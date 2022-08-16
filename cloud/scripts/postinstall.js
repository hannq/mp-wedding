// @ts-check

const execa = require('execa');
const path = require('path');
const { getSubPackageList } = require('./utils');

;(async function() {
  const pkgInfos = await getSubPackageList(path.join(__dirname, '../functions'))
  await Promise.all(pkgInfos.map(async (info) => {
    await execa(`npx pnpm install`, { shell: true, cwd: info.dirname })
  }));
})();
