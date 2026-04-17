import type { BasicColumn } from '/@/components/Table';
import type { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '捐赠日期',
    dataIndex: 'donationDate',
    width: 140,
  },
  {
    title: '捐赠者',
    dataIndex: 'donorName',
    width: 140,
  },
  {
    title: '物资名称',
    dataIndex: 'materialName',
    width: 160,
  },
  {
    title: '类型',
    dataIndex: 'materialTypeName',
    width: 120,
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    width: 120,
    customRender: ({ text, record }) => {
      const qty = text != null && text !== '' ? String(text) : '';
      const unit = record?.unitName ?? record?.unit ?? '';
      const unitStr = unit ? String(unit).trim() : '';
      if (!qty && !unitStr) return '';
      if (!unitStr) return qty;
      if (!qty) return unitStr;
      // 如：50箱
      return `${qty}${unitStr}`;
    },
  },
  {
    title: '单价（元）',
    dataIndex: 'unitPrice',
    width: 120,
  },
  {
    title: '总价（元）',
    dataIndex: 'totalPrice',
    width: 120,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'materialName',
    label: '物资名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'materialType',
    label: '物资类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'yjaqxxk_material_type',
      placeholder: '请选择物资类型',
    },
    colProps: { span: 6 },
  },
  {
    field: 'donationDateRange',
    label: '捐赠日期',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    colProps: { span: 6 },
  },
];
