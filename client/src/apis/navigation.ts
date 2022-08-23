import { cloud } from '@tarojs/taro';
import type { Navigation } from '@/types';
import type { ApiRes } from '../apis/types';

interface SaveNavigationParam extends Omit<Navigation, 'id'> {
  /** 唯一 ID */
  id?: string;
}

/**
 * 保存导航信息
 * @param data 更新信息
 */
export async function save(data: SaveNavigationParam): Promise<ApiRes<void>> {
  try {
    const { result } = await cloud.callFunction({
      name: "saveNavigation",
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
 * 删除保存导航信息
 * @param id
 */
export async function del(id: string): Promise<ApiRes<void>> {
  try {
    const { result } = await cloud.callFunction({
      name: "delNavigation",
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

/**
 * 获取导航列表
 */
 export async function get(id: string): Promise<ApiRes<Navigation>> {
  try {
    const { list } = await cloud.database()
      .collection('navigation')
      .aggregate()
      .match({ _id: id })
      .addFields({
        id: '$_id'
      })
      .project({ _id: 0 })
      .end() as any;
    const target = list?.[0];
    if (!target) throw new Error('获取导航失败！');
    return {
      errCode: 0,
      errMsg: '',
      data: target
    } as ApiRes<Navigation>;
  } catch (err) {
    return {
      errCode: 1,
      errMsg: (err instanceof Error ? err.message : err) || '获取导航失败！',
      data: null
    }
  }
}

/**
 * 获取导航列表
 */
export async function getList(): Promise<ApiRes<Navigation[]>> {
  try {
    const { list } = await cloud.database()
      .collection('navigation')
      .aggregate()
      .addFields({
        id: '$_id'
      })
      .project({ _id: 0 })
      .end() as any;
    return {
      errCode: 0,
      errMsg: '',
      data: list
    } as ApiRes<Navigation[]>;
  } catch (err) {
    return {
      errCode: 1,
      errMsg: (err instanceof Error ? err.message : err) || '获取导航列表失败！',
      data: null
    }
  }
}
