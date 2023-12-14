import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { NestMiddleware, Injectable } from '@nestjs/common';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class ProxyBaidu implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    createProxyMiddleware('/apiBaidu', {
      target: 'https://graph.baidu.com/', // 替换为你要代理的接口地址
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/apiBaidu': '', // 如果接口地址有前缀，需替换为空字符串
      },
    })(req, res, next);
  }
}

@Injectable()
export class ProxyGoogle implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    createProxyMiddleware('/apiGoogle', {
      target: 'https://lens.google.com',
      changeOrigin: true,
      secure: false,
      onProxyReq: fixRequestBody,
      agent: new HttpsProxyAgent('http://127.0.0.1:7890'),
      pathRewrite: {
        '^/apiGoogle': '', // 如果接口地址有前缀，需替换为空字符串
      },
    })(req, res, next);
  }
}
