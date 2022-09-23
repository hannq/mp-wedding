import { type FC, useState, useEffect, useRef, useCallback } from 'react';
import { View, Image } from '@tarojs/components';
import { Current } from '@tarojs/taro';
import classnames from 'classnames';
import type { SceneCommonProps } from '../types';
import { getSuitableImg, getSuitableWindowSizeType } from '../utils';
import { SizeType } from '../constants';
import './index.less';

const Scene4: FC<SceneCommonProps> = (props) => {
  const [idx, setIdx] = useState(-1);
  const imgReadyCountRef = useRef(0);
  const addImgReadyCount = useCallback(() => {
    imgReadyCountRef.current++;
  }, []);

  const setProcessCount = useCallback((param: number | ((prevState: number) => number)) => {
    if (imgReadyCountRef.current === 7) {
      setIdx(param);
    }
  }, []);

  useEffect(() => {
    switch (idx) {
      case 0:
        Current.page?.animate?.(
          '#scene4-bg1',
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
          '#scene4-btn1',
          [
            { left: -400, top: -50, ease: 'ease-in' },
            { left: 0, top: 0,  ease: 'ease-in' },
          ],
          400,
          () => {}
        );
        Current.page?.animate?.(
          '#scene4-btn2',
          [
            { left: 400, top: -50, ease: 'ease-in' },
            { left: 0, top: 0,  ease: 'ease-in' },
          ],
          400,
          () => {}
        );
        Current.page?.animate?.(
          '#scene4-btn3',
          [
            { left: -400, top: 50, ease: 'ease-in' },
            { left: 0, top: 0,  ease: 'ease-in' },
          ],
          400,
          () => {}
        );
        Current.page?.animate?.(
          '#scene4-btn4',
          [
            { left: 400, top: 50, ease: 'ease-in' },
            { left: 0, top: 0,  ease: 'ease-in' },
          ],
          400,
          () => {}
        );
        break;
      case 2:
        Current.page?.animate?.(
          '#scene4-btn1',
          [
            { left: 0, top: 0,  ease: 'ease-in' },
            { left: -400, top: -50, ease: 'ease-in' },
          ],
          400,
          () => {}
        );
        Current.page?.animate?.(
          '#scene4-btn2',
          [
            { left: 0, top: 0,  ease: 'ease-in' },
            { left: 400, top: -50, ease: 'ease-in' },
          ],
          400,
          () => {}
        );
        Current.page?.animate?.(
          '#scene4-btn3',
          [
            { left: 0, top: 0,  ease: 'ease-in' },
            { left: -400, top: 50, ease: 'ease-in' },
          ],
          400,
          () => {}
        );
        Current.page?.animate?.(
          '#scene4-btn4',
          [
            { left: 0, top: 0,  ease: 'ease-in' },
            { left: 400, top: 50, ease: 'ease-in' },
          ],
          400,
          () => {}
        );
        Current.page?.animate?.(
          '#scene4-wrong-selecton',
          [
            { opacity: 0 },
            { opacity: 1 },
          ],
          400,
          () => {}
        );
        break;
      case 3:
        Current.page?.animate?.(
          '#scene4-bg2',
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
          '#scene4-bg3',
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
    <View className='scene4-wrapper'>
      {idx === -1 && (
        <View className='scene4-presetting' onClick={() => setProcessCount(prev => prev + 1)}>
          <View className='presetting-text-wrapper'>
            <View className='presetting-text'>第四幕</View>
            <View className='presetting-text'>2019 年</View>
          </View>
        </View>
      )}
      <View
        id='scene4-bg1'
        className='scene4-bg1-wrapper'
        style={{ display: idx >= 0 && idx < 3 ? void (0) : 'none' }}
        onClick={() => setProcessCount(1)}
      >
        <Image
          onLoad={addImgReadyCount}
          className='scene4-bg1-img'
          mode='scaleToFill'
          src={getSuitableImg({
            [SizeType.MEDIUM]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_4_bg_1_medium.png?sign=e98a65660c3a72958f08e470470d584e&t=1663930785',
            [SizeType.LARGE]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_4_bg_1_large.png?sign=5102899677e791ae94444c8a3c1dc179&t=1663936118',
          })}
        />
        <View className={classnames('scene4-btn-wrapper', { 'large': getSuitableWindowSizeType() === SizeType.LARGE } )}>
          <View className='scene4-btn-row-wrapper'>
            <Image
              onLoad={addImgReadyCount}
              id='scene4-btn1'
              className='scene4-btn1'
              mode='scaleToFill'
              src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_4_btn_1.png?sign=754d2f2db13c50f94c94b545885b3f18&t=1663931088'
              onClick={e => {
                e.stopPropagation();
                setProcessCount(2);
              }}
            />
            <Image
              onLoad={addImgReadyCount}
              id='scene4-btn2'
              className='scene4-btn2'
              mode='scaleToFill'
              src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_4_btn_2.png?sign=febc34495d0ba08aa810992d4c8f1749&t=1663931101'
              onClick={e => {
                e.stopPropagation();
                setProcessCount(2);
              }}
            />
          </View>
          <View className='scene4-btn-row-wrapper'>
            <Image
              onLoad={addImgReadyCount}
              id='scene4-btn3'
              className='scene4-btn3'
              mode='scaleToFill'
              src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_4_btn_3.png?sign=4d911f0198c42c407ae7734e3d386477&t=1663931111'
              onClick={e => {
                e.stopPropagation();
                setProcessCount(2);
              }}
            />
            <Image
              onLoad={addImgReadyCount}
              id='scene4-btn4'
              className='scene4-btn4'
              mode='scaleToFill'
              src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_4_btn_4.png?sign=8f6ccf3f2115bffcd843a3ad9cd846ed&t=1663931122'
              onClick={e => {
                e.stopPropagation();
                setProcessCount(3);
              }}
            />
          </View>
          <View
            id='scene4-wrong-selecton'
            style={{ display: idx === 2 ? void (0) : 'none' }}
            className='scene4-wrong-selecton'
          >不，离博群家太远了</View>
        </View>
      </View>
      <Image
        style={{ display: idx === 3 ? void (0) : 'none' }}
        onLoad={addImgReadyCount}
        id='scene4-bg2'
        className='scene4-bg2'
        mode='scaleToFill'
        src={getSuitableImg({
          [SizeType.MEDIUM]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_4_bg_2_medium.png?sign=fd3a7fd13da284305f7c14ef8914fb0f&t=1663937745',
          [SizeType.LARGE]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_4_bg_2_large.png?sign=5f49336bac81396bf9784f84c2cc2b5d&t=1663938133',
        })}
        onClick={() => setProcessCount(prev => prev + 1)}
      />
      <Image
        style={{ display: idx === 4 ? void (0) : 'none' }}
        onLoad={addImgReadyCount}
        id='scene4-bg3'
        className='scene4-bg3'
        mode='scaleToFill'
        src={getSuitableImg({
          [SizeType.MEDIUM]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_4_bg_3_medium.png?sign=8d910cba4ccb40d884d895265b9d036b&t=1663936542',
          [SizeType.LARGE]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_4_bg_3_large.png?sign=a3e022871b34aeaa011bb4eb1bb763f1&t=1663936521',
        })}
        onClick={props.onComplete}
      />
    </View>
  )
}

export default Scene4
