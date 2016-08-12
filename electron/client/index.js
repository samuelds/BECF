module.exports = {
  electron: require('electron'),
  path: require('path'),

  app: null,
  menu: null,
  Tray: null,
  BrowserWindow: null,

  mainWindow: null,
  appIcon: null,
  trayOn: false,
  willQuitApp: false,
  shouldQuit: false,

  hideWindow: function () {
    this.mainWindow.hide()
    this.trayOn = true
  },

  showWindow: function () {
    this.mainWindow.show()
    this.trayOn = false
  },

  focusWindow: function () {
    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore()
    }
    if (this.trayOn) {
      this.showWindow()
    }
    this.mainWindow.focus()
  },

  createWindow: function  () {
    this.mainWindow = new this.BrowserWindow({width: 800, height: 600})
    this.mainWindow.loadURL(`file://${__dirname}/views/index.html`)    //
    this.mainWindow.webContents.openDevTools()
  },

  createMenu: function () {
    var self = this
    const contextMenu = this.menu.buildFromTemplate([{
      label: 'Quit',
      click: function () {
        self.willQuitApp = true
        self.app.quit()
      }
    }])
    this.appIcon.setContextMenu(contextMenu)

    this.appIcon.on('click', function () {
      if (this.trayOn) {
        self.mainWindow.show()
      }
      self.mainWindow.focus()
    })
  },

  createIcon: function  () {
    var iconName = 'ressources/icon.png'
    var iconPath = this.path.join(__dirname, iconName)
    this.appIcon = new this.Tray(iconPath)
    this.appIcon.setToolTip('Electron is runing')
  },

  listeners: function () {

    var self = this

    // Client app
    this.app.on('ready', function () {
      self.createWindow()
      self.mainWindow.on('close', function (event) {
        if (self.willQuitApp === false) {
          event.preventDefault()
          self.hideWindow()
        }
      })

      self.createIcon()
      self.appIcon.on('click', function () {
        if (self.trayOn) {
          self.showWindow()
        }
        self.mainWindow.focus()
      })

      self.createMenu()
    })

    this.app.on('before-quit', function () {
      self.willQuitApp = true;
    });

    this.app.on('activate', function () {
      if (self.mainWindow === null) {
        self.createWindow()
      }
    })

  },

  check: function () {
    var self = this
    this.shouldQuit = this.app.makeSingleInstance(function(commandLine, workingDirectory) {
      if (self.mainWindow) {
        self.focusWindow()
      }
    })
  },

  init: function () {
    this.app = this.electron.app
    this.menu = this.electron.Menu
    this.Tray = this.electron.Tray
    this.BrowserWindow = this.electron.BrowserWindow
  }
}
