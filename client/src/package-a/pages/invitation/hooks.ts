import { useMemo, useEffect, useRef, useState } from 'react';
import { useDidShow, hideHomeButton, useRouter, createInnerAudioContext, type InnerAudioContext } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { useScene, useCloudInit, useAuth } from '@/hooks';
import { roleCode as roleCodeApi } from '@/apis';

/**
 * 隐藏返回首页按钮
 */
export function useHideHomeBtn() {
  useDidShow(hideHomeButton)
}

/**
 * 获取请柬信息
 */
export function useInvitationInfo() {
  const { loading: authLoading, auth, refresh } = useAuth();
  const { params: { roleCode: roleCodeFromParams = '' } } = useRouter();
  const { roleCode: roleCodeFromScene } = useScene();
  const code = useMemo(() => roleCodeFromParams || roleCodeFromScene, [roleCodeFromParams, roleCodeFromScene]);
  const initTaskRef = useCloudInit();
  const { run, loading, data } = useRequest(roleCodeApi.getList, { manual: true });

  useEffect(() => {
    if (code) {
      initTaskRef.current.then(() => run({ code, inUse: false }));
    }
    // eslint-disable-next-line
  }, [code]);

  return useMemo(
    () => ({
      loading: [loading, authLoading].includes(true),
      roleCodeInfo: data?.data?.[0] || null, auth,
      refresh
    }),
    [loading, authLoading, data, auth, refresh]
  )
}

export function usePlayBGM() {
  const contextRef = useRef<InnerAudioContext | null>(null)
  const [audioPause, setAudioPause] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const audioContext = createInnerAudioContext();
    contextRef.current = audioContext;
    audioContext.src = 'https://6d61-marry-prod-0gyfw3yc84f765a6-1313043687.tcb.qcloud.la/assets/media/bgm.mp3?sign=cf0bb6bf0d3d57428df2cf2951227b15&t=1664345039'
    audioContext.autoplay = true;
    audioContext.loop = true;
    const onPlayHandle = () => {
      setAudioPause(audioContext.paused);
      setLoading(false);
    };
    const onPauseHandle = () => setAudioPause(audioContext.paused);
    const onCanplayHandle = () => setLoading(false);
    const onWaitingHandle = () => {
      if (!audioContext.paused) {
        setLoading(true)
      }
    };
    audioContext.onPlay(onPlayHandle);
    audioContext.onCanplay(onCanplayHandle);
    audioContext.onWaiting(onWaitingHandle);
    audioContext.onPause(onPauseHandle);

    return () => {
      audioContext.stop();
      audioContext.src = '';
      audioContext.destroy();
      audioContext.offPlay(onPlayHandle);
      audioContext.offPause(onPauseHandle);
      audioContext.offWaiting(onWaitingHandle);
    }
  }, []);

  return {
    pause: audioPause,
    loading,
    contextRef
  };
}
