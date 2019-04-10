import * as _ from 'lodash'
import { generateMondrian } from './generator'

const CANVAS_WIDTH = 1600
const CANVAS_HEIGHT = 900
const MIN_CELL_SIZE = 100
const MIN_VERTICAL_SPLIT = MIN_CELL_SIZE / CANVAS_WIDTH
const MIN_HORIZONTAL_SPLIT = MIN_CELL_SIZE / CANVAS_HEIGHT

export default function genMondrian(canvas: HTMLCanvasElement) {
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  const {cells, lines} = generateMondrian({
    minVerticalSplit: MIN_VERTICAL_SPLIT,
    minHorizontalSplit: MIN_HORIZONTAL_SPLIT,
  })

  cells.forEach(({ x, y, width, height, color }) => {
    ctx.fillStyle = color
    ctx.fillRect(x * CANVAS_WIDTH, y * CANVAS_HEIGHT, width * CANVAS_WIDTH, height * CANVAS_HEIGHT)
  })

  ctx.fillStyle = 'black'
  lines.forEach(({ horizontal, split, start, length }) => {
    const halfLineWidth = Math.random() * 3 + 1.5
    if (horizontal)
      ctx.fillRect(start * CANVAS_WIDTH, split * CANVAS_HEIGHT - halfLineWidth, length * CANVAS_WIDTH, halfLineWidth * 2)
    else
      ctx.fillRect(split * CANVAS_WIDTH - halfLineWidth, start * CANVAS_HEIGHT, halfLineWidth * 2, length * CANVAS_HEIGHT)
  })
  ctx.fillRect(0, 0, CANVAS_WIDTH, 2)
  ctx.fillRect(0, 0, 2, CANVAS_HEIGHT)
  ctx.fillRect(CANVAS_WIDTH - 2, 0, 2, CANVAS_HEIGHT)
  ctx.fillRect(0, CANVAS_HEIGHT - 2, CANVAS_WIDTH, 2)
}
