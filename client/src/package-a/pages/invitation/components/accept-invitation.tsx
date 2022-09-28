import { useMemo, type FC } from 'react';
import { getUserProfile, showToast, reLaunch, showLoading, hideLoading, requestSubscribeMessage } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Image, Checkbox } from "@taroify/core";
import { MusicOutlined } from "@taroify/icons";
import { user } from "@/apis";
import { Page, MSG_TEMPLATE_ID } from "@/constants";
import { useInvitationInfo } from "../hooks";
import type { SceneCommonProps } from "../types";
import './index.less';

export const AcceptInvitation: FC<SceneCommonProps> = (props) => {
  const { alreadyCompleteGame = false, bgmPause = true, bgmLoading = true, bgmContextRef } = props;
  const { loading, roleCodeInfo, auth, refresh } = useInvitationInfo();
  const isReadOnly = useMemo(() => auth && (auth.role || !roleCodeInfo), [auth, roleCodeInfo])
  return (
    <View className='accept-invitation-wrapper'>
      <View className='content-wrapper'>
        <Image
          className='title-tips'
          mode='aspectFit'
          src={require('@/package-a/assets/images/title-tips.png')}
        />
        <View>
          {
            loading
              ?
              <View className='msg-tips'>信息查询中 ...</View>
              :
              (
                isReadOnly
                  ?
                  <View className='msg-tips'>
                    <View className='msg-tips-text'>博群和曼曼的婚礼，欢迎您的到来</View>
                    <View className='msg-tips-important-info'>[{auth?.role?.name || '来宾'}]{auth!.nickName}</View>
                  </View>
                  :
                  alreadyCompleteGame && <View className='msg-tips'>
                    <View className='msg-tips-text'>博群和曼曼的婚礼，邀请您成为</View>
                    <View className='msg-tips-important-info'>{roleCodeInfo ? roleCodeInfo.role.name : '来宾'}</View>
                  </View>
              )
          }
        </View>
        <View className='action-btn-wrapper'>
          <Checkbox
            className='checkbox-wrapper'
            shape='square'
            checked={!bgmPause}
            disabled={bgmLoading}
            onChange={checked => {
              if (checked) {
                bgmContextRef?.current?.play();
              } else {
                bgmContextRef?.current?.pause();
              }
            }}
          >
            <View className='checkbox-content'>
              <MusicOutlined size={18} />
              <View className='checkbox-text'>{bgmLoading ? '背景音乐加载中 ...' : '开启背景音乐'}</View>
            </View>
          </Checkbox>
          {!loading && (
            isReadOnly
              ?
              <Image
                className='action-btn'
                src={require('@/package-a/assets/images/enter-btn.png')}
                onClick={async () => {
                  const subscribeMessageRes = await requestSubscribeMessage?.({ tmplIds: [MSG_TEMPLATE_ID] });
                  if (subscribeMessageRes?.[MSG_TEMPLATE_ID] === "accept") {
                    showLoading({ title: '加载中 ...', mask: true });
                    await user.save({ pushMsgCount: (auth?.pushMsgCount || 0) + 1 });
                    await hideLoading();
                  }
                  await reLaunch({ url: Page.INDEX })
                }
                }
              />
              :
              alreadyCompleteGame && <Image
                className='action-btn'
                src={require('@/package-a/assets/images/accept-btn.png')}
                onClick={async () => {
                  try {
                    const [{ userInfo }, subscribeMessageRes] = await Promise.all([
                      getUserProfile({ lang: 'zh_CN', desc: '用于识别来宾身份' }),
                      requestSubscribeMessage?.({ tmplIds: [MSG_TEMPLATE_ID] })
                    ])
                    const pushMsgCount = subscribeMessageRes?.[MSG_TEMPLATE_ID] === "accept" ? (auth?.pushMsgCount || 0) + 1 : (auth?.pushMsgCount || 0)
                    showLoading({ title: '加载中 ...', mask: true });
                    const { errCode, errMsg } = await user.save({
                      avatarUrl: userInfo.avatarUrl,
                      nickName: userInfo.nickName,
                      gender: userInfo.gender,
                      roleCode: roleCodeInfo?.code,
                      pushMsgCount
                    });
                    await refresh();
                    await hideLoading();
                    if (errCode) {
                      console.error(errMsg)
                      showToast({ title: '绑定失败', icon: 'error' });
                    } else {
                      reLaunch({ url: Page.INDEX });
                    }
                  } catch (err) {
                    console.error(err);
                    await hideLoading();
                    showToast({ title: '操作失败', icon: 'error' });
                  }
                }}
              />
          )}
          <Image
            className='action-btn play-btn'
            src={require('@/package-a/assets/images/play-btn.png')}
            onClick={props.onComplete}
          />
        </View>
      </View>
    </View>
  )
}

export default AcceptInvitation;
