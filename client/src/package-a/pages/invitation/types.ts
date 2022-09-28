import type { InnerAudioContext } from '@tarojs/taro'

export interface SceneCommonProps {
  /** 场景完成回调 */
  onComplete?(): void;
  /** 是否已经完成游戏，首次必须要完成 */
  alreadyCompleteGame?: boolean;
  /** bgm 是否暂停状态 */
  bgmPause: boolean;
  /** bgm 是否加载中 */
  bgmLoading: boolean;
  /** bgm 上下文对象 */
  bgmContextRef: React.MutableRefObject<InnerAudioContext | null>;
}
