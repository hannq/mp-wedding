// @ts-check

const path = require('path');
const execa = require('execa');
const chalk = require('chalk');
const ci = require('miniprogram-ci');
const fse = require('fs-extra');
const { getSubPackageList } = require('./utils');

;(async function() {
  await execa(`npx pnpm run build`, { shell: true, cwd: path.join(__dirname, '..') });
  const funcInfos = await getSubPackageList(path.join(__dirname, '../functions'));
  // ignores 并不生效，手动临时删除
  await Promise.all(funcInfos.map(async info => {
    await Promise.all(
      ['node_modules', 'src', 'tsconfig.json', 'tsconfig.tsbuildinfo', 'pnpm-lock.yaml']
        .map(async filename => {
          await fse.remove(path.join(info.dirname, filename))
        })
    )
  }));
  const project = new ci.Project({
    appid: require('../../project.config.json').appid,
    type: 'miniProgram',
    projectPath: path.join(__dirname, '../functions'),
    privateKeyPath: path.join(__dirname, '../../private.key'),
    ignores: ['node_modules/**/*'],
  });
  await Promise.all(funcInfos.map(async info => {
    const result = await ci.cloud.uploadFunction({
      project,
      env: 'merry-4g3cmdd8cc1a9dba',
      name: info.name,
      path: info.dirname,
      remoteNpmInstall: true, // 是否云端安装依赖
    })
    console.warn(result);
  }));

  await execa(`git reset --hard`, { shell: true })

  console.log(chalk.green('🎉 CI Run Successfully !'));
  process.exit(0);
})();
