// Preload script — runs in renderer context before page loads
// Exposes safe APIs from main process to renderer if needed
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
})
