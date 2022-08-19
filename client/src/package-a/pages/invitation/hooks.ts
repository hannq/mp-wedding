import { useDidShow, hideHomeButton, useRouter } from '@tarojs/taro';
import { useMemo } from 'react';
import { useScene } from '@/hooks';

/**
 * 隐藏返回首页按钮
 */
export function useHideHomeBtn() {
  useDidShow(hideHomeButton)
}

/**
 * 获取角色邀请码
 */
export function useRoleCode() {
  const { params: { roleCode = '' } } = useRouter();
  const { roleCode: roleCodeFromScene } = useScene()
  return useMemo(() => roleCode || roleCodeFromScene, [roleCode, roleCodeFromScene]);
}
