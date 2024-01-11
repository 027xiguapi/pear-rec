/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
// fork-ts-checker-webpack-plugin需要单独安装
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main',
  target: 'node',
  // 置为空即可忽略webpack-node-externals插件
  externals: {},
  module: {
    noParse: /sql.js/,
    rules: [
      {
        test: /\.ts?$/,
        use: {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
        exclude: /node_modules/,
      },
    ],
  },
  // 打包后的文件名称以及位置
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    symlinks: true,
  },
  plugins: [
    // 需要进行忽略的插件
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          '@fastify/static',
          '@nestjs/microservices',
          '@nestjs/microservices/microservices-module',
          '@nestjs/websockets/socket-module',
          'cache-manager',
          'class-validator',
          'class-transformer',
        ];
        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource, {
            paths: [process.cwd()],
          });
        } catch (err) {
          return true;
        }
        return false;
      },
    }),
    new ForkTsCheckerWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: './node_modules/sql.js/dist/sql-wasm.wasm',
        },
      ],
    }),
  ],
};
