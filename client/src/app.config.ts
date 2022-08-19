import { Page, PackageAPage, PackageBPage } from './constants'

export default {
  pages: [
    Page.INDEX,
  ].map(page => page.replace(/^\//, '')),
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
      ].map(page => page.replace(/^\/package-b\//, '')),
    }
  ],
  cloud: true
}
