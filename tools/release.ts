/* eslint-disable  import/no-extraneous-dependencies,@typescript-eslint/camelcase, no-console */
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import util from 'util';
import chalk from 'chalk';
import semverInc from 'semver/functions/inc';
import { ReleaseType } from 'semver';

import pkg from '../package.json';

const exec = util.promisify(child_process.exec);

const run = async (command: string) => {
  console.log(chalk.green(command));
  await exec(command);
};

const currentVersion = pkg.version;

const getNextVersions = (): { [key in ReleaseType]: string | null } => ({
  major: semverInc(currentVersion, 'major'),
  minor: semverInc(currentVersion, 'minor'),
  patch: semverInc(currentVersion, 'patch'),
  premajor: semverInc(currentVersion, 'premajor'),
  preminor: semverInc(currentVersion, 'preminor'),
  prepatch: semverInc(currentVersion, 'prepatch'),
  prerelease: semverInc(currentVersion, 'prerelease'),
});

const timeLog = (logInfo: string, type: 'start' | 'end') => {
  let info = '';
  if (type === 'start') {
    info = `=> 开始任务：${logInfo}`;
  } else {
    info = `✨ 结束任务：${logInfo}`;
  }
  const nowDate = new Date();
  console.log(
    `[${nowDate.toLocaleString()}.${nowDate.getMilliseconds().toString().padStart(3, '0')}] ${info}
    `,
  );
};

/**
 * 询问获取下一次版本号
 */
async function prompt(): Promise<string> {
  const nextVersions = getNextVersions();
  const { nextVersion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'nextVersion',
      message: `请选择将要发布的版本 (当前版本 ${currentVersion})`,
      choices: (Object.keys(nextVersions) as Array<ReleaseType>).map((level) => ({
        name: `${level} => ${nextVersions[level]}`,
        value: nextVersions[level],
      })),
    },
  ]);
  return nextVersion;
}

/**
 * 更新版本号
 * @param nextVersion 新版本号
 */
async function updateVersion(nextVersion: string) {
  pkg.version = nextVersion;
  timeLog('修改package.json版本号', 'start');
  await fs.writeFileSync(path.resolve(__dirname, './../package.json'), JSON.stringify(pkg));
  await run('npx prettier package.json --write');
  timeLog('修改package.json版本号', 'end');
}

/**
 * 生成CHANGELOG
 */
async function generateChangelog() {
  timeLog('生成CHANGELOG.md', 'start');
  await run(' npx conventional-changelog -p angular -i CHANGELOG.md -s -r 0');
  timeLog('生成CHANGELOG.md', 'end');
}

/**
 * 将代码提交至git
 */
async function push(nextVersion: string) {
  timeLog('推送代码至git仓库', 'start');
  await run('git add package.json CHANGELOG.md');
  await run(`git commit -m "v${nextVersion}" -n`);
  await run('git push');
  timeLog('推送代码至git仓库', 'end');
}

/**
 * 组件库打包
 */
async function build() {
  timeLog('组件库打包', 'start');
  await run('npm run build');
  timeLog('组件库打包', 'end');
}

/**
 * 发布至npm
 */
async function publish() {
  timeLog('发布组件库', 'start');
  await run('npm publish');
  timeLog('发布组件库', 'end');
}

/**
 * 打tag提交至git
 */
async function tag(nextVersion: string) {
  timeLog('打tag并推送至git', 'start');
  await run(`git tag v${nextVersion}`);
  await run(`git push origin tag v${nextVersion}`);
  timeLog('打tag并推送至git', 'end');
}

async function main() {
  try {
    const nextVersion = await prompt();
    const startTime = Date.now();
    // =================== 更新版本号 ===================
    await updateVersion(nextVersion);
    // =================== 更新changelog ===================
    await generateChangelog();
    // =================== 代码推送git仓库 ===================
    await push(nextVersion);
    // =================== 组件库打包 ===================
    await build();
    // =================== 发布至npm ===================
    await publish();
    // =================== 打tag并推送至git ===================
    await tag(nextVersion);
    console.log(`✨ 发布流程结束 共耗时${((Date.now() - startTime) / 1000).toFixed(3)}s`);
  } catch (error) {
    console.log('💣 发布失败，失败原因：', error);
  }
}

main();
