import { Color } from './types'

const black = { r: 0, g: 0, b: 0 }
const red = { r: 255, g: 0, b: 0 }
const blue = { r: 0, g: 17, b: 255 }
const yellow = { r: 243, g: 208, b: 0 }
export const white = { r: 255, g: 255, b: 255 }

export const palettes: Color[][] = [
  // ['rgb(226, 35, 149)', 'rgb(28, 10, 39)', 'rgb(28, 10, 39)', 'rgb(26, 139, 122)'],
  [red, blue, yellow, black],
  [red, blue, yellow],
  // ['rgb(201, 0, 12)', 'rgb(39, 53, 103)', 'rgb(253, 201, 0)', black],
  // ['rgb(201, 0, 12)', 'rgb(39, 53, 103)', 'rgb(253, 201, 0)'],
  // [red, 'rgb(213, 0, 83)', 'rgb(253, 137, 0)', 'rgb(255, 255, 0)'],
  // [red, blue, yellow, 'rgb(4, 114, 0)', black],
  // [red, blue, yellow, 'rgb(4, 114, 0)']
]

