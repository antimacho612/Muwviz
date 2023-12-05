import { ElectronAPI } from './ipc';

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
