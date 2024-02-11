import fs from 'node:fs';
import multer from 'multer';
import { join, dirname } from 'node:path';
import { Application } from 'express';
import { exec } from 'child_process';
// import { getImgsByImgUrl, getAudiosByAudioUrl, getVideosByVideoUrl } from '../util/index';
// import { RecordsService } from '../records/records.service';
// import { UsersService } from '../users/users.service';
// import { SettingsService } from '../settings/settings.service';
// import { PEAR_FILES_PATH } from '../constant';

// const usersService = new UsersService();

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { type, userId } = req.body;
    // const user = await usersService.findOneById(userId);
    // const setting = await settingController._getSettingByUserId(userId);
    try {
      // const filePath = join(setting?.filePath || PEAR_FILES_PATH, `${user.uuid}/${type}`);
      // if (!fs.existsSync(filePath)) {
      //   fs.mkdirSync(filePath, { recursive: true });
      // }
      // cb(null, filePath);
    } catch (err) {
      console.log('saveFile err', err);
    }
  },
  filename: function (req, file, cb) {
    const fileTypeMap = {
      ss: 'png',
      rs: 'mp4',
      ra: 'webm',
      ei: 'png',
    };
    const type = req.body.type;
    const fileType = fileTypeMap[type] || 'webm';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${type}-${uniqueSuffix}.${fileType}`);
  },
});
const upload = multer({ storage: storage });

export function initLocalApi(app: Application) {
  app.post('/saveFile', upload.single('file'), async (req: any, res) => {
    // recordController.saveFile(req, res);
  });

  app.get('/getFile', async (req, res) => {
    const url = req.query.url as string;
    fs.readFile(url, function (err, data) {
      res.end(data);
    });
  });

  app.get('/video', function (req, res) {
    const url = req.query.url as string;
    const stat = fs.statSync(url);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(url, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(url).pipe(res);
    }
  });

  app.get('/audio', function (req, res) {
    const url = req.query.url as string;
    const stat = fs.statSync(url);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(url, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mp3',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mp3',
      };
      res.writeHead(200, head);
      fs.createReadStream(url).pipe(res);
    }
  });

  // app.get('/getImgs', async (req, res) => {
  //   const { imgUrl, isElectron } = req.query as any;
  //   const imgs = await getImgsByImgUrl(imgUrl, isElectron);
  //   res.json({ code: 0, data: imgs });
  // });

  // app.get('/getAudios', async (req, res) => {
  //   const { audioUrl, isElectron } = req.query as any;
  //   const audios = await getAudiosByAudioUrl(audioUrl, isElectron);
  //   res.json({ code: 0, data: audios });
  // });

  // app.get('/getVideos', async (req, res) => {
  //   const { videoUrl, isElectron } = req.query as any;
  //   const videos = await getVideosByVideoUrl(videoUrl, isElectron);
  //   res.json({ code: 0, data: videos });
  // });

  // app.get('/getFolder', async (req, res) => {
  //   const folderPath = req.query.folderPath as string;
  //   exec(`start "" "${folderPath}"`);
  //   res.json({ code: 0 });
  // });

  // app.get('/openFilePath', async (req, res) => {
  //   const filePath = req.query.filePath as string;
  //   const folderPath = dirname(filePath);
  //   exec(`start "" "${folderPath}"`);
  //   res.json({ code: 0 });
  // });
}
