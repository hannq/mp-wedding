import cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  // @ts-ignore
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * 保存导航信息
 * @param event
 * @returns
 */
export async function main(event: Record<string, any>) {
  try {
    const {
      id,
      isLocal,
      destinationName,
      destinationAddress,
      destinationLocation,
      transport,
      rate,
      desc
    } = event;
    const navigation = {
      isLocal,
      destinationName,
      destinationAddress,
      destinationLocation,
      transport,
      rate,
      desc
    };
    if (id) {
      await db.collection('navigation').doc(id).update({ data: navigation })
    } else {
      await db.collection('navigation').add({ data: navigation })
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
