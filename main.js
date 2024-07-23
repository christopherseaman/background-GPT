const { menubar } = require('menubar')
const { app, nativeImage, globalShortcut, Menu } = require('electron')
const path = require('path')

let tray = null
let windowPosition = {}

// Use menubar for the window management
const mb = menubar({
  index: 'https://chatgpt.com', // Replace with your URL
  preloadWindow: true,
  browserWindow: {
    alwaysOnTop: true, // Keeps the window always on top
    movable: true, // Allows the window to be moved
    frame: true, // Adds a frame to the window for dragging
  }
})

// Event listeners
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
    {
      label: 'Toggle App', 
      click: () => { 
        if (mb.window.isVisible()) {
          windowPosition = mb.window.getBounds()
          mb.hideWindow()
        } else {
          mb.showWindow()
        }
      }
    },
    { label: 'Quit', click: () => { app.quit() } }
  ])

  tray.setToolTip('ChatGPT') // Replace with your app name
  tray.setContextMenu(contextMenu)

  // Register a global shortcut
  const ret = globalShortcut.register('Alt+Space', () => {
    if (mb.window.isVisible()) {
      windowPosition = mb.window.getBounds()
      mb.hideWindow()
    } else {
      mb.showWindow()
    }
  })

  if (!ret) {
    console.log('Registration failed')
  }

  // Check whether the shortcut is registered
  console.log(globalShortcut.isRegistered('Alt+Space'))
})

mb.on('after-create-window', () => {
  mb.window.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    require('electron').shell.openExternal(url)
  })
})

mb.on('after-show', () => {
  if (Object.keys(windowPosition).length) {
    mb.window.setBounds(windowPosition)
  }
})

// Unregister the global shortcut when the app quits
app.on('will-quit', () => {
  globalShortcut.unregister('Alt+Space')
  globalShortcut.unregisterAll()
})
