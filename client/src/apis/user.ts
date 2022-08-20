import { cloud } from '@tarojs/taro';
import type { User } from '@/types';
import type { RoleType, UserListSortType } from '@/constants';
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

export interface GetUserListParam {
  /** 页码 */
  current?: number;
  /** 每页长度 */
  pageSize?: number;
  /** 唯一id $current 指当前用户 */
  id?: string | '$current';
  /** 角色类型 */
  roleType?: RoleType | '';
  /** 排序方式 */
  sortType?: UserListSortType;
}

interface UserListRes {
  /** 列表 */
  list: User[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  current: number;
  /** 每页长度 */
  pageSize: number;
}

/**
 * 获取 用户列表
 * @param data
 */
 export async function getList(data: GetUserListParam): Promise<UserListRes> {
  try {
    const { result } = await cloud.callFunction({
      name: "getUserList",
      data
    })!;
    const { errCode, errMsg, data: listRes } = result as ApiRes<UserListRes>;
    if (errCode || !listRes) throw new Error(errMsg || '获取列表失败！')
    return listRes!;
  } catch (err) {
    throw err instanceof Error ? err : new Error(err || '获取列表失败！');
  }
}
