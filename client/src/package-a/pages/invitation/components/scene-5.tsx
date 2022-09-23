import { type FC, useState, useEffect, useRef, useCallback } from 'react';
import { View, Image } from '@tarojs/components';
import { Current } from '@tarojs/taro';
import type { SceneCommonProps } from '../types';
import { getSuitableImg } from '../utils';
import { SizeType } from '../constants';
import './index.less';

const Scene5: FC<SceneCommonProps> = (props) => {
  const [idx, setIdx] = useState(-1);
  const imgReadyCountRef = useRef(0);
  const addImgReadyCount = useCallback(() => {
    imgReadyCountRef.current++;
  }, []);

  const setProcessCount = useCallback((param: number | ((prevState: number) => number)) => {
    if (imgReadyCountRef.current === 1) {
      setIdx(param);
    }
  }, []);

  useEffect(() => {
    switch (idx) {
      case 0:
        Current.page?.animate?.(
          '#scene5-bg',
          [
            { opacity: 0 },
            { opacity: 1 },
          ],
          400,
          () => {}
        )
        break;
        default:
        break;
    }
  }, [idx, setProcessCount]);

  return (
    <View className='scene5-wrapper'>
      {idx === -1 && (
        <View className='scene5-presetting' onClick={() => setProcessCount(prev => prev + 1)}>
          <View className='presetting-text-wrapper'>
            <View className='presetting-text'>第五幕</View>
            <View className='presetting-text'>2022 年 8 月 24 日</View>
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
        onClick={props.onComplete}
      />
    </View>
  )
}

export default Scene5
