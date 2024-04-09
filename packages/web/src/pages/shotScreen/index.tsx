import { ExclamationCircleFilled } from '@ant-design/icons';
import Screenshots, { Bounds } from '@pear-rec/screenshot';
import '@pear-rec/screenshot/src/Screenshots/screenshots.scss';
import { Button, Modal, Space, message } from 'antd';
import { saveAs } from 'file-saver';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UploadImg from '../../components/upload/UploadImg';
import { db, defaultUser } from '../../db';
import ininitApp from '../../pages/main';
import { searchImg } from '../../util/searchImg';
import { isURL } from '../../util/validate';
import styles from './index.module.scss';

const defaultImg = '/imgs/th.webp';
function ShotScreen() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>({});
  const [screenShotImg, setScreenShotImg] = useState('');

  useEffect(() => {
    init();
    user.id || getCurrentUser();
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

  const onSave = useCallback(
    (blob: Blob, bounds: Bounds) => {
      const url = URL.createObjectURL(blob);
      saveAs(url, `pear-rec_${+new Date()}.png`);
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

  const onOk = useCallback(
    (blob: Blob, bounds: Bounds) => {
      saveFile(blob, bounds, false);
    },
    [user],
  );

  async function saveFile(blob, bounds, isPin) {
    try {
      const record = {
        fileName: `pear-rec_${+new Date()}.png`,
        fileData: blob,
        fileType: 'ss',
        userId: user.id,
        createdAt: new Date(),
        createdBy: user.id,
        updatedAt: new Date(),
        updatedBy: user.id,
      };
      const recordId = await db.records.add(record);
      if (recordId) {
        copyImg(blob);
        if (window.isElectron) {
          window.electronAPI?.sendSsCloseWin();
          if (isPin) {
            window.electronAPI?.sendPiOpenWin({
              recordId: recordId,
              width: bounds.width,
              height: bounds.height,
            });
          } else {
            saveAs(blob, `pear-rec_${+new Date()}.png`);
          }
        } else {
          Modal.confirm({
            title: '图片已保存，是否查看？',
            content: record.fileName,
            okText: t('modal.ok'),
            cancelText: t('modal.cancel'),
            onOk() {
              location.href = isPin
                ? `/pinImage.html?recordId=${recordId}`
                : `/viewImage.html?recordId=${recordId}`;
            },
          });
        }
      }
    } catch (err) {
      message.error('保存失败');
    }
  }

  const onPin = useCallback(async (blob, bounds) => {
    window.isElectron && saveFile(blob, bounds, true);
  }, []);

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
          <UploadImg handleUploadImg={handleUploadImg} />
          <Button type="primary" onClick={getShotScreenImg}>
            屏幕
          </Button>
        </Space>
      )}
    </div>
  );
}

ininitApp(ShotScreen);

export default ShotScreen;
