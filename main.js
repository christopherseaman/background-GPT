const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')

let tray = null
let mainWindow = null

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  mainWindow.loadURL('https://chatgpt.com') // Replace with your URL

  mainWindow.on('minimize', (event) => {
    event.preventDefault()
    mainWindow.hide()
  })

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
  })
}

app.on('ready', () => {
  createWindow()
  app.dock.hide() // Hide the app from the dock

  // Ensure the path to icon.icns is correct
  const iconPath = path.join(__dirname, 'icon.icns')
  console.log("Icon path:", iconPath)
  
  tray = new Tray(iconPath) // Path to your .icns icon
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => { mainWindow.show() } },
    { label: 'Quit', click: () => { app.quit() } }
  ])
  tray.setToolTip('AppName') // Replace with your app name
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
})

app.on('before-quit', () => app.isQuitting = true)
