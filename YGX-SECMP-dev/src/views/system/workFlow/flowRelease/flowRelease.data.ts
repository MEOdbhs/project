import { FormSchema } from '/@/components/Table';
export const columns = [
  {
    title: '流程设计ID',
    dataIndex: 'id',
    width: 160,
  },
  {
    title: '流程部署ID',
    dataIndex: 'deploymentId',
    width: 160,
  },
  {
    title: '模型标识',
    dataIndex: 'key',
    width: 140,
  },
  {
    title: '模型名称',
    dataIndex: 'name',
    width: 140,
  },
  {
    title: '流程资源定义',
    dataIndex: 'resourceName',
    width: 140,
  },
  {
    title: '版本号',
    dataIndex: 'version',
    width: 120,
  },
  {
    title: '详情',
    dataIndex: 'detail',
    slots: { customRender: 'detail' },
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
  {
    field: 'version',
    label: '版本号',
    component: 'Input',
    colProps: { span: 4 },
    componentProps: {
      placeholder: '只看最新版',
    },
  },
];
