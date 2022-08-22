import { useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import { PackageAPage } from '@/constants';

/**
 * 分享逻辑
 */
export function useShare() {
  // 只有从角色管理页面分享的页面携带角色信息
  useShareAppMessage(({ target }) => ({
    path: `${PackageAPage.INVITATION}?roleCode=${(target as any)?.dataset?.code || ''}`,
    title: '请柬'
    // TODO: 缺少图片
    // imageUrl: ''
  }));

  useShareTimeline(() => ({
    title: '请柬',
    path: PackageAPage.INVITATION,
  }))
}

export default useShare;
