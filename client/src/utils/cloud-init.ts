import { cloud, getAccountInfoSync } from '@tarojs/taro';

const RELEASE_ENV = 'marry-prod-0gyfw3yc84f765a6';
const DEV_ENV = 'merry-4g3cmdd8cc1a9dba';

export function cloudInit () {
  const { miniProgram: { envVersion } } = getAccountInfoSync();
  cloud.init({
    env: envVersion === 'release' ? RELEASE_ENV : DEV_ENV
  })
}

export default cloudInit;
