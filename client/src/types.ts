import { type UserInfo } from '@tarojs/taro';
import type { RoleType } from './constants';

/** 角色码 */
export interface RoleCode {
  /** 唯一 id */
  id: string;
  /** 当前角色码是否在使用中 */
  inUse: boolean;
  /** 绑定角色 */
  role: Role;
  /** 绑定角色 */
  user?: Omit<User, 'role'>;
}

/** 角色 */
export interface Role {
  /** 角色名称 */
  name: string;
  /** 角色类型 */
  type: RoleType;
}

/** 用户信息 */
export interface User extends Pick<UserInfo, 'avatarUrl' | 'nickName' | 'gender'> {
  /** Role */
  role?: Role;
}
