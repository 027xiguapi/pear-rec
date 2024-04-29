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
    <div className="cardContent">
      <HandPaintedPlate className="cardIcon" onClick={handleRecordCanvasClick} />
      <div className="cardTitle">{t('home.canvas')}</div>
    </div>
  );
});

export default RecordCanvasCard;
