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
 * 保存角色邀请码
 * @param event
 * @returns
 */
export async function main(event: Record<'roleType' | 'id', string> & { inUse: false }) {
  try {
    const { inUse, roleType, id } = event;

    // @ts-ignore
    const transaction: cloud.DB.Database = await db.startTransaction();

    if (id) {
      // update

      const updateData = { roleType, inUse } as Record<string , unknown>;
      if (inUse !== false) delete updateData.inUse;
      if (!roleType) delete updateData.roleType;

      await Promise.all([
        transaction.collection('role-code')
          .doc(id)
          .update({ data: updateData }),
        'inUse' in updateData && db.collection('role-code')
          .aggregate()
          .match({ _id: id, inUse: true })
          .lookup({
            from: 'user',
            localField: 'code',
            foreignField: 'roleCode',
            as: 'ul'
          })
          .addFields({
            user: $.arrayElemAt(['$ul', 0]),
          })
          .project({ ul: 0 })
          .end()!
          .then(({ list: { 0: roleCode } }) => {
            const userId = roleCode?.user?._id;
            if (userId) {
              return transaction.collection('user').doc(userId).update({ data: { roleCode: '' } }) as any;
            }
          })
      ])

    } else {
      // create

      const { _id } = await transaction.collection('role-code')
        .add({
          data: {
            roleType,
            inUse: false,
          }
        }) as cloud.DB.IAddResult;
      const code = String(_id).slice(-6);
      const { buffer } = await cloud.openapi.wxacode.getUnlimited({
        page: 'package-a/pages/invitation/index',
        scene: `roleCode=${code}`,
        // 检查 page 是否存在，为 true 时 page 必须是已经发布的小程序存在的页面（否则报错）；为 false 时允许小程序未发布或者 page 不存在， 但 page 有数量上限（60000个）请勿滥用
        checkPath: false,
        // 生产环境记得改成 release
        envVersion: 'trial'
      });

      const { fileID } = await cloud.uploadFile({
        cloudPath: `${roleType}_${_id}.jpg`,
        fileContent: buffer,
      });

      await transaction.collection('role-code').doc(_id).update({ data: { codeFileID: fileID, code } });

    }

    // @ts-ignore
    await transaction.commit();

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

