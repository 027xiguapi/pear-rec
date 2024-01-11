const fs = require('fs-extra');
const { rm } = require('node:fs');

const copyFiles = async () => {
  try {
    await fs.copy('./packages/web/dist', './packages/desktop/dist/');
    console.log('Web files copied over successfully');
  } catch (err) {
    console.error(err);
  }
};

function deleteFolderFiles() {
  const folderPath = './packages/desktop/dist';

  rm(folderPath, () => {
    console.log('Server files delete successfully');
    copyFiles();
  });
}

deleteFolderFiles();
