import { useMemo, type FC } from 'react';
import { useDidShow, showToast, showModal, showLoading, hideLoading, navigateTo, openLocation } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { Button, SafeArea, Empty } from "@taroify/core";
import { Plus } from "@taroify/icons";
import { useRequest } from "ahooks";
import { schedule, } from "@/apis";
import { useShare } from "@/hooks/useShare";
import { PackageBPage } from '@/constants';
import { ScheduleItem } from "./components/schedule-item";
import './index.less';

export const Invitation: FC = () => {
  const { loading, run, data: scheduleListRes } = useRequest(schedule.getList, { manual: true });
  const scheduleList = useMemo(() => scheduleListRes?.data || [], [scheduleListRes]);

  useDidShow(run);
  useShare();

  return (
    <View className='wrapper'>
      <ScrollView
        className='list-wrapper'
        scrollY
        refresherEnabled
        refresherBackground='#f5f5f5'
        refresherTriggered={loading}
        onRefresherRefresh={() => !loading && run()}
      >
        <View className='list-content'>
          {
            !!scheduleList.length
            ?
            scheduleList.map(item => (
              <ScheduleItem
                {...item}
                key={item.id}
                onDel={async () => {
                  const { confirm } = await showModal({ title: '删除确认', content: '删除后已绑定的用户会丢失角色！' })
                  if (confirm) {
                    showLoading({ title: '正在删除 ...', mask: true });
                    const { errCode, errMsg } = await schedule.del(item.id);
                    hideLoading();
                    if (errCode) {
                      showToast({ title: errMsg, icon: 'error' });
                    } else {
                      await showToast({ title: '删除成功！' });
                      run();
                    }
                  }
                }}
                onEdit={() => navigateTo({ url: `${PackageBPage.SCHEDULE_FORM}?id=${item.id}` })}
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
            ))
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
      <View className='action-btn-wrapper'>
        <Button
          block
          color='primary'
          icon={<Plus />}
          onClick={() => navigateTo({ url: PackageBPage.SCHEDULE_FORM })}
        >
          新增日程
        </Button>
        <SafeArea position='bottom' />
      </View>
    </View>
  )
}

export default Invitation;
