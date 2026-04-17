import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '工艺编号',
    dataIndex: 'processCode',
    width: 150,
  },
  {
    title: '工艺名称',
    dataIndex: 'processName',
    width: 200,
  },
  {
    title: '工艺类型',
    dataIndex: 'processTypeName',
    width: 120,
  },
  {
    title: '原辅材料',
    dataIndex: 'rawMaterial',
    width: 200,
  },
  {
    title: '产物',
    dataIndex: 'product',
    width: 200,
  },
];

export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'paramName',
  //   label: '参数名',
  //   component: 'Input',
  //   colProps: { span: 6 },
  // },
  // {
  //   field: 'paramTypeId',
  //   label: '参数类型',
  //   component: 'JDictSelectTag',
  //   componentProps: {
  //     dictCode: 'sys_param_type',
  //   },
  //   colProps: { span: 6 },
  // },
];
