import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '所属区域',
    dataIndex: 'region',
    width: 150,
  },
  {
    title: '经度',
    dataIndex: 'lon',
    width: 120,
  },
  {
    title: '纬度',
    dataIndex: 'lat',
    width: 120,
  },
  {
    title: '类型',
    dataIndex: 'waterbodyTypeName', 
    width: 120,
  },
  {
    title: '建成时间',
    dataIndex: 'buildTime',
    width: 150,
  },
  {
    title: '责任单位全称',
    dataIndex: 'dept',
    width: 180,
  },
  {
    title: '法定代表人',
    dataIndex: 'legal',
    width: 100,
  },
  {
    title: '负责人',
    dataIndex: 'manager',
    width: 100,
  },
  {
    title: '负责人联系方式',
    dataIndex: 'phone',
    width: 120,
  },
  {
    title: '运维单位',
    dataIndex: 'omDept',
    width: 150,
  },
  {
    title: '管护人员数量',
    dataIndex: 'count',
    width: 100,
    align: 'right',
  },
  {
    title: '范围确权情况',
    dataIndex: 'confirm',
    width: 120,
  },
  {
    title: '周边涉及的镇、村（社区）',
    dataIndex: 'towns',
    width: 200,
    ellipsis: true,
  },
  {
    title: '管理责任信息',
    dataIndex: 'duty',
    width: 200,
    ellipsis: true,
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
    field: 'waterbodyTypeId',
    label: '类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'waterbody_type',
    },
    colProps: { span: 6 },
  },
];
