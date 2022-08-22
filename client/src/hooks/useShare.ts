import { useShareAppMessage } from '@tarojs/taro';

/**
 * 分享逻辑
 */
export function useShare() {
  // 只有从角色管理页面分享的页面携带角色信息
  useShareAppMessage(({ target }) => {
    return {
      // @ts-ignore
      path: `${PackageAPage.INVITATION}?roleCode=${target?.dataset?.code || ''}`,
      title: '请柬'
      // TODO: 缺少图片
      // imageUrl: ''
    }
  });
}

export default useShare;
