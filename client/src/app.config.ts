import { Page, PackageAPage, PackageBPage } from './constants'

export default {
  pages: [
    Page.INDEX,
    Page.MAP_NAVIGATION,
    Page.CONTACTS,
    Page.MINE,
  ].map(page => page.replace(/^\//, '')),
  tabBar: {
    color: '#999',
    selectedColor: '#f18f45',
    list: [{
      pagePath: Page.INDEX,
      iconPath: './assets/images/home.png',
      selectedIconPath: './assets/images/home-active.png',
      text: '首页'
    }, {
      pagePath: Page.MAP_NAVIGATION,
      text: '导航',
      iconPath: './assets/images/navigation.png',
      selectedIconPath: './assets/images/navigation-active.png',
    }, {
      pagePath: Page.CONTACTS,
      text: '联系人',
      iconPath: './assets/images/concats.png',
      selectedIconPath: './assets/images/concats-active.png',
    }, {
      pagePath: Page.MINE,
      text: '我的',
      iconPath: './assets/images/mine.png',
      selectedIconPath: './assets/images/mine-active.png',
    }].map(item => ({ ...item, pagePath: item.pagePath.replace(/^\//, '') }))
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#f5f5f5',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f5f5'
  },
  subpackages: [
    {
      root: "package-a",
      pages: [
        PackageAPage.INVITATION,
      ].map(page => page.replace(/^\/package-a\//, '')),
      independent: true
    },
    {
      root: "package-b",
      pages: [
        PackageBPage.ROLE_CODE_MANAGEMENT,
        PackageBPage.NAVIGATION_MANAGEMENT,
        PackageBPage.NAVIGATION_FORM,
        PackageBPage.USER_LIST,
        PackageBPage.SCHEDULE_MANAGEMENT,
        PackageBPage.SCHEDULE_FORM,
        PackageBPage.MSG_PUSH,
      ].map(page => page.replace(/^\/package-b\//, '')),
    }
  ],
  cloud: true,
  requiredPrivateInfos: [
    'chooseLocation'
  ],
}
