import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '隐患点名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '隐患点类型',
    dataIndex: 'geoHazardTypeName',
    width: 150,
  },
  {
    title: '地理位置',
    dataIndex: 'loc',
    width: 180,
  },
  {
    title: '威胁范围面积(平方米)',
    dataIndex: 'threatArea',
    width: 120,
  },
  {
    title: '风险等级',
    dataIndex: 'riskLevelName',
    width: 200,
    ellipsis: true,
  },
  {
    title: '受威胁居民区数量',
    dataIndex: 'residenceCount',
    width: 150,
  },
  {
    title: '受威胁基础设施数量',
    dataIndex: 'facbaseCount',
    width: 120,
  },

];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '隐患点名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'geoHazardTypeId',
    label: '类型',
    component: 'JDictSelectTag',
    componentProps: { dictCode: 'geo_hazard_type' },
    colProps: { span: 6 },
  },
  {
    field: 'riskLevelId',
    label: '风险等级',
    component: 'JDictSelectTag',
    componentProps: { dictCode: 'geohazard_risk_type' },
    colProps: { span: 6 },
  },
];
