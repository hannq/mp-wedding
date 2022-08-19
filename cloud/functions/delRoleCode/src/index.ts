import cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  // @ts-ignore
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const $ = db.command.aggregate;
// const _ = db.command;

/**
 * 根据 openId 获取 用户信息
 * @param event
 * @returns
 */
export async function main(event: Record<'id', string>) {
  try {
    const { id } = event;
    const { list: { 0 : roleCode } } = await db.collection('role-code')
      .aggregate()
      .match({ _id: id })
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
      })
      .project({
        rl: 0,
        ul: 0,
      })
      .end()!;

    if (!roleCode) {
      console.error(`id not found: ${id}`);
      throw new Error(`指定角色邀请码未找到！`);
    }

    // @ts-ignore
    const transaction: cloud.DB.Database = await db.startTransaction();

    await Promise.all([
      !!roleCode.user && transaction
        .collection('user')
        .doc(roleCode.user._id)
        .update({ data: { roleCode: '' } }),
      transaction
        .collection('role-code')
        .doc(roleCode._id)
        .remove(),
    ]);

    await cloud.deleteFile({ fileList: [roleCode.codeFileID] })

    // @ts-ignore
    await transaction.commit();

    return {
      errCode: 0,
      errMsg: '',
      data: roleCode,
    }

  } catch (err) {
    console.error(err);
    return {
      errCode: 1,
      errMsg: err instanceof Error ? err.message : err,
      data: null,
    }
  }
}

