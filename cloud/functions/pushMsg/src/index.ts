import cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  // @ts-ignore
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/** 小程序模版ID */
const TEMPLATE_ID = '40DN4h2ks6v2i4oZb9mp_euR33IO-49xRauKkYBTIWM';
/**
 * 保存导航信息
 * @param event
 * @returns
 */
export async function main(event: Record<string, string>, context: any) {
  const isProd = context?.namespace?.includes('-prod');
  try {
    const {
      tips,
      name,
      startTime,
      address,
    } = event;

    const { data } = await db.collection('user')
      .where({ pushMsgCount: _.gt(0) })
      .get() as cloud.DB.IQueryResult;

    await Promise.all(data.map(async user => {
      await cloud.openapi.subscribeMessage.send({
        touser: user.openId,
        page: 'pages/map-navigation/index',
        lang: 'zh_CN',
        templateId: TEMPLATE_ID,
        // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
        miniprogramState: isProd ? 'formal' : 'trial',
        data: {
          thing1: {
            value: tips
          },
          thing2: {
            value: name
          },
          date3: {
            value: startTime
          },
          thing6: {
            value: address
          }
        }
      })
      .then(() => db.collection('user')
        .doc(user._id!)
        .update({
          data: {
            pushMsgCount: Math.max((user.pushMsgCount || 0) - 1, 0)
          }
        })
      )
      .catch((err: unknown) => {
        if (err instanceof Error && err.message.includes(`43101`)) {
          return db.collection('user')
            .doc(user._id!)
            .update({
              data: {
                pushMsgCount: 0
              }
            })
        } else throw err;
      })
    }));

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

