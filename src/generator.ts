import * as _ from 'lodash'
import { Cell, GeneratorConstraints, MondrianData } from './types'
import { splitCell } from './split_cell'

function getSplits(numSplits: number, minSplit: number): number[] {
  const result = []
  while (result.length < numSplits) {
    const newVal = Math.random()
    if (newVal > minSplit &&
        newVal < (1 - minSplit) &&
        !_.some(result, v => Math.abs(newVal - v) < minSplit))
      result.push(newVal)
  }
  return _.sortBy(result)
}


function getGridCells(horizontalSplits: number[], verticalSplits: number[]): Cell[] {
  function getSegments(splits: number[]): [number, number][] {
    const startPoints = [0].concat(splits)
    const endPoints = splits.concat([1])
    return _.zip(startPoints, endPoints)
  }

  return _.flatMap(getSegments(horizontalSplits), ([hStart, hEnd]) =>
    _.map(getSegments(verticalSplits), ([vStart, vEnd]) =>
      ({ x: vStart, y: hStart, width: vEnd - vStart, height: hEnd - hStart, color: 'white' })))
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

export function generateMondrian(constraints: GeneratorConstraints): MondrianData {
  const { minHorizontalSplit, minVerticalSplit } = constraints
  const horizontalSplits = getSplits(_.random(0, 4), minHorizontalSplit)
  const verticalSplits = getSplits(_.random(0, 4), minVerticalSplit)

  const gridCells = getGridCells(horizontalSplits, verticalSplits)
  const gridLines = horizontalSplits.map(split => ({ horizontal: true, split, start: 0, length: 1 })).concat(
    verticalSplits.map(split => ({ horizontal: false, split, start: 0, length: 1 })))

  const targetCellCount = _.random(20, 40)
  while (gridCells.length < targetCellCount) {
    const elligible = gridCells
      .map<[Cell, number]>((cell, index) => [cell, index])
      .filter(pair => pair[0].width > 3 * minVerticalSplit && pair[0].height > 3 * minHorizontalSplit)
    if (!elligible.length)
      break

    const [toSplit, index] = _.sample(elligible)

    const { cell1, cell2, line } = splitCell(toSplit, constraints)
    gridLines.push(line)
    gridCells.splice(index, 1, cell1, cell2)
  }

  const coloration = Math.random() * 0.4 + 0.4
  const palette = _.sample(palettes)
  gridCells.forEach(cell => {
    if (Math.random() < coloration)
      cell.color = _.sample(palette)
  })

  return {
    cells: gridCells,
    lines: gridLines,
  }
}
