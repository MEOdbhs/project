import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '是否涉及危险源',
    dataIndex: 'hazardInvolve',
    width: 120,
    customRender: ({ text }) => (text === 'Y' ? '是' : text === 'N' ? '否' : text),
  },
  {
    title: '最高危险源等级',
    dataIndex: 'maxHazardLevel',
    width: 150,
  },
  {
    title: '是否使用特种设备',
    dataIndex: 'specialEquipUsage',
    width: 140,
    customRender: ({ text }) => (text === 'Y' ? '是' : text === 'N' ? '否' : text),
  },
  {
    title: '特种设备种类',
    dataIndex: 'specialEquipType',
    width: 200,
  },
  {
    title: '是否使用危险设备',
    dataIndex: 'hazardEquipUsage',
    width: 140,
    customRender: ({ text }) => (text === 'Y' ? '是' : text === 'N' ? '否' : text),
  },
  {
    title: '是否涉及危险工艺',
    dataIndex: 'hazardProcessInvolve',
    width: 140,
    customRender: ({ text }) => (text === 'Y' ? '是' : text === 'N' ? '否' : text),
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
