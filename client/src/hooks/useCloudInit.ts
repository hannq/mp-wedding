import { useRef } from 'react';
import { useMount } from 'ahooks';
import { createControlReversalPromise, cloudInit } from '@/utils';

export const initCloudReady = createControlReversalPromise();

/**
 * 初始化云开发
 */
export function useCloudInit() {
  useMount(() => {
    if (!initCloudReady.isFullfilled) {
      cloudInit();
      initCloudReady?.resolve?.();
    }
  });

  return useRef(initCloudReady)
}

export default useCloudInit;
