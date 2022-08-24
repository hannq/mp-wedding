import { cloud } from '@tarojs/taro';
import type { User } from '@/types';
import type { RoleType, UserListSortType } from '@/constants';
import type { ApiRes } from '../apis/types';

interface SaveUserParam extends Partial<Omit<User, 'role' | 'createTime'>> {
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
 * 获取当前用户信息
 */
export async function getAuth(): Promise<ApiRes<User>> {
  try {
    const { result } = await cloud.callFunction({
      name: 'getUserList',
      data: { id: '$current' }
    });
    return result as ApiRes<User>;
  } catch (err) {
    return {
      errCode: 1,
      errMsg: (err instanceof Error ? err.message : err) || '获取用户信息失败！',
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
  id?: '$current' | string;
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
 export async function getList(data: GetUserListParam = {}): Promise<UserListRes> {
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
