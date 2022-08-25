import { useMemo, type FC } from 'react';
import { View, Picker } from '@tarojs/components';
import { showLoading, hideLoading, showToast } from '@tarojs/taro';
import { SwipeCell, Image, Button } from '@taroify/core';
import { Share, Qr } from '@taroify/icons';
import { RoleCode, Role } from '@/types';
import { roleCode } from '@/apis';
import { useAuth } from '@/hooks';
import './index.less';

interface Props extends RoleCode {
  /** 可用角色列表 */
  roleList: Role[];
  /** 删除回调 */
  onDel(id: string): void;
  /** 解绑回调 */
  onReuse(id: string): void;
  /** 刷新列表 */
  onRefresh(): void;
  /** 展示二维码 */
  onShowQrCode(): void;
}

export const RoleCodeItem: FC<Props> = (props) => {
  const { roleList, inUse, onRefresh, onShowQrCode } = props;
  const { isAdmin } = useAuth();
  const editable = useMemo(() => isAdmin || (props.role.canInvited ?? true), [props.role.canInvited, isAdmin]) ;
  return (
    <View className='role-code-item-wrapper'>
      <SwipeCell disabled={!editable} className='swipe-cell'>
        <SwipeCell.Actions side='left'>
          <Picker
            className='edit-picker'
            range={roleList}
            rangeKey='name'
            onChange={async e => {
              showLoading({ title: '正在操作 ...', mask: true });
              const { errCode, errMsg } = await roleCode.save({
                id: props.id,
                roleType: roleList[e.detail.value as number].type
              });
              hideLoading();
              if (errCode) {
                console.error(errMsg);
                showToast({ title: '创建失败', icon: 'error' });
              } else {
                showToast({ title: '创建成功' });
                onRefresh?.()
              };
            }}
          >
            <Button
              variant='contained'
              shape='square'
              color='primary'
            >
              编辑
            </Button>
          </Picker>
        </SwipeCell.Actions>
        <View className='card'>
          <View className='left-content'>
            <Image className='icon' src='https://img01.yzcdn.cn/vant/ipad.jpeg' />
            <View>
              <View>{props?.role?.name}</View>
              {props.inUse && !!props.user && <View>使用者：{props.user?.nickName}</View>}
            </View>
          </View>
          <View className='right-content'>
            <Button
              variant='text'
              color='primary'
              openType='share'
              icon={<Share />}
              data-code={props.code}
            />
            <Button
              variant='text'
              color='primary'
              icon={<Qr />}
              onClick={onShowQrCode}
            />
          </View>
        </View>
        <SwipeCell.Actions side='right'>
          {inUse && <Button
            variant='contained'
            shape='square'
            color='warning'
            onClick={() => props.onReuse(props.id)}
          >
            解绑
          </Button>}
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

export default RoleCodeItem;
