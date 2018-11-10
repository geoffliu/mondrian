import _ from 'lodash'

type Cell = {
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
}

const CANVAS_WIDTH = 1600
const CANVAS_HEIGHT = 900
const MIN_CELL_SIZE = 100
const MIN_VERTICAL_SPLIT = MIN_CELL_SIZE / CANVAS_WIDTH
const MIN_HORIZONTAL_SPLIT = MIN_CELL_SIZE / CANVAS_HEIGHT

function randInt(start, end): number {
  return Math.floor(Math.random() * (end - start)) + start
}

function getSplits(numSplits, minSplit): Array<number> {
  const result = []
  while (result.length < numSplits) {
    const newVal = Math.random()
    if (newVal > minSplit &&
        newVal < (1 - minSplit) &&
        !_.some(result, v => Math.abs(newVal - v) < minSplit))
      result.push(newVal)
  }
  result.sort()
  return result
}

function splitCellVertical(cell: Cell) {
  let split = Math.random()
  while (split * cell.width < MIN_VERTICAL_SPLIT ||
      (1 - split) * cell.width < MIN_VERTICAL_SPLIT) {
    split = Math.random()
  }

  return {
    cell1: {
      x: cell.x,
      y: cell.y,
      width: split * cell.width,
      height: cell.height,
      color: cell.color
    },
    cell2: {
      x: cell.x + split * cell.width,
      y: cell.y,
      width: (1 - split) * cell.width,
      height: cell.height,
      color: cell.color
    },
    line: {
      horizontal: false,
      split: cell.x + split * cell.width,
      start: cell.y,
      length: cell.height
    }
  }
}

function splitCellHorizontal(cell: Cell) {
  let split = Math.random()
  while (split * cell.height < MIN_HORIZONTAL_SPLIT ||
      (1 - split) * cell.height < MIN_HORIZONTAL_SPLIT) {
    split = Math.random()
  }

  return {
    cell1: {
      x: cell.x,
      y: cell.y,
      width: cell.width,
      height: split * cell.height,
      color: cell.color
    },
    cell2: {
      x: cell.x,
      y: cell.y + split * cell.height,
      width: cell.width,
      height: (1 - split) * cell.height,
      color: cell.color
    },
    line: {
      horizontal: true,
      split: cell.y + split * cell.height,
      start: cell.x,
      length: cell.width
    }
  }
}

function splitCell(cell: Cell) {
  const verticalness = Math.atan(cell.height / cell.width) * 2 / Math.PI
  if (Math.random() < verticalness)
    return splitCellHorizontal(cell)
  return splitCellVertical(cell)
}

function getGridCells(horizontalSplits, verticalSplits): Array<Cell> {
  function getSegments(splits) {
    const startPoints = [0].concat(splits)
    const endPoints = splits.concat([1])
    return _.zip(startPoints, endPoints)
  }

  return _.flatMap(getSegments(horizontalSplits), ([hStart, hEnd]) =>
    _.map(getSegments(verticalSplits), ([vStart, vEnd]) =>
      ({ x: vStart, y: hStart, width: vEnd - vStart, height: hEnd - hStart, color: 'white' })))
}

function randChoice<T>(array: Array<T>): T {
  return array[randInt(0, array.length)]
}

const palettes = [
  ['rgb(226, 35, 149)', 'rgb(28, 10, 39)', 'rgb(28, 10, 39)', 'rgb(26, 139, 122)'],
  ['rgb(225, 0, 0)', 'rgb(0, 17, 255)', 'rgb(243, 208, 0)', 'black'],
  ['rgb(225, 0, 0)', 'rgb(0, 17, 255)', 'rgb(243, 208, 0)'],
  ['rgb(201, 0, 12)', 'rgb(39, 53, 103)', 'rgb(253, 201, 0)', 'black'],
  ['rgb(201, 0, 12)', 'rgb(39, 53, 103)', 'rgb(253, 201, 0)'],
  ['rgb(255, 0, 0)', 'rgb(213, 0, 83)', 'rgb(253, 137, 0)', 'rgb(255, 255, 0)'],
  ['rgb(225, 0, 0)', 'rgb(0, 17, 255)', 'rgb(243, 208, 0)', 'rgb(4, 114, 0)', 'black'],
  ['rgb(225, 0, 0)', 'rgb(0, 17, 255)', 'rgb(243, 208, 0)', 'rgb(4, 114, 0)']
]

export default function genMondrian(canvas: Object) {
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT

  const horizontalSplits = getSplits(randInt(0, 4), MIN_HORIZONTAL_SPLIT)
  const verticalSplits = getSplits(randInt(0, 4), MIN_VERTICAL_SPLIT)

  const gridCells = getGridCells(horizontalSplits, verticalSplits)
  const gridLines = horizontalSplits.map(split => ({ horizontal: true, split, start: 0, length: 1 })).concat(
    verticalSplits.map(split => ({ horizontal: false, split, start: 0, length: 1 })))

  const targetCellCount = randInt(20, 40)
  while (gridCells.length < targetCellCount) {
    const elligible = gridCells
      .map((cell, index) => [cell, index])
      .filter(pair => pair[0].width > 3 * MIN_VERTICAL_SPLIT && pair[0].height > 3 * MIN_HORIZONTAL_SPLIT)
    if (!elligible.length)
      break

    const [toSplit, index] = randChoice(elligible)

    const { cell1, cell2, line } = splitCell(toSplit)
    gridLines.push(line)
    gridCells.splice(index, 1, cell1, cell2)
  }

  const coloration = Math.random() * 0.4 + 0.4
  const palette = randChoice(palettes)
  gridCells.forEach(cell => {
    if (Math.random() < coloration)
      cell.color = randChoice(palette)
  })

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  gridCells.forEach(({ x, y, width, height, color }) => {
    ctx.fillStyle = color
    ctx.fillRect(x * CANVAS_WIDTH, y * CANVAS_HEIGHT, width * CANVAS_WIDTH, height * CANVAS_HEIGHT)
  })

  ctx.fillStyle = 'black'
  gridLines.forEach(({ horizontal, split, start, length }) => {
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
