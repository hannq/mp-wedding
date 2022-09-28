import { type FC, useMemo, useEffect, useState } from 'react';
import { navigateTo, requestSubscribeMessage, showLoading, hideLoading, showToast } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Dialog, Avatar, Cell, Button } from '@taroify/core';
import { Arrow } from '@taroify/icons';
import { useShare, useAuth } from '@/hooks';
import { user } from '@/apis';
import { PackageAPage, PackageBPage, RoleType, MSG_TEMPLATE_ID } from '@/constants';
import avatarDefaultImg from '@/assets/images/avatar-default.png';
import './index.less';

export const Index: FC = () => {
  useShare();
  const [openModal, setOpenModal] = useState(false);
  const { auth } = useAuth();
  const showManageEntry = useMemo(() => [RoleType.ADMIN, RoleType.BRIDEGROOM, RoleType.BRIDE].includes(auth?.role?.type!), [auth]);

  useEffect(() => {
    if (auth && !auth?.pushMsgCount && !openModal) {
      setOpenModal(true);
    }
  }, [auth, openModal]);

  return (
    <View className='wrapper'>
      <View className='auth-info-wrapper'>
        <View className='left-wrapper'>
          <Avatar size='large' className='avatar' src={auth?.avatarUrl || avatarDefaultImg} />
        </View>
        <View className='right-wrapper'>
          <View className='nick-name'>{auth?.nickName || '未登录'}</View>
          <View className='role'>{auth?.role?.name || '宾客'}</View>
        </View>
      </View>
      <View className='link-wrapper'>
        <Cell
          clickable
          title='请柬'
          rightIcon={<Arrow />}
          onClick={() => navigateTo({ url: PackageAPage.INVITATION })}
        />
        {showManageEntry && <>
          <Cell
            clickable
            title='用户列表'
            rightIcon={<Arrow />}
            onClick={() => navigateTo({ url: PackageBPage.USER_LIST })}
          />
          <Cell
            clickable
            title='日程管理'
            rightIcon={<Arrow />}
            onClick={() => navigateTo({ url: PackageBPage.SCHEDULE_MANAGEMENT })}
          />
          <Cell
            clickable
            title='导航管理'
            rightIcon={<Arrow />}
            onClick={() => navigateTo({ url: PackageBPage.NAVIGATION_MANAGEMENT })}
          />
          <Cell
            clickable
            title='角色码管理'
            rightIcon={<Arrow />}
            onClick={() => navigateTo({ url: PackageBPage.ROLE_CODE_MANAGEMENT })}
          />
          <Cell
            clickable
            title='消息推送'
            rightIcon={<Arrow />}
            onClick={() => navigateTo({ url: PackageBPage.MSG_PUSH })}
          />
        </>}
      </View>
      <Dialog open={openModal}>
        <Dialog.Header>接收婚礼消息</Dialog.Header>
        <Dialog.Content>我们希望能透过小程序给你推送最新的婚礼消息</Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setOpenModal(false)}>取消</Button>
          <Button
            className='ok-btn'
            onClick={async () => {
              setOpenModal(false);
              try {
                const subscribeMessageRes = await requestSubscribeMessage?.({ tmplIds: [MSG_TEMPLATE_ID] });
                if (subscribeMessageRes?.[MSG_TEMPLATE_ID] === "accept") {
                  showLoading({ title: '加载中 ...', mask: true });
                  await user.save({ pushMsgCount: (auth?.pushMsgCount || 0) + 1 });
                  await hideLoading();
                  await showToast({ title: '订阅成功', icon: 'none' });
                }
              } catch (err) {
                console.error(err);
                await showToast({ title: '订阅失败', icon: 'error' });
              }
            }}
          >确认</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}

export default Index;
