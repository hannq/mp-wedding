import { useShareAppMessage } from '@tarojs/taro';

/**
 * 分享逻辑
 */
export function useShare() {
  useShareAppMessage(() => {
    return {
      // @ts-ignore
      path: PackageAPage.INVITATION,
      title: '请柬'
      // TODO: 缺少图片
      // imageUrl: ''
    }
  });
}

export default useShare;
