import { FormSchema } from '/@/components/Table';
import { Tag } from 'ant-design-vue';
import { h } from 'vue';
export const columns = [
  { title: '设备类型', dataIndex: 'monitorTypeName', width: 100 },
  { title: '设备名称', dataIndex: 'monitorName', width: 150 },
  { title: '设备编码', dataIndex: 'monitorCode', width: 150 },
  { title: '规则参数', dataIndex: 'alarmArgs', width: 200, ellipsis: true },
  { title: '状态', dataIndex: 'enableStatus', width: 80, customRender: ({ record }) => {
    let color = '';
    let text = '';
    if (record.enableStatus === 'Y') {
      color = 'green';
      text = '启用';
    }
    if (record.enableStatus === 'N') {
      color = 'red';
      text = '禁用';
    }
    return h(Tag, { color }, () => text);
  },},
  // customRender: ({ text }) => text === 1 ? '启用' : '禁用' },
  { title: '创建时间', dataIndex: 'createDatetimeStr', width: 160 },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'monitorName',
    label: '设备名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'enabled',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
    colProps: { span: 6 },
  },
];