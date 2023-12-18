import { type UtilityProcess, utilityProcess } from 'electron';
import { url, serverPath } from './contract';

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
    });
    serverProcess.stderr?.on('data', (data) => {
      console.error(`serverProcess err: ${data}`);
    });
  });
}

export function quitServerProcess() {
  serverProcess?.kill();
}
