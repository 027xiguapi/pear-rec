// logger.ts
import { app } from 'electron';
import log from 'electron-log';
import path from 'node:path';
import { LOG_PATH } from './constant';

// 关闭控制台打印
log.transports.console.level = false;
log.transports.file.level = 'debug';
log.transports.file.maxSize = 10024300; // 文件最大不超过 10M
// 输出格式
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
let date = new Date();
let dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
// 文件位置及命名方式
// 默认位置为：C:\Users\[user]\AppData\Roaming\[appname]\electron_log\
// 文件名为：年-月-日.log
// 自定义文件保存位置为安装目录下 \log\年-月-日.log
log.transports.file.resolvePathFn = () => path.join(LOG_PATH, dateStr + '.log');

// 有六个日志级别error, warn, info, verbose, debug, silly。默认是silly
export default {
  info(param: any) {
    log.info(param);
  },
  warn(param: any) {
    log.warn(param);
  },
  error(param: any) {
    log.error(param);
  },
  debug(param: any) {
    log.debug(param);
  },
  verbose(param: any) {
    log.verbose(param);
  },
  silly(param: any) {
    log.silly(param);
  },
};

app.on('ready', async () => {
  // 渲染进程崩溃
  // app.on('renderer-process-crashed', (event, webContents, killed) => {
  //   log.error(
  //     `APP-ERROR:renderer-process-crashed; event: ${JSON.stringify(
  //       event,
  //     )}; webContents:${JSON.stringify(webContents)}; killed:${JSON.stringify(killed)}`,
  //   );
  // });

  // // GPU进程崩溃
  // app.on('gpu-process-crashed', (event, killed) => {
  //   log.error(
  //     `APP-ERROR:gpu-process-crashed; event: ${JSON.stringify(event)}; killed: ${JSON.stringify(
  //       killed,
  //     )}`,
  //   );
  // });

  // 渲染进程结束
  app.on('render-process-gone', async (event, webContents, details) => {
    log.error(
      `APP-ERROR:render-process-gone; event: ${JSON.stringify(event)}; webContents:${JSON.stringify(
        webContents,
      )}; details:${JSON.stringify(details)}`,
    );
  });

  // 子进程结束
  app.on('child-process-gone', async (event, details) => {
    log.error(
      `APP-ERROR:child-process-gone; event: ${JSON.stringify(event)}; details:${JSON.stringify(
        details,
      )}`,
    );
  });
});
