import { useDidShow, hideHomeButton, useRouter } from '@tarojs/taro';
import { useMemo } from 'react';
import { queryString } from '@/utils';

/**
 * 隐藏返回首页按钮
 */
export function useHideHomeBtn() {
  useDidShow(hideHomeButton)
}

/**
 * 获取场景值
 */
export function useScene() {
  const { params: { scene = '' } } = useRouter();
  return useMemo(() => queryString.parse(decodeURIComponent(scene)), [scene]);
}
