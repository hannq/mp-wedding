import { useMemo, type FC } from 'react';
import { useDidShow, showToast, showModal, showLoading, hideLoading, navigateTo, openLocation } from '@tarojs/taro';
import { View, ScrollView, } from '@tarojs/components';
import { Button, SafeArea, Empty } from "@taroify/core";
import { Plus } from "@taroify/icons";
import { useRequest } from "ahooks";
import { navigation } from "@/apis";
import { PackageBPage } from "@/constants";
import { useShare } from "@/hooks/useShare";
import { NavigationItem } from "./components/navigation-item";
import './index.less';

export const Invitation: FC = () => {
  const { loading, run, data: navigationListRes } = useRequest(navigation.getList, { manual: true });
  const navigationList = useMemo(() => navigationListRes?.data || [], [navigationListRes]);

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
            !!navigationList.length
            ?
            navigationList.map(item => (
              <NavigationItem
                {...item}
                key={item.id}
                onDel={async () => {
                  const { confirm } = await showModal({ title: '删除确认', content: '确定要删除吗！' })
                  if (confirm) {
                    showLoading({ title: '正在删除 ...', mask: true });
                    const { errCode, errMsg } = await navigation.del(item.id);
                    hideLoading();
                    if (errCode) {
                      showToast({ title: errMsg, icon: 'error' });
                    } else {
                      await showToast({ title: '删除成功！' });
                      run();
                    }
                  }
                }}
                onEdit={() => navigateTo({ url: `${PackageBPage.NAVIGATION_FORM}?id=${item.id || ''}` })}
                onNavigate={() => openLocation({
                  longitude: item.destinationLocation.coordinates[0],
                  latitude: item.destinationLocation.coordinates[1],
                  name: item.destinationName,
                  address: item.destinationAddress
                })}
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
          onClick={() => navigateTo({ url: PackageBPage.NAVIGATION_FORM })}
        >
          新增导航
        </Button>
        <SafeArea position='bottom' />
      </View>
    </View>
  )
}

export default Invitation;
