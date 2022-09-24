import { type FC, useState, useEffect, useRef, useCallback } from 'react';
import { View, Image } from '@tarojs/components';
import { Current } from '@tarojs/taro';
import type { SceneCommonProps } from '../types';
import { getSuitableImg } from '../utils';
import { SizeType, SAFE_ANIMATION_GAP_TIME } from '../constants';
import './index.less';

const defaultTask = Promise.resolve();

const Scene5: FC<SceneCommonProps> = (props) => {
  const [presettingLoading, setPresettingLoading] = useState(true);
  const [idx, setIdx] = useState(-1);
  const imgReadyCountRef = useRef(0);
  const loadingRef = useRef(true);
  const prevTaskRef = useRef(defaultTask);
  const addImgReadyCount = useCallback(() => {
    imgReadyCountRef.current++;
    if (imgReadyCountRef.current === 1) {
      setPresettingLoading(false)
    }
  }, []);

  const setProcessCount = useCallback((param: number | ((prevState: number) => number)) => {
    if (!presettingLoading && !loadingRef.current) {
      setIdx(param);
    }
  }, [presettingLoading]);

  useEffect(() => {
    prevTaskRef.current = prevTaskRef.current.then(async () => {
      loadingRef.current = true;

      switch (idx) {
        case -1:
          await new Promise<void>(resolve => {
            Current.page?.animate?.(
              '#scene5-presetting',
              [
                { opacity: 0 },
                { opacity: 1 },
              ],
              400,
              resolve
            )
          })
          break;
        case 0:
          await new Promise<void>(resolve => {
            Current.page?.animate?.(
              '#scene5-bg',
              [
                { opacity: 0 },
                { opacity: 1 },
              ],
              400,
              resolve
            )
          })
          break;
        default:
          break;
      }

      await new Promise(r => setTimeout(r, SAFE_ANIMATION_GAP_TIME));
      loadingRef.current = false;
    })
  }, [idx]);

  return (
    <View className='scene5-wrapper'>
      {idx === -1 && (
        <View
          id='scene5-presetting'
          className='scene5-presetting'
          onClick={() => setProcessCount(prev => prev + 1)}
        >
          <View />
          <View className='presetting-text-wrapper'>
            {
              !presettingLoading ?
              <>
                <View className='presetting-text'>第五幕</View>
                <View className='presetting-text'>2021 年 5 月 7 日</View>
              </>
              :
              <View className='presetting-text'>加载中 ...</View>
            }
          </View>
          <View className='presetting-text-wrapper'>
            {!presettingLoading && <View className='presetting-text'>点击屏幕任意区域以继续 ...</View>}
          </View>
        </View>
      )}
      <Image
        onLoad={addImgReadyCount}
        style={{ display: idx === 0 ? void (0) : 'none' }}
        className='scene5-bg'
        id='scene5-bg'
        mode='scaleToFill'
        src={getSuitableImg({
          [SizeType.MEDIUM]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_5_bg_medium.png?sign=023ef338422130cd3452b24018032be9&t=1663936943',
          [SizeType.LARGE]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_5_bg_large.png?sign=35123342d2460376e74a198bbe26befb&t=1663936926',
        })}
        onClick={() => !loadingRef.current && props.onComplete?.()}
      />
    </View>
  )
}

export default Scene5
