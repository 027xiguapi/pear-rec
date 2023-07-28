import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { DB } from "./utils";

const db = new Database(DB, { verbose: console.log });

init()

function init() {
  createTableUsers();
}


function createTableUsers() {
  const tabUser = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='user';`).get();
  // 创建user表
  if (!tabUser) {
    const create_table_user =
      `CREATE TABLE "user" (
      "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
      "uuid" varchar(255) NOT NULL,
      "userName" varchar(255) NOT NULL,
      "filePath" varchar(255),
      "historyImg" varchar(255),
      "historyVideo" varchar(255),
      "createdTime" datetime,
      "createdBy" varchar(255),
      "updatedTime" datetime,
      "updatedBy" varchar(255)
    );`

    db.exec(create_table_user)
  }
}

function setUser(user: any) {
  const stmt = db.prepare('INSERT INTO user (uuid, userName, filePath, createdTime) VALUES (?, ?, ?, ?)');
  stmt.run(user.uuid, user.userName, user.filePath, user.createdTime);
}

function getUser() {
  const stmt = db.prepare('SELECT * FROM user LIMIT 1');
  const user = stmt.get(); //返回第一条记录
  console.log("user", user)
  return user || {};
}

function getUserByUuid(uuid: string) {
  const stmt = db.prepare('SELECT * FROM user WHERE uuid = ?');
  const user = stmt.get(uuid);

  return user;
}

function getUserUuid() {
  const user = getUser() as any;
  return user.uuid;
}

function getUserCreatedTime() {
  const user = getUser() as any;
  return user.createdTime;
}

function setFilePath(filePath: string) {
  const uuid = getUserUuid();
  const stmt = db.prepare('UPDATE user SET filePath = ? WHERE uuid = ?');
  stmt.run(filePath, uuid);
}

function getFilePath() {
  const user = getUser() as any;
  return user.filePath;
}

function setHistoryImg(historyImg: any) {
  const uuid = getUserUuid();
  const stmt = db.prepare('UPDATE user SET historyImg = ? WHERE uuid = ?');
  stmt.run(historyImg, uuid);
}

function getHistoryImg() {
  const user = getUser() as any;
  return user.historyImg;
}

function setHistoryVideo(historyVideo: any) {
  const uuid = getUserUuid();
  const stmt = db.prepare('UPDATE user SET historyVideo = ? WHERE uuid = ?');
  stmt.run(historyVideo, uuid);
}

function getHistoryVideo() {
  const user = getUser() as any;
  return user.historyVideo;
}

getHistoryImg()

export {
  setUser,
  getUser,
  getUserUuid,
  getUserCreatedTime,
  setFilePath,
  getFilePath,
  setHistoryImg,
  setHistoryVideo,
  getHistoryImg,
  getHistoryVideo,
};
