
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
    title: '盘点编号',
    dataIndex: 'inventoryNum',
    width: 140,
  },
  {
    title: '盘点计划名称',
    dataIndex: 'inventoryName',
    width: 220,
  },
  {
    title: '盘点区域',
    dataIndex: 'inventoryLocal',
    width: 180,
  },
  {
    title: '盘点人员',
    dataIndex: 'inventoryUserName',
    width: 220,
  },
  {
    title: '计划盘点时间',
    dataIndex: 'startTime',
    width: 360,
    customRender: ({ record }) => {
      return `${record.startTime || '-'} ~ ${record.endTime || '-'}`;
    },
  },
  {
    title: '盘点状态',
    dataIndex: 'inventoryStatus',
    width: 120,
    customRender: ({ record }) => {
      const color = record.inventoryStatus == '1' ? 'green' : 'default';
      const text = record.inventoryStatus == '1' ? '已完成' : '待完成';
      return render.renderTag(text, color);
    },
  },
  {
    title: '审核状态',
    dataIndex: 'reviewStatus',
    width: 120,
    customRender: ({ record }) => {
      const text = record.reviewStatus == 0 ? '待审核' : record.reviewStatus == 1 ? '通过' : record.reviewStatus == 2 ? '驳回' : '-';
      const color = record.reviewStatus == 0 ? 'blue' : record.reviewStatus == 1 ? 'green' : record.reviewStatus == 2 ? 'red' : '';
      return render.renderTag(text, color);
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
    label: '计划盘点时间',
    component: 'RangePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    colProps: { span: 8 },
  },
  {
    field: 'inventoryStatus',
    label: '盘点状态',
    component: 'Select',
    componentProps: {
      options: inventoryStatusOptions,
    },
    colProps: { span: 6 },
  },
  {
    field: 'reviewStatus',
    label: '审核状态',
    component: 'Select',
    componentProps: {
      options: statusOptions,
    },
    colProps: { span: 6 },
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
