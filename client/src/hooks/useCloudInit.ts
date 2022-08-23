import { useRef } from 'react';
import { useMount } from 'ahooks';
import { cloud } from '@tarojs/taro';
import { createControlReversalPromise } from '@/utils';

export const initCloudReady = createControlReversalPromise();

/**
 * 初始化云开发
 */
export function useCloudInit() {
  useMount(() => {
    if (!initCloudReady.isFullfilled) {
      cloud.init();
      initCloudReady?.resolve?.();
    }
  });

  return useRef(initCloudReady)
}

export default useCloudInit;
