const { menubar } = require('menubar')
const { app, nativeImage } = require('electron')
const path = require('path')

let tray = null

// Use menubar for the window management
const mb = menubar({
  index: 'https://chatgpt.com', // Replace with your URL
  preloadWindow: true
})

mb.on('ready', () => {
  console.log('Menubar app is ready.')

  // Create tray icon using nativeImage
  const iconPath = path.join(__dirname, 'icon_square.png') // Ensure the path to your icon
  let trayIcon = nativeImage.createFromPath(iconPath)
  // Optionally resize the icon if needed
  trayIcon = trayIcon.resize({ width: 16, height: 16 }) // Adjust size if necessary

  tray = mb.tray // Access the tray object from menubar
  tray.setImage(trayIcon)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => { mb.showWindow() } },
    { label: 'Quit', click: () => { app.quit() } }
  ])
  tray.setToolTip('AppName') // Replace with your app name
  tray.setContextMenu(contextMenu)
})

mb.on('after-create-window', () => {
  mb.window.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    require('electron').shell.openExternal(url)
  })
})
