import { Button, Input, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const SelectMedia = (props) => {
  const { t } = useTranslation();

  function getMediaWeb() {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((stream) => {
        props.setMediaStream(stream);
      })
      .catch((error) => {
        console.error('无法获取媒体权限：', error);
      });
  }

  function handlePage(value) {
    value && props.setIframeRef(value);
  }

  return (
    <Space wrap className="selectMedia">
      <Input.Search
        allowClear
        defaultValue={'https://juejin.cn/column/7261972803695444026'}
        placeholder="选择录屏网站"
        onSearch={handlePage}
        enterButton="确认"
      />
      <Button type="primary" onClick={getMediaWeb}>
        屏幕
      </Button>
    </Space>
  );
};

export default SelectMedia;
