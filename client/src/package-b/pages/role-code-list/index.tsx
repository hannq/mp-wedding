import { useMemo, type FC } from 'react';
import { useDidShow, showToast } from '@tarojs/taro';
import { View, ScrollView, Picker } from '@tarojs/components';
import { Button, SafeArea } from "@taroify/core";
import { Plus } from "@taroify/icons";
import { useRequest } from "ahooks";
import { roleCode, common } from "@/apis";
import { RoleCodeItem } from "./components/role-code-item";
import './index.less';

export const Invitation: FC = () => {
  const { data: roleListRes } = useRequest(common.getRoleList);
  const { loading, run, data: roleCodeListRes } = useRequest(roleCode.getList, { manual: true });
  const roleList = useMemo(() => roleListRes?.data || [], [roleListRes]);
  const roleCodeList = useMemo(() => roleCodeListRes?.data || [], [roleCodeListRes]);

  useDidShow(run);

  return (
    <View className='wrapper'>
      <ScrollView
        className='list-wrapper'
        scrollY
        enhanced
        refresherEnabled
        refresherBackground='#f5f5f5'
        refresherTriggered={loading}
        showScrollbar={false}
        onRefresherRefresh={run}
      >
        <View className='list-content'>
          {!!roleCodeList.length ? roleCodeList.map(item => (
            <RoleCodeItem {...item} key={item.id} />
          )) : <View>暂无数据</View> }
        </View>
      </ScrollView>
      <View className='action-btn-wrapper'>
        <Picker
          range={roleList}
          rangeKey='name'
          onChange={async e => {
            await roleCode.save(roleList[e.detail.value as number].type);
            showToast({ title: '创建成功' });
            run();
          }}
        >
          <Button
            block
            color='primary'
            icon={<Plus />}
          >
            新增角色邀请码
          </Button>
        </Picker>
        <SafeArea position='bottom' />
      </View>
    </View>
  )
}

export default Invitation;
