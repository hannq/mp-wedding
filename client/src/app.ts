import { Component, PropsWithChildren } from 'react'
import { cloudInit } from './utils'
import './app.less'

class App extends Component<PropsWithChildren> {

  componentDidMount () {
    cloudInit();
  }

  componentDidShow () {}

  componentDidHide () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
