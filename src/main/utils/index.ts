import { Notification } from 'electron';
import fsAsync from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { showWindow } from '@main/window';

export const ensureDirectory = async (path: string) => {
  await fsAsync.mkdir(path, { recursive: true });
};

export const deleteOldLog = (dir: string, days = 3) => {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);

  fs.readdir(dir, (err, files) => {
    if (err || !files.length) return;

    for (const file of files) {
      const matches = /^(\d{4}-\d{2}-\d{2})(\.old)?\.log$/.exec(file);
      if (matches) {
        const fileDate = new Date(matches[1]);
        if (fileDate.getTime() < daysAgo.getTime()) {
          fs.unlink(path.join(dir, file), (err) => {
            if (err) console.error(err);
          });
        }
      }
    }
  });
};

export const showNotification = (title: string, body: string, imagePath?: string) => {
  const notification = new Notification({ title, body, icon: imagePath });
  notification.show();
  notification.on('click', () => showWindow(true));
};
