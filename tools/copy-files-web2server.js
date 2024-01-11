const fs = require('fs-extra');
const { rm } = require('node:fs');

const copyFiles = async () => {
  try {
    await fs.copy('./packages/web/dist', './packages/server/public/');
    console.log('Web files copied over successfully');
  } catch (err) {
    console.error(err);
  }
};

function deleteFolderFiles() {
  const folderPath = './packages/server/public';

  rm(folderPath, () => {
    console.log('Server files delete successfully');
    copyFiles();
  });
}

deleteFolderFiles();
