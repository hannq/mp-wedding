import { type FC } from 'react';
import { View, Text } from '@tarojs/components';
import { Collapse, SwipeCell, Button, Rate, Tag } from '@taroify/core';
import { Location } from '@taroify/icons';
import { Navigation } from '@/types';
import './index.less';

interface Props extends Navigation {
  /** 删除回调 */
  onDel?(id: string): void;
  /** 编辑回调 */
  onEdit?(id: string): void;
  /** 去导航回调 */
  onNavigate?(navigation: Navigation): void;
}

export const NavigationItem: FC<Props> = (props) => {
  const { destinationName, isLocal, rate, transport, destinationAddress, desc, onEdit, onNavigate } = props;

  return (
    <View className='role-code-item-wrapper'>
      <SwipeCell className='swipe-cell'>
        <SwipeCell.Actions side='left'>
          <Button
            variant='contained'
            shape='square'
            color='primary'
            onClick={() => onEdit?.(props.id)}
          >
            编辑
          </Button>
        </SwipeCell.Actions>
        <Collapse defaultValue={[]}>
          <Collapse.Item
            clickable={false}
            title={(
              <View
                hoverClass='navigate-hover'
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.(props)
                }}
              >
                <Location />
                <Tag variant='outlined' color={isLocal ? 'info' : 'warning'}>{isLocal ? '南堡内' : '外地'}</Tag>
                <Text className='destination-name'>{destinationName}</Text>
              </View>
            )}
            brief={destinationAddress}
            expandIcon={null}
            icon={<Tag className='transport' color='primary'>{transport}</Tag>}
            extra={
              <Rate
                className='rate-color'
                value={rate}
                readonly
                size={12}
              />
            }
          >
            {desc || ''}
          </Collapse.Item>
        </Collapse>
        <SwipeCell.Actions side='right'>
          <Button
            variant='contained'
            shape='square'
            color='danger'
            onClick={() => props.onDel?.(props.id)}
          >
            删除
          </Button>
        </SwipeCell.Actions>
      </SwipeCell>
    </View>
  )
}

export default NavigationItem;
