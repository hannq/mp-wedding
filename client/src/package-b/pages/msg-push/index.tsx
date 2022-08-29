import { type FC, useRef, useMemo } from 'react';
import type { FormInstance } from '@taroify/core/form/form.shared';
import { showToast, showLoading, hideLoading, navigateBack } from '@tarojs/taro';
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
          const { errCode, errMsg } = await common.pushMsg({
            tips,
            name,
            startTime: `${date} ${time}`,
            address: addressList[addressIdx].destinationName || ''
          });
          if (errCode) throw new Error(errMsg);
          await showToast({ title: '推送成功!', icon: 'none' });
          navigateBack();
        } catch (err) {
          console.error(err);
          await hideLoading();
          await showToast({ title: '推送失败!', icon: 'none' });
        }
      }}
    >
      <Cell.Group inset>
        <Field
          name='name'
          label={{ align: "left", children: "活动名称" }}
          rules={[{ required: true, message: "请填写活动名称" }]}
        >
          <Input cursorSpacing={120} placeholder='请填写活动名称' maxlength={20} />
        </Field>
        <Field
          name='tips'
          label={{ align: "left", children: "活动提示" }}
        >
          <Textarea
            autoHeight
            placeholder='请填写活动提示'
            limit={20}
            cursorSpacing={120}
          />
        </Field>
        <Form.Item clickable rightIcon={<ArrowRight />} name='time' rules={[{ required: true, message: "请选择活动时间" }]}>
          <Form.Label>活动时间</Form.Label>
          <Form.Control>
            {controller => (
              <Picker
                className='form-field'
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
                className='form-field'
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
                className='form-field'
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
