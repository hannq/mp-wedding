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

const sortKeyMap: Record<string, string> = {
  CREATE_TIME: 'createTime',
  ROLE_TYPE: 'role.type',
}

/**
 * 获取 用户列表
 * @param event
 */
export async function main(event: Record<string, string>) {
  try {
    const _id = event.id === '$current' ? void(0) : event.id;
    const isContacts = typeof event.isContacts !== 'boolean' ? void(0) : event.isContacts;
    const openId = event.id === '$current' ? cloud.getWXContext().OPENID : void(0);
    const pageSize = +event.pageSize || 10;
    const current = +event.current || 0;
    const limit = pageSize;
    const skip = current * limit;
    const filter = { openId, _id, isContacts };
    Object.keys(filter)
      .forEach(key => {
        // @ts-ignore
        if (typeof filter[key] === 'undefined') delete filter[key];
      });
    const [{ list }, { list: totalRes }] = await Promise.all([ //  { list: { 0: { total } } }
      db.collection('user')
        .aggregate()
          .match(filter)
          .lookup({
            from: 'role-code',
            localField: 'roleCode',
            foreignField: 'code',
            as: 'rcl',
          })
          .lookup({
            from: 'role',
            let: {
              rc: $.arrayElemAt(['$rcl', 0]),
            },
            // @ts-ignore
            pipeline: $.pipeline()
              // @ts-ignore
              .match(_.expr($.and([
                $.eq(['$type', '$$rc.roleType']),
              ].filter(Boolean))))
              .done(),
            as: 'rl',
          })
          .addFields({
            role: $.arrayElemAt(['$rl', 0]),
            id: '$_id'
          })
          .project({
            _id: 0,
            openId: 0,
            rcl: 0,
            rl: 0,
            roleCode: 0,
            'role._id': 0,
            'role.canInvited': 0
          })
          .match(
            // @ts-ignore
            _.expr($.and([
              !!event.roleType && $.eq(['$role.type', event.roleType]),
            ].filter(Boolean)))
          )
          .sort({
            [sortKeyMap[event.sortType] || 'nickName']: -1
          })
          .skip(skip)
          .limit(limit)
          .end()!,

      db.collection('user')
        .aggregate()
        .match(filter)
        .lookup({
          from: 'role-code',
          localField: 'roleCode',
          foreignField: 'code',
          as: 'rcl',
        })
        .project({
          rc: $.arrayElemAt(['$rcl', 0])
        })
        .match(
          // @ts-ignore
          _.expr($.and([
            !!event.roleType && $.eq(['$rc.roleType', event.roleType])
          ].filter(Boolean)))
        )
        .count('total')
        .end()!
    ]);

    return {
      errCode: 0,
      errMsg: '',
      data: {
        list,
        total: totalRes?.[0]?.total || 0,
        pageSize,
        current,
      },
    }

  } catch (err) {
    return {
      errCode: 1,
      errMsg: err instanceof Error ? err.message : err,
      data: null,
    }
  }
}

