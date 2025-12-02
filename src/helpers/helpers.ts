import variables from '@/style/vars.module.scss'

export function interpolate(
  value: number, 
  inMin: number, 
  inMax: number, 
  outMin: number, 
  outMax: number
): number {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

interface ColorVariables {
  [key: string]: string;
  __checksum?: string;
}

export function decideColor(variables: ColorVariables): string {
  const colors: string[] = []
  Object.keys(variables).forEach(key => {
    if (key !== '__checksum') {
      colors.push(variables[key])
    }
  })
  return colors[Math.floor(Math.random() * colors.length)]
}