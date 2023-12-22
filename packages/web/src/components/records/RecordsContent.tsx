import React, { useState, useEffect, forwardRef } from 'react';
import { Layout, Button, List, Skeleton, Avatar } from 'antd';
import {
  ScissorOutlined,
  AudioOutlined,
  CameraOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useApi } from '../../api';
import { useRecordApi } from '../../api/record';
import { eventEmitter } from '../../util/bus';

const { Content } = Layout;
const recordApi = useRecordApi();
const api = useApi();

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
    const res = (await recordApi.deleteListRecord(ids)) as any;
    if (res.code == 0) {
      const newData = [];
      setData(newData);
      setList(newData);
      window.dispatchEvent(new Event('resize'));
    }
    setIsDelete(false);
  }

  function handleSearchRecord(filterVal) {
    setFilterVal(filterVal);
  }

  async function getRecords() {
    const res = (await recordApi.getRecords({ pageSize, pageNumber })) as any;
    if (res.code == 0) {
      setInitLoading(false);
      setData(res.data);
      setList(res.data);
      setPageNumber(pageNumber + 1);
      setIsMore(res.data.length < pageSize ? false : true);
    }
  }

  async function onLoadMore() {
    setLoading(true);
    setList(
      data.concat(
        [...new Array(10)].map(() => ({ loading: true, filePath: '----', createdAt: '----' })),
      ),
    );
    const res = (await recordApi.getRecords({ pageSize, pageNumber })) as any;
    if (res.code == 0) {
      const newData = data.concat(res.data);
      setData(newData);
      setList(newData);
      setLoading(false);
      setIsMore(res.data.length < pageSize ? false : true);
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
    if (record.fileType == 'ss' || record.fileType == 'eg') {
      return <ScissorOutlined />;
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

  function handleOpenFilePath(record: any) {
    if (record.fileType == 'ss') {
      window.electronAPI
        ? window.electronAPI?.sendViOpenWin({ imgUrl: record.filePath })
        : window.open(`/viewImage.html?imgUrl=${record.filePath}`);
    }
    if (record.fileType == 'rs') {
      window.electronAPI
        ? window.electronAPI.sendVvOpenWin({ videoUrl: record.filePath })
        : window.open(`/viewVideo.html?videoUrl=${record.filePath}`);
    }
    if (record.fileType == 'rv') {
      window.electronAPI
        ? window.electronAPI.sendVvOpenWin({ videoUrl: record.filePath })
        : window.open(`/viewVideo.html?videoUrl=${record.filePath}`);
    }
    if (record.fileType == 'ra') {
      window.electronAPI
        ? window.electronAPI.sendVaOpenWin({ audioUrl: record.filePath })
        : window.open(`/viewAudio.html?audioUrl=${record.filePath}`);
    }
  }

  async function handleDeleteRecord(record: any, index) {
    const res = (await recordApi.deleteRecord(record.id)) as any;
    if (res.code == 0) {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
      setList(newData);
      window.dispatchEvent(new Event('resize'));
    }
  }

  function openFilePath(filePath) {
    api.openFilePath(filePath);
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
            ]}
          >
            <Skeleton avatar title={false} loading={record.loading} active>
              <List.Item.Meta
                avatar={<Avatar icon={getAvatar(record)} style={{ backgroundColor: '#1677ff' }} />}
                title={
                  <a
                    onClick={() => handleOpenFilePath(record)}
                    dangerouslySetInnerHTML={{ __html: record.filePath }}
                  ></a>
                }
                description={
                  <span>
                    <span dangerouslySetInnerHTML={{ __html: record.createdAt }}></span>{' '}
                    <span className="openFolder" onClick={() => openFilePath(record.filePath)}>
                      在文件夹中显示
                    </span>
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
