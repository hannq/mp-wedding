import { cloud, getAccountInfoSync } from '@tarojs/taro';

declare const CLOUD_ENV_DEV: string;
declare const CLOUD_ENV_PROD: string;

export function cloudInit () {
  const { miniProgram: { envVersion } } = getAccountInfoSync();
  cloud.init({
    env: envVersion === 'release' ? CLOUD_ENV_PROD : CLOUD_ENV_DEV
  })
}

export default cloudInit;
