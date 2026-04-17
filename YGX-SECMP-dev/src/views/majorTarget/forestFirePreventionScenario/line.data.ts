import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '防火场景名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '地理位置',
    dataIndex: 'address',
    width: 250,
    ellipsis: true,
  },
  {
    title: '风险等级',
    dataIndex: 'riskLevelName',
    width: 120,
  },
  {
    title: '雨林及周边居民区',
    dataIndex: 'vicinityCount',
    width: 120,
  },
  {
    title: '重要设施',
    dataIndex: 'facilityCount',
    width: 120,
  },
  {
    title: '生态敏感区',
    dataIndex: 'ecozoneCount',
    width: 120,
  },
  {
    title: '重点场所',
    dataIndex: 'siteCount',
    width: 120,
  },


];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'riskLevelId',
    label: '风险等级',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'firewatch_risk_type',
    },
    colProps: { span: 6 },
  },
];
