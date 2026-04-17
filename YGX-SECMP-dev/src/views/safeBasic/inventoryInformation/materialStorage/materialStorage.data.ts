import type { BasicColumn } from '/@/components/Table';
import type { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '仓储编码',
    dataIndex: 'storageCode',
    width: 140,
  },
  {
    title: '仓储名称',
    dataIndex: 'storageName',
    width: 160,
  },
  {
    title: '地址',
    dataIndex: 'address',
    width: 260,
  },
  {
    title: '联系人',
    dataIndex: 'contactPerson',
    width: 120,
  },
  {
    title: '联系电话',
    dataIndex: 'contactPhone',
    width: 150,
  },
  {
    title: '仓储面积（㎡）',
    dataIndex: 'storageArea',
    width: 140,
  },
  {
    title: '总容量',
    dataIndex: 'totalCapacity',
    width: 120,
  },
];


export const searchFormSchema: FormSchema[] = [
  {
    field: 'storageName',
    label: '仓储名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];

