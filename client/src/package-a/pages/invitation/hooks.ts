import { useDidShow, hideHomeButton, useRouter } from '@tarojs/taro';
import { useMemo, useEffect } from 'react';
import { useRequest } from 'ahooks';
import { useScene, useCloudInit } from '@/hooks';
import { roleCode as roleCodeApi } from '@/apis';

/**
 * 隐藏返回首页按钮
 */
export function useHideHomeBtn() {
  useDidShow(hideHomeButton)
}

/**
 * 获取角色邀请码
 */
export function useGetRoleCodeInfo() {
  const { params: { roleCode: roleCodeFromParams = '' } } = useRouter();
  const { roleCode: roleCodeFromScene } = useScene();
  const code = useMemo(() => roleCodeFromParams || roleCodeFromScene, [roleCodeFromParams, roleCodeFromScene]);
  const initTaskRef = useCloudInit();
  const { run, loading, data } = useRequest(roleCodeApi.getList, { manual: true });

  useEffect(() => {
    initTaskRef.current.then(() => run({ code, inUse: false }));
    // eslint-disable-next-line
  }, [code]);

  return useMemo(() => ({ loading, data: data?.data?.[0] || null }), [loading, data])
}
