import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const columns = [
  {
    title: '监控设备名称',
    dataIndex: 'deviceMonitor',
    width: 200,
  },
  {
    title: '监控区域',
    dataIndex: 'monitorZone',
    width: 150,
  },
  {
    title: '摄像头类型',
    dataIndex: 'cameraType',
    width: 150,
  },
  {
    title: '关联危险源',
    dataIndex: 'seriousOriginalName',
    width: 150,
  },
  {
    title: '在线状态',
    dataIndex: 'onlineStatus',
    width: 120,
    customRender: ({ record }) => {
      const isOnline = record.onlineStatus === 0;
      return h(Tag, { color: isOnline ? 'green' : 'default' }, () => isOnline ? '在线' : '离线');
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'deviceMonitor',
    label: '监控设备名称',
    component: 'Input',
    labelWidth:100,
    colProps: { span: 4 },
  },
  {
    field: 'monitorZone',
    label: '监控区域',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'cameraType',
    label: '摄像头类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'safe_device_video_camera_type',
    },
    colProps: { span: 4 },
  },
];
