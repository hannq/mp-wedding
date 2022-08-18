import { Page, PackageAPage, PackageBPage } from './constants'

export default {
  pages: [
    Page.INDEX,
  ],
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
      ],
      independent: true
    },
    {
      root: "package-b",
      pages: [
        PackageBPage.ROLE_CODE_LIST,
      ],
    }
  ],
  cloud: true
}
