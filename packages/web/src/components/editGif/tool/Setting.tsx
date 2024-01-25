import { FileEditingOne, FolderDownload, Stopwatch } from '@icon-park/react';
import { InputNumber, Modal } from 'antd';
import { saveAs } from 'file-saver';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../../api';
import { GifContext } from '../../context/GifContext';
import { HistoryContext } from '../../context/HistoryContext';
import { UserContext } from '../../context/UserContext';
import EditImg from '../../editImg';
import styles from './setting.module.scss';

const Setting = (props) => {
  const { t } = useTranslation();
  const api = useApi();
  const { user, setUser } = useContext(UserContext);
  const { historyState, historyDispatch } = useContext(HistoryContext);
  const { gifState, gifDispatch } = useContext(GifContext);
  const [duration, setDuration] = useState<string | number | null>('500');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let _duration = gifState.videoFrames[gifState.index]?.duration || 500;
    setDuration(_duration);
  }, [gifState.index]);

  useEffect(() => {
    let currentVideoFrame = gifState.videoFrames[gifState.index];
    if (currentVideoFrame && currentVideoFrame.duration != duration) {
      let newVideoFrame = {
        ...currentVideoFrame,
        duration: duration,
      };
      const newVideoFrames = [...gifState.videoFrames];
      newVideoFrames.splice(gifState.index, 1, newVideoFrame);
      gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
    }
  }, [duration]);

  function handleDownloadFrame() {
    const newVideoFrames = [...gifState.videoFrames];
    const videoFrame = newVideoFrames[gifState.index];
    saveAs(videoFrame.url, `pear-rec_${+new Date()}.png`);
  }

  // function handleEditFrame() {
  // const newVideoFrames = [...gifState.videoFrames];
  // const videoFrame = newVideoFrames[gifState.index];
  // console.log(videoFrame);
  // }

  function handleEditFrame(blob) {
    let url = URL.createObjectURL(blob);
    let currentVideoFrame = gifState.videoFrames[gifState.index];
    let newVideoFrame = {
      ...currentVideoFrame,
      url: url,
    };
    const newVideoFrames = [...gifState.videoFrames];
    newVideoFrames.splice(gifState.index, 1, newVideoFrame);
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
    setIsModalOpen(false);
  }

  return (
    <div className={`${styles.setting}`}>
      <div className="settingList">
        <div className="settingBtn durationBtn">
          <div className="durationTool">
            <Stopwatch
              className="settingIcon durationIcon"
              theme="outline"
              size="27"
              fill="#749EC4"
            />
            <InputNumber min={1} value={duration} onChange={setDuration} />
          </div>
          <div className="settingBtnTitle">延迟(ms)</div>
        </div>
        <div className="settingBtn" onClick={handleDownloadFrame}>
          <FolderDownload className="settingIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="settingBtnTitle">下载</div>
        </div>
        <div className="settingBtn" onClick={() => setIsModalOpen(true)}>
          <FileEditingOne className="settingIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="settingBtnTitle">编辑</div>
        </div>
      </div>
      <div className="subTitle">设置</div>
      <Modal
        title="编辑图片"
        width={'90%'}
        style={{ top: 10 }}
        open={isModalOpen}
        // onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
      >
        <EditImg imgUrl={gifState.videoFrames[gifState.index]?.url} onSave={handleEditFrame} />
      </Modal>
    </div>
  );
};

export default Setting;
