/** 主包 页面路径 */
export const enum Page {
  /** 首页 */
  INDEX = '/pages/index/index',
  /** 地图导航 */
  MAP_NAVIGATION = '/pages/map-navigation/index',
  /** 联系人 */
  CONTACTS = '/pages/contacts/index',
  /** 我的 */
  MINE = '/pages/mine/index',
}

/** 分包A 页面路径 */
export const enum PackageAPage {
  /** 请柬 */
  INVITATION = '/package-a/pages/invitation/index',
}

/** 分包B 页面路径 */
export const enum PackageBPage {
  /** 角色邀请码管理 */
  ROLE_CODE_MANAGEMENT = '/package-b/pages/role-code-management/index',
  /** 导航管理 */
  NAVIGATION_MANAGEMENT = '/package-b/pages/navigation-management/index',
  /** 导航表单 */
  NAVIGATION_FORM = '/package-b/pages/navigation-form/index',
  /** 用户列表 */
  USER_LIST = '/package-b/pages/user-list/index',
  /** 日程管理 */
  SCHEDULE_MANAGEMENT = '/package-b/pages/schedule-management/index',
  /** 日程表单 */
  SCHEDULE_FORM = '/package-b/pages/schedule-form/index',
  /** 消息推送 */
  MSG_PUSH = '/package-b/pages/msg-push/index',
}

/** Storage 存储数据的 key */
export const enum StorageKey {
  /** 用户信息 */
  AUTH = 'STORAGE:AUTH',
}

/** 角色类型 */
export const enum RoleType {
  /** 管理员 */
  ADMIN = 'admin',
  /** 新郎 */
  BRIDEGROOM = 'bridegroom',
  /** 新娘 */
  BRIDE = 'bride',
  /** 伴郎 */
  GROOMSMAN = 'groomsman',
  /** 伴娘 */
  BRIDESMAID = 'bridesmaid',
  /** 主办方 */
  SPONSOR = 'sponsor',
  /** 来宾 */
  GUEST = 'guest',
  /** 贵宾 */
  VIP = 'vip',
}

/** 用户列表排序方式 */
export const enum UserListSortType {
  ROLE_TYPE = 'ROLE_TYPE',
  CREATE_TIME = 'CREATE_TIME'
}
