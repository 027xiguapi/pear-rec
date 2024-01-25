import { AlignHorizontally, AlignVertically } from '@icon-park/react';
import { Modal } from 'antd';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../../api';
import { GifContext } from '../../context/GifContext';
import { HistoryContext } from '../../context/HistoryContext';
import { UserContext } from '../../context/UserContext';
import SpliceImg from '../spliceImg/Index';
import styles from './splice.module.scss';

const Setting = (props) => {
  const { t } = useTranslation();
  const api = useApi();
  const { user, setUser } = useContext(UserContext);
  const { historyState, historyDispatch } = useContext(HistoryContext);
  const { gifState, gifDispatch } = useContext(GifContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleVerticalSpliceFrames() {
    const newVideoFrames = [...gifState.videoFrames];
    const videoFrame = newVideoFrames[gifState.index];
    setIsModalOpen(true);
    console.log(videoFrame);
  }

  function handleHorizontalSpliceFrames() {
    const newVideoFrames = [...gifState.videoFrames];
    const videoFrame = newVideoFrames[gifState.index];
    setIsModalOpen(true);
    console.log(videoFrame);
  }

  return (
    <div className={`${styles.splice}`}>
      <div className="spliceList">
        <div className="spliceBtn" onClick={handleVerticalSpliceFrames}>
          <AlignVertically className="spliceIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="spliceBtnTitle">垂直拼接</div>
        </div>
        <div className="spliceBtn" onClick={handleHorizontalSpliceFrames}>
          <AlignHorizontally className="spliceIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="spliceBtnTitle">水平拼接</div>
        </div>
      </div>
      <div className="subTitle">拼接</div>
      <Modal
        title="拼接图片"
        style={{ top: 20 }}
        open={isModalOpen}
        // onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
      >
        <SpliceImg />
      </Modal>
    </div>
  );
};

export default Setting;
