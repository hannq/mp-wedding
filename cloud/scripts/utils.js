// @ts-check

const path = require('path');
const fg = require('fast-glob');

/**
 * 获取子包列表
 * @param { string } rootDir 根目录
 */
async function getSubPackageList(rootDir) {
  const pkgJsonLocationList = await fg(`**/package.json`, { ignore: ['**/node_modules/**/*'], cwd: rootDir, absolute: true });
  return pkgJsonLocationList.map(location => ({
    location,
    name: path.basename(path.join(location, '..')),
    dirname: path.dirname(location)
  }))
}

module.exports.getSubPackageList = getSubPackageList;
