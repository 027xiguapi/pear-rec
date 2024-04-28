import {
  AudioOutlined,
  CameraOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Layout, List, message, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { forwardRef, useEffect, useState } from 'react';
import { db } from '../../db';
import { eventEmitter } from '../../util/bus';

const { Content } = Layout;

const RecordAudioCard = forwardRef(() => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageNumber, setPageNumber] = useState(1);
  const [isMore, setIsMore] = useState(true);
  const [filterVal, setFilterVal] = useState('');
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    setPageNumber(1);
    getRecords();

    eventEmitter.on('deleteAllRecord', handleDeleteAllRecord);
    eventEmitter.on('searchRecord', handleSearchRecord);

    return () => {
      eventEmitter.off('deleteAllRecord', handleDeleteAllRecord);
      eventEmitter.off('searchRecord', handleSearchRecord);
    };
  }, []);

  useEffect(() => {
    filterData();
  }, [filterVal]);

  useEffect(() => {
    isDelete && deleteListRecord();
  }, [isDelete]);

  async function handleDeleteAllRecord() {
    setIsDelete(true);
  }

  async function deleteListRecord() {
    let ids = [];
    data.map((item) => {
      ids.push(item.id);
    });
    await db.records.bulkDelete(ids);
    const newData = [];
    setData(newData);
    setList(newData);
    window.dispatchEvent(new Event('resize'));
    setIsDelete(false);
  }

  function handleSearchRecord(filterVal) {
    setFilterVal(filterVal);
  }

  async function getRecords() {
    let records = await db.records
      .orderBy('id')
      .reverse()
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    if (records.length >= 0) {
      setInitLoading(false);
      setData(records);
      setList(records);
      setPageNumber(pageNumber + 1);
      setIsMore(records.length < pageSize ? false : true);
    }
  }

  async function onLoadMore() {
    setLoading(true);
    setList(
      data.concat(
        [...new Array(10)].map(() => ({
          loading: true,
          fileName: '----',
          filePath: '----',
          createdAt: '----',
        })),
      ),
    );
    let records = await db.records
      .orderBy('id')
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    if (records.length >= 0) {
      const newData = data.concat(records);
      setData(newData);
      setList(newData);
      setLoading(false);
      setIsMore(records.length < pageSize ? false : true);
      window.dispatchEvent(new Event('resize'));
    }
  }

  function filterData() {
    const _filterVal = String(filterVal).trim().toLowerCase();
    let _tableData = [];
    if (filterVal) {
      const searchProps = ['filePath', 'createdAt'];
      const filterRE = new RegExp(filterVal, 'gi');
      const rest = data.filter((item: any) =>
        searchProps.some((key) => String(item[key]).toLowerCase().indexOf(_filterVal) > -1),
      );
      _tableData = rest.map((row) => {
        const item = Object.assign({}, row) as any;
        searchProps.forEach((key) => {
          item[key] = String(item[key]).replace(
            filterRE,
            (match) => `<span class="keyword-lighten">${match}</span>`,
          );
        });
        return item;
      });
    } else {
      _tableData = [...data];
    }

    setList(_tableData);
    window.dispatchEvent(new Event('resize'));
  }

  function getAvatar(record: any) {
    if (
      record.fileType == 'ss' ||
      record.fileType == 'eg' ||
      record.fileType == 'gif' ||
      record.fileType == 'ei'
    ) {
      return <PictureOutlined />;
    }
    if (record.fileType == 'rs') {
      return <CameraOutlined />;
    }
    if (record.fileType == 'rv') {
      return <VideoCameraOutlined />;
    }
    if (record.fileType == 'ra') {
      return <AudioOutlined />;
    }
  }

  async function handleOpenFilePath(record: any) {
    if (
      record.fileType == 'ss' ||
      record.fileType == 'eg' ||
      record.fileType == 'gif' ||
      record.fileType == 'ei'
    ) {
      window.isElectron
        ? (await handleExistsRecord(record)) &&
          window.electronAPI.sendViOpenWin({ recordId: record.id })
        : window.open(`/viewImage.html?recordId=${record.id}`);
    }
    if (record.fileType == 'rs') {
      window.isElectron
        ? (await handleExistsRecord(record)) &&
          window.electronAPI.sendVvOpenWin({ recordId: record.id })
        : window.open(`/viewVideo.html?recordId=${record.id}`);
    }
    if (record.fileType == 'rv') {
      window.isElectron
        ? (await handleExistsRecord(record)) &&
          window.electronAPI.sendVvOpenWin({ recordId: record.id })
        : window.open(`/viewVideo.html?recordId=${record.id}`);
    }
    if (record.fileType == 'ra') {
      window.isElectron
        ? (await handleExistsRecord(record)) &&
          window.electronAPI.sendVaOpenWin({ recordId: record.id })
        : window.open(`/viewAudio.html?recordId=${record.id}`);
    }
  }

  async function handleDeleteRecord(record: any, index) {
    await db.records.delete(record.id);
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
    setList(newData);
    window.dispatchEvent(new Event('resize'));
  }

  async function handleDownloadRecord(record) {
    if (window.isElectron) {
      (await handleExistsRecord(record)) && window.electronAPI.sendReOpenFile(record.filePath);
    } else {
      saveAs(record.fileData, record.fileName);
    }
  }

  async function handleExistsRecord(record) {
    const isExists = await window.electronAPI.invokeReGetExists(record.filePath);
    if (!isExists) {
      message.error('文件未找到！');
    }
    return isExists;
  }

  const loadMore =
    !initLoading && !loading && isMore ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

  return (
    <Content className="recordsContent">
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={(record: any, index) => (
          <List.Item
            actions={[
              <a key="list-loadmore-delete" onClick={() => handleDeleteRecord(record, index)}>
                删除
              </a>,
              <a key="list-loadmore-download" onClick={() => handleDownloadRecord(record)}>
                打开
              </a>,
            ]}
          >
            <Skeleton avatar title={false} loading={record.loading} active>
              <List.Item.Meta
                avatar={<Avatar icon={getAvatar(record)} style={{ backgroundColor: '#1677ff' }} />}
                title={
                  <a
                    onClick={() => handleOpenFilePath(record)}
                    dangerouslySetInnerHTML={{ __html: record.filePath || record.fileName }}
                  />
                }
                description={
                  <span>
                    <span
                      className="createdAt"
                      dangerouslySetInnerHTML={{
                        __html: dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                      }}
                    />
                    {/* <span className="openFolder" onClick={() => openFilePath(record)}>
                      在文件夹中显示
                    </span> */}
                  </span>
                }
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </Content>
  );
});

export default RecordAudioCard;
