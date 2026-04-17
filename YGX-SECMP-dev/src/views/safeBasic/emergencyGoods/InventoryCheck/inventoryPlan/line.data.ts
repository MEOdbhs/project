import type { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

export const statusOptions = [
  { label: '已结束', value: '2' },
  { label: '进行中', value: '1' },
  { label: '未开始', value: '0' },
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
    title: '计划状态',
    dataIndex: 'startText',
    width: 120,
    customRender: ({ record }) => {
      const color = record.statusText == '已结束' ? 'green' : record.statusText == '进行中' ? 'blue' : 'default';
      return render.renderTag(record.statusText, color);
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
    field: 'statusText',
    label: '计划状态',
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
    dataIndex: 'materialCode',
    width: 160,
  },
  {
    title: '物资名称',
    dataIndex: 'materialName',
    width: 180,
  },
  {
    title: '系统库存',
    dataIndex: 'systemStock',
    width: 120,
  },
  {
    title: '实际库存',
    dataIndex: 'actualStock',
    width: 140,
  },
  {
    title: '差异',
    dataIndex: 'difference',
    width: 120,
    customRender: ({ record }) => {
      const actualStock = Number(record.actualStock ?? 0);
      const systemStock = Number(record.systemStock ?? 0);
      return actualStock - systemStock;
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 220,
  },
];
