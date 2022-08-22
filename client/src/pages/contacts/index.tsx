import { type FC } from 'react';
import { makePhoneCall } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Button } from '@taroify/core';
import { useShare } from '@/hooks';
import './index.less';

export const Index: FC = () => {
  useShare();
  return (
    <View className='wrapper'>
      <Button
        onClick={() => {
          makePhoneCall({
            phoneNumber: '17526880804'
          })
        }}
      >拨打电话</Button>
    </View>
  )
}

export default Index;
