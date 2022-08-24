import { type FC, useState, useMemo, useRef } from 'react';
import type { FormInstance } from '@taroify/core/form/form.shared';
import { useDidShow, showLoading, hideLoading, showToast } from '@tarojs/taro';
import { View, ScrollView, Text, Image } from '@tarojs/components';
import { Empty, Avatar, Tag, Loading, SafeArea, DropdownMenu, Button, Popup, Form, Field, Input } from "@taroify/core";
import { Phone, PhoneOutlined, PhoneCircleOutlined, FriendsOutlined } from "@taroify/icons";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import { user, common } from "@/apis";
import type { GetUserListParam } from "@/apis/user";
import { RoleType, UserListSortType } from "@/constants";
import type { User } from "@/types";
import genderUnknownIcon from '@/package-b/assets/images/gender-unknown.png'
import genderMaleIcon from '@/package-b/assets/images/gender-male.png'
import genderFemaleIcon from '@/package-b/assets/images/gender-female.png'
import './index.less';

type TagColor = "default" | "primary" | "info" | "success" | "warning" | "danger";

const genderIcon = {
  0: genderUnknownIcon,
  1: genderMaleIcon,
  2: genderFemaleIcon,
}

const roleTagColor: Record<RoleType, TagColor> = {
  [RoleType.ADMIN]: 'primary',
  [RoleType.BRIDEGROOM]: 'primary',
  [RoleType.BRIDE]: 'danger',
  [RoleType.GROOMSMAN]: 'info',
  [RoleType.BRIDESMAID]: 'success',
  [RoleType.SPONSOR]: 'warning',
  [RoleType.GUEST]: 'default',
}

interface UserInfoEditPopup extends User {
  /** 是否展示弹出层 */
  show: boolean;
}

export const UserList: FC = () => {
  const [param, setParam] = useState<GetUserListParam>({ pageSize: 10, current: 0 });
  const { data: roleListRes } = useRequest(common.getRoleList);
  const roleList = useMemo(() => roleListRes?.data || [], [roleListRes]);
  const [userList, setUserList] = useState<User[]>([]);
  const [freshing, setFreshing] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [userInfoEditPopup, setUserInfoEditPopup] = useState<UserInfoEditPopup | null>(null);
  const formRef = useRef<FormInstance>();
  const { run, loading } = useRequest(user.getList, {
    manual: true,
    onBefore(params) {
      const isRefresh = !params?.[0]?.current;
      if (isRefresh) {
        setFreshing(true);
      } else {
        setLoadingMore(true);
      }
    },
    onSuccess(data, params) {
      setParam(params![0]!);
      const isRefresh = !params?.[0]?.current;
      const currentList = (data?.list || []);
      setNoMoreData(Math.ceil(data.total / data.pageSize) <= data.current + 1)
      setUserList(prevUserList => isRefresh ? currentList : prevUserList.concat(currentList));
      if (isRefresh) {
        setFreshing(false);
      } else {
        setLoadingMore(false);
      }
    },
  });
  useDidShow(() => run(param));

  return (
    <View className='wrapper'>
      <DropdownMenu>
        <DropdownMenu.Item
          value={param.roleType || 'all'}
          onChange={(value: RoleType | 'all') => {
            setNoMoreData(false);
            run({ ...param, current: 0, roleType: !value || value === 'all' ? void(0) : value })
          }}
        >
          <DropdownMenu.Option value='all'>全部角色</DropdownMenu.Option>
          {roleList.map(role => (
            <DropdownMenu.Option
              value={role.type}
              key={role.type}
            >{role.name}</DropdownMenu.Option>
          ))}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          value={param.sortType || 'default'}
          onChange={(value: UserListSortType | 'default') => {
            setNoMoreData(false);
            run({ ...param, current: 0, sortType: !value || value === 'default' ? void(0) : value })
          }}
        >
          <DropdownMenu.Option value='default'>默认排序</DropdownMenu.Option>
          <DropdownMenu.Option value={UserListSortType.CREATE_TIME}>按创建时间排序</DropdownMenu.Option>
          <DropdownMenu.Option value={UserListSortType.ROLE_TYPE}>按角色排序</DropdownMenu.Option>
        </DropdownMenu.Item>
      </DropdownMenu>
      <ScrollView
        className='list-wrapper'
        scrollY
        refresherEnabled
        refresherBackground='#f5f5f5'
        refresherTriggered={freshing}
        onRefresherRefresh={() => {
          if (!loading) {
            setNoMoreData(false);
            run({
              pageSize: 10,
              current: 0,
            })
          }
        }}
        onScrollToLower={() => !noMoreData && !loading && run({
          pageSize: 10,
          current: param.current! + 1,
        })}
      >
        <View className='list-content'>
          {
            !!userList.length
            ?
            userList.map(userInfo => (
              <View className='list-item' key={userInfo.id}>
                <Avatar src={userInfo.avatarUrl} />
                <View className='right-wrapper'>
                  <View className='nick-name'>
                    <Image className='gender-icon' mode='aspectFit' src={genderIcon[userInfo.gender as any] || genderIcon[0]} />
                    <Text>{userInfo.nickName}</Text>
                    <Text className='create-time'>{dayjs(userInfo.createTime).format(`YYYY-MM-DD HH:mm:ss`)}</Text>
                  </View>
                  {userInfo.realName && <View className='real-name'>
                    <FriendsOutlined color='#999' size={12} />
                    <Text className='text'>{userInfo.realName}</Text>
                  </View>}
                  {userInfo.phoneNum && <View className='phone-num'>
                    <PhoneCircleOutlined color='#999' size={12} />
                    <Text className='text'>{userInfo.phoneNum}</Text>
                  </View>}
                  <Tag
                    variant={userInfo?.role?.type === RoleType.ADMIN ? 'contained' : 'outlined'}
                    color={roleTagColor[userInfo?.role?.type || RoleType.GUEST]}
                  >{userInfo?.role?.name || '宾客'}</Tag>
                </View>
                <Button
                  variant='text'
                  icon={userInfo?.isContacts ? <Phone size={24} color='primary' /> : <PhoneOutlined size={24} />}
                  onClick={async () => {
                    await showLoading({ title: '提交中 ...', mask: true });
                    if (!userInfo?.isContacts) {
                      if (!userInfo?.realName || !userInfo.phoneNum) {
                        setUserInfoEditPopup({
                          ...userInfo,
                          show: true
                        })
                      } else {
                        await user.save({
                          id: userInfo.id,
                          isContacts: true
                        })
                        setNoMoreData(false);
                        run({ ...param, current: 0, });
                      }
                    } else {
                      await user.save({
                        id: userInfo.id,
                        isContacts: false
                      })
                      setNoMoreData(false);
                      run({ ...param, current: 0, });
                    }
                    await hideLoading();
                  }}
                />
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
          {
          !noMoreData ?
            loadingMore &&
            (
              <View className='loading-wrapper'>
                <Loading>加载中 ...</Loading>
              </View>
            )
            :
            <View className='no-more-data-tips'>没有更多数据了～</View>
          }
          <SafeArea position='bottom' />
        </View>
      </ScrollView>
      <Popup
        rounded
        placement='bottom'
        open={!!userInfoEditPopup?.show}
        onClose={() => {
          setUserInfoEditPopup(info => ({ ...info!, show: false }));
          formRef.current?.reset();
        }}
      >
        <Popup.Close />
        <View className='popup-title'>完善信息</View>
        <Form
          className='form-wrapper'
          ref={formRef}
          onSubmit={async event => {
            try {
              const { realName, phoneNum } = event.detail.value as Pick<User, 'realName' | 'phoneNum'>;
              await showLoading({ title: '提交中 ...', mask: true });
              await user.save({
                id: userInfoEditPopup!.id,
                realName,
                phoneNum,
                isContacts: true
              })
              setUserInfoEditPopup(null);
              await showToast({ title: '保存成功!', icon: 'none' });
              setNoMoreData(false);
              run({ ...param, current: 0, })
            } catch (err) {
              console.error(err);
              await hideLoading();
              await showToast({ title: '保存失败!', icon: 'none' });
            }
          }}
        >
          <Field
            name='realName'
            label={{ align: "left", children: "真实姓名" }}
            rules={[{ required: true, message: "请填写用户真实姓名" }]}
          >
            <Input placeholder='请填写用户真实姓名' />
          </Field>
          <Field
            name='phoneNum'
            label={{ align: "left", children: "用户电话" }}
            rules={[{ required: true, message: "请填写用户电话号码" }]}
          >
            <Input placeholder='请填写用户电话号码' />
          </Field>
          <View style={{ margin: '16px' }}>
            <Button shape='round' block color='primary' formType='submit'>
              提交
            </Button>
          </View>
        </Form>
      </Popup>
    </View>
  )
}

export default UserList;
