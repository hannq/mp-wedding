import { useState } from 'react';
import { useDidShow, } from '@tarojs/taro';
import { user } from '@/apis';
import type { User } from '@/types';
import { RoleType } from '@/constants';
import useCloudInit from './useCloudInit';

/**
 * 获取当前用户信息
 */
export function useAuth() {
  const initReadyTaskRef = useCloudInit();
  const [auth, setAuth] = useState<User | null>(null);
  useDidShow(async () => {
    try {
      await initReadyTaskRef.current;
      const { errCode, errMsg, data } = await user.get();
      if (errCode) throw new Error(errMsg);
      data!.role = data?.role || { name: '来宾', type: RoleType.GUEST }
      setAuth(data!);
    } catch (err) {
      console.error('err -->', err);
      // navigateTo({ url: `/${PackageAPage.INVITATION}` });
    }
  });

  return auth;
}

export default useAuth;
