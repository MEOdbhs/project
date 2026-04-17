
import type { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

export const statusOptions = [  //审核状态
  { label: '驳回', value: '2' },
  { label: '通过', value: '1' },
  { label: '待审核', value: '0' },
];
export const inventoryStatusOptions = [  //盘点状态
  { label: '已完成', value: '1' },
  { label: '待完成', value: '0' },
];


export const columns = [
  {
    title: '存档编号',
    dataIndex: 'archiveNum',
    width: 120,
    customRender: ({ record }) => {
      return record.archiveNum || '-';
    },
  },
  {
    title: '盘点计划名称',
    dataIndex: 'inventoryName',
    width: 220,
  },
  {
    title: '盘点区域',
    dataIndex: 'inventoryLocal',
    width: 200,
  },
  {
    title: '审核人员',
    dataIndex: 'reviewUserName',
    width: 220,
    customRender: ({ record }) => {
      return record.reviewUserName || '-';
    },
  },
  {
    title: '存档时间',
    dataIndex: 'archiveTime',
    width: 220,
    customRender: ({ record }) => {
      return record.archiveTime || '-';
    },
  },

];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'inventoryName',
    label: '盘点计划名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'planTimeRange',
    label: '存档时间',
    component: 'RangePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    colProps: { span: 8 },
  },

];
export const goodsColumns = [
  {
    title: '物资编码',
    dataIndex: 'materialsNum',
    width: 180,
  },
  {
    title: '物资名称',
    dataIndex: 'materialsName',
    width: 220,
  },
  {
    title: '系统库存',
    dataIndex: 'sysStock',
    width: 120,
  },
  {
    title: '实际库存',
    dataIndex: 'nowStock',
    width: 120,
  },
  {
    title: '差异',
    dataIndex: 'difference',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 220,
  },
]
