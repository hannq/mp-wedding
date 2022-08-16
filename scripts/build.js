// @ts-check

const execa = require('execa');
const path = require('path');

;(async function() {
  await execa(`npx pnpm run build:weapp:upload`, { shell: true, cwd: path.join(__dirname, '../client'), env: { CI: 'true' } });
})();
