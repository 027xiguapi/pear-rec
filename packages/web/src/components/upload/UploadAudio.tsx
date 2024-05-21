import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Space, Button } from 'antd';

function UploadAudio(props) {
  const { t } = useTranslation();
  const inputRef = useRef(null);

  function handleUpload() {
    inputRef.current.click();
  }

  function handleUploadAudios(event) {
    const files = event.target.files;
    props.handleUploadAudios(files);
  }

  return (
    <Space>
      <Button type="primary" onClick={handleUpload}>
        {t('recorderAudio.localAudio')}
      </Button>
      <input
        type="file"
        accept="audio/*"
        className="inputRef hide"
        ref={inputRef}
        multiple
        onChange={handleUploadAudios}
      />
    </Space>
  );
}

export default UploadAudio;
