import { cloud } from '@tarojs/taro';
import type { RoleCode } from '@/types';
import type { ApiRes } from '../apis/types';

interface SaveRoleCodeParam extends Partial<Omit<RoleCode, 'role' | 'user'>> {
  /** 角色类型 */
  roleType?: string;
}

/**
 * 保存角色邀请码信息
 * @param data 更新信息
 */
export async function save(data: SaveRoleCodeParam): Promise<ApiRes<RoleCode>> {
  try {
    const { result } = await cloud.callFunction({
      name: "saveRoleCode",
      data
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
 * 保存角色邀请码信息
 * @param id
 */
export async function del(id: string): Promise<ApiRes<void>> {
  try {
    const { result } = await cloud.callFunction({
      name: "delRoleCode",
      data: { id }
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


interface GetRoleCodeListParam extends Partial<Omit<RoleCode, 'role' | 'user' | 'codeFileID'>> {
}

/**
 * 获取角色邀请码列表
 */
export async function getList(data: GetRoleCodeListParam = {}): Promise<ApiRes<RoleCode[]>> {
  try {
    const { result } = await cloud.callFunction({
      name: "getRoleCodeList",
      data
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
