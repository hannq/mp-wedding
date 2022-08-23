import { useDidShow, hideHomeButton, useRouter } from '@tarojs/taro';
import { useMemo, useEffect } from 'react';
import { useRequest } from 'ahooks';
import { useScene, useCloudInit, useAuth } from '@/hooks';
import { roleCode as roleCodeApi } from '@/apis';

/**
 * 隐藏返回首页按钮
 */
export function useHideHomeBtn() {
  useDidShow(hideHomeButton)
}

/**
 * 获取请柬信息
 */
export function useInvitationInfo() {
  const { loading: authLoading, auth } = useAuth();
  const { params: { roleCode: roleCodeFromParams = '' } } = useRouter();
  const { roleCode: roleCodeFromScene } = useScene();
  const code = useMemo(() => roleCodeFromParams || roleCodeFromScene, [roleCodeFromParams, roleCodeFromScene]);
  const initTaskRef = useCloudInit();
  const { run, loading, data } = useRequest(roleCodeApi.getList, { manual: true });

  useEffect(() => {
    if (code) {
      initTaskRef.current.then(() => run({ code, inUse: false }));
    }
    // eslint-disable-next-line
  }, [code]);

  return useMemo(() => ({ loading: [loading, authLoading].includes(true), roleCodeInfo: data?.data?.[0] || null, auth }), [loading, authLoading, data, auth])
}
