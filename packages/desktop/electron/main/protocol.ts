import { net, protocol } from 'electron';

export function registerSchemesAsPrivileged() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'pearrec',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        stream: true,
      },
    },
  ]);
}

export function protocolHandle() {
  protocol.handle('pearrec', (req) => {
    const { host, pathname } = new URL(req.url);
    console.log(host, pathname, `file://${host}:\\${pathname}`);
    try {
      return net.fetch(`file://${host}:\\${pathname}`);
      // return net.fetch(`file://C://Users/Administrator/Desktop/pear-rec_1709102672477.mp4`);
    } catch (error) {
      console.error('protocolHandle', error);
    }
  });
}
