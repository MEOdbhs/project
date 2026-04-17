import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '化学品编号',
    dataIndex: 'chemicalCode',
    width: 150,
  },
  {
    title: '化学品主名称',
    dataIndex: 'mainName',
    width: 200,
  },
  {
    title: '别名/形态',
    dataIndex: 'alias',
    width: 250,
    ellipsis: true, // 内容过长时省略
  },
  {
    title: '储存要求',
    dataIndex: 'storageRequirement',
    width: 300,
    ellipsis: true,
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
