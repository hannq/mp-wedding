import { cloud } from '@tarojs/taro';
import dayjs from 'dayjs';
import type { Schedule } from '@/types';
import type { ApiRes } from './types';

interface SaveScheduleParam extends Omit<Schedule, 'id' | 'startTime'> {
  /** 唯一 ID */
  id?: string;
  /** 开始时间 */
  startTime: string;
}

/**
 * 保存日程信息
 * @param data 更新信息
 */
export async function save(data: SaveScheduleParam): Promise<ApiRes<void>> {
  try {
    const { result } = await cloud.callFunction({
      name: "saveSchedule",
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
      name: "delSchedule",
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
 * 获取日程信息
 */
export async function get(id: string): Promise<ApiRes<Schedule>> {
  try {
    const { result } = await cloud.callFunction({
      name: "getScheduleList",
      data: { id }
    });
    const target = (result as ApiRes<Schedule[]>).data?.map(schedule => ({
      ...schedule,
      startTime: dayjs(schedule.startTime).toDate()
    }))?.[0];
    if (!target) throw new Error('获取日程失败！');
    return {
      errCode: 0,
      errMsg: '',
      data: target
    } as ApiRes<Schedule>;
  } catch (err) {
    return {
      errCode: 1,
      errMsg: (err instanceof Error ? err.message : err) || '获取日程失败！',
      data: null
    }
  }
}

interface GetScheduleListParam {
  /** 唯一 ID */
  id?: string;
}

/**
 * 获取导航列表
 */
export async function getList(data: GetScheduleListParam = {}): Promise<ApiRes<Schedule[]>> {
  try {
    const { result } = await cloud.callFunction({
      name: "getScheduleList",
      data: { data }
    }) as any as { result: ApiRes<Schedule[]> };
    result.data = result.data?.map(schedule => ({
      ...schedule,
      startTime: dayjs(schedule.startTime).toDate()
    })) || [];
    return result as ApiRes<Schedule[]>;
  } catch (err) {
    return {
      errCode: 1,
      errMsg: (err instanceof Error ? err.message : err) || '获取日程列表失败！',
      data: null
    }
  }
}
