import { useMemo, type FC } from 'react';
import { View, Text, } from '@tarojs/components';
import { Collapse, Button,  } from '@taroify/core';
import { GuideOutlined, CalendarOutlined, LocationOutlined, UserOutlined } from '@taroify/icons';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { Schedule } from '@/types';
import { getScheduleStatus } from "../utils";
import { ScheduleStatus } from "../constants";
import './index.less';

interface Props extends Schedule {
  className?: string;
  /** 导航回调 */
  onNavigate?(schedule: Schedule): void;
}

export const ScheduleItem: FC<Props> = (props) => {
  const { className, name, desc, addressName, roles, startTime, finishTime, onNavigate } = props;
  const roleShowText = useMemo(() => roles.map(role => role.name).join('、'), [roles]);
  const formatTime = useMemo(() => `${dayjs(startTime).format(`YYYY-MM-DD HH:mm`)} ~ ${dayjs(finishTime).format(`YYYY-MM-DD HH:mm`)}`, [startTime, finishTime]);
  return (
    <View
      className={classnames(
        'schedule-item-wrapper',
        { current: getScheduleStatus(startTime, finishTime) === ScheduleStatus.HAPPENING},
        className
      )}
    >
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
              {!!addressName && <View className='brief-item'>
                <LocationOutlined />
                <Text className='text'>{addressName}</Text>
              </View>}
              <View className='brief-item'>
                <CalendarOutlined />
                <Text className='text'>{formatTime}</Text>
              </View>
            </View>
          )}
        >
          {desc}
        </Collapse.Item>
      </Collapse>
    </View>
  )
}

export default ScheduleItem;
