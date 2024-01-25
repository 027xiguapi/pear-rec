import { Button } from 'antd';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../../api';
import { GifContext } from '../../context/GifContext';
import { HistoryContext } from '../../context/HistoryContext';
import { UserContext } from '../../context/UserContext';
import styles from './splice.module.scss';

const Setting = (props) => {
  const { t } = useTranslation();
  const api = useApi();
  const { user, setUser } = useContext(UserContext);
  const { historyState, historyDispatch } = useContext(HistoryContext);
  const { gifState, gifDispatch } = useContext(GifContext);
  const [duration, setDuration] = useState<string | number | null>('500');

  return (
    <div className={`${styles.setting}`}>
      <div className="imgList">
        <img src="" alt="" />
      </div>
      <div className="tool">
        <Button type="primary">保存</Button>
      </div>
      <div className="canvas">
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </div>
    </div>
  );
};

export default Setting;
