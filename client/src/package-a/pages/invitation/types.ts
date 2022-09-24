export interface SceneCommonProps {
  /** 场景完成回调 */
  onComplete?(): void;
  /** 是否已经完成游戏，首次必须要完成 */
  alreadyCompleteGame?: boolean;
}
