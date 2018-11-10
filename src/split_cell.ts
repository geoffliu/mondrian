import { Cell, SplitResult, GeneratorConstraints } from './types'

function splitCellVertical(cell: Cell, minSplit: number): SplitResult {
  let split = Math.random()
  while (split * cell.width < minSplit ||
      (1 - split) * cell.width < minSplit) {
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

function splitCellHorizontal(cell: Cell, minSplit: number): SplitResult {
  let split = Math.random()
  while (split * cell.height < minSplit ||
      (1 - split) * cell.height < minSplit) {
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

export function splitCell(cell: Cell, constraints: GeneratorConstraints): SplitResult {
  const verticalness = Math.atan(cell.height / cell.width) * 2 / Math.PI
  if (Math.random() < verticalness)
    return splitCellHorizontal(cell, constraints.minHorizontalSplit)
  return splitCellVertical(cell, constraints.minVerticalSplit)
}

