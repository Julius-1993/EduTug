const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 375,
    minHeight: 667,
    title: 'Edu Tug of War',
    icon: path.join(__dirname, '../public/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#0c1a13',
    show: false, // show after ready-to-show for smooth launch
  })

  // Load URL in dev, file in production
  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Show window when ready (prevents white flash)
  win.once('ready-to-show', () => win.show())

  // Open external links in system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Custom menu — remove default Electron menu in prod
  if (!isDev) {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: 'App',
        submenu: [
          { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => win.reload() },
          { type: 'separator' },
          { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }
        ]
      }
    ]))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
