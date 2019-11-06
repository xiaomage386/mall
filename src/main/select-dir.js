// 选择文件夹路径
const {ipcMain, dialog} = require('electron')
ipcMain.on('select-file-dialog', (event) => {
  dialog.showOpenDialog({
    title: '选择文件夹',
    buttonLabel: '确定',
    properties: ['openFile', 'openDirectory']
  }, (files) => {
    if (files) {
      event.sender.send('selected-directory', files)
    }
  })
})
