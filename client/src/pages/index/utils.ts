import dayjs from 'dayjs';
import { ScheduleStatus } from './constants';

/**
 * 获取日程的状态
 * @param startTime 开始时间
 * @param finishTime 完成时间
 */
export function getScheduleStatus(startTime: string | Date, finishTime: string | Date): ScheduleStatus {
  const current = dayjs();
  const start = dayjs(startTime);
  const finish = dayjs(finishTime);
  if (current.isBefore(start)) return ScheduleStatus.NOT_STARTED;
  else if (current.isAfter(finish)) return ScheduleStatus.FINISHED;
  else if (current.isAfter(start) && current.isBefore(finish)) return ScheduleStatus.HAPPENING;
  else return ScheduleStatus.NOT_STARTED
}
