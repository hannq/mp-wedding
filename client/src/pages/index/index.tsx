import { useMemo, type FC, useEffect, useState } from 'react';
import { useDidShow, openLocation } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { Timeline, Empty, Tabs } from "@taroify/core";
import type { TimelineDotProps } from "@taroify/core/timeline/timeline-dot";
import { useRequest } from "ahooks";
import { schedule, common } from "@/apis";
import { useShare, useAuth } from "@/hooks";
import { RoleType } from "@/constants";
import { ScheduleItem } from "./components/schedule-item";
import { ScheduleStatus } from "./constants";
import { getScheduleStatus } from "./utils";
import { useScrollIntoView } from "./hooks";
import './index.less';

const statusDotMap: Record<ScheduleStatus, TimelineDotProps> = {
  [ScheduleStatus.NOT_STARTED]: { variant: 'outlined', color: 'default' },
  [ScheduleStatus.HAPPENING]: { variant: 'outlined', color: 'warning' },
  [ScheduleStatus.FINISHED]: { variant: 'filled', color: 'default' },
}

export const Index: FC = () => {
  useShare();
  const { loading: authLoading, auth } = useAuth();
  const [roleIdx, setRoleIdx] = useState(0);
  const { loading, run, data: scheduleListRes } = useRequest(schedule.getList, { manual: true });
  const { scrollIntoViewId, setScrollIntoViewId } = useScrollIntoView();
  const { data: roleListRes } = useRequest(common.getRoleList);
  const roleList = useMemo(() => {
    const roleRawList = roleListRes?.data?.filter(role => ![RoleType.ADMIN].includes(role.type) && !authLoading) || [];
    const currentAuthRoleIdx = roleRawList.findIndex(role => role.type === (auth?.role?.type || RoleType.GUEST));
    if (!!~currentAuthRoleIdx) {
      const [currentAuthRole] = roleRawList.splice(currentAuthRoleIdx, 1);
      roleRawList.unshift({ ...currentAuthRole, name: '我的' });
    };
    return roleRawList;
  }, [roleListRes, auth, authLoading]);
  const scheduleList = useMemo(
    () => (scheduleListRes?.data || []).filter(item => item.roles.find(role => role.type === roleList?.[roleIdx]?.type)),
    [scheduleListRes, roleIdx, roleList]
  );
  useDidShow(run);
  useEffect(() => {
    const target = scheduleList.find(item => getScheduleStatus(item.startTime, item.finishTime) === ScheduleStatus.HAPPENING) || scheduleList?.[0]
    target && setScrollIntoViewId(`id-${target.id}`);
    // eslint-disable-next-line
  }, [scheduleList]);

  return (
    <View className='wrapper'>
      <Tabs  className='role-tab' value={roleIdx} onChange={setRoleIdx}>
        {roleList.map(role => <Tabs.TabPane key={role.type} title={role.name} />)}
      </Tabs>
      <ScrollView
        className='list-wrapper'
        scrollY
        refresherEnabled
        scrollWithAnimation
        refresherBackground='#f5f5f5'
        refresherTriggered={loading}
        onRefresherRefresh={() => !loading && run()}
        scrollIntoView={scrollIntoViewId}
      >
        <View className='list-content'>
          {
            !!scheduleList.length
            ?
            <Timeline className='timeline' position='right'>
              {
                scheduleList.map(item => (
                  <Timeline.Item
                    key={item.id}
                    dot={statusDotMap[getScheduleStatus(item.startTime, item.finishTime)]}
                    id={`id-${item.id}`}
                  >
                    <ScheduleItem
                      {...item}
                      className='schedule-item'
                      onNavigate={() => {
                        const { addressLocation, addressName, addressDetail } = item;
                        if (addressLocation && addressName && addressDetail) {
                          openLocation({
                            longitude: addressLocation?.coordinates[0]!,
                            latitude: addressLocation?.coordinates[1]!,
                            name: addressName,
                            address: addressDetail
                          })
                        }
                      }}
                    />
                  </Timeline.Item>
                ))
              }
            </Timeline>
            :
            (
              !loading ? <Empty>
                <Empty.Image
                  className='empty-img'
                  src='https://img.yzcdn.cn/vant/custom-empty-image.png'
                />
                <Empty.Description>暂无数据</Empty.Description>
              </Empty> : null
            )
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default Index;
