import { FormSchema } from '/@/components/Table';
import { getDictTextByCode } from '/@/utils/dict';

export const columns = [
  {
    title: '重大危险源名称',
    dataIndex: 'hazardName',
    width: 200,
  },
  {
    title: '危险源等级',
    dataIndex: 'hazardLevel',
    customRender: ({ record }) => {
      return getDictTextByCode(record.hazardLevel,'hs_level');
    },
    width: 150,
  },
  {
    title: '危险源类型',
    dataIndex: 'hazardType',
    customRender: ({ record }) => {
      return getDictTextByCode(record.hazardType,'hs_category');
    },
    width: 150,
  },
  {
    title: '投用日期',
    dataIndex: 'hazardUseTime',
    width: 150,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'hazardName',
    label: '危险源名称',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'hazardType',
    label: '危险源类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'hs_category',
    },
    colProps: { span: 4 },
  },
  {
    field: 'hazardLevel',
    label: '危险源等级',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'hs_level',
    },
    colProps: { span: 4 },
  },
];
