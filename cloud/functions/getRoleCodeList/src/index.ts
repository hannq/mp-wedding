import cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  // @ts-ignore
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const $ = db.command.aggregate;

/**
 * 根据 openId 获取 用户信息
 * @param event
 * @returns
 */
export async function main() {
  try {
    const { list } = await db.collection('role-code')
      .aggregate()
      .lookup({
        from: 'role',
        localField: 'roleType',
        foreignField: 'type',
        as: 'rl'
      })
      .lookup({
        from: 'user',
        localField: 'code',
        foreignField: 'roleCode',
        as: 'ul'
      })
      .addFields({
        role: $.arrayElemAt(['$rl', 0]),
        user: $.arrayElemAt(['$ul', 0]),
        id: '$_id'
      })
      .project({
        rl: 0,
        ul: 0,
        _id: 0,
        roleType: 0,
        'user._id': 0,
        'role._id': 0,
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

