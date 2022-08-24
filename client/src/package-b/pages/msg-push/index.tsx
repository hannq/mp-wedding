import { type FC, useRef, useMemo } from 'react';
import type { FormInstance } from '@taroify/core/form/form.shared';
import { showToast, showLoading, hideLoading, navigateBack, cloud, type DB, } from '@tarojs/taro';
import { View, Picker, Text } from '@tarojs/components';
import { Form, Cell, Field, Button, Input, Textarea, } from '@taroify/core';
import { ArrowRight, } from '@taroify/icons';
import { useRequest } from 'ahooks';
import { common, navigation } from '@/apis';
import { Message } from '@/types';
import './index.less';

interface FormData extends Omit<Message, 'startTime' | 'address'> {
  /** 时间 hh:mm */
  time: string;
  /** 日期 YYYY-MM-DD */
  date: string;
  /** 地址下标 */
  addressIdx: number;
}

export const Index: FC = () => {
  const formRef = useRef<FormInstance>();
  const { data } = useRequest(navigation.getList);
  const addressList = useMemo(() => data?.data || [], [data])

  return (
    <Form
      className='form-wrapper'
      ref={formRef}
      onSubmit={async event => {
        try {
          const {
            tips,
            name,
            addressIdx,
            time,
            date
          } = event.detail.value as FormData;
          await showLoading({ title: '提交中 ...', mask: true })
          await common.pushMsg({
            tips,
            name,
            startTime: `${date} ${time}`,
            address: addressList[addressIdx].destinationName || ''
          });
          await showToast({ title: '保存成功!', icon: 'none' });
          navigateBack();
        } catch (err) {
          console.error(err);
          await hideLoading();
          await showToast({ title: '保存失败!', icon: 'none' });
        }
      }}
    >
      <Cell.Group inset>
        <Field
          name='name'
          label={{ align: "left", children: "活动名称" }}
          rules={[{ required: true, message: "请填写活动名称" }]}
        >
          <Input placeholder='请填写活动名称' />
        </Field>
        <Field
          name='tips'
          label={{ align: "left", children: "活动提示" }}
        >
          <Textarea autoHeight placeholder='请填写活动提示' />
        </Field>
        <Form.Item clickable rightIcon={<ArrowRight />} name='time' rules={[{ required: true, message: "请选择活动时间" }]}>
          <Form.Label>活动时间</Form.Label>
          <Form.Control>
            {controller => (
              <Picker
                mode='time'
                value={controller.value}
                onChange={e => {
                  controller.onChange?.(e.detail.value || '')
                }}
              >{controller.value || <Text className='placeholder'>请选择活动时间</Text>}</Picker>
            )}
          </Form.Control>
        </Form.Item>
        <Form.Item clickable rightIcon={<ArrowRight />} name='date' rules={[{ required: true, message: "请选择活动日期" }]}>
          <Form.Label>活动日期</Form.Label>
          <Form.Control>
            {controller => (
              <Picker
                mode='date'
                value={controller.value}
                onChange={e => {
                  controller.onChange?.(e.detail.value || '')
                }}
              >{controller.value || <Text className='placeholder'>请选择活动日期</Text>}</Picker>
            )}
          </Form.Control>
        </Form.Item>
        <Form.Item clickable rightIcon={<ArrowRight />} name='addressIdx' rules={[{ required: true, message: "请选择活动地址" }]}>
          <Form.Label>活动地址</Form.Label>
          <Form.Control>
            {controller => (
              <Picker
                range={addressList}
                rangeKey='destinationName'
                value={controller.value}
                onChange={e => {
                  if (typeof e.detail.value !== 'undefined') {
                    controller.onChange?.(e.detail.value)
                  }
                }}
              >{addressList?.[controller.value]?.destinationName || <Text className='placeholder'>请选择活动地址</Text>}</Picker>
            )}
          </Form.Control>
        </Form.Item>
      </Cell.Group>
      <View style={{ margin: '16px' }}>
        <Button shape='round' block color='primary' formType='submit'>
          提交
        </Button>
      </View>
    </Form>
  )
}

export default Index;
