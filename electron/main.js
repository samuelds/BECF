const electron = require('electron')
const path = require('path')

const ipc = electron.ipcMain
const app = electron.app
const Menu = electron.Menu
const Tray = electron.Tray
const BrowserWindow = electron.BrowserWindow

let mainWindow = null
let appIcon = null
let trayOn = false
let willQuitApp = false;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  mainWindow.webContents.openDevTools()

  mainWindow.on('close', function (event) {
    if (willQuitApp === false) {
      event.preventDefault()
      mainWindow.hide()
      trayOn = true
    }
  })
}

function createIcon () {
  var iconName = 'icon.png'
  var iconPath = path.join(__dirname, iconName)
  appIcon = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([{
    label: 'Quit',
    click: function () {
      willQuitApp = true
      app.quit()
    }
  }])
  appIcon.setToolTip('Electron is runing')
  appIcon.setContextMenu(contextMenu)

  appIcon.on('click', function () {
    if (trayOn) {
      mainWindow.show()
    }
    mainWindow.focus()
  })
}

app.on('ready', function() {
  createWindow()
  createIcon()
})

app.on('before-quit', function () {
  willQuitApp = true;
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
