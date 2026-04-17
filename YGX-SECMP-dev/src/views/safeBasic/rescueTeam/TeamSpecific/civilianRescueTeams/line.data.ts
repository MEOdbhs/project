import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '队伍名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '备案登记',
    dataIndex: 'record',
    width: 200,
    ellipsis: true,
  },
  {
    title: '人员构成',
    dataIndex: 'staff',
    width: 250,
    ellipsis: true,
  },
  {
    title: '装备保障',
    dataIndex: 'equip',
    width: 250,
    ellipsis: true,
  },
  {
    title: '业务能力',
    dataIndex: 'skill',
    width: 250,
    ellipsis: true,
  },
  {
    title: '联动协作',
    dataIndex: 'coop',
    width: 250,
    ellipsis: true,
  },
  {
    title: '备注',
    dataIndex: 'memo',
    width: 200,
    ellipsis: true,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '队伍名称',
    component: 'Input',
    componentProps: { placeholder: '请输入队伍名称', allowClear: true },
    colProps: { span: 6 },
  },
  {
    field: 'record',
    label: '备案登记',
    component: 'Input',
    componentProps: { placeholder: '请输入备案登记', allowClear: true },
    colProps: { span: 6 },
  },
];