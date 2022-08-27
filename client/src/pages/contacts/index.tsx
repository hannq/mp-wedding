import { useMemo, type FC } from 'react';
import { useDidShow, makePhoneCall } from '@tarojs/taro';
import { View, ScrollView, Text } from '@tarojs/components';
import { Empty, Avatar, Tag } from "@taroify/core";
import { PhoneCircle } from "@taroify/icons";
import { useRequest } from "ahooks";
import { user } from "@/apis";
import { useShare } from "@/hooks/useShare";
import { RoleType } from "@/constants";
import './index.less';

type TagColor = "default" | "primary" | "info" | "success" | "warning" | "danger";

const roleTagColor: Record<RoleType, TagColor> = {
  [RoleType.ADMIN]: 'primary',
  [RoleType.BRIDEGROOM]: 'primary',
  [RoleType.BRIDE]: 'danger',
  [RoleType.GROOMSMAN]: 'info',
  [RoleType.BRIDESMAID]: 'success',
  [RoleType.SPONSOR]: 'warning',
  [RoleType.GUEST]: 'default',
}

export const Invitation: FC = () => {
  const { loading, run, data: concatsListRes } = useRequest(user.getContactsList, { manual: true });
  const concatsList = useMemo(() => concatsListRes?.list || [], [concatsListRes]);

  useDidShow(run);
  useShare();

  return (
    <View className='wrapper'>
      <ScrollView
        className='list-wrapper'
        scrollY
        refresherEnabled
        refresherBackground='#f5f5f5'
        refresherTriggered={loading}
        onRefresherRefresh={() => !loading && run()}
      >
        <View className='list-content'>
          {
            !!concatsList.length
            ?
            concatsList.map(userInfo => (
              <View
                hoverClass='list-item-hover'
                className='list-item'
                key={userInfo.id}
                onClick={() => makePhoneCall({ phoneNumber: userInfo.phoneNum! }).catch(() => {})}
              >
                <Avatar src={userInfo.avatarUrl} />
                <View className='right-wrapper'>
                  <View className='nick-name'>
                    <Text>{userInfo.realName}</Text>
                    <Tag
                      className='role-tag'
                      variant={userInfo?.role?.type === RoleType.ADMIN ? 'contained' : 'outlined'}
                      color={roleTagColor[userInfo?.role?.type || RoleType.GUEST]}
                      size='small'
                    >{userInfo?.role?.name || '宾客'}</Tag>
                  </View>
                  <View className='phone-num'>{userInfo.phoneNum}</View>
                </View>
                <PhoneCircle color='#999' size={24} />
              </View>
            ))
            :
            (
              !loading ? <Empty>
                <Empty.Image
                  className='empty-img'
                  src='https://img.yzcdn.cn/vant/custom-empty-image.png'
                />
                <Empty.Description>暂未设置联系人~</Empty.Description>
              </Empty> : null
            )
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default Invitation;
