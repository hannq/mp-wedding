import { type FC, useState, useEffect, useRef, useCallback } from 'react';
import { View, Image } from '@tarojs/components';
import { Current } from '@tarojs/taro';
import type { SceneCommonProps } from '../types';
import { getSuitableImg } from '../utils';
import { SizeType } from '../constants';
import './index.less';

const Scene2: FC<SceneCommonProps> = (props) => {
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
          '#scene2-bg1',
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
          '#scene2-bg1-text-step2',
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
          '#scene2-bg2',
          [
            { opacity: 0 },
            { opacity: 1 },
          ],
          400,
          () => {}
        )
        break;
      case 3:
        Current.page?.animate?.(
          '#scene2-b-text1',
          [
            { scale: [0, 0], transformOrigin: 'left bottom' },
            { scale: [1, 1], transformOrigin: 'left bottom' },
          ],
          400,
          () => {}
        )
        break;
      case 4:
        Current.page?.animate?.(
          '#scene2-m-text1',
          [
            { scale: [0, 0], transformOrigin: 'right bottom' },
            { scale: [1, 1], transformOrigin: 'right bottom' },
          ],
          400,
          () => {}
        )
        break;
      case 5:
        Current.page?.animate?.(
          '#scene2-b-text1',
          [
            { scale: [1, 1], left: '42%', top: '10%' },
            { scale: [0.7, 0.7], left: '100%', top: '-10%' },
          ],
          400,
          () => {}
        );
        Current.page?.animate?.(
          '#scene2-b-text2',
          [
            { scale: [0, 0], transformOrigin: 'left bottom' },
            { scale: [1, 1], transformOrigin: 'left bottom' },
          ],
          400,
          () => {}
        )
        break;
      case 6:
        Current.page?.animate?.(
          '#scene2-m-text1',
          [
            { scale: [1, 1], translateX: 0, translateY: 0 },
            { scale: [0.7, 0.7], translateX: '150%', translateY: '-100%' },
          ],
          400,
          () => {}
        );
        Current.page?.animate?.(
          '#scene2-m-text2',
          [
            { scale: [0, 0], transformOrigin: 'left bottom' },
            { scale: [1, 1], transformOrigin: 'left bottom' },
          ],
          400,
          () => {}
        )
        break;
      case 7:
        Current.page?.animate?.(
          '#scene2-bg3',
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
    <View className='scene2-wrapper'>
      {idx === -1 && (
        <View className='scene2-presetting' onClick={() => setProcessCount(prev => prev + 1)}>
          <View className='presetting-text-wrapper'>
            <View className='presetting-text'>第二幕</View>
            <View className='presetting-text'>2016 年</View>
          </View>
        </View>
      )}
      <View
        id='scene2-bg1'
        className='scene2-bg1-wrapper'
        style={{ display: idx >= 0 && idx < 2 ? void (0) : 'none' }}
        onClick={() => setProcessCount(prev => prev + 1)}
      >
        <Image
          onLoad={addImgReadyCount}
          className='scene2-bg1-img'
          mode='scaleToFill'
          src={getSuitableImg({
            [SizeType.MEDIUM]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_2_bg_1_medium.png?sign=79868ad903291726aece181549da7801&t=1663921690',
            [SizeType.LARGE]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_2_bg_1_large.png?sign=5f6b43b5d420c4847b363ca7faef8a81&t=1663921653',
          })}
        />
        <View className='scene2-bg1-text-wrapper'>
          <View className='scene2-bg1-text-content'>
            <View className='scene2-bg1-text'>博群毕业以后到了北京工作</View>
            <View className='scene2-bg1-text'>曼曼还在唐山上学</View>
            <View
              id='scene2-bg1-text-step2'
              className='scene2-bg1-text scene2-bg1-text-step2'
            >10月 博群被安排到贵阳长期出差</View>
          </View>
        </View>
      </View>
      <View
        id='scene2-bg2'
        className='scene2-bg2-wrapper'
        style={{ display: idx >= 2 && idx < 7 ? void (0) : 'none' }}
        onClick={() => setProcessCount(prev => prev + 1)}
      >
        <Image
          onLoad={addImgReadyCount}
          className='scene2-bg2-img'
          mode='scaleToFill'
          src={getSuitableImg({
            [SizeType.MEDIUM]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_2_bg_2_medium.png?sign=822d6bfdd570b576917fc96a696ade16&t=1663923043',
            [SizeType.LARGE]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_2_bg_2_large.png?sign=2591d3728ec6c8f878a47c843614a206&t=1663923016',
          })}
        />
        <Image
          onLoad={addImgReadyCount}
          id='scene2-b-text1'
          className='scene2-b-text1'
          mode='scaleToFill'
          src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_2_b_text_1.png?sign=72327eb8a816301ffe49c8884586ee2e&t=1663923564'
        />
        <Image
          onLoad={addImgReadyCount}
          id='scene2-b-text2'
          className='scene2-b-text2'
          mode='scaleToFill'
          src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_2_b_text_2.png?sign=56468cea8677de185c60f64974ce6a2e&t=1663923601'
        />
        <Image
          onLoad={addImgReadyCount}
          id='scene2-m-text1'
          className='scene2-m-text1'
          mode='scaleToFill'
          src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_2_m_text_1.png?sign=fc2d7f80c9726aa4b2710feb96792d7a&t=1663925601'
        />
        <Image
          onLoad={addImgReadyCount}
          id='scene2-m-text2'
          className='scene2-m-text2'
          mode='scaleToFill'
          src='https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_2_m_text_2.png?sign=b5eaf9cb4c8ecbe35c5644c1db4df8a7&t=1663925626'
        />
      </View>
      <Image
        onLoad={addImgReadyCount}
        id='scene2-bg3'
        className='scene2-bg3'
        style={{ display: idx >= 7 ? void (0) : 'none' }}
        mode='scaleToFill'
        src={getSuitableImg({
          [SizeType.MEDIUM]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_2_bg_3_medium.png?sign=a484aad5d29bb9259cb0fef0f21e4e64&t=1663927108',
          [SizeType.LARGE]: 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/invitation/scene_2_bg_3_large.png?sign=91f8ef78abcb4732d4015bb3df995679&t=1663927095',
        })}
        onClick={props.onComplete}
      />
    </View>
  )
}

export default Scene2
