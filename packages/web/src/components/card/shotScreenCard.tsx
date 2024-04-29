import { ScissorOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';

const ShotScreenCard = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({
    handleCutScreen,
  }));

  const { t } = useTranslation();

  function handleCutScreen() {
    if (window.electronAPI) {
      window.electronAPI.sendSsStartWin();
    } else {
      location.href = '/shotScreen.html';
    }
  }

  return (
    <div className="cardContent" onClick={handleCutScreen}>
      <ScissorOutlined />
      <div className="cardTitle">{t('home.screenshot')}</div>
    </div>
  );
});

export default ShotScreenCard;
