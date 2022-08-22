import { type FC } from 'react';
import { View } from '@tarojs/components';
import { Empty } from '@taroify/core';
import { useShare } from '@/hooks';
import './index.less';

export const Index: FC = () => {
  useShare();

  return (
    <View className='wrapper'>
      <Empty>
        <Empty.Image src='network' />
        <Empty.Description>敬请期待～～～</Empty.Description>
      </Empty>
    </View>
  )
}

export default Index;
