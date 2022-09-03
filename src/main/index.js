const electron = require('electron')
const path = require('path')
const { game } = require('./game')
const busEvents = require('./busEvents')

const { app, BrowserWindow, ipcMain } = electron
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 850,
    useContentSize: true,
    width: 750,
  })

  mainWindow.loadURL(winURL)

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.send('arrGame', JSON.stringify(game.getGame()))
    busEvents.on('arrGame', (arrGame) => {
      mainWindow.webContents.send('arrGame', JSON.stringify(arrGame))
    })
    busEvents.on('state', (state) => {
      mainWindow.webContents.send('state', state)
    })
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    game.stop()
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('setState', (event, arg) => {
  if (arg) {
    game.start()
  } else {
    game.stop()
  }
})
ipcMain.on('nextTick', () => {
  game.nextTick()
})
ipcMain.on('reset', () => {
  game.reset()
})
ipcMain.on('setAlive', (event, arg) => {
  if (arg != undefined && arg instanceof Array && arg.length == 2) {
    game.setAlive(arg)
    event.sender.send('arrGame', JSON.stringify(game.getGame()))
  }
})
ipcMain.on('changeInterval', (event, arg) => {
  if (arg != undefined) {
    arg = parseInt(arg, 10)
    game.changeInterval(arg)
  }
})
ipcMain.on('saveGame', (event, arg) => {
  if (arg && typeof (arg) === 'string') {
    try {
      game.saveGame(arg)
    } catch (error) {
      event.sender.send('error', 'Erreur lors de la sauvegarde')
    }
  }
})
ipcMain.on('restoreGame', (event, arg) => {
  if (arg && typeof (arg) === 'string') {
    try {
      game.restoreGame(arg)
    } catch (error) {
      event.sender.send('error', 'Erreur lors de la restoration')
    }
  }
})

ipcMain.on('changeBoardSize', (event, arg) => {
  if (arg != undefined && (arg.h || arg.w)) {
    game.changeBoardSize(arg)
  }
})

ipcMain.on('getBoardsGame', (event) => {
  try {
    event.sender.send('boardsGame', game.getBoardsGame())
  } catch (error) {
    event.sender.send('error', 'Impossible de recuperer le plateau')
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
