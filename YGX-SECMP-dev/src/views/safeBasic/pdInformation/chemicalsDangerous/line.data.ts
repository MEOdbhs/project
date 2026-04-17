import { FormSchema } from '/@/components/Table';
import { getDictTextByCode } from '/@/utils/dict';

export const columns = [
  {
    title: '危化品名称',
    dataIndex: 'dangerName',
    width: 150,
  },
  {
    title: '别名',
    dataIndex: 'otherName',
    width: 120,
  },
  {
    title: '英文名',
    dataIndex: 'englishName',
    width: 150,
  },
  {
    title: 'CAS号',
    dataIndex: 'casCard',
    width: 120,
  },
  {
    title: '化学品类型',
    dataIndex: 'chemicalsType',
    customRender: ({ record }) => {
      return getDictTextByCode(record.chemicalsType,'chemicals_type');
    },
    width: 120,
  },
  {
    title: '物质形态',
    dataIndex: 'substanceType',
    customRender: ({ record }) => {
      return getDictTextByCode(record.substanceType,'material_form');
    },
    width: 100,
  },
  {
    title: '计量单位',
    dataIndex: 'unit',
    width: 100,
  },
  {
    title: '是否重点监管危化品',
    dataIndex: 'isImportant',
    width: 140,
    customRender: ({ text }) => {
      return text === '1' || text === 1 ? '是' : '否';
    },
  },
  {
    title: '是否特别管控危化品',
    dataIndex: 'isEspecially',
    width: 140,
    customRender: ({ text }) => {
      return text === '1' || text === 1 ? '是' : '否';
    },
  },
  {
    title: '是否剧毒化学品',
    dataIndex: 'isToxic',
    width: 120,
    customRender: ({ text }) => {
      return text === '1' || text === 1 ? '是' : '否';
    },
  },
  {
    title: '是否易制爆',
    dataIndex: 'isExplosion',
    width: 120,
    customRender: ({ text }) => {
      return text === '1' || text === 1 ? '是' : '否';
    },
  },
  {
    title: '是否易制毒',
    dataIndex: 'isDrug',
    width: 120,
    customRender: ({ text }) => {
      return text === '1' || text === 1 ? '是' : '否';
    },
  },
  {
    title: '最大储量(吨)',
    dataIndex: 'maxReserves',
    width: 120,
  },
  {
    title: '当前储量(吨)',
    dataIndex: 'nowReserves',
    width: 120,
  },
  {
    title: '储存方式',
    dataIndex: 'reservesType',
   
    width: 120,
  },
  {
    title: '主要用途',
    dataIndex: 'purpose',
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'dangerName',
    label: '危化品名称',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'casCard',
    label: 'CAS号',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'chemicalsType',
    label: '化学品类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'chemicals_type',
    },
    colProps: { span: 4 },
  },
];
