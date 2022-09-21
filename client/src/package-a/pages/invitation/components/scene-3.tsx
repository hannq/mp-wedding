import { type FC, useState, useEffect, useRef, useCallback } from 'react';
import { View, Image } from '@tarojs/components';
import { Current } from '@tarojs/taro';
import type { SceneCommonProps } from '../types';
import { SizeType } from '../constants';
import { getSuitableImg } from '../utils';

import './index.less';

const Scene1: FC<SceneCommonProps> = (props) => {
  const [idx, setIdx] = useState(-1);
  const imgReadyCountRef = useRef(0);
  const addImgReadyCount = useCallback(() => {
    imgReadyCountRef.current++;
  }, []);

  const setProcessCount = useCallback((param: number | ((prevState: number) => number)) => {
    // if (imgReadyCountRef.current === 9) {
    //   setIdx(param);
    // }
    setIdx(param);
  }, []);

  useEffect(() => {
    switch (idx) {
      case 0:
        Current.page?.animate?.(
          '#scene3-bg-top',
          [
            { opacity: 0 },
            { opacity: 1 },
          ],
          400,
          () => {}
        )
        break;
      case 1:
        Current.page?.animate?.(
          '#scene3-modal',
          [
            { opacity: 0 },
            { opacity: 1 },
          ],
          400,
          () => {}
        )
        break;
      case 2:
        Current.page?.animate?.(
          '#scene3-modal-title',
          [
            { translateY: -700 },
            { translateY: 0 },
          ],
          400,
          () => {}
        )
        Current.page?.animate?.(
          '#scene3-modal-btn-left',
          [
            { translateX: -700 },
            { translateX: 0 },
          ],
          400,
          () => {}
        )
        Current.page?.animate?.(
          '#scene3-modal-btn-right',
          [
            { translateX: 700 },
            { translateX: 0 },
          ],
          400,
          () => {}
        )
        break;
      case 3:
        Current.page?.animate?.(
          '#scene3-modal-title',
          [
            { translateY: 0 },
            { translateY: -700 },
          ],
          400,
          () => {}
        )
        Current.page?.animate?.(
          '#scene3-modal-btn-left',
          [
            { translateX: 0 },
            { translateX: -700 },
          ],
          400,
          () => {}
        )
        Current.page?.animate?.(
          '#scene3-modal-btn-right',
          [
            { translateX: 0 },
            { translateX: 700 },
          ],
          400,
          () => {}
        );
        Current.page?.animate?.(
          '#scene3-modal-wrong-selection',
          [
            { opacity: 0 },
            { opacity: 1 },
          ],
          400,
          () => {}
        )
        break;
      case 4:
        Current.page?.animate?.(
          '#scene3-bg-bottom',
          [
            { left: '100%', bottom: '62%' },
            { left: 0, bottom: 0 },
          ],
          400,
          () => {}
        )
        break;
      case 5:
        Current.page?.animate?.(
          '#scene3-end-1',
          [
            { opacity: 0 },
            { opacity: 1 },
          ],
          400,
          () => {}
        )
        break;
      case 6:
        Current.page?.animate?.(
          '#scene3-end-2',
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
    <View className='scene3-wrapper'>
      {idx === -1 && (
        <View className='scene3-presetting' onClick={() => setProcessCount(prev => prev + 1)}>
          <View className='presetting-text-wrapper'>
            <View className='presetting-text'>第三幕</View>
            <View className='presetting-text'>2017 年</View>
          </View>
        </View>
      )}
      <View
        className='scene3-wrapper'
        style={{ display: idx >= 0 && idx < 5 ? void (0) : 'none' }}
        onClick={() => idx < 1 && setProcessCount(1)}
      >
        <Image
          onLoad={addImgReadyCount}
          className='scene3-bg-top' id='scene3-bg-top'
          mode='scaleToFill'
          src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_3_bg_top.png?sign=e7d40c646676e14e6b0457d01695b05a&t=1663730082'
        />
        <View
          className='scene3-modal'
          id='scene3-modal'
          style={{ display: idx < 4 ? void (0) : 'none' }}
        >
          <Image
            onLoad={addImgReadyCount}
            id='scene3-modal-title'
            className='scene3-modal-title'
            mode='scaleToFill'
            src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_3_modal_title.png?sign=ef57fe935ea8a9690ad5da77913556f6&t=1663731654'
          />
          <View className='scene3-modal-btn-wrapper'>
            <Image
              onLoad={addImgReadyCount}
              id='scene3-modal-btn-left'
              className='scene3-modal-btn-left'
              mode='scaleToFill'
              src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_3_modal_btn_left.png?sign=f5ec1d7176a310e45580c1a4bd39b92d&t=1663731678'
              onClick={() => setProcessCount(4)}
            />
            <Image
              onLoad={addImgReadyCount}
              id='scene3-modal-btn-right'
              className='scene3-modal-btn-right'
              mode='scaleToFill'
              src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_3_modal_btn_right.png?sign=083403dbf466eb037567dfaf76ce7b20&t=1663731668'
              onClick={() => setProcessCount(3)}
            />
          </View>
        </View>
        <View
          className='scene3-modal scene3-modal-wrong-selection'
          id='scene3-modal-wrong-selection'
          style={{ display: idx === 3 ? void(0) : 'none' }}
          onClick={() => setProcessCount(prev => prev - 1)}
        >
          博群怎么会不去？
        </View>
        <Image
          onLoad={addImgReadyCount}
          className='scene3-bg-bottom' id='scene3-bg-bottom'
          style={{ display: idx === 4 ? void(0) : 'none' }}
          mode='scaleToFill'
          src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_3_bg_bottom.png?sign=8910b37b9179ee87604ed5c0a9cbede2&t=1663730743'
          onClick={() => setProcessCount(prev => prev + 1)}
        />
      </View>
      <Image
        onLoad={addImgReadyCount}
        className='scene3-end'
        id='scene3-end-1'
        style={{ display: idx === 5 ? void(0) : 'none' }}
        mode='scaleToFill'
        src={getSuitableImg({
          [SizeType.LARGE]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_3_end_1_large.png?sign=04c0130f424a92793880f547d38baabe&t=1663749102',
          [SizeType.MEDIUM]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_3_end_1_medium.png?sign=f2edcc3602b8e2c28a467a49a0dc7aae&t=1663751192',
        })}
        onClick={() => setProcessCount(prev => prev + 1)}
      />
      <Image
        onLoad={addImgReadyCount}
        className='scene3-end'
        id='scene3-end-2'
        style={{ display: idx === 6 ? void(0) : 'none' }}
        mode='scaleToFill'
        src={getSuitableImg({
          [SizeType.LARGE]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_3_end_2_large.png?sign=04188975b6b86aec0c2b398b478f10b2&t=1663749134',
          [SizeType.MEDIUM]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_3_end_2_medium.png?sign=7510705ceb096b56ba2a1e5fd3beb488&t=1663751207',
        })}
        onClick={props.onComplete}
      />
    </View>
  )
}

export default Scene1
