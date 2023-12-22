import { type UtilityProcess, utilityProcess } from 'electron';
import { url, serverPath } from './contract';
import logger from './logger';

let serverProcess: null | UtilityProcess = null;

export function initServerProcess() {
  serverProcess =
    url ||
    utilityProcess.fork(serverPath, [], {
      stdio: 'pipe',
    });

  serverProcess.on?.('spawn', () => {
    serverProcess.stdout?.on('data', (data) => {
      console.log(`serverProcess output: ${data}`);
      logger.info(`serverProcess output: ${data}`);
    });
    serverProcess.stderr?.on('data', (data) => {
      console.error(`serverProcess err: ${data}`);
      logger.error(`serverProcess output: ${data}`);
    });
  });
}

export function quitServerProcess() {
  url || serverProcess?.kill();
}
