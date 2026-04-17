import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

// 设备状态枚举
export const DeviceStatusEnum = {
  IN_USE: 0,      // 在用
  MAINTAIN: 1,    // 保养
  REPAIR: 2,      // 维修
  SCRAP: 3,       // 报废
  STOP: 4,        // 停用
};

// 设备状态配置
export const DeviceStatusConfig = {
  [DeviceStatusEnum.IN_USE]: { text: '在用', color: 'green' },
  [DeviceStatusEnum.MAINTAIN]: { text: '保养', color: 'blue' },
  [DeviceStatusEnum.REPAIR]: { text: '维修', color: 'orange' },
  [DeviceStatusEnum.SCRAP]: { text: '报废', color: 'red' },
  [DeviceStatusEnum.STOP]: { text: '停用', color: 'default' },
};

export const columns = [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: 200,
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: 150,
  },
  {
    title: '型号规格',
    dataIndex: 'modelNorms',
    width: 150,
  },
  {
    title: '投用地点',
    dataIndex: 'locationUse',
    width: 150,
  },
  {
    title: '投用时间',
    dataIndex: 'dateOfUse',
    width: 150,
  },
  {
    title: '设备状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      const status = record.status;
      const config = DeviceStatusConfig[status];
      if (!config) return '-';
      return h(Tag, { color: config.color }, () => config.text);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'deviceName',
    label: '设备名称',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'deviceType',
    label: '设备类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'safe_device_archive_type',
    },
    colProps: { span: 4 },
  },
  {
    field: 'status',
    label: '设备状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '在用', value: 0 },
        { label: '保养', value: 1 },
        { label: '维修', value: 2 },
        { label: '报废', value: 3 },
        { label: '停用', value: 4 },
      ],
    },
    colProps: { span: 4 },
  },
];
