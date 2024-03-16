import { SearchOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { urlToBlob } from '../../util/file';
import { searchImg } from '../../util/searchImg';

const SearchImageCard = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const fileRef = useRef(null);

  async function handleUploadFile(event) {
    const file = event.target.files[0];
    const imgUrl = window.URL.createObjectURL(file);
    const blob = await urlToBlob(imgUrl);
    const tabUrl = await searchImg(blob, props.user.isProxy);
    if (window.isElectron) {
      tabUrl && window.electronAPI.sendSsOpenExternal(tabUrl);
      window.electronAPI.sendSsCloseWin();
    } else {
      tabUrl && window.open(tabUrl);
    }
    event.target.value = '';
  }

  return (
    <Card
      hoverable
      bordered={false}
      style={{ maxWidth: 300, minWidth: 140, height: 130 }}
      onClick={() => fileRef.current.click()}
    >
      <div className="cardContent">
        <SearchOutlined className="cardIcon" />
        <div className="cardTitle">搜图</div>
      </div>
      <input
        type="file"
        ref={fileRef}
        accept="image/png,image/jpeg,.webp"
        className="fileRef"
        onChange={handleUploadFile}
      />
    </Card>
  );
});

export default SearchImageCard;
