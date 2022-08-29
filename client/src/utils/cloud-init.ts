import { cloud, getAccountInfoSync } from '@tarojs/taro';

const { CLOUD_ENV_DEV, CLOUD_ENV_PROD } = process.env

export function cloudInit () {
  const { miniProgram: { envVersion } } = getAccountInfoSync();
  cloud.init({
    env: envVersion === 'release' ? CLOUD_ENV_PROD : CLOUD_ENV_DEV
  })
}

export default cloudInit;
