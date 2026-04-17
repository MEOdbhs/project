import type { BasicColumn } from '/@/components/Table';
import type { FormSchema } from '/@/components/Table';
import { getStorageLocation } from './materialClassification.api';

export const columns: BasicColumn[] = [
  {
    title: '物资编码',
    dataIndex: 'materialCode',
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
    title: '规格',
    dataIndex: 'specification',
    width: 160,
  },
  {
    title: '当前库存',
    dataIndex: 'currentStock',
    width: 120,
    customRender: ({ text, record }) => {
      const qty = text != null && text !== '' ? String(text) : '';
      const unit = record?.unitName ?? record?.unit ?? '';
      const unitStr = unit ? String(unit).trim() : '';
      if (!qty && !unitStr) return '';
      if (!unitStr) return qty;
      if (!qty) return unitStr;
      return `${qty} ${unitStr}`;
    },
  },

  {
    title: '参考单价（元）',
    dataIndex: 'unitPrice',
    width: 120,
  },
  {
    title: '参考总价（元）',
    dataIndex: 'totalPrice',
    width: 120,
  },
  {
    title: '仓储位置',
    dataIndex: 'storageName',
    width: 160,
  }
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
    field: 'emergencyMaterialStorageId',
    label: '仓储位置',
    component: 'ApiSelect',
    componentProps: {
      api: async (params) => {
        const res = await getStorageLocation(params ?? {});
        if (!Array.isArray(res)) return [];
        return res.map((item: Record<string, any>) => ({
          label: item.storageName,
          value: item.id,
        }));
      },
      labelField: 'label',
      valueField: 'value',
      placeholder: '请选择仓储位置',
      allowClear: true,
    },
    colProps: { span: 6 },
  },
  
];

