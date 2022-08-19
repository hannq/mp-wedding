import { type FC } from 'react';
import { View, } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { Button } from '@taroify/core';
import { PackageAPage, PackageBPage } from '@/constants';
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
        onClick={() => navigateTo({ url: PackageBPage.ROLE_CODE_LIST })}
      >角色码管理</Button>
    </View>
  )
}

export default Index;
