import cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  // @ts-ignore
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * 保存用户信息
 * @param event 参数包含小程序端调用传入的 data
 * @param context
 */
export async function main(event: Record<string, unknown>) {
  try {
    const {
      avatarUrl,
      nickName,
      gender,
      roleCode,
    } = event;

    const { OPENID: openId } = cloud.getWXContext();
    const userInfo: Record<string, any> = {
      avatarUrl,
      nickName,
      gender,
      roleCode,
      openId
    }

    // @ts-ignore
    const transaction: cloud.DB.Database = await db.startTransaction();

    const { data: { 0: user } } = await db
      .collection('user')
      .where({ openId })
      .get() as any as cloud.DB.IQueryResult;

    // 如果用户已有角色，不可覆盖
    if (!roleCode || !!user?.roleCode) delete userInfo.roleCode;
    else {
      const { data: { 0: validCode } } = await db
        .collection('role-code')
        .where({ code: roleCode, inUse: false })
        .get() as cloud.DB.IQueryResult;

      // 角色验证码合法
      if (validCode) {
        await transaction.collection('role-code')
          .doc(validCode._id!)
          .update({ data: { inUse: true } })
      } else {
        delete userInfo.roleCode;
      }
    }

    if (user) {
      // 角色存在，直接更新
      await transaction.collection('user')
        .doc(user._id!)
        .update({ data: userInfo });
    } else {
      // 角色不存在，直接新增
      await transaction.collection('user').add({ data: {
        ...userInfo,
        createTime: db.serverDate(),
      } });
    }

    // @ts-ignore
    await transaction.commit();

    return {
      errCode: 0,
      errMsg: '',
      data: null
    }
  } catch (err) {
    return {
      errCode: 1,
      errMsg: err instanceof Error ? err.message : err,
      data: null,
    }
  }
}

