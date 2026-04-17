import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '参数名',
    dataIndex: 'paramName',
    width: 150,
  },
  {
    title: '参数值',
    dataIndex: 'paramValue',
    width: 120,
  },
  {
    title: '参数类型',
    dataIndex: 'paramTypeName',
    width: 150,
  },
  {
    title: '参数编码',
    dataIndex: 'paramCode',
    width: 150,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 120,
  },
  
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'paramName',
    label: '参数名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'paramTypeId',
    label: '参数类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'sys_param_type',
    },
    colProps: { span: 6 },
  },
];
