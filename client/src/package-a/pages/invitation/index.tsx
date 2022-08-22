import { type FC } from 'react';
import { getUserProfile, showToast } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Button } from "@taroify/core";
import { user } from "@/apis";
import { useCloudInit, useShare } from "@/hooks";
import { useHideHomeBtn, useGetRoleCodeInfo } from "./hooks";
import './index.less';

export const Invitation: FC = () => {
  useShare();
  useCloudInit();
  useHideHomeBtn();
  const { loading, data: roleCodeInfo } = useGetRoleCodeInfo();
  return (
    <View className='index'>

      {loading
      ?
      <View>查询中 ...</View>
      :
      <View>
        身份：{roleCodeInfo ? roleCodeInfo.role.name : '来宾'}
      </View>}

      {!loading && <Button
        onClick={async () => {
          try {
            const { userInfo } = await getUserProfile({ lang: 'zh_CN', desc: '用于识别来宾身份' });
            const { errCode, errMsg } = await user.save({
              avatarUrl: userInfo.avatarUrl,
              nickName: userInfo.nickName,
              gender: userInfo.gender,
              roleCode: roleCodeInfo?.code
            });
            if (errCode) {
              console.error(errMsg)
              showToast({ title: '绑定失败', icon: 'error' });
            } else {
              showToast({ title: roleCodeInfo ? '绑定成功' : '邀请成功' });
            }
          } catch (err) {
            console.error(err);
            showToast({ title: '操作失败', icon: 'error' });
          }
        }}
      >接受邀请</Button>}
    </View>
  )
}

export default Invitation;
