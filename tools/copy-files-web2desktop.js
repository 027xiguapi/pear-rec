const fs = require('fs-extra');
const { rimraf, rimrafSync } = require('rimraf');

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

  rimraf
    .rimraf(folderPath)
    .then(() => {
      console.log('Server files delete successfully');
      copyFiles();
    })
    .catch((err) => {
      console.error('deleteFolderFiles', err);
    });
}

deleteFolderFiles();
