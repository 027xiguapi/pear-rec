import { SyncOutlined } from '@ant-design/icons';
import type { ProgressInfo } from 'electron-updater';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import Progress from './Progress';
import styles from './update.module.scss';

const Update = () => {
  const { t } = useTranslation();
  const [checking, setChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [versionInfo, setVersionInfo] = useState<VersionInfo>();
  const [updateError, setUpdateError] = useState<ErrorType>();
  const [progressInfo, setProgressInfo] = useState<Partial<ProgressInfo>>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalBtn, setModalBtn] = useState<{
    cancelText?: string;
    okText?: string;
    onCancel?: () => void;
    onOk?: () => void;
  }>({
    onCancel: () => setModalOpen(false),
  });

  const checkUpdate = async (isOpenModel) => {
    setChecking(true);
    /**
     * @type {import('electron-updater').UpdateCheckResult | null | { message: string, error: Error }}
     */
    // const result = await ipcRenderer.invoke('check-update');
    const result = await window.electronAPI?.invokeEuCheckUpdate();
    setProgressInfo({ percent: 0 });
    setChecking(false);
    isOpenModel && setModalOpen(true);
    if (result?.error) {
      setUpdateAvailable(false);
      setUpdateError(result?.error);
    }
  };

  const onUpdateCanAvailable = useCallback(
    (_event: Electron.IpcRendererEvent, arg1: VersionInfo) => {
      setVersionInfo(arg1);
      setUpdateError(undefined);
      // Can be update
      if (arg1.update) {
        setModalBtn((state) => ({
          ...state,
          cancelText: t('update.later'),
          okText: t('update.update'),
          onOk: () => window.electronAPI?.invokeEuStartDownload(),
        }));
        setUpdateAvailable(true);
      } else {
        setUpdateAvailable(false);
      }
    },
    [],
  );

  const onUpdateError = useCallback((_event: Electron.IpcRendererEvent, arg1: ErrorType) => {
    setUpdateAvailable(false);
    setUpdateError(arg1);
  }, []);

  const onDownloadProgress = useCallback(
    (_event: Electron.IpcRendererEvent, arg1: ProgressInfo) => {
      setProgressInfo(arg1);
    },
    [],
  );

  const onUpdateDownloaded = useCallback((_event: Electron.IpcRendererEvent, ...args: any[]) => {
    setProgressInfo({ percent: 100 });
    setModalBtn((state) => ({
      ...state,
      cancelText: t('update.later'),
      okText: t('update.install'),
      onOk: () => window.electronAPI?.invokeEuQuitAndInstall(),
    }));
  }, []);

  useEffect(() => {
    checkUpdate(false);
    // Get version information and whether to update
    window.electronAPI?.handleEuUpdateCanAvailable(onUpdateCanAvailable);
    window.electronAPI?.handleEuUpdateeError(onUpdateError);
    window.electronAPI?.handleEuDownloadProgress(onDownloadProgress);
    window.electronAPI?.handleEuUpdateDownloaded(onUpdateDownloaded);

    return () => {
      window.electronAPI?.offEuUpdateCanAvailable(onUpdateCanAvailable);
      window.electronAPI?.offEuUpdateeError(onUpdateError);
      window.electronAPI?.offEuDownloadProgress(onDownloadProgress);
      window.electronAPI?.offEuUpdateDownloaded(onUpdateDownloaded);
    };
  }, []);

  return (
    <>
      <Modal
        open={modalOpen}
        cancelText={modalBtn?.cancelText}
        okText={modalBtn?.okText}
        onCancel={modalBtn?.onCancel}
        onOk={modalBtn?.onOk}
        footer={updateAvailable ? /* hide footer */ null : undefined}
      >
        <div className={styles.modalslot}>
          {updateError ? (
            <div className="update-error">
              <p>{t('update.error')}</p>
              <p>{updateError.message}</p>
            </div>
          ) : updateAvailable ? (
            <div className="can-available">
              <div>
                {t('update.version')}: v{versionInfo?.newVersion}
              </div>
              <div className="new-version-target">
                v{versionInfo?.version} -&gt; v{versionInfo?.newVersion}
              </div>
              <div className="update-progress">
                <div className="progress-title">{t('update.progress')}:</div>
                <div className="progress-bar">
                  <Progress percent={progressInfo?.percent}></Progress>
                </div>
              </div>
            </div>
          ) : (
            <div className="can-not-available">{JSON.stringify(versionInfo ?? {}, null, 2)}</div>
          )}
        </div>
      </Modal>
      <SyncOutlined
        title={t('nav.update')}
        className={`${updateAvailable ? 'red blink' : ''} icon`}
        disabled={checking}
        onClick={() => checkUpdate(true)}
      />
    </>
  );
};

export default Update;
