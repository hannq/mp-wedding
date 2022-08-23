import { useMemo, type FC } from 'react';
import { getUserProfile, showToast, reLaunch, showLoading, hideLoading } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Button } from "@taroify/core";
import { user } from "@/apis";
import { useCloudInit, useShare } from "@/hooks";
import { Page } from "@/constants";
import { useHideHomeBtn, useInvitationInfo } from "./hooks";
import './index.less';

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
        <Button onClick={() => reLaunch({ url: Page.INDEX })}>回到首页</Button>
        :
        <Button
          onClick={async () => {
            try {
              const { userInfo } = await getUserProfile({ lang: 'zh_CN', desc: '用于识别来宾身份' });
              showLoading({ title: '加载中 ...', mask: true });
              const { errCode, errMsg } = await user.save({
                avatarUrl: userInfo.avatarUrl,
                nickName: userInfo.nickName,
                gender: userInfo.gender,
                roleCode: roleCodeInfo?.code
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
