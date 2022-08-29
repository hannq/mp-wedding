// @ts-check

const execa = require('execa');
const path = require('path');
const chalk = require('chalk');

;(async function() {
  await execa(`npx pnpm run weapp:ci`, { shell: true, cwd: path.join(__dirname, '../client'), stderr: 'inherit', stdout: 'inherit' }),
  await execa(`npx pnpm run ci`, { shell: true, cwd: path.join(__dirname, '../cloud'), stderr: 'inherit', stdout: 'inherit' })
  console.log(chalk.green('🎉 CI Run Successfully !'));
})();
