import react from '@vitejs/plugin-react-swc';
import { join, resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
const buildOptionsProject = {
  rollupOptions: {
    input: {
      index: resolve(__dirname, 'src/pages/index.html'),
      shotScreen: resolve(__dirname, 'src/pages/shotScreen.html'),
      recorderScreen: resolve(__dirname, 'src/pages/recorderScreen.html'),
      recorderFullScreen: resolve(__dirname, 'src/pages/recorderFullScreen.html'),
      recorderVideo: resolve(__dirname, 'src/pages/recorderVideo.html'),
      recorderAudio: resolve(__dirname, 'src/pages/recorderAudio.html'),
      viewImage: resolve(__dirname, 'src/pages/viewImage.html'),
      pinImage: resolve(__dirname, 'src/pages/pinImage.html'),
      viewVideo: resolve(__dirname, 'src/pages/viewVideo.html'),
      videoConverter: resolve(__dirname, 'src/pages/videoConverter.html'),
      setting: resolve(__dirname, 'src/pages/setting.html'),
      clipScreen: resolve(__dirname, 'src/pages/clipScreen.html'),
      editImage: resolve(__dirname, 'src/pages/editImage.html'),
      viewAudio: resolve(__dirname, 'src/pages/viewAudio.html'),
      records: resolve(__dirname, 'src/pages/records.html'),
      editGif: resolve(__dirname, 'src/pages/editGif.html'),
      spliceImage: resolve(__dirname, 'src/pages/spliceImage.html'),
      canvas: resolve(__dirname, 'src/pages/canvas.html'),
    },
  },
  outDir: resolve(__dirname, 'dist'),
};
const buildOptionsLib: any = {
  minify: false,
  rollupOptions: {
    external: ['react', 'react-dom'],
    output: [
      {
        format: 'es',
        entryFileNames: '[name].mjs',
        preserveModules: true,
        exports: 'named',
        dir: resolve(__dirname, `es`),
        preserveModulesRoot: 'src',
      },
      // {
      // 	format: "cjs",
      // 	entryFileNames: "[name].js",
      // 	//让打包目录和我们目录对应
      // 	preserveModules: true,
      // 	exports: "named",
      // 	//配置打包根目录
      // 	dir: resolve(__dirname, `lib`),
      // 	preserveModulesRoot: "src",
      // },
    ],
  },
  lib: {
    entry: resolve(__dirname, 'src/index.ts'),
    // formats: ["es", "cjs"],
  },
};

export default ({ mode }) => {
  return defineConfig({
    root: resolve(__dirname, 'src/pages'),
    base: './',
    publicDir: resolve(__dirname, 'public'),
    resolve: {
      alias: {
        '@': join(__dirname, 'src'),
      },
    },
    server: {
      // open: true,
      port: 9191,
      host: '0.0.0.0',
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
    plugins: [
      react(),
      visualizer() as any,
      VitePWA({
        injectRegister: 'auto',
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: 'pear-rec',
          short_name: 'pear-rec',
          description:
            'pear-rec is a software with screenshot, screen recording, audio recording and video recording.',
          theme_color: '#fff',
          start_url: './home.html',
          display: 'standalone',
          background_color: '#fff',
          icons: [
            {
              src: '/imgs/icons/png/512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/imgs/icons/png/512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
          ],
          screenshots: [
            {
              src: '/imgs/screenshot1.jpg',
              type: 'image/jpg',
              sizes: '944x656',
              form_factor: 'narrow',
            },
          ],
        },
        workbox: {
          ignoreURLParametersMatching: [/.*/],
        },
      }),
    ],
    optimizeDeps: {
      exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
    },
    // build: mode == "lib" ? buildOptionsLib : buildOptionsProject,
    build: buildOptionsProject,
  });
};
