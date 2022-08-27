import { type FC, PropsWithChildren, useState, useMemo, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { View, Text, ScrollView } from '@tarojs/components';
import { Cell, Checkbox, Popup, Button, SafeArea } from '@taroify/core';
import { Role } from '@/types';
import './index.less';

interface Props {
  /** className */
  className?: string;
  /** 选择列表 */
  list: Role[];
  /** 所有选中项的标识符 */
  value: string[];
  /** 当绑定值变化时触发的事件 */
  onChange(value: string[]): void;
}

export const MultiRolePicker: FC<PropsWithChildren<Props>> = (props) => {
  const { className, list, value, onChange } = props;
  const valueRef = useRef(value);
  valueRef.current = value;
  const [open, setOpen] = useState(false);
  const [selections, setSelections] = useState<string[]>([]);
  const roleMap = useMemo(() => list.reduce((acc, item) => (acc[item.type] = item, acc), {} as Record<string, Role>), [list]);
  const selectResult = useMemo(() => value?.map(type => roleMap[type].name).join(','), [value, roleMap]);

  useEffect(() => {
    if (open) {
      setSelections(valueRef.current);
    }
  }, [open]);

  return (
    <>
      <View
        className={classnames('multi-cell-picker', className)}
        onClick={() => setOpen(true)}
      >
        {
          selectResult
          ?
          <Text>{selectResult}</Text>
          :
          <Text className='placeholder'>请选择角色</Text>
        }
      </View>
      <Popup
        rounded
        open={open}
        placement='bottom'
        onClose={() => setOpen(false)}
        className='multi-role-picker-popup'
      >
        <Popup.Close />
        <View className='popup-title'>选择角色</View>
        <ScrollView className='scroll-view' scrollY>
          <Cell.Group>
            {
              list.map(item => {
                const checked = !!selections.includes(item.type);
                return (
                  <Cell
                    clickable
                    title={item.name}
                    key={item.type}
                    onClick={() => {
                      if (checked) {
                        setSelections(selections.filter(type => type !== item.type))
                      } else {
                        setSelections(selections.concat(item.type))
                      }
                    }}
                  >
                    <Checkbox checked={checked} name='type' />
                  </Cell>
                )
              })
            }
          </Cell.Group>
        </ScrollView>
        <View className='actions-wrapper'>
          <Button
            shape='round'
            block color='primary'
            onClick={() => {
              setOpen(false);
              onChange(selections);
            }}
          >
            提交
          </Button>
          <SafeArea position='bottom' />
        </View>
      </Popup>
    </>
  )
}

MultiRolePicker.defaultProps = {
  list: [],
  value: [],
  onChange() {}
}

export default MultiRolePicker;
