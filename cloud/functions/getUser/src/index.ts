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
 * 根据 openId 获取 用户信息
 * @param event
 * @returns
 */
export async function main(event: Record<'openId', string>) {
  try {
    const openId = event.openId || cloud.getWXContext().OPENID;
    const { list } = await db
      .collection('user')
      .aggregate()
        .match({ openId })
        .lookup({
          from: 'role-code',
          localField: 'roleCode',
          foreignField: 'code',
          as: 'vc',
        })
        .lookup({
          from: 'role',
          let: {
            vc: $.arrayElemAt(['$vc', 0]),
          },
          // @ts-ignore
          pipeline: $.pipeline()
            // @ts-ignore
            .match(_.expr($.eq(['$type', '$$vc.roleType'])))
            .done(),
          as: 'rl',
        })
        .addFields({
          role: $.arrayElemAt(['$rl', 0])
        })
        .project({
          vc: 0,
          rl: 0,
          roleCode: 0,
          'role._id': 0
        })
        .end() as cloud.DB.IAggregateResult

    if (!list.length) throw new Error(`用户不存在 ！`);
    else return {
      errCode: 0,
      errMsg: '',
      data: list[0] || null,
    }

  } catch (err) {
    return {
      errCode: 1,
      errMsg: err instanceof Error ? err.message : err,
      data: null,
    }
  }
}

