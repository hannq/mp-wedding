import { type FC, useRef, useEffect } from 'react';
import type { FormInstance } from '@taroify/core/form/form.shared';
import { chooseLocation, useRouter, showToast, showLoading, hideLoading, navigateBack, cloud, type DB, } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Form, Cell, Field, Button, Input, Textarea, Rate, Checkbox } from '@taroify/core';
import { ArrowRight, Checked } from '@taroify/icons';
import { Navigation } from '@/types';
import { navigation } from '@/apis';
import './index.less';

export const Index: FC = () => {
  const formRef = useRef<FormInstance>();
  const { params: { id } } = useRouter();

  useEffect(() => {
    ;(async function () {
      if (id) {
        const { errCode, errMsg, data } = await navigation.get(id);
        if (errCode) showToast({ title: errMsg })
        else {
          const {
            destinationName,
            destinationAddress,
            rate,
            isLocal,
            desc,
            transport,
            destinationLocation
          } = data!;
          formRef.current?.setValues({
            destinationName,
            destinationAddress,
            rate,
            isLocal,
            desc,
            transport,
            destinationLocation
          });
        }
      }
    })();
  }, [id])

  return (
    <Form
      className='form-wrapper'
      ref={formRef}
      onSubmit={async event => {
        try {
          const {
            destinationName,
            destinationAddress,
            rate,
            isLocal,
            desc,
            transport,
            destinationLocation,
          } = event.detail.value as Navigation;
          await showLoading({ title: '提交中 ...', mask: true })
          await navigation.save({
            id,
            destinationName,
            destinationAddress,
            destinationLocation,
            rate,
            isLocal,
            desc,
            transport,
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
        <Form.Item
          name='destinationLocation'
          rules={[{ required: true, message: "请选择目的地" }]}
          rightIcon={<ArrowRight />}
          clickable
          onClick={async () => {
            try {
              const { address, latitude, longitude, name } = await chooseLocation({});
              formRef.current?.setValues({
                destinationAddress: address,
                destinationName: name,
                destinationLocation: cloud.database().Geo.Point(+longitude, +latitude).toJSON() as DB.IGeo.JSONPoint
              });
            } catch (err) {
              console.log(err)
            }
          }}
        >
          <Form.Label>目的地</Form.Label>
          <Form.Control>
            {controller => (
              <View>
                {!!controller.value && <Checked color='#07c160' className='checked-icon' />}
                {!!controller.value ? '已选择' : <Text className='placeholder'>请选择目的地</Text>}
              </View>
            )}
          </Form.Control>
        </Form.Item>
        <Field
          name='destinationName'
          label={{ align: "left", children: "地点名" }}
          rules={[{ required: true, message: "请填写目的地地点名" }]}
        >
          <Input cursorSpacing={120} placeholder='请填写目的地地点名' />
        </Field>
        <Field
          name='destinationAddress'
          label={{ align: "left", children: "详细地址" }}
          rules={[{ required: true, message: "请输入目的地详细地址" }]}
        >
          <Textarea autoHeight cursorSpacing={120} placeholder='请输入目的地详细地址' />
        </Field>
        <Field
          name='transport'
          label={{ align: "left", children: "交通方式" }}
          rules={[{ required: true, message: "请填写交通方式" }]}
        >
          <Input cursorSpacing={120} placeholder='请填写交通方式，如：火车、自驾' />
        </Field>
        <Form.Item name='isLocal'>
          <Form.Label>本地</Form.Label>
          <Form.Control>
            <Checkbox shape='round' />
          </Form.Control>
        </Form.Item>
        <Form.Item name='rate'>
          <Form.Label>评分</Form.Label>
          <Form.Control>
            <Rate />
          </Form.Control>
        </Form.Item>
        <Field
          name='desc'
          label={{ align: "left", children: "描述" }}
        >
          <Textarea autoHeight cursorSpacing={120} placeholder='请输入描述' />
        </Field>
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
