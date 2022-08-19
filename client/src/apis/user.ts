import { cloud } from '@tarojs/taro';
import type { User } from '@/types';
import type { ApiRes } from '../apis/types';

interface SaveUserParam extends Omit<User, 'role'> {
  /** 角色邀请码 */
  roleCode?: string;
}

/**
 * 保存用户信息
 * @param data 用于保存的用户信息
 * @returns
 */
export async function save(data: SaveUserParam): Promise<ApiRes<void>> {
  try {
    const { result } = await cloud.callFunction({
      name: "saveUser",
      data
    });
    return result as ApiRes<void>;
  } catch (err) {
    return {
      errCode: 1,
      errMsg: (err instanceof Error ? err.message : err) || '保存用户信息失败！',
      data: null
    }
  }
}

/**
 * 根据 openId 获取 用户信息
 * @param openId
 */
export async function get(openId: string = ''): Promise<ApiRes<User>> {
  try {
    const { result } = await cloud.callFunction({
      name: "getUser",
      data: { openId }
    });
    return result as ApiRes<User>;
  } catch (err) {
    return {
      errCode: 1,
      errMsg: (err instanceof Error ? err.message : err) || '保存用户信息失败！',
      data: null
    }
  }
}
