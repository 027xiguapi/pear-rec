const { app, globalShortcut, ipcMain } = require('electron')

app.whenReady().then(() => {
  // 注册一个'CommandOrControl+X' 快捷键监听器
//   const ret = globalShortcut.register('CommandOrControl+X', () => {
//     console.log('CommandOrControl+X is pressed')
//   })

//   if (!ret) {
//     console.log('registration failed')
//   }

//   // 检查快捷键是否注册成功
//   console.log(globalShortcut.isRegistered('CommandOrControl+X'))

    // globalShortcut.register('CommandOrControl+Shift+R', () => browserWindow.webContents.send("StartRecording"))
    // globalShortcut.register('CommandOrControl+Shift+S', () => browserWindow.webContents.send("StopRecording"))

})

app.on('will-quit', () => {
  // 注销快捷键
//   globalShortcut.unregister('CommandOrControl+X')

  // 注销所有快捷键
  globalShortcut.unregisterAll()
})