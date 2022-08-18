import { useRef } from 'react';
import { useMount } from 'ahooks';
import { cloud } from '@tarojs/taro';
import { createControlReversalPromise } from '@/utils';

const initReady = createControlReversalPromise();

/**
 * 初始化云开发
 */
export function useCloudInit() {
  useMount(() => {
    if (!initReady.isFullfilled) {
      cloud.init();
      initReady?.resolve?.();
    }
  });

  return useRef(initReady)
}

export default useCloudInit;
