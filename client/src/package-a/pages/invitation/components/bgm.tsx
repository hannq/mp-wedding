import { FC, useEffect, useRef, useState } from 'react';
import { createInnerAudioContext, type InnerAudioContext } from '@tarojs/taro';
import { Music } from '@taroify/icons';
import { View } from '@tarojs/components';
import './index.less';

interface Props {
  /** 是否展示控制器 */
  show: boolean;
}

const BGM: FC<Props> = (props) => {
  const audioContextRef = useRef<InnerAudioContext | null>(null)
  const [angle, setAngle] = useState(0);
  const [audioPause, setAudioPause] = useState(true);

  useEffect(() => {
    const audioContext = createInnerAudioContext();
    audioContextRef.current = audioContext;
    audioContext.src = 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/media/bgm.mp3?sign=cf0bb6bf0d3d57428df2cf2951227b15&t=1664345039'
    audioContext.autoplay = true;
    audioContext.loop = true;
    const onPlayHandle = () => setAudioPause(false);
    const onPlayPause = () => setAudioPause(true);
    audioContext.onPlay(onPlayHandle);
    audioContext.onPause(onPlayPause);

    return () => {
      audioContext.stop();
      audioContext.src = '';
      audioContext.destroy();
      audioContext.offPlay(onPlayHandle);
      audioContext.offPause(onPlayPause);
    }
  }, []);

  useEffect(() => {
    let inervalId = 0;
    if (!audioPause) {
      inervalId = setInterval(() => setAngle(prevAngle => (prevAngle + 0.3) % 360), 10);
    }
    return () => clearInterval(inervalId)
  }, [audioPause]);

  return (
    <View
      style={{ display: props?.show ? 'block' : 'none' }}
      className='bgm-wrapper'
      onClick={() => {
        if (audioPause) {
          audioContextRef.current?.play();
        } else {
          audioContextRef.current?.pause();
        }
      }}
    >
      <Music size={38} style={{ transform: `rotate(${angle}deg)` }} color='#333' />
    </View>
  )
}

export default BGM
