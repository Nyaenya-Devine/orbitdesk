// OrbitDesk Preload — Secure IPC Bridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('orbitdesk', {
  // Incoming call from main to renderer
  onAcceptCall: (callback) => ipcRenderer.on('accept-call', (event, ticket) => callback(ticket)),
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),
  onNewTicket: (callback) => ipcRenderer.on('new-ticket', callback),
  onExportTranscript: (callback) => ipcRenderer.on('export-transcript', callback),
  onAcceptIncoming: (callback) => ipcRenderer.on('accept-incoming', callback),
  onToggleMute: (callback) => ipcRenderer.on('toggle-mute', callback),
  onToggleHold: (callback) => ipcRenderer.on('toggle-hold', callback),
  onAddExpert: (callback) => ipcRenderer.on('add-expert', callback),
  onEndCall: (callback) => ipcRenderer.on('end-call', callback),
  onOpenCommandPalette: (callback) => ipcRenderer.on('open-command-palette', callback),
  onOpenTraining: (callback) => ipcRenderer.on('open-training', callback),
  onShowShortcuts: (callback) => ipcRenderer.on('show-shortcuts', callback),
  
  // Renderer to main
  incomingCall: (ticket) => ipcRenderer.send('incoming-call', ticket),
  
  // App info
  isDesktop: true,
  platform: process.platform,
  version: process.env.npm_package_version || '2.0.0-voice-calls',
});

console.log('OrbitDesk Desktop Bridge loaded — Voice calls, remote PC, tech experts');
