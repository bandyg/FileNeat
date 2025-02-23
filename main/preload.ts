import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value);
  },
  sendSync(channel: string, value: unknown) {
    return ipcRenderer.sendSync(channel, value);
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  once(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => {
      callback(...args);
      ipcRenderer.removeListener(channel, subscription); // Remove listener after first call
    };
    ipcRenderer.on(channel, subscription);
  },
};

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler;
