#!/usr/bin/env python3
"""
extract_hero_fields.py — A Colorful History hero system
Extracts painted colour-field polygons from a painting image using seeded
flood fill (Photoshop magic-wand behaviour), and outputs normalized JSON
for the hero animation.

Usage:
    python extract_hero_fields.py painting.jpg config.json -o heroFields.json
    python extract_hero_fields.py painting.jpg config.json -o heroFields.json --debug overlay.png

Dependencies (netcup box):
    pip install opencv-python-headless numpy

Config file — produced by seed-picker.html:
{
  "artwork": "berlin-brandenburgertor-1899",
  "imageSize": [1600, 1600],          // natural size the seeds were clicked on
  "photoRect": { "x": 0.18, "y": 0.52, "w": 0.55, "h": 0.30 },  // normalized 0-1, optional
  "fields": [
    { "name": "sky",   "hex": "#A8D6E8", "seed": [800, 300],  "tolerance": 12 },
    { "name": "cream", "hex": "#F0E8C0", "seed": [760, 1350], "tolerance": 12, "epsilon": 0.002 }
  ]
}

Notes:
- Tolerance is applied per-channel in LAB colour space with FIXED_RANGE
  (compared against the seed pixel, like Photoshop's non-cumulative wand).
- Only the external contour is kept: figures painted *around* leave holes in
  the mask, and we deliberately ignore them — the animation crossfades to the
  real painting photograph at landing, which restores every detail.
- If the extraction image resolution differs from config imageSize, seed
  coordinates are rescaled automatically.
"""

import argparse
import json
import sys
from datetime import date

import cv2
import numpy as np

DEFAULT_TOLERANCE = 12
DEFAULT_EPSILON = 0.002       # polygon simplification, fraction of perimeter
MIN_AREA_FRACTION = 0.003     # warn below 0.3% of canvas — probably a bad seed
MAX_AREA_FRACTION = 0.98      # warn above — tolerance likely swallowed the image


def load_config(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def flood_mask(lab_img, seed, tol):
    """Seeded flood fill on the LAB image. Returns a uint8 mask (h, w)."""
    h, w = lab_img.shape[:2]
    mask = np.zeros((h + 2, w + 2), np.uint8)
    flags = (
        8                          # 8-connectivity
        | cv2.FLOODFILL_MASK_ONLY
        | cv2.FLOODFILL_FIXED_RANGE
        | (255 << 8)               # value written into the mask
    )
    lo = (tol, tol, tol)
    hi = (tol, tol, tol)
    cv2.floodFill(lab_img.copy(), mask, tuple(seed), 0, lo, hi, flags)
    return mask[1:-1, 1:-1]


def clean_mask(mask, img_min_side):
    """Morphological close to seal noise where paint meets photo transfer."""
    k = max(3, int(round(img_min_side * 0.004)) | 1)  # odd kernel, ~0.4% of side
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))
    return cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)


def largest_external_contour(mask):
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None
    return max(contours, key=cv2.contourArea)


def contour_to_field(contour, w, h, eps_frac):
    perimeter = cv2.arcLength(contour, True)
    approx = cv2.approxPolyDP(contour, eps_frac * perimeter, True)
    poly = [[round(float(p[0][0]) / w, 4), round(float(p[0][1]) / h, 4)] for p in approx]

    m = cv2.moments(contour)
    if m["m00"] == 0:
        return None
    cx, cy = m["m10"] / m["m00"], m["m01"] / m["m00"]
    x, y, bw, bh = cv2.boundingRect(contour)

    return {
        "polygon": poly,
        "centroid": [round(cx / w, 4), round(cy / h, 4)],
        "bbox": {
            "x": round(x / w, 4),
            "y": round(y / h, 4),
            "w": round(bw / w, 4),
            "h": round(bh / h, 4),
        },
        "area": round(cv2.contourArea(contour) / (w * h), 4),
    }


def draw_debug(img, fields, out_path):
    overlay = img.copy()
    h, w = img.shape[:2]
    rng = np.random.default_rng(7)
    for f in fields:
        pts = np.array(
            [[int(p[0] * w), int(p[1] * h)] for p in f["polygon"]], np.int32
        ).reshape((-1, 1, 2))
        colour = tuple(int(c) for c in rng.integers(60, 255, 3))
        cv2.fillPoly(overlay, [pts], colour)
        cv2.polylines(img, [pts], True, colour, 3)
        cx, cy = int(f["centroid"][0] * w), int(f["centroid"][1] * h)
        cv2.putText(img, f["name"], (cx, cy), cv2.FONT_HERSHEY_SIMPLEX,
                    1.0, (0, 0, 0), 5, cv2.LINE_AA)
        cv2.putText(img, f["name"], (cx, cy), cv2.FONT_HERSHEY_SIMPLEX,
                    1.0, (255, 255, 255), 2, cv2.LINE_AA)
    blended = cv2.addWeighted(overlay, 0.35, img, 0.65, 0)
    cv2.imwrite(out_path, blended)
    print(f"  debug overlay -> {out_path}")


def main():
    ap = argparse.ArgumentParser(description="Extract hero field polygons from a painting.")
    ap.add_argument("image", help="Painting image (square archive export)")
    ap.add_argument("config", help="Seed config JSON from seed-picker.html")
    ap.add_argument("-o", "--output", default="heroFields.json")
    ap.add_argument("--debug", metavar="PNG", help="Write a debug overlay image")
    args = ap.parse_args()

    img = cv2.imread(args.image, cv2.IMREAD_COLOR)
    if img is None:
        sys.exit(f"Could not read image: {args.image}")
    h, w = img.shape[:2]
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)

    cfg = load_config(args.config)

    # Rescale seeds if extraction resolution differs from the picker's
    sx = sy = 1.0
    if "imageSize" in cfg:
        cw, ch = cfg["imageSize"]
        if (cw, ch) != (w, h):
            sx, sy = w / cw, h / ch
            print(f"Rescaling seeds: config {cw}x{ch} -> image {w}x{h}")

    out_fields = []
    for fc in cfg["fields"]:
        name = fc["name"]
        seed = [int(round(fc["seed"][0] * sx)), int(round(fc["seed"][1] * sy))]
        tol = int(fc.get("tolerance", DEFAULT_TOLERANCE))
        eps = float(fc.get("epsilon", DEFAULT_EPSILON))

        if not (0 <= seed[0] < w and 0 <= seed[1] < h):
            print(f"[SKIP] {name}: seed {seed} outside image bounds")
            continue

        mask = flood_mask(lab, seed, tol)
        mask = clean_mask(mask, min(w, h))
        contour = largest_external_contour(mask)
        if contour is None:
            print(f"[SKIP] {name}: flood fill produced no region — check seed/tolerance")
            continue

        field = contour_to_field(contour, w, h, eps)
        if field is None:
            print(f"[SKIP] {name}: degenerate contour")
            continue

        if field["area"] < MIN_AREA_FRACTION:
            print(f"[WARN] {name}: area {field['area']:.1%} very small — bad seed or low tolerance?")
        if field["area"] > MAX_AREA_FRACTION:
            print(f"[WARN] {name}: area {field['area']:.1%} — tolerance may have flooded the whole image")

        field.update({"name": name, "hex": fc["hex"]})
        # Order keys for readability
        out_fields.append({k: field[k] for k in
                           ("name", "hex", "polygon", "centroid", "bbox", "area")})
        print(f"[OK]   {name}: {len(field['polygon'])} pts, area {field['area']:.1%}")

    result = {
        "artwork": cfg.get("artwork", ""),
        "generated": date.today().isoformat(),
        "sourceImage": {"width": w, "height": h},
        "photoRect": cfg.get("photoRect"),
        "fields": out_fields,
    }

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
    print(f"\nWrote {len(out_fields)} fields -> {args.output}")

    if args.debug:
        draw_debug(img, out_fields, args.debug)


if __name__ == "__main__":
    main()
