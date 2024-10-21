const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}



ipcMain.on('open-file', (event, arg) => {
  event.returnValue = dialog.showOpenDialogSync({
    properties: ['openFile']
  })
})


ipcMain.on('synchronous-message', (event, arg) => {
  event.returnValue = dialog.showOpenDialogSync({
    properties: ['openDirectory']
  })
})

ipcMain.handle('receive-from-index', async (event, data) => {
  return 'Received data from index: ' + data
})





const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: true,
    },
    icon: path.join(__dirname, 'asset/icon.png'),

  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setTitle('FileFolder')
  mainWindow.resizable = false;
  


  mainWindow.webContents.session.setCertificateVerifyProc((request, callback) => {
    const { hostname } = request
    if (hostname === 'example.com') {
      callback(0);
    } else {
      callback(-3);
    }
  })

};


app.whenReady().then(() => {
  createWindow();


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});











