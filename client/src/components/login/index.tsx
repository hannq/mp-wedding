import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

export default class Index extends Component {
  state = {
    context: {},
    context2: {}
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getLogin = () => {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {}
      })
      .then(res => {
        this.setState({
          context: res.result
        })
      })
  }

  getLogin2 = () => {
    Taro.cloud
      .callFunction({
        name: "login2",
        data: {}
      })
      .then(res => {
        this.setState({
          context2: res.result
        })
      })
  }

  render() {
    return (
      <View>
        <View className='index'>
          <Button onClick={this.getLogin}>获取登录云函数</Button>
          <Text>context：{JSON.stringify(this.state.context)}</Text>
        </View>
        <View className='index'>
          <Button onClick={this.getLogin2}>获取登录云函数2</Button>
          <Text>context2：{JSON.stringify(this.state.context2)}</Text>
        </View>
      </View>
    )
  }
}
