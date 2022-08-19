import { type FC } from 'react';
import { View } from '@tarojs/components';
import { SwipeCell, Image, Button } from '@taroify/core';
import { RoleCode } from '@/types';
import './index.less';

interface Props extends RoleCode { }

export const RoleCodeItem: FC<Props> = (props) => {
  return (
    <View className='role-code-item-wrapper'>
      <SwipeCell className='swipe-cell'>
        <View className='card'>
          <View className='left-content'>
            <Image className='icon' src='https://img01.yzcdn.cn/vant/ipad.jpeg' />
            <View>
              <View>{props.role.name}</View>
              {props.inUse && <View>使用者：{props.user?.nickName}</View>}
            </View>
          </View>
          <View className='right-content'></View>
        </View>
        <SwipeCell.Actions side='right'>
          <Button variant='contained' shape='square' color='danger'>
            删除
          </Button>
        </SwipeCell.Actions>
      </SwipeCell>
    </View>
  )
}

export default RoleCodeItem;
