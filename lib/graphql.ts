export const getAllArtwork = `
    query getAllArtwork {
        allArtwork(where: {categoryName: "A Colorful History"}, first: 1000) {
            nodes {
                slug
                artworkFields {
                    city
                    artworklink {
                        url
                        title
                    }
                    artworkImage {
                        node {
                            mediaDetails {
                                sizes(include: [MEDIUM, LARGE, THUMBNAIL]) {
                                    sourceUrl
                                    height
                                    width
                                }
                                width
                                height
                            }
                            mediaItemUrl
                        }
                    }
                    country
                    forsale
                    height
                    lat
                    lng
                    medium
                    metadescription
                    metakeywords
                    orientation
                    proportion
                    series
                    size
                    style
                    width
                    year
                }
                colorfulFields {
                    wikiLinkEn
                    wikiLinkDe
                    storyEn
                    storyDe
                    ar
                }
                title(format: RENDERED)
                content(format: RENDERED)
                databaseId
                id
                date
                featuredImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
            }
        }
    }
`

export const getArtworkBySlugQuery = `
    query getArtworkBySlug($slug: ID!) {
        artwork(id: $slug, idType: SLUG) {
            slug
            artworkFields {
                city
                artworklink {
                    url
                    title
                }
                artworkImage {
                    node {
                        mediaDetails {
                            sizes(include: [MEDIUM, LARGE, THUMBNAIL]) {
                                sourceUrl
                                height
                                width
                            }
                            width
                            height
                        }
                        mediaItemUrl
                    }
                }
                country
                forsale
                height
                lat
                lng
                medium
                metadescription
                metakeywords
                orientation
                proportion
                series
                size
                style
                width
                year
            }
            colorfulFields {
                mind {
                    node {
                        uri
                    }
                }
                freestyleColor
                freestyleIcon {
                    node {
                        uri
                    }
                }
                freestylePoster {
                    node {
                        uri
                    }
                }
                ar
                freestyleVideo {
                    node {
                        uri
                    }
                }
                historyColor
                historyIcon {
                    node {
                        uri
                    }
                }
                historyPoster {
                    node {
                        uri
                    }
                }
                historyVideo {
                node {
                    uri
                }
                }
                makingColor
                makingIcon {
                    node {
                        uri
                    }
                }
                makingPoster {
                    node {
                        uri
                    }
                }
                makingVideo {
                    node {
                        uri
                    }
                }
                storyDe
                storyEn
                wikiLinkDe
                wikiLinkEn
            }
            title(format: RENDERED)
            content(format: RENDERED)
            databaseId
            id
            date
            featuredImage {
                node {
                    sourceUrl
                    altText
                }
            }
        }
    }
`