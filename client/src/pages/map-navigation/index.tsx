import { type FC } from 'react';
import { openLocation } from '@tarojs/taro';
import { View, } from '@tarojs/components';
import { Button } from '@taroify/core';
import './index.less';

export const Index: FC = () => {
  // 116.400175,39.905543

  return (
    <View className='wrapper'>
      <Button
        onClick={async () => {
          await openLocation({
            longitude: 118.797398,
            latitude: 32.044228,
            name: '总统府',
            address: '长江路292号'
          })
        }}
      >导航：总统府</Button>
      <Button
        onClick={async () => {
          await openLocation({
            longitude: 118.840467,
            latitude: 32.051931,
            name: '明孝陵景区',
            address: '石象路7号'
          })
        }}
      >导航：明孝陵景区</Button>
    </View>
  )
}

export default Index;
