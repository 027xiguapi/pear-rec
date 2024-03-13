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
      window.electronAPI.sendMaCloseWin();
      window.electronAPI.sendSsOpenWin();
    } else {
      location.href = '/shotScreen.html';
    }
  }

  return (
    <Card
      hoverable
      bordered={false}
      style={{ maxWidth: 300, minWidth: 140, height: 130 }}
      onClick={handleCutScreen}
    >
      <div className="cardContent">
        <ScissorOutlined />
        <div className="cardTitle">{t('home.screenshot')}</div>
      </div>
    </Card>
  );
});

export default ShotScreenCard;
