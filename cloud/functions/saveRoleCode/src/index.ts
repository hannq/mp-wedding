import cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  // @ts-ignore
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * 保存角色邀请码
 * @param event
 * @returns
 */
export async function main(event: Record<'roleType', string>) {
  try {
    const { roleType } = event;
    const { _id } = await db.collection('role-code')
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
      checkPath: true,
      // 生产环境记得改成 release
      envVersion: 'trial'
    });

    const { fileID } = await cloud.uploadFile({
      cloudPath: `${roleType}_${_id}.jpg`,
      fileContent: buffer,
    });

    await db.collection('role-code').doc(_id).update({ data: { codeFileID: fileID, code } });

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

