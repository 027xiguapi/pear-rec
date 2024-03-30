import { HandPaintedPlate } from '@icon-park/react';
import { Card, Modal } from 'antd';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const RecordCanvasCard = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();

  function handleRecordCanvasClick() {
    if (window.isElectron) {
      window.electronAPI.sendCaOpenWin();
      window.electronAPI.sendMaCloseWin();
    } else {
      location.href = `/canvas.html`;
    }
  }

  return (
    <Card hoverable bordered={false} style={{ maxWidth: 300, minWidth: 140, height: 130 }}>
      <div className="cardContent">
        <HandPaintedPlate className="cardIcon" onClick={handleRecordCanvasClick} />
        <div className="cardTitle">{t('home.canvas')}</div>
      </div>
    </Card>
  );
});

export default RecordCanvasCard;
