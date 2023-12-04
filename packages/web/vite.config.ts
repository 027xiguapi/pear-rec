import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve, join } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
const buildOptionsProject = {
  rollupOptions: {
    input: {
      index: resolve(__dirname, 'src/pages/index.html'),
      shotScreen: resolve(__dirname, 'src/pages/shotScreen.html'),
      recorderScreen: resolve(__dirname, 'src/pages/recorderScreen.html'),
      recorderVideo: resolve(__dirname, 'src/pages/recorderVideo.html'),
      recorderAudio: resolve(__dirname, 'src/pages/recorderAudio.html'),
      viewImage: resolve(__dirname, 'src/pages/viewImage.html'),
      pinImage: resolve(__dirname, 'src/pages/pinImage.html'),
      viewVideo: resolve(__dirname, 'src/pages/viewVideo.html'),
      setting: resolve(__dirname, 'src/pages/setting.html'),
      clipScreen: resolve(__dirname, 'src/pages/clipScreen.html'),
      editImage: resolve(__dirname, 'src/pages/editImage.html'),
      viewAudio: resolve(__dirname, 'src/pages/viewAudio.html'),
      records: resolve(__dirname, 'src/pages/records.html'),
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
    },
    plugins: [react(), visualizer() as any],
    // build: mode == "lib" ? buildOptionsLib : buildOptionsProject,
    build: buildOptionsProject,
  });
};
