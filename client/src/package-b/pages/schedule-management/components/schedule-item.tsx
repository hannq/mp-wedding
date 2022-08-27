import { useMemo, type FC } from 'react';
import { } from '@tarojs/taro';
import { View, Text, } from '@tarojs/components';
import { SwipeCell, Collapse, Button,  } from '@taroify/core';
import { GuideOutlined, CalendarOutlined, LocationOutlined, UserOutlined } from '@taroify/icons';
import dayjs from 'dayjs';
import { Schedule } from '@/types';
import './index.less';

interface Props extends Schedule {
  /** 删除回调 */
  onDel(id: string): void;
  /** 编辑回调 */
  onEdit?(id: string): void;
  /** 导航回调 */
  onNavigate?(schedule: Schedule): void;
}

export const ScheduleItem: FC<Props> = (props) => {
  const { name, desc, addressName, roles, startTime, onEdit, onNavigate } = props;
  const roleShowText = useMemo(() => roles.map(role => role.name).join('、'), [roles]);
  const formatStartTime = useMemo(() => dayjs(startTime).format(`YYYY-MM-DD HH:mm`), [startTime]);
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
        <Collapse value={desc ? void(0) : []} defaultValue={[]}>
          <Collapse.Item
            clickable={!!desc}
            title={(
              <View className='title'>
                <View>{name}</View>
                <Button
                  size='small'
                  variant='text'
                  icon={<GuideOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate?.(props);
                  }}
                >导航</Button>
              </View>
            )}
            expandIcon={null}
            brief={(
              <View>
                <View className='brief-item'>
                  <UserOutlined />
                  <Text className='text'>{roleShowText}</Text>
                </View>
                <View className='brief-item'>
                  <CalendarOutlined />
                  <Text className='text'>{formatStartTime}</Text>
                </View>
                {!!addressName && <View className='brief-item'>
                  <LocationOutlined />
                  <Text className='text'>{addressName}</Text>
                </View>}
              </View>
            )}
          >
            {desc}
          </Collapse.Item>
        </Collapse>
        <SwipeCell.Actions side='right'>
          <Button
            variant='contained'
            shape='square'
            color='danger'
            onClick={() => props.onDel(props.id)}
          >
            删除
          </Button>
        </SwipeCell.Actions>
      </SwipeCell>
    </View>
  )
}

export default ScheduleItem;
