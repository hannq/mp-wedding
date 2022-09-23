import { type FC, useState, useEffect, useRef, useCallback } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { Current } from '@tarojs/taro';
import classnames from 'classnames';
import type { SceneCommonProps } from '../types';
import { getSuitableImg, getSuitableWindowSizeType } from '../utils';
import { SizeType } from '../constants';
import './index.less';

const Scene1: FC<SceneCommonProps> = (props) => {
  const [idx, setIdx] = useState(-1);
  const imgReadyCountRef = useRef(0);
  const addImgReadyCount = useCallback(() => {
    imgReadyCountRef.current++;
  }, []);

  const setProcessCount = useCallback((param: number | ((prevState: number) => number)) => {
    if (imgReadyCountRef.current === 10) {
      setIdx(param);
    }
  }, []);

  useEffect(() => {
    switch (idx) {
      case 0:
        Current.page?.animate?.(
          '#scene1-bg',
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
          '#text-ask-help',
          [
            { opacity: 0, scale: [0, 0], transformOrigin: 'bottom left' },
            { opacity: 1, scale: [1, 1], transformOrigin: 'bottom left' },
          ],
          400,
          () => {}
        )
        break;
      case 2:
        Current.page?.animate?.(
          '#ask-help-mask',
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
          '#ask-help-mask',
          [
            { opacity: 1 },
            { opacity: 0 },
          ],
          400,
          () => {
            setProcessCount(idx + 1);
            setTimeout(() => {
              Current.page?.animate?.(
                '#text-ask-help',
                [
                  { transformOrigin: 'top left', scale: [1, 1], translateY: 0 },
                  { transformOrigin: 'top left', scale: [0.7, 0.7], translateY: -26 },
                ],
                400,
                () => {}
              );

              Current.page?.animate?.(
                '#text-agree-help',
                [
                  { opacity: 0, scale: [0, 0], transformOrigin: 'bottom center' },
                  { opacity: 1, scale: [1, 1], transformOrigin: 'bottom center' },
                ],
                400,
                () => {}
              );
            });
          }
        )
        break;
      case 6:
        Current.page?.animate?.(
          '#scene1-finish-bg1',
          [
            { opacity: 0 },
            { opacity: 1 },
          ],
          400,
          () => {}
        )
        break;
      case 7:
        Current.page?.animate?.(
          '#scene1-finish-bg1',
          [
            { opacity: 1, scale: [2, 2], transformOrigin: 'center 100px', },
            { opacity: 0, scale: [1, 1], transformOrigin: 'center 100px', },
          ],
          400,
          () => {}
        )
        setTimeout(() => {
          Current.page?.animate?.(
            '#scene1-finish-bg2',
            [
              { opacity: 0 },
              { opacity: 1 },
            ],
            400,
            () => {}
          )
        }, 100);
        break;
      case 8:
        Current.page?.animate?.(
          '#scene1-finish-bg3',
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
    <View className='scene1-wrapper'>
      {idx === -1 && (
        <View className='scene1-presetting' onClick={() => setProcessCount(prev => prev + 1)}>
          <View className='presetting-text-wrapper'>
            <View className='presetting-text'>唐山</View>
            <View className='presetting-text'>华北理工大学  第二教学楼  以升实验中心</View>
            <View className='presetting-text'>2015 年</View>
          </View>
        </View>
      )}
      <View
        className='scene1-wrapper'
        style={{ display: idx >= 0 && idx < 6 ? void (0) : 'none' }}
        onClick={() => setProcessCount(prev => prev + 1)}
      >
        <Image
          onLoad={addImgReadyCount}
          className='scene1-bg' id='scene1-bg'
          mode='scaleToFill'
          src={getSuitableImg({
            [SizeType.MEDIUM]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_1_start_medium.png?sign=9cf72db5597377622685936ae9162aa9&t=1663751019',
            [SizeType.LARGE]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_1_start_large.png?sign=426dad35768e7759c69800eb1e9aa0a1&t=1663751029',
          })}
        />
        <Image
          onLoad={addImgReadyCount}
          style={{ display: idx >= 1 ? void (0) : 'none' }}
          className={classnames('text-ask-help', { 'large': getSuitableWindowSizeType() === SizeType.LARGE })}
          id='text-ask-help'
          mode='scaleToFill'
          src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_1_text_%E6%B1%82%E5%B8%AE%E5%BF%99.png?sign=4d9acd98baee484b0561a50ec7dae7e6&t=1663316242'
        />
        <View
          className='ask-help-mask'
          id='ask-help-mask'
          style={{ display: idx >= 2 && idx < 5 ? void (0) : 'none' }}
          onClick={e => {
            e.stopPropagation();
            if (idx === 3) {
              setProcessCount(4)
            }
          }}
        >
          <Image
            onLoad={addImgReadyCount}
            className='scene1-mask'
            mode='scaleToFill'
            src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_1_%E9%81%AE%E7%BD%A9.png?sign=fdef00dd0533649d9d188a7520ba5b0c&t=1663317753'
          />
          <View
            className='agree-help-modal-wrapper'
            style={{ display: idx >= 2 && idx < 3 ? void (0) : 'none' }}
          >
            <Image
              onLoad={addImgReadyCount}
              className='agree-help-modal-title'
              mode='scaleToFill'
              src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_1_text_%E5%B8%AE%E5%BF%99%E5%90%97.png?sign=5c301a8aa05ac1ac781cb305b7525294&t=1663317998'
            />
            <View className='agree-help-modal-btns-wrapper'>
              <Image
                onLoad={addImgReadyCount}
                className='btn-disagree'
                mode='scaleToFill'
                src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_1_btn_%E4%B8%8D%E5%B8%AE.png?sign=e79958750f94c46cf5364d9a14c5fbdc&t=1663318638'
                onClick={() => setProcessCount(prev => prev + 1)}
              />
              <Image
                onLoad={addImgReadyCount}
                className='btn-agree'
                mode='scaleToFill'
                src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_1_btn_%E5%B8%AE%E5%BF%99.png?sign=9784f9b41240a73a27437b5b5be44445&t=1663318619'
                onClick={() => setProcessCount(prev => prev + 2)}
              />
            </View>
          </View>
          {idx === 3 && <View className='disagree-tips' >
            <Text className='disagree-tips-text'>不行，博群要帮</Text>
          </View>}
        </View>
        <Image
          onLoad={addImgReadyCount}
          style={{ display: idx === 5 ? void (0) : 'none' }}
          className={classnames('text-agree-help', { 'large': getSuitableWindowSizeType() === SizeType.LARGE })}
          id='text-agree-help'
          mode='scaleToFill'
          src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_1_text_%E5%90%8C%E6%84%8F%E5%B8%AE%E5%BF%99.png?sign=b2b3a739af7987e5a9b48e4ece80a442&t=1663316828'
        />
      </View>
      <View
        className='scene1-wrapper'
        style={{ display: idx >= 6 ? void (0) : 'none' }}
      >
        <Image
          onLoad={addImgReadyCount}
          className='scene1-bg scene1-finish-bg1'
          id='scene1-finish-bg1'
          mode='scaleToFill'
          src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_1_%E7%BB%93%E6%9D%9F1.png?sign=ded0cf060cadf7c9c92550bfef3050c7&t=1663319624'
          onClick={() => setProcessCount(prev => prev + 1)}
        />
        <Image
          onLoad={addImgReadyCount}
          style={{ display: idx === 7 ? void (0) : 'none' }}
          className='scene1-bg scene1-finish-bg2'
          id='scene1-finish-bg2'
          mode='scaleToFill'
          src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_1_%E7%BB%93%E6%9D%9F2.jpg?sign=dc89231dc0ead317789c2853fa32acf5&t=1663319683'
          onClick={() => setProcessCount(prev => prev + 1)}
        />
        <Image
          onLoad={addImgReadyCount}
          style={{ display: idx === 8 ? void (0) : 'none' }}
          className='scene1-bg scene1-finish-bg2'
          id='scene1-finish-bg3'
          mode='scaleToFill'
          src={getSuitableImg({
            [SizeType.MEDIUM]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_1_end_3_medium.png?sign=d23675686b10f3190a55add6dcc9c693&t=1663750928',
            [SizeType.LARGE]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_1_end_3_large.png?sign=bb79c61fc5d5de6ca47bd3f3d46e3fe4&t=1663750964',
          })}
          onClick={props.onComplete}
        />
      </View>
    </View>
  )
}

export default Scene1
