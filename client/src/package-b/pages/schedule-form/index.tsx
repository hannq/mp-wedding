import { type FC, useRef, useEffect, useMemo } from 'react';
import type { FormInstance } from '@taroify/core/form/form.shared';
import { chooseLocation, useRouter, showToast, showLoading, hideLoading, navigateBack, cloud, type DB, } from '@tarojs/taro';
import { View, Text, Picker } from '@tarojs/components';
import { Form, Cell, Field, Button, Input, Textarea } from '@taroify/core';
import { ArrowRight, Checked } from '@taroify/icons';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { Schedule } from '@/types';
import { schedule, common } from '@/apis';
import { MultiRolePicker } from './components/multi-role-picker';
import './index.less';

interface FormData extends Omit<Schedule, 'startTime' | 'id' | 'role'> {
  /** 时间 */
  time: string;
  /** 日期 */
  date: string;
  /** 绑定角色 */
  role: string[];
}

export const Index: FC = () => {
  const formRef = useRef<FormInstance>();
  const { params: { id } } = useRouter();
  const { data: roleListRes } = useRequest(common.getRoleList);
  const roleList = useMemo(() => roleListRes?.data || [], [roleListRes]);
  useEffect(() => {
    ;(async function () {
      if (id) {
        await showLoading({ title: '加载中 ...', mask: true })
        const { errCode, errMsg, data } = await schedule.get(id);
        await hideLoading();
        if (errCode) showToast({ title: errMsg })
        else {
          const {
            name,
            roles,
            startTime,
            addressLocation,
            addressName,
            addressDetail,
            desc
          } = data!;
          const [date, time] = dayjs(startTime).format(`YYYY-MM-DD HH:mm`).split(' ')
          formRef.current?.setValues({
            name,
            roles: roles.map(role => role.type),
            time,
            date,
            addressLocation,
            addressName,
            addressDetail,
            desc
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
            name,
            roles,
            time,
            date,
            addressLocation,
            addressName,
            addressDetail,
            desc,
          } = event.detail.value as FormData;
          await showLoading({ title: '提交中 ...', mask: true })
          await schedule.save({
            id,
            name,
            roles,
            startTime: `${date} ${time}`,
            addressLocation,
            addressName,
            addressDetail,
            desc,
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
          label={{ align: "left", children: "日程名称" }}
          rules={[{ required: true, message: "日程名称不能为空" }]}
        >
          <Input cursorSpacing={120} placeholder='请填写日程名称' />
        </Field>
        <Form.Item
          clickable
          rightIcon={<ArrowRight />}
          name='roles'
          rules={[{ required: true, message: "绑定角色不能为空" }]}
        >
          <Form.Label>绑定角色</Form.Label>
          <Form.Control>
          {controller => (
            <MultiRolePicker
              list={roleList}
              value={controller.value || []}
              onChange={val => controller.onChange?.(val)}
            />
          )}
          </Form.Control>
        </Form.Item>
        <Form.Item clickable rightIcon={<ArrowRight />} name='time' rules={[{ required: true, message: "请选择活动时间" }]}>
          <Form.Label>开始时间</Form.Label>
          <Form.Control>
            {controller => (
              <Picker
                className='picker'
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
          <Form.Label>开始日期</Form.Label>
          <Form.Control>
            {controller => (
              <Picker
                className='picker'
                mode='date'
                value={controller.value}
                onChange={e => {
                  controller.onChange?.(e.detail.value || '')
                }}
              >{controller.value || <Text className='placeholder'>请选择活动日期</Text>}</Picker>
            )}
          </Form.Control>
        </Form.Item>
        <Form.Item
          name='addressLocation'
          rightIcon={<ArrowRight />}
          clickable
          onClick={async () => {
            try {
              const { address, latitude, longitude, name } = await chooseLocation({});
              formRef.current?.setValues({
                addressName: name,
                addressDetail: address,
                addressLocation: cloud.database().Geo.Point(+longitude, +latitude).toJSON() as DB.IGeo.JSONPoint
              });
            } catch (err) {
              console.log(err)
            }
          }}
        >
          <Form.Label>地点</Form.Label>
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
          name='addressName'
          label={{ align: "left", children: "地点名称" }}
        >
          <Input cursorSpacing={120} placeholder='请填写目的地地点名' />
        </Field>
        <Field
          name='addressDetail'
          label={{ align: "left", children: "详细地址" }}
        >
          <Textarea autoHeight cursorSpacing={120} placeholder='请输入目的地详细地址' />
        </Field>
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
