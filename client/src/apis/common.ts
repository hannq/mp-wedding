import { cloud } from '@tarojs/taro';
import type { Role, Message } from '@/types';
import type { ApiRes } from '../apis/types';

/**
 * 获取角色邀请码列表
 */
export async function getRoleList(): Promise<ApiRes<Role[]>> {
  try {
    const db = cloud.database();
    const { data } = await db.collection('role').where({ canInvited: true }).get()
    return {
      errCode: 0,
      errMsg: '',
      data: data
    } as ApiRes<Role[]>;
  } catch (err) {
    return {
      errCode: 1,
      errMsg: (err instanceof Error ? err.message : err) || '获取邀请码列表失败！',
      data: null
    }
  }
}

/**
 * 推送消息
 * @param data
 */
export async function pushMsg(data: Message): Promise<ApiRes<void>> {
  try {
    await cloud.callFunction({
      name: "pushMsg",
      data
    });
    return {
      errCode: 0,
      errMsg: '',
      data: null
    } as ApiRes<void>;
  } catch (err) {
    return {
      errCode: 1,
      errMsg: (err instanceof Error ? err.message : err) || '获取邀请码列表失败！',
      data: null
    }
  }
}
