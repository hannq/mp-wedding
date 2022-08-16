// @ts-check

const execa = require('execa');
const path = require('path');

;(async function() {
  await Promise.all([
    execa(`npx pnpm run weapp:ci`, { shell: true, cwd: path.join(__dirname, '../client') }),
    execa(`npx pnpm run ci`, { shell: true, cwd: path.join(__dirname, '../cloud') })
  ])
})();
