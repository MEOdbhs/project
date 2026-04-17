import type { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

export const statusOptions = [
  { label: '已结束', value: '2' },
  { label: '进行中', value: '1' },
  { label: '未开始', value: '0' },
];

export const columns = [
  {
    title: '物资编码',
    dataIndex: 'materialCode',
    width: 140,
  },
  {
    title: '物资名称',
    dataIndex: 'materialName',
    width: 220,
  },
  {
    title: '最低库存',
    dataIndex: 'inventoryMin',
    width: 180,
    customRender: ({ record }) => {
      return record.inventoryMin || '-';
    },
  },
  {
    title: '最高库存',
    dataIndex: 'inventoryMax',
    width: 220,
    customRender: ({ record }) => {
      return record.inventoryMax || '-';
    },
  },
  {
    title: '当前库存',
    dataIndex: 'currentStock',
    width: 220,
    customRender: ({ record }) => {
      return record.currentStock || '-';
    },
  },
  {
    title: '最近修改时间',
    dataIndex: 'updateDt',
    width: 220,
  },


];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'materialName',
    label: '物资名称',
    component: 'Input',
    colProps: { span: 6 },
  },

];

