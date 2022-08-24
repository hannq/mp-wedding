import { useMemo, useState, type FC } from 'react';
import { useDidShow, showToast, showModal, showLoading, hideLoading, saveImageToPhotosAlbum, cloud, useShareAppMessage } from '@tarojs/taro';
import { View, ScrollView, Picker } from '@tarojs/components';
import { Button, SafeArea, Empty, Popup, Image } from "@taroify/core";
import { Plus } from "@taroify/icons";
import { useRequest } from "ahooks";
import { roleCode, common, } from "@/apis";
import { useShare } from "@/hooks/useShare";
import { RoleCodeItem } from "./components/role-code-item";
import './index.less';

interface QRCode {
  /** 文件路径 */
  src: string;
  /** 云存储文件ID */
  fileID: string;
}

export const Invitation: FC = () => {
  const [qrCode, setQRCode] = useState<QRCode | null>(null);
  const [qrCodePopupOpen, setQRCodePopupOpen] = useState(false);
  const { data: roleListRes } = useRequest(common.getRoleList);
  const { loading, run, data: roleCodeListRes } = useRequest(roleCode.getList, { manual: true });
  const roleList = useMemo(() => roleListRes?.data || [], [roleListRes]);
  const roleCodeList = useMemo(() => roleCodeListRes?.data || [], [roleCodeListRes]);

  useDidShow(run);
  useShare();

  return (
    <View className='wrapper'>
      <ScrollView
        className='list-wrapper'
        scrollY
        refresherEnabled
        refresherBackground='#f5f5f5'
        refresherTriggered={loading}
        onRefresherRefresh={() => !loading && run()}
      >
        <View className='list-content'>
          {
            !!roleCodeList.length
            ?
            roleCodeList.map(item => (
              <RoleCodeItem
                {...item}
                key={item.id}
                roleList={roleList}
                onReuse={async () => {
                  const { confirm } = await showModal({ title: '解绑确认', content: '解绑后已绑定的用户会丢失角色！' })
                  if (confirm) {
                    showLoading({ title: '正在解绑 ...', mask: true });
                    const { errCode, errMsg } = await roleCode.save({
                      id: item.id,
                      inUse: false
                    });
                    hideLoading();
                    if (errCode) {
                      showToast({ title: errMsg, icon: 'error' });
                    } else {
                      await showToast({ title: '解绑成功！' });
                      run();
                    }

                  }
                }}
                onDel={async () => {
                  const { confirm } = await showModal({ title: '删除确认', content: '删除后已绑定的用户会丢失角色！' })
                  if (confirm) {
                    showLoading({ title: '正在删除 ...', mask: true });
                    const { errCode, errMsg } = await roleCode.del(item.id);
                    hideLoading();
                    if (errCode) {
                      showToast({ title: errMsg, icon: 'error' });
                    } else {
                      await showToast({ title: '删除成功！' });
                      run();
                    }

                  }
                }}
                onShowQrCode={async () => {
                  await showLoading({ title: '正在生成 ...', mask: true });
                  const { fileList: { 0: { tempFileURL, fileID } } } = await cloud.getTempFileURL({ fileList: [item.codeFileID] })
                  setQRCode({ src: tempFileURL, fileID });
                  await hideLoading()
                  setQRCodePopupOpen(true);
                }}
                onRefresh={run}
              />
            ))
            :
            (
              !loading ? <Empty>
                <Empty.Image
                  className='empty-img'
                  src='https://img.yzcdn.cn/vant/custom-empty-image.png'
                />
                <Empty.Description>暂无数据</Empty.Description>
              </Empty> : null
            )
          }
        </View>
      </ScrollView>
      <View className='action-btn-wrapper'>
        <Picker
          range={roleList}
          rangeKey='name'
          onChange={async e => {
            showLoading({ title: '正在创建 ...', mask: true });
            const { errCode, errMsg } = await roleCode.save({
              roleType: roleList[e.detail.value as number].type
            });
            hideLoading();
            if (errCode) {
              console.error(errMsg);
              showToast({ title: '创建失败', icon: 'error' });
            } else {
              showToast({ title: '创建成功' });
              run();
            };
          }}
        >
          <Button
            block
            color='primary'
            icon={<Plus />}
          >
            新增角色邀请码
          </Button>
        </Picker>
        <SafeArea position='bottom' />
      </View>
      <Popup
        open={!!qrCode && qrCodePopupOpen}
        onClose={() => setQRCodePopupOpen(false)}
        className='popup-wrapper'
      >
        <Image className='qr-img' src={qrCode?.src} />
        <Button
          block
          color='primary'
          className='save-btn'
          onClick={async () => {
            try {
              await showLoading({ title: '下载中', mask: true });
              const { tempFilePath } = await cloud.downloadFile({ fileID: qrCode!.fileID })
              await saveImageToPhotosAlbum({
                filePath: tempFilePath
              });
              await hideLoading();
              await showToast({ title: '保存成功' });
            } catch(err) {
              console.error(err);
              showToast({ title: '保存失败', icon: 'error' })
            }
          }}
        >保存到相册</Button>
      </Popup>
    </View>
  )
}

export default Invitation;
