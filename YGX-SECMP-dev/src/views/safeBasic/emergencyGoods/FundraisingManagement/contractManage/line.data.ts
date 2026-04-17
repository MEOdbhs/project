import type { FormSchema } from '/@/components/Table';
import { Tag } from 'ant-design-vue';
import { h } from 'vue';

export const contractStatusEnum = {
  notStarted: 1,
  processing: 2,
  completed: 3,
  terminated: 4,
};

export const contractStatusConfig: Record<number, { text: string; color: string }> = {
  [contractStatusEnum.notStarted]: { text: '未开始', color: 'default' },
  [contractStatusEnum.processing]: { text: '进行中', color: 'blue' },
  [contractStatusEnum.completed]: { text: '已完成', color: 'green' },
  [contractStatusEnum.terminated]: { text: '已终止', color: 'red' },
};

export const columns = [
  {
    title: '合同编号',
    dataIndex: 'contractCode',
    width: 180,
  },
  {
    title: '合同名称',
    dataIndex: 'contractName',
    width: 220,
  },
  {
    title: '甲方',
    dataIndex: 'partyAName',
    width: 220,
  },
  {
    title: '乙方',
    dataIndex: 'partyBName',
    width: 220,
  },
  {
    title: '签订日期',
    dataIndex: 'signDate',
    width: 140,
  },
  {
    title: '合同金额（元）',
    dataIndex: 'contractAmount',
    width: 180,
    customRender: ({ record }) => {
      return Number(record.contractAmount ?? 0).toFixed(2);
    },
  },
  {
    title: '合同状态',
    dataIndex: 'contractStatus',
    width: 130,
    customRender: ({ record }) => {
      const statusConfig = contractStatusConfig[record.contractStatus];
      if (statusConfig == null) return '-';
      return h(Tag, { color: statusConfig.color }, () => statusConfig.text);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'contractName',
    label: '合同名称',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'signDateRange',
    label: '签订日期',
    component: 'RangePicker',
    componentProps: {
      valueType: 'Date',
      valueFormat: 'YYYY-MM-DD',
    },
    colProps: { span: 8 },
  },
  {
    field: 'contractStatus',
    label: '合同状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '未开始', value: contractStatusEnum.notStarted },
        { label: '进行中', value: contractStatusEnum.processing },
        { label: '已完成', value: contractStatusEnum.completed },
        { label: '已终止', value: contractStatusEnum.terminated },
      ],
    },
    colProps: { span: 4 },
  },
];
