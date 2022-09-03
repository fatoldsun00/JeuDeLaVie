const fs = require('fs')
const busEvents = require('./busEvents')

const game = ((config) => {
  let timerTickPointer

  if (config) {
    config = {
      dimension: {
        w: config.dimension && config.dimension.w ? config.dimension.w : 30,
        h: config.dimension && config.dimension.h ? config.dimension.h : 30,
      },
      interval: config.interval || 1000, // ms
    }
  } else {
    config = {
      dimension: { w: 30, h: 30 },
      interval: 1000, // ms
    }
  }

  // Creation rep qui contient les plateau
  if (!fs.existsSync('./boardsGame/')) fs.mkdirSync('./boardsGame/')

  let { dimension } = config
  let arrGame = []

  const init = (board = undefined) => {
    if (dimension.w < 3 || dimension.h < 3 || dimension.w > 30 || dimension.h > 30) throw new Error("dimension pour l'initalisation nom comprise en 3 et 30")

    let aliveCells = []
    arrGame = []
    // init
    if (board) {
      aliveCells = board
    } else {
      aliveCells = [[0, 1], [1, 1], [1, 2], [2, 2], [2, 3], [3, 3], [3, 4], [4, 4], [5, 4], [5, 5], [6, 3], [6, 4], [7, 2], [7, 3], [8, 1], [8, 2], [9, 1]]
    }

    for (let kLine = 0; kLine < dimension.h; kLine++) {
      const alivesInLine = aliveCells.filter((r) => r[0] == kLine).map((r) => r[1])
      if (!arrGame[kLine]) arrGame[kLine] = []
      for (let kColumn = 0; kColumn < dimension.w; kColumn++) {
        if (alivesInLine.indexOf(kColumn) > -1) {
          arrGame[kLine][kColumn] = 1
        } else {
          arrGame[kLine][kColumn] = 0
        }
      }
    }
    busEvents.emit('arrGame', arrGame)
  }

  const nextTick = () => {
    const arrGameTemp = []
    for (let kLine = 0; kLine < dimension.h; kLine++) {
      for (let kColumn = 0; kColumn < dimension.w; kColumn++) {
        let countSideAlive = 0
        const kPreviousLine = arrGame[kLine - 1] != undefined ? kLine - 1 : dimension.h - 1
        const kNextLine = arrGame[kLine + 1] != undefined ? kLine + 1 : 0
        const kPreviousColumn = arrGame[kLine][kColumn - 1] != undefined ? kColumn - 1 : dimension.w - 1
        const kNextColumn = arrGame[kLine][kColumn + 1] != undefined ? kColumn + 1 : 0
        // cases voisines
        if (arrGame[kPreviousLine][kPreviousColumn]) countSideAlive++
        if (arrGame[kPreviousLine][kColumn]) countSideAlive++
        if (arrGame[kPreviousLine][kNextColumn]) countSideAlive++
        if (arrGame[kLine][kPreviousColumn]) countSideAlive++
        if (arrGame[kLine][kNextColumn]) countSideAlive++
        if (arrGame[kNextLine][kPreviousColumn]) countSideAlive++
        if (arrGame[kNextLine][kColumn]) countSideAlive++
        if (arrGame[kNextLine][kNextColumn]) countSideAlive++

        if (arrGameTemp[kLine] == undefined) arrGameTemp[kLine] = []
        if ((arrGame[kLine][kColumn] && (countSideAlive == 2 || countSideAlive == 3)) || countSideAlive == 3) {
          arrGameTemp[kLine][kColumn] = 1
        } else {
          arrGameTemp[kLine][kColumn] = 0
        }
      }
    }

    arrGame = [...arrGameTemp]
    busEvents.emit('arrGame', arrGame)
  }

  const start = () => {
    if (config.interval > 0) {
      timerTickPointer = setInterval(() => {
        if (arrGame.length == 0) init()
        nextTick()
      }, config.interval)
      busEvents.emit('state', true)
    }
  }

  const stop = () => {
    clearInterval(timerTickPointer)
    timerTickPointer = undefined
    busEvents.emit('state', false)
  }

  const reset = () => {
    init()
  }

  const getGame = () => arrGame

  const getAliveCells = () => {
    const aliveCells = []

    for (let kLine = 0; kLine < dimension.h; kLine++) {
      for (let kColumn = 0; kColumn < dimension.w; kColumn++) {
        if (arrGame[kLine] && arrGame[kLine][kColumn]) {
          aliveCells.push([kLine, kColumn])
        }
      }
    }
    return aliveCells
  }

  const setAlive = (cells) => {
    arrGame[cells[0]][cells[1]] = !arrGame[cells[0]][cells[1]]
  }

  const changeBoardSize = (dim) => {
    config.dimension.h = dim.h ? dim.h : config.dimension.h
    config.dimension.w = dim.w ? dim.w : config.dimension.w
    dimension = config.dimension
    const state = timerTickPointer
    stop()
    init(getAliveCells())
    if (state) start()
  }

  const changeInterval = (interval) => {
    config.interval = interval * 20
    const state = timerTickPointer
    stop()
    if (state) start()
  }

  const saveGame = (name) => {
    const aliveCells = getAliveCells()
    fs.writeFileSync(`./boardsGame/${name}.json`, global.JSON.stringify(aliveCells))
  }

  const restoreGame = (name) => {
    const dataBoard = fs.readFileSync(`./boardsGame/${name}.json`)
    init(JSON.parse(dataBoard))
  }

  const getBoardsGame = () => {
    const files = fs.readdirSync('./boardsGame/').map((r) => r.replace('.json', ''))
    return files
  }

  init()
  return {
    stop,
    start,
    reset,
    nextTick,
    setAlive,
    changeInterval,
    getGame,
    restoreGame,
    saveGame,
    changeBoardSize,
    getBoardsGame,
  }
})()

module.exports = {
  game,
}
