import { useRouter } from '@tarojs/taro';
import { useMemo } from 'react';
import { queryString } from '@/utils';

/**
 * 获取场景值
 */
export function useScene() {
  const { params: { scene = '' } } = useRouter();
  return useMemo(() => queryString.parse(decodeURIComponent(scene)), [scene]);
}
