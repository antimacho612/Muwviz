import { sendScanProgressToMain } from '@main/ipc';

export const scanProgressReporter = (path: string) => {
  const progress = {
    path,
    totalFilesCount: 0,
    currentIndex: 0,
    scannedFilesCount: 0,
    skippedFilesCount: 0,
    done: false,
  };

  const setTotal = (total: number) => {
    progress.totalFilesCount = total;
  };

  const incrementScanned = () => {
    progress.currentIndex++;
    progress.scannedFilesCount++;
  };

  const incrementSkipped = () => {
    progress.currentIndex++;
    progress.skippedFilesCount++;
  };

  const report = (done = false) => {
    progress.done = done;
    sendScanProgressToMain(progress);
  };

  return {
    setTotal,
    incrementScanned,
    incrementSkipped,
    report,
  };
};
