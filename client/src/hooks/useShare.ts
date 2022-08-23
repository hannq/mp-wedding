import { useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import { PackageAPage } from '@/constants';
import shareCardImg from '@/assets/images/share-card.png';

/**
 * 分享逻辑
 */
export function useShare() {
  // 只有从角色管理页面分享的页面携带角色信息
  useShareAppMessage(({ target }) => ({
    path: `${PackageAPage.INVITATION}?roleCode=${(target as any)?.dataset?.code || ''}`,
    title: '请柬',
    imageUrl: shareCardImg
  }));

  useShareTimeline(() => ({
    title: '请柬',
    path: PackageAPage.INVITATION,
  }))
}

export default useShare;
