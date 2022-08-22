import { type FC } from 'react';
import { View, } from '@tarojs/components';
import { navigateTo, switchTab } from '@tarojs/taro';
import { Button } from '@taroify/core';
import { Page, PackageAPage, PackageBPage } from '@/constants';
import './index.less';

export const Index: FC = () => {
  return (
    <View className='wrapper'>
      <Button
        block
        color='primary'
        className='link-btn'
        onClick={() => navigateTo({ url: PackageAPage.INVITATION })}
      >请柬</Button>
      <Button
        block
        color='primary'
        className='link-btn'
        onClick={() => switchTab({ url: Page.INDEX })}
      >主页</Button>
      <Button
        block
        color='primary'
        className='link-btn'
        onClick={() => navigateTo({ url: PackageBPage.USER_LIST })}
      >用户列表</Button>
      <Button
        block
        color='primary'
        className='link-btn'
        onClick={() => navigateTo({ url: PackageBPage.ROLE_CODE_MANAGEMENT })}
      >角色码管理</Button>
    </View>
  )
}

export default Index;
