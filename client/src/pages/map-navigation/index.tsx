import { useMemo, type FC } from 'react';
import { useDidShow, openLocation } from '@tarojs/taro';
import { View, ScrollView, Text } from '@tarojs/components';
import { Button, Collapse, Tag, Rate, Empty } from "@taroify/core";
import { Location, GuideOutlined } from "@taroify/icons";
import { useRequest } from "ahooks";
import groupby from "lodash.groupby";
import { navigation } from "@/apis";
import type { Navigation } from "@/types";
import { useShare } from "@/hooks/useShare";
import './index.less';

export const Invitation: FC = () => {
  const { loading, run, data: navigationListRes } = useRequest(navigation.getList, { manual: true });
  const navigationGroupList = useMemo(
    () => Object.entries(groupby(navigationListRes?.data || [], 'transport')) as readonly [string,  Navigation[]][],
    [navigationListRes]
  );

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
            !!navigationGroupList.length
              ?
              navigationGroupList.map(([transport, navigationList], idx) => (
                <View key={idx}>
                  <View className='transport-cell'>{transport}</View>
                  <Collapse defaultValue={[]}>
                    {
                      navigationList.map(item => (
                        <Collapse.Item
                          clickable
                          key={item.id}
                          className='navigation-item'
                          title={(
                            <View className='title'>
                              <View className='destination-info'>
                                <Location />
                                <Tag variant='outlined' color={item.isLocal ? 'info' : 'warning'}>{item.isLocal ? '南堡内' : '外地'}</Tag>
                                <Text className='destination-name'>{item.destinationName}</Text>
                              </View>
                              <Button
                                size='small'
                                variant='text'
                                icon={<GuideOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openLocation({
                                    longitude: item.destinationLocation.coordinates[0],
                                    latitude: item.destinationLocation.coordinates[1],
                                    name: item.destinationName,
                                    address: item.destinationAddress
                                  })
                                }}
                              >导航</Button>
                            </View>
                          )}
                          brief={(
                            <View className='destination-address-wrapper'>
                              <View className='destination-address'>{item.destinationAddress}</View>
                              <Rate
                                className='rate-color'
                                value={item.rate}
                                readonly
                                size={12}
                              />
                            </View>
                          )}
                          expandIcon={null}
                        >
                          {item.desc || ''}
                        </Collapse.Item>
                      ))
                    }
                  </Collapse>
                </View>
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
    </View>
  )
}

export default Invitation;
