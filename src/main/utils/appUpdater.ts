import { autoUpdater } from 'electron-updater';
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from 'toad-scheduler';
import logger from 'electron-log/main';
import { sendUpdateNotificationToMain } from '@main/ipc';

export default class AppUpdater {
  constructor() {
    autoUpdater.logger = logger;
    autoUpdater.on('update-available', async () => {
      sendUpdateNotificationToMain();
    });

    this.setupUpdateCheckTask();
  }

  private setupUpdateCheckTask = () => {
    const scheduler = new ToadScheduler();
    const task = new AsyncTask(
      'update-check-task',
      () => this.checkUpdates(),
      (e) => console.error(e)
    );

    const job = new SimpleIntervalJob({ hours: 1 }, task, { id: 'update-check-task' });
    scheduler.addSimpleIntervalJob(job);
  };

  public async checkUpdates() {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;

    try {
      await autoUpdater.checkForUpdates();
    } catch (e) {
      console.error(e);
    }
  }

  public async updateNow() {
    await autoUpdater.downloadUpdate();
    autoUpdater.quitAndInstall();
  }
}
