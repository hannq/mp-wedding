import cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  // @ts-ignore
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const $ = db.command.aggregate;
const _ = db.command;

/**
 * 保存导航信息
 * @param event
 * @returns
 */
export async function main(event: Record<'id', string>) {
  try {
    const { id } = event;
    const { list } = await db.collection('schedule')
      .aggregate()
      .match({ _id: id })
      .lookup({
        from: 'role',
        let: {
          schedule_roles: '$roles',
        },
        // @ts-ignore
        pipeline: $.pipeline()
          // @ts-ignore
          .match(_.expr($.in(['$type', '$$schedule_roles'])))
          .done(),
        as: 'roleInfos'
      })
      .addFields({
        id: '$_id',
        roles: '$roleInfos'
      })
      .project({
        _id: 0,
        roleInfos: 0
      })
      .limit(99999)
      .sort({
        startTime: -1
      })
      .end()!;

    return {
      errCode: 0,
      errMsg: '',
      data: list,
    }
  } catch (err) {
    return {
      errCode: 1,
      errMsg: err instanceof Error ? err.message : err,
      data: null,
    }
  }
}

