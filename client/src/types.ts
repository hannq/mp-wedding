import type { UserInfo, DB } from '@tarojs/taro';
import type { RoleType } from './constants';

/** 角色码 */
export interface RoleCode {
  /** 唯一 id */
  id: string;
  /** 当前角色码是否在使用中 */
  inUse: boolean;
  /** 绑定角色 */
  role: Role;
  /** 码文件ID */
  codeFileID: string;
  /** 角色码 */
  code: string;
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
  /** 唯一 id */
  id: string;
  /** 角色 */
  role?: Role;
  /** 创建时间 */
  createTime: Date;
  /** 消息推送次数 */
  pushMsgCount: number;
}

export interface Navigation {
  /** 唯一 id */
  id: string;
  /** 是否本地 */
  isLocal: boolean;
  /** 目的地名称 */
  destinationName: string;
  /** 目的地详细地址 */
  destinationAddress: string;
  /** 目的地经经纬度 */
  destinationLocation: DB.IGeo.JSONPoint;
  /** 交通方式 */
  transport: string;
  /** 推荐等级 */
  rate: number;
  /** 描述信息 */
  desc: string;
}

/** 消息推送 */
export interface Message {
  /** 提示 */
  tips: string;
  /** 名称 */
  name: string;
  /** 开始时间 */
  startTime: string;
  /** 地址 */
  address: string;
}
