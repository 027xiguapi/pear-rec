import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

export function initApp() {
  const app: Application = express();

  app.use(cors());

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });

  app.use(
    '/apiGoogle',
    createProxyMiddleware({
      target: 'https://lens.google.com',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: fixRequestBody,
      agent: new HttpsProxyAgent('http://127.0.0.1:7890'),
      pathRewrite: {
        '^/apiGoogle': '',
      },
    }),
  );

  app.use(
    '/apiBaidu',
    createProxyMiddleware({
      target: 'https://graph.baidu.com/',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      pathRewrite: {
        '^/apiBaidu': '',
      },
    }),
  );

  app.listen(9190, () => {
    console.log('Express app listening on port 9190!');
  });
}
