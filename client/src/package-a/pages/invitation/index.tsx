import { useMemo, type FC } from 'react';
import { getUserProfile, showToast, reLaunch, showLoading, hideLoading, requestSubscribeMessage } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Button } from "@taroify/core";
import { user } from "@/apis";
import { useCloudInit, useShare } from "@/hooks";
import { Page } from "@/constants";
import { useHideHomeBtn, useInvitationInfo } from "./hooks";
import './index.less';

/** 小程序模版ID */
const TEMPLATE_ID = '40DN4h2ks6v2i4oZb9mp_euR33IO-49xRauKkYBTIWM';

export const Invitation: FC = () => {
  useShare();
  useCloudInit();
  useHideHomeBtn();
  const { loading, roleCodeInfo, auth } = useInvitationInfo();
  const isReadOnly = useMemo(() => auth && (auth.role || !roleCodeInfo), [auth, roleCodeInfo])
  return (
    <View className='index'>
      {
        loading
        ?
        <View>信息查询中 ...</View>
        :
        (
          isReadOnly
          ?
          <View>
            欢迎回来，[{auth?.role?.name || '来宾'}] {auth!.nickName}
          </View>
          :
          <View>
            邀请你成为：{roleCodeInfo ? roleCodeInfo.role.name : '来宾'}
          </View>
        )
      }

      {!loading && (
        isReadOnly
        ?
        <Button
          onClick={async () => {
            const subscribeMessageRes = await requestSubscribeMessage({ tmplIds: [TEMPLATE_ID] });
            if (subscribeMessageRes[TEMPLATE_ID] === "accept") {
              showLoading({ title: '加载中 ...', mask: true });
              await user.save({ pushMsgCount: (auth?.pushMsgCount || 0) + 1 });
              await hideLoading();
            }
            await reLaunch({ url: Page.INDEX })}
          }
        >回到首页</Button>
        :
        <Button
          onClick={async () => {
            try {
              const [{ userInfo }, subscribeMessageRes] = await Promise.all([
                getUserProfile({ lang: 'zh_CN', desc: '用于识别来宾身份' }),
                requestSubscribeMessage({ tmplIds: [TEMPLATE_ID] })
              ])
              const pushMsgCount = subscribeMessageRes[TEMPLATE_ID] === "accept" ? (auth?.pushMsgCount || 0) + 1 : (auth?.pushMsgCount || 0)
              showLoading({ title: '加载中 ...', mask: true });
              const { errCode, errMsg } = await user.save({
                avatarUrl: userInfo.avatarUrl,
                nickName: userInfo.nickName,
                gender: userInfo.gender,
                roleCode: roleCodeInfo?.code,
                pushMsgCount
              });
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
        >接受邀请</Button>
      )}
    </View>
  )
}

export default Invitation;
