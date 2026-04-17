import { FormSchema } from '/@/components/Table';
import { getTypeList } from './line.api'
import { Tag } from 'ant-design-vue';
import { h } from 'vue';
export const columns = [
  {
    title: '类别',
    dataIndex: 'monitorCategoryName',
    width: 100,
  },
  {
    title: '设备类型',
    dataIndex: 'monitorTypeName',
    width: 120,
  },
  {
    title: '设备名称',
    dataIndex: 'monitorName',
    width: 150,
  },
  {
    title: '设备编号',
    dataIndex: 'monitorCode',
    width: 180,
  },
  {
    title: '安装日期',
    dataIndex: 'installDate',
    width: 120,
    // 若后端返回日期格式需格式化，可在此配置 customRender
  },
  {
    title: '在线状态',
    dataIndex: 'onlineStatus',
    width: 100,
    slots: { customRender: 'onlineStatus' }, // 使用插槽自定义渲染
  },
];
export const column = [
  { title: '类别', dataIndex: 'monitorCategoryName', width: 100 },
  { title: '设备类型', dataIndex: 'monitorTypeName', width: 120 },
  { title: '告警规则', dataIndex: 'alarmArgs', ellipsis: true },
  {
    title: '是否启用', dataIndex: 'enableStatus', width: 80, customRender: ({ record }) => {
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
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'monitorCategoryId',
    label: '类别',
    colProps: { span: 8 },
    component: 'ApiSelect',
    componentProps: {
      api: getTypeList,
      labelField: 'categoryName',
      valueField: 'id',
      immediate: false,
    }
  },
  {
    field: 'monitorTypeId',
    label: '设备类型',
    component: 'JDictSelectTag',
    colProps: { span: 6 },
    componentProps: {
      dictCode: 'monitor_detector_type',
    },
  },
  {
    field: 'keyword',
    label: '设备名称/编号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入设备名称或编号',
    },
    colProps: { span: 6 },
  },
  {
    field: 'onlineStatus',
    label: '在线状态',
    component: 'Select',
    colProps: { span: 8 },
    componentProps: {
      options: [
        { label: '在线', value: 'Y' },
        { label: '离线', value: 'N' },
      ],
      placeholder: '请选择在线状态',
    },
  },
];

export const searchFormSchemas: FormSchema[] = [
  {
    field: 'monitorCategoryId',
    label: '类别',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'monitor_category',
    },
    colProps: { span: 6 },
  },
  {
    field: 'monitorTypeId',
    label: '设备类型',
    component: 'JDictSelectTag',
    colProps: { span: 6 },
    componentProps: {
      dictCode: 'monitor_detector_type',
    },
  },
  {
    field: 'onlineStatus',
    label: '在线状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '在线', value: 'Y' },
        { label: '离线', value: 'N' },
      ],
      placeholder: '请选择在线状态',
    },
  },
];