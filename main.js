const { menubar } = require('menubar')
const { app, nativeImage, globalShortcut, Menu } = require('electron')
const path = require('path')

let tray = null
let windowPosition = {}
let currentUrl = 'https://claude.ai'

// Use menubar for the window management
const mb = menubar({
  index: currentUrl,
  preloadWindow: true,
  browserWindow: {
    alwaysOnTop: true,
    movable: true,
    frame: true,
  },
  showOnAllWorkspaces: false,
  showDockIcon: false,
  showOnRightClick: false,
})

// Event listeners
mb.on('ready', () => {
  console.log('Menubar app is ready.')

  // Create tray icon using nativeImage
  const iconPath = path.join(__dirname, 'icon_square.png')
  let trayIcon = nativeImage.createFromPath(iconPath)
  trayIcon = trayIcon.resize({ width: 16, height: 16 })

  tray = mb.tray
  tray.setImage(trayIcon)

  // Prevent the default toggle behavior
  mb.tray.removeAllListeners('click')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'ChatGPT',
      type: 'radio',
      checked: currentUrl === 'https://chatgpt.com',
      click: () => {
        currentUrl = 'https://chatgpt.com';
        mb.window.loadURL(currentUrl);
      }
    },
    {
      label: 'Claude.ai',
      type: 'radio',
      checked: currentUrl === 'https://claude.ai',
      click: () => {
        currentUrl = 'https://claude.ai';
        mb.window.loadURL(currentUrl);
      }
    },
    { type: 'separator' },
    {
      label: 'Toggle App', 
      click: toggleApp
    },
    { label: 'Quit', click: () => { app.quit() } }
  ])

  tray.setToolTip('Background-GPT')
  tray.setContextMenu(contextMenu)

  // Register a global shortcut
  const ret = globalShortcut.register('Alt+Space', toggleApp)

  if (!ret) {
    console.log('Registration failed')
  }

  console.log(globalShortcut.isRegistered('Alt+Space'))
})

// Helper function to toggle the app
function toggleApp() {
  if (mb.window.isVisible()) {
    windowPosition = mb.window.getBounds()
    mb.hideWindow()
  } else {
    mb.showWindow()
  }
}

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