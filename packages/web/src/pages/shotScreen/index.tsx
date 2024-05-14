import { ExclamationCircleFilled } from '@ant-design/icons';
import Screenshots, { Bounds } from '@pear-rec/screenshot';
import '@pear-rec/screenshot/src/Screenshots/screenshots.scss';
import { Button, Modal, Space, message } from 'antd';
import { saveAs } from 'file-saver';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UploadImg from '@/components/upload/UploadImg';
import { db, defaultUser } from '@/db';
import ininitApp from '@/pages/main';
import { searchImg } from '@/util/searchImg';
import { isURL } from '@/util/validate';
import { blobToBase64 } from '@/util/file.ts';
import { Local } from '@/util/storage';
import styles from './index.module.scss';

let i18n = '';
function ShotScreen() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>({});
  const [screenShotImg, setScreenShotImg] = useState('');

  useEffect(() => {
    init();
    user.id || getCurrentUser();
    window.electronAPI?.sendSsFile((file) => {
      addRecord(file);
    });
  }, []);

  async function getCurrentUser() {
    try {
      let user = await db.users.where({ userType: 1 }).first();
      if (!user) {
        user = defaultUser;
        await db.users.add(user);
      }
      setUser(user);
    } catch (err) {
      console.log(err);
      Modal.confirm({
        title: '数据库错误，是否重置数据库?',
        icon: <ExclamationCircleFilled />,
        content: err.message,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          console.log('OK');
          await db.delete();
          location.reload();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }

  async function init() {
    setScreenShotImg('');
    if (window.electronAPI) {
      window.electronAPI?.sendSsShowWin((img) => {
        setScreenShotImg(img);
      });
      window.electronAPI?.sendSsHideWin(() => {
        setScreenShotImg('');
      });
    }
    i18n = Local.get('i18n');
  }

  async function getShotScreenImg() {
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((stream) => {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play();

        videoElement.addEventListener('loadedmetadata', () => {
          const context = canvas.getContext('2d');

          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          setScreenShotImg(canvas.toDataURL('image/png'));
          stream.getTracks().forEach((track) => track.stop());
        });
      })
      .catch((error) => {
        console.error('Error accessing screen:', error);
      });
  }

  const onOk = useCallback(
    (blob: Blob, bounds: Bounds) => {
      copyImg(blob);
      window.electronAPI?.sendSsCloseWin();
      const fileName = `pear-rec_${+new Date()}.png`;
      if (window.isElectron) {
        blobToBase64(blob).then((base64Data) => {
          window.electronAPI.sendSsDownloadImg({
            fileData: base64Data,
            fileName: fileName,
            bounds: bounds,
            isShow: false,
            isPin: false,
          });
        });
      } else {
        saveAs(blob, fileName);
        addRecord({ fileData: blob, fileName: fileName });
      }
    },
    [user],
  );

  const onSave = useCallback(
    (blob: Blob, bounds: Bounds) => {
      copyImg(blob);
      window.electronAPI?.sendSsCloseWin();
      const fileName = `pear-rec_${+new Date()}.png`;
      if (window.isElectron) {
        blobToBase64(blob).then((base64Data) => {
          window.electronAPI.sendSsDownloadImg({
            fileData: base64Data,
            fileName: fileName,
            bounds: bounds,
            isShow: true,
            isPin: false,
          });
        });
      } else {
        saveAs(blob, fileName);
        addRecord({ fileData: blob, fileName: fileName });
      }
    },
    [user],
  );

  const onCancel = useCallback(() => {
    if (window.isElectron) {
      window.electronAPI.sendSsCloseWin();
      window.electronAPI.sendMaOpenWin();
    } else {
      location.href = `/index.html`;
    }
  }, [user]);

  const onScan = useCallback(
    (result) => {
      Modal.confirm({
        title: '扫码结果',
        content: result,
        okText: t('modal.ok'),
        cancelText: t('modal.cancel'),
        onOk() {
          if (isURL(result)) {
            window.electronAPI
              ? window.electronAPI.sendSsOpenExternal(result)
              : window.open(result);
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    [user],
  );

  const onPin = useCallback(async (blob, bounds) => {
    const fileName = `pear-rec_${+new Date()}.png`;
    window.electronAPI?.sendSsCloseWin();
    if (window.isElectron) {
      blobToBase64(blob).then((base64Data) => {
        window.electronAPI.sendSsDownloadImg({
          fileData: base64Data,
          fileName: fileName,
          bounds: bounds,
          isShow: false,
          isPin: true,
        });
      });
    }
  }, []);

  const onSearch = useCallback(
    async (blob) => {
      const tabUrl = await searchImg(blob, user.isProxy);
      if (window.electronAPI) {
        tabUrl && window.electronAPI.sendSsOpenExternal(tabUrl);
        window.electronAPI.sendSsCloseWin();
      } else {
        tabUrl && window.open(tabUrl);
      }
    },
    [user],
  );

  async function addRecord(file) {
    const isPin = file.isPin;
    const bounds = file.bounds;
    try {
      const record = {
        fileName: file.fileName,
        filePath: file.filePath,
        fileData: file.fileData,
        fileType: 'ss',
        userId: user.id,
        createdAt: new Date(),
        createdBy: user.id,
        updatedAt: new Date(),
        updatedBy: user.id,
      };
      const recordId = await db.records.add(record);
      if (recordId) {
        window.electronAPI?.sendNotification({ title: '保存成功', body: '可以在历史中查看' });
        if (isPin) {
          window.electronAPI?.sendPiOpenWin({
            recordId: recordId,
            width: bounds.width,
            height: bounds.height,
          });
        } else {
          file.isShow || window.electronAPI?.sendViOpenWin({ recordId: recordId });
        }
      }
    } catch (err) {
      message.error('保存失败');
    }
  }

  async function copyImg(blob) {
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
  }

  function handleUploadImg(files) {
    const selectedFile = files[0];
    setScreenShotImg(window.URL.createObjectURL(selectedFile));
  }

  return (
    <div className={styles.shotScreen}>
      {screenShotImg ? (
        <Screenshots
          url={screenShotImg}
          width={window.innerWidth}
          height={window.innerHeight}
          lang={
            i18n != 'zh'
              ? {
                  operation_undo_title: 'Undo',
                  operation_mosaic_title: 'Mosaic',
                  operation_text_title: 'Text',
                  operation_brush_title: 'Brush',
                  operation_arrow_title: 'Arrow',
                  operation_ellipse_title: 'Ellipse',
                  operation_rectangle_title: 'Rectangle',
                  magnifier_position_label: 'Position',
                  operation_ok_title: 'Ok',
                  operation_cancel_title: 'Cancel',
                  operation_save_title: 'Save',
                  operation_redo_title: 'Redo',
                  operation_search_title: 'Search',
                  operation_scan_title: 'Scan',
                  operation_pin_title: 'Pin',
                }
              : {}
          }
          onSave={onSave}
          onCancel={onCancel}
          onOk={onOk}
          onSearch={onSearch}
          onScan={onScan}
          onPin={onPin}
        />
      ) : window.isElectron ? (
        <></>
      ) : (
        <Space wrap className="btns">
          <UploadImg handleUploadImg={handleUploadImg}>{t('shotScreen.image')}</UploadImg>
          <Button type="primary" onClick={getShotScreenImg}>
            {t('shotScreen.screen')}
          </Button>
        </Space>
      )}
    </div>
  );
}

ininitApp(ShotScreen);

export default ShotScreen;
