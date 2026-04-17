import { FormSchema } from '/@/components/Table';
export const columns = [
  {
    title: '模型标识',
    dataIndex: 'key',
    width: 180,
  },
  {
    title: '模型名称',
    dataIndex: 'name',
    width: 180,
  },
  {
    title: '分类',
    dataIndex: 'category',
    width: 180,
  },
  {
    title: '版本',
    dataIndex: 'version',
    width: 180,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'key',
    label: '模型标识',
    component: 'Input',
    colProps: { span: 4 },
    componentProps: {
      placeholder: '关键词',
    },
  },
  {
    field: 'name',
    label: '模型名称',
    component: 'Input',
    colProps: { span: 4 },
    componentProps: {
      placeholder: '关键词',
    },
  },
];
