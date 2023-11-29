import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ScissorOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';

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
