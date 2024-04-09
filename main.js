const { app, BrowserWindow,Menu } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 1100,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, './src/image/ico.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  Menu.setApplicationMenu(null);
  win.loadFile('./template/index.html');
}


app.whenReady().then(() => { createWindow() });


