const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectFile: () => ipcRenderer.invoke('select-file'),
    selectAudioFile: () => ipcRenderer.invoke('select-audio-file'),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    generateAudio: (options) => ipcRenderer.invoke('generate-audio', options),
    transcribeAudio: (options) => ipcRenderer.invoke('transcribe-audio', options),
    fetchSubscription: (options) => ipcRenderer.invoke('fetch-subscription', options),
    openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
    getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath)
});
