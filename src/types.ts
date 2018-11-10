export interface OutputOptions {
  width: number
  height: number
  minCellSize: number
}

export interface GeneratorConstraints {
  minHorizontalSplit: number
  minVerticalSplit: number
}

export interface Cell {
  x: number
  y: number
  width: number
  height: number
  color: string
}

export interface Line {
  horizontal: boolean
  split: number
  start: number
  length: number
}

export interface SplitResult {
  cell1: Cell
  cell2: Cell
  line: Line
}

export interface MondrianData {
  cells: Cell[]
  lines: Line[]
}
