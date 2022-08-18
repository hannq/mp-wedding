import { useDidShow, hideHomeButton } from '@tarojs/taro';

/**
 * 隐藏返回首页按钮
 */
export function useHideHomeBtn() {
  useDidShow(hideHomeButton)
}
