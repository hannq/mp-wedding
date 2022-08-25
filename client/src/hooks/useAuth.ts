import { useState, useEffect, useMemo } from 'react';
import { reLaunch, cloud, type DB, Current } from '@tarojs/taro';
import { user } from '@/apis';
import type { User } from '@/types';
import { PackageAPage, RoleType } from '@/constants';
import { eventBus } from '@/utils';
import useCloudInit, { initCloudReady } from './useCloudInit';

const AUTH_CHANGE_EVENT = 'AUTH_CHANGE_EVENT';
let authInfo: User | null = null;
let watcher: DB.Document.IWatcher | null = null;

function getSavedAuthInfo() {
  return authInfo;
}

async function saveAuthInfo(newAuthInfo: User | null) {
  authInfo = newAuthInfo;
  if (!watcher && authInfo) {
    await initCloudReady;
    watcher = cloud.database()
      .collection('user')
      .where({ _id: authInfo.id })
      .watch({
        onChange(snapshot: any) {
          if (snapshot.type !== 'init') {
            eventBus.emit(AUTH_CHANGE_EVENT);
          }
        },
        onError(err) {
          console.error('the watch closed because of error', err);
        }
      })
  }
}

function addAuthChangeListener(handle: () => void) {
  eventBus.on(AUTH_CHANGE_EVENT, handle);
}

async function removeAuthChangeListener(handle: () => void) {
  eventBus.off(AUTH_CHANGE_EVENT, handle);
  if (!eventBus.all.get(AUTH_CHANGE_EVENT)?.length) {
    await watcher?.close();
    watcher = null;
  }
}

/**
 * 获取当前用户信息
 */
async function getAuthInfo() {
  const res = await user.getList({ id: '$current' });
  const currentUser = res?.list?.[0];
  return currentUser;
}

/**
 * 获取当前用户信息
 */
export function useAuth() {
  useCloudInit();
  const [loading, setLoading] = useState(() => !getSavedAuthInfo());
  const [auth, setAuth] = useState<User | null>(authInfo);

  useEffect(() => {
    async function authInfoChangeEventHandle() {
      const newAuthInfo = await getAuthInfo();
      await saveAuthInfo(newAuthInfo);
      setAuth(newAuthInfo);
    };

    ;(async function () {
      const savedAuthInfo = getSavedAuthInfo();
      if (savedAuthInfo) {
        setAuth(savedAuthInfo);
      } else {
        const remoteAuthInfo = await getAuthInfo();
        if (remoteAuthInfo) {
          await saveAuthInfo(remoteAuthInfo);
          setAuth(remoteAuthInfo);
        } else {
          // 首次使用，直接重定向回请柬页
          if (Current.router?.path !== PackageAPage.INVITATION) {
            await reLaunch({ url: PackageAPage.INVITATION });
          }
        }
      }
      setLoading(false);
      addAuthChangeListener(authInfoChangeEventHandle);
    })();

    return () => {
      removeAuthChangeListener(authInfoChangeEventHandle);
    }
  }, []);

  const isAdmin = useMemo(() => auth?.role?.type === RoleType.ADMIN, [auth]);
  return { auth, isAdmin, loading };
}

export default useAuth;
