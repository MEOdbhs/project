import type { FormSchema } from '/@/components/Table';
import { Tag } from 'ant-design-vue';
import { h } from 'vue';
import { getDictTextByCode } from '/@/utils/dict';

export const cooperationStatusEnum = {
  working: 1,
  paused: 2,
  terminated: 3,
};

export const cooperationStatusConfig = {
  [cooperationStatusEnum.working]: { text: '合作中', color: 'green' },
  [cooperationStatusEnum.paused]: { text: '暂停合作', color: 'gold' },
  [cooperationStatusEnum.terminated]: { text: '终止合作', color: 'red' },
};

export const columns = [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    width: 220,
  },
  {
    title: '供应商类别',
    dataIndex: 'supplierType',
    width: 140,
    customRender: ({ value }) => getDictTextByCode(value, 'yjaqxxk_material_type') || value || '-',
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
    title: '供应商等级',
    dataIndex: 'supplierLevel',
    width: 140,
    customRender: ({ value }) => getDictTextByCode(value, 'yjaqxxk_supplier_level') || value || '-',
  },
  {
    title: '合作状态',
    dataIndex: 'cooperationStatus',
    width: 130,
    customRender: ({ record }) => {
      const currentStatus = Number(record.cooperationStatus);
      const statusConfig = cooperationStatusConfig[currentStatus];
      if (!statusConfig) return '-';
      return h(Tag, { color: statusConfig.color }, () => statusConfig.text);
    },
  },
  {
    title: '初始合作时间',
    dataIndex: 'cooperationStartTime',
    width: 160,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'supplierName',
    label: '供应商名称',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: {
      placeholder: '请输入供应商名称',
      allowClear: true,
    },
  },
  {
    field: 'supplierLevel',
    label: '供应商等级',
    component: 'JDictSelectTag',
    colProps: { span: 6 },
    componentProps: {
      dictCode: 'yjaqxxk_supplier_level',
      placeholder: '请选择供应商等级',
      allowClear: true,
    },
  },
  {
    field: 'cooperationStatus',
    label: '合作状态',
    component: 'Select',
    colProps: { span: 4 },
    componentProps: {
      allowClear: true,
      placeholder: '请选择合作状态',
      options: [
        { label: '合作中', value: cooperationStatusEnum.working },
        { label: '暂停合作', value: cooperationStatusEnum.paused },
        { label: '终止合作', value: cooperationStatusEnum.terminated },
      ],
    },
  },
];

