import { type FC } from 'react';
import { getUserProfile, showToast } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Button } from "@taroify/core";
import { user } from "@/apis";
import { useHideHomeBtn, useRoleCode } from "./hooks";
import './index.less';

export const Invitation: FC = () => {
  useHideHomeBtn();
  const roleCode = useRoleCode();
  return (
    <View className='index'>
      <Button
        onClick={async () => {
          try {
            const { userInfo } = await getUserProfile({ lang: 'zh_CN', desc: '用于识别来宾身份' });
            const { errCode, errMsg, data } = await user.save({
              avatarUrl: userInfo.avatarUrl,
              nickName: userInfo.nickName,
              gender: userInfo.gender,
              roleCode
            });
            if (errCode) {
              showToast({ title: errMsg, icon: 'error' });
            } else {
              console.log('user ==>', data)
              showToast({ title: '保存成功' });
            }
          } catch (err) {
            console.error(err);
            showToast({ title: '保存信息失败', icon: 'error' });
          }
        }}
      >接受邀请</Button>
    </View>
  )
}

export default Invitation;
