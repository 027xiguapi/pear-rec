const fs = require('fs-extra');
const { rm } = require('node:fs');

const copyFiles = async () => {
  try {
    await fs.copy('./packages/server/dist', './packages/desktop/dist-electron/server');
    console.log('Server files copied over successfully');
  } catch (err) {
    console.error(err);
  }
};

function deleteFolderFiles() {
  const folderPath = './packages/desktop/dist-electron/server';

  rm(folderPath, () => {
    console.log('Desktop files delete successfully');
    copyFiles();
  });
}

deleteFolderFiles();
