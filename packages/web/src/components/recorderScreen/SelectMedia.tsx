import { Button, Input, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const SelectMedia = (props) => {
  const { t } = useTranslation();

  async function getMediaElectron() {
    const sources = await window.electronAPI?.invokeRsGetDesktopCapturerSource();
    const source = sources.filter((e: any) => e.id == 'screen:0:0')[0] || sources[0];
    const constraints: any = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
        },
      },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        props.setMediaStream(stream);
      })
      .catch((error) => {
        console.error('无法获取媒体权限：', error);
      });
  }

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

  function handleMedia() {
    if (window.electronAPI) {
      getMediaElectron();
    } else {
      getMediaWeb();
    }
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
      <Button type="primary" onClick={handleMedia}>
        屏幕
      </Button>
    </Space>
  );
};

export default SelectMedia;
