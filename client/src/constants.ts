/** 主包 页面路径 */
export const enum Page {
  /** 首页 */
  INDEX = 'pages/index/index',
}

/** 分包A 页面路径 */
export const enum PackageAPage {
  /** 请柬 */
  INVITATION = 'pages/invitation/index',
}

/** 分包B 页面路径 */
export const enum PackageBPage {
  /** 请柬 */
  ROLE_CODE_LIST = 'pages/role-code-list/index',
}



/** Storage 存储数据的 key */
export const enum StorageKey {
  /** 用户信息 */
  AUTH = 'STORAGE:AUTH',
}

/** 角色类型 */
export const enum RoleType {
  /** 新郎 */
  BRIDEGROOM = 'BRIDEGROOM',
  /** 新娘 */
  BRIDE = 'BRIDE',
  /** 伴郎 */
  GROOMSMAN = 'GROOMSMAN',
  /** 伴娘 */
  BRIDESMAID = 'BRIDESMAID',
  /** 主办方 */
  SPONSOR = 'SPONSOR',
  /** 来宾 */
  GUEST = 'GUEST',
}