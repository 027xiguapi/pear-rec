const fs = require('fs-extra');
const { rimraf, rimrafSync } = require('rimraf');

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

  rimraf
    .rimraf(folderPath)
    .then(() => {
      console.log('Desktop files delete successfully');
      copyFiles();
    })
    .catch((err) => {
      console.error('deleteFolderFiles', err);
    });
}

deleteFolderFiles();
