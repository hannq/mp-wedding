// @ts-check

const path = require('path');
const execa = require('execa');
const chalk = require('chalk');
const ci = require('miniprogram-ci');
const fse = require('fs-extra');
const filesize = require('filesize');
const { getSubPackageList } = require('./utils');

;(async function() {
  const size = filesize.partial({ base: 2, standard: 'jedec' });
  const funcInfos = await getSubPackageList(path.join(__dirname, '../functions'));
  const totalCount = funcInfos.length;
  let currentCount = 0;
  const project = new ci.Project({
    appid: require('../../project.config.json').appid,
    type: 'miniProgram',
    projectPath: path.join(__dirname, '../functions'),
    privateKeyPath: path.join(__dirname, '../../private.key'),
    ignores: ['node_modules/**/*'],
  });
  await Promise.all(funcInfos.map(async info => {
    // ignores 并不生效，手动临时删除
    await Promise.all(
      ['src', 'tsconfig.json', 'tsconfig.tsbuildinfo', 'pnpm-lock.yaml']
        .map(async filename => {
          await fse.remove(path.join(info.dirname, filename))
        })
    );
    const result = await ci.cloud.uploadFunction({
      project,
      env: 'merry-4g3cmdd8cc1a9dba',
      name: info.name,
      path: info.dirname,
      remoteNpmInstall: true, // 是否云端安装依赖
    })
    console.log(
      chalk.cyan(`[${++currentCount}/${totalCount}]`),
      `${chalk.green(`${result.filesCount}`)} files ${chalk.green(size(result.packSize))}`,
      `Cloud Functions [${chalk.cyan(info.name)}] Upload Successfully !`
    )
  }));

  await execa(`git reset --hard`, { shell: true })
  console.log(chalk.green('🎉 Cloud Functions Upload Successfully !'));
  process.exit(0);
})();
