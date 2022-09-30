import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import cloud = require('wx-server-sdk');

dayjs.extend(customParseFormat);

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  // @ts-ignore
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * 保存日程信息
 * @param event
 * @returns
 */
export async function main(event: Record<string, any>) {
  try {
    const {
      id,
      name,
      roles,
      startTime,
      finishTime,
      addressLocation,
      addressName,
      addressDetail,
      desc,
    } = event;

    console.log(startTime, finishTime)

    const schedule = {
      id,
      name,
      roles,
      startTime: dayjs(startTime, 'YYYY-MM-DD HH:mm').toDate(),
      finishTime: dayjs(finishTime, 'YYYY-MM-DD HH:mm').toDate(),
      addressLocation,
      addressName,
      addressDetail,
      desc,
    };
    if (id) {
      await db.collection('schedule').doc(id).update({ data: schedule })
    } else {
      await db.collection('schedule').add({ data: schedule })
    }

    return {
      errCode: 0,
      errMsg: '',
      data: null,
    }
  } catch (err) {
    return {
      errCode: 1,
      errMsg: err instanceof Error ? err.message : err,
      data: null,
    }
  }
}
