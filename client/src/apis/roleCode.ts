import { cloud } from '@tarojs/taro';
import type { RoleCode } from '@/types';
import type { ApiRes } from '../apis/types';

/**
 * 保存用户信息
 * @param roleType 角色类型
 * @returns
 */
export async function save(roleType: string): Promise<ApiRes<RoleCode>> {
  try {
    const { result } = await cloud.callFunction({
      name: "saveRoleCode",
      data: { roleType }
    });
    return result as ApiRes<RoleCode>;
  } catch (err) {
    return {
      errCode: 1,
      errMsg: (err instanceof Error ? err.message : err) || '保存用户信息失败！',
      data: null
    }
  }
}

/**
 * 获取角色邀请码列表
 */
export async function getList(): Promise<ApiRes<RoleCode[]>> {
  try {
    const { result } = await cloud.callFunction({
      name: "getRoleCodeList",
    });
    return result as ApiRes<RoleCode[]>;
  } catch (err) {
    return {
      errCode: 1,
      errMsg: (err instanceof Error ? err.message : err) || '获取邀请码列表失败！',
      data: null
    }
  }
}
