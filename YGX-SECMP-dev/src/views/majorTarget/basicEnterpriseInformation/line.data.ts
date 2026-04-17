import { FormSchema } from '/@/components/Table';

export const columns =[
  {
    title: '企业名称',
    dataIndex: 'entName',
    width: 200,
  },
  {
    title: '企业编码',
    dataIndex: 'entCode',
    width: 150,
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'creditCode',
    width: 180,
  },
  {
    title: '行政区划',
    dataIndex: 'regionCode',
    width: 120,
  },
  {
    title: '工商注册地址',
    dataIndex: 'regAddr',
    width: 250,
    ellipsis: true,
  },
  {
    title: '邮政编码',
    dataIndex: 'zipCode',
    width: 100,
  },
  {
    title: '成立日期',
    dataIndex: 'establishDate',
    width: 120,
  },
  {
    title: '企业规模',
    dataIndex: 'entScale',
    width: 100,
  },
  {
    title: '经济类型',
    dataIndex: 'ecoType',
    width: 120,
  },
  {
    title: '所属行业',
    dataIndex: 'industry',
    width: 150,
  },
  {
    title: '营业期限',
    dataIndex: 'businessTerm',
    width: 150,
  },
  {
    title: '企业状态',
    dataIndex: 'entStatus',
    width: 100,
  },
  {
    title: '企业类型',
    dataIndex: 'entType',
    width: 100,
  },
  {
    title: '法定代表人',
    dataIndex: 'legalPerson',
    width: 120,
  },
  {
    title: '法定代表人电话',
    dataIndex: 'legalPersonPhone',
    width: 150,
  },
];

export const searchFormSchema: FormSchema[] = [

];
