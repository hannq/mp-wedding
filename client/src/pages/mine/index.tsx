import { type FC, useMemo } from 'react';
import { navigateTo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Avatar, Cell } from '@taroify/core';
import { Arrow } from '@taroify/icons';
import { useShare, useAuth } from '@/hooks';
import { PackageAPage, PackageBPage, RoleType } from '@/constants';
import avatarDefaultImg from '@/assets/images/avatar-default.png';
import './index.less';

export const Index: FC = () => {
  useShare();
  const { auth } = useAuth();
  const showManageEntry = useMemo(() => [RoleType.ADMIN, RoleType.BRIDEGROOM, RoleType.BRIDE].includes(auth?.role?.type!), [auth]);

  return (
    <View className='wrapper'>
      <View className='auth-info-wrapper'>
        <View className='left-wrapper'>
          <Avatar size='large' className='avatar' src={auth?.avatarUrl || avatarDefaultImg} />
        </View>
        <View className='right-wrapper'>
          <View className='nick-name'>{auth?.nickName || '未登录'}</View>
          <View className='role'>{auth?.role?.name || '宾客'}</View>
        </View>
      </View>
      {showManageEntry && <View className='link-wrapper'>
        <Cell
          clickable
          title='请柬'
          rightIcon={<Arrow />}
          onClick={() => navigateTo({ url: PackageAPage.INVITATION })}
        />
        <Cell
          clickable
          title='用户列表'
          rightIcon={<Arrow />}
          onClick={() => navigateTo({ url: PackageBPage.USER_LIST })}
        />
        <Cell
          clickable
          title='日程管理'
          rightIcon={<Arrow />}
          onClick={() => navigateTo({ url: PackageBPage.SCHEDULE_MANAGEMENT })}
        />
        <Cell
          clickable
          title='导航管理'
          rightIcon={<Arrow />}
          onClick={() => navigateTo({ url: PackageBPage.NAVIGATION_MANAGEMENT })}
        />
        <Cell
          clickable
          title='角色码管理'
          rightIcon={<Arrow />}
          onClick={() => navigateTo({ url: PackageBPage.ROLE_CODE_MANAGEMENT })}
        />
        <Cell
          clickable
          title='消息推送'
          rightIcon={<Arrow />}
          onClick={() => navigateTo({ url: PackageBPage.MSG_PUSH })}
        />
      </View>}
    </View>
  )
}

export default Index;
