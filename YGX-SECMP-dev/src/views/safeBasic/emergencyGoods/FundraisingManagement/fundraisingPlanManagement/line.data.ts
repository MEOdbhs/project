import type { FormSchema } from '/@/components/Table';
import { Tag } from 'ant-design-vue';
import { h } from 'vue';

export const planStatusEnum = {
  notStarted: 1,
  processing: 2,
  completed: 3,
};

export const planStatusConfig: Record<number, { text: string; color: string }> = {
  [planStatusEnum.notStarted]: { text: '待开始', color: 'default' },
  [planStatusEnum.processing]: { text: '进行中', color: 'blue' },
  [planStatusEnum.completed]: { text: '已完成', color: 'green' },
};

export const columns = [
  {
    title: '计划名称',
    dataIndex: 'planName',
    width: 220,
  },
  {
    title: '编制部门',
    dataIndex: 'departmentName',
    width: 200,
  },
  {
    title: '负责人',
    dataIndex: 'personInChargeName',
    width: 160,
  },
  {
    title: '计划日期',
    dataIndex: 'planDate',
    width: 140,
  },
  {
    title: '需求日期',
    dataIndex: 'demandDate',
    width: 140,
  },
  {
    title: '预计预算（元）',
    dataIndex: 'estimatedBudget',
    width: 160,
    customRender: ({ record }) => {
      const value = Number(record.estimatedBudget ?? 0);
      if (Number.isNaN(value)) return '-';
      return value.toFixed(2);
    },
  },
  {
    title: '计划状态',
    dataIndex: 'planStatus',
    width: 130,
    customRender: ({ record }) => {
      const statusConfig = planStatusConfig[record.planStatus];
      if (!statusConfig) return '-';
      return h(Tag, { color: statusConfig.color }, () => statusConfig.text);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'planName',
    label: '计划名称',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'planDateRange',
    label: '计划日期',
    component: 'RangePicker',
    componentProps: {
      valueType: 'Date',
      valueFormat: 'YYYY-MM-DD',
    },
    colProps: { span: 6 },
  },
  {
    field: 'demandDateRange',
    label: '需求日期',
    component: 'RangePicker',
    componentProps: {
      valueType: 'Date',
      valueFormat: 'YYYY-MM-DD',
    },
    colProps: { span: 6 },
  },
  {
    field: 'planStatus',
    label: '计划状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '待开始', value: planStatusEnum.notStarted },
        { label: '进行中', value: planStatusEnum.processing },
        { label: '已完成', value: planStatusEnum.completed },
      ],
    },
    colProps: { span: 4 },
  },
];
