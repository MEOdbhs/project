import type { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

export const statusOptions = [
  { label: '已结束', value: '2' },
  { label: '进行中', value: '1' },
  { label: '未开始', value: '0' },
];

export const columns = [
  {
    title: '预警物资',
    dataIndex: 'materialName',
    width: 140,
  },
  {
    title: '预警状态',
    dataIndex: 'warningStatusName',
    width: 120,
    customRender: ({ record }) => {
      const color = record.warningStatusName == '高于阈值' ? 'blue' : record.warningStatusName == '低于阈值' ? 'red' : 'default';
      return render.renderTag(record.warningStatusName, color);
    },
  },
  {
    title: '生成时间',
    dataIndex: 'remindDt',
    width: 180,
    customRender: ({ record }) => {
      return record.remindDt || '-';
    },
  },
  {
    title: '状态',
    dataIndex: 'handleStatusName',
    width: 120,
    customRender: ({ record }) => {
      const color = record.handleStatusName == '已处理' ? 'green' : record.handleStatusName == '待处理' ? 'blue' : 'default';
      return render.renderTag(record.handleStatusName, color);
    },
  },
  {
    title: '处理人',
    dataIndex: 'handleUserName',
    width: 120,
    customRender: ({ record }) => {
      return record.handleUserName || '-';
    },
  },
  {
    title: '处理时间',
    dataIndex: 'handleDt',
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
  {
    field: 'planTimeRange',
    label: '生成时间',
    component: 'RangePicker',
    componentProps: {
      //showTime: true,
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
    colProps: { span: 8 },
  },
  {
    field: 'handleTimeRange',
    label: '处理时间',
    component: 'RangePicker',
    componentProps: {
      //showTime: true,
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
    colProps: { span: 8 },
  },
  {
    field: 'warningStatus',
    label: '预警状态',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '低于阈值',
          value: '1',
        },
        {
          label: '高于阈值',
          value: '2',
        },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'handleStatus',
    label: '处理状态',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '已处理',
          value: '2',
        },
        {
          label: '待处理',
          value: '1',
        },
      ],
    },
    colProps: { span: 6 },
  },
];

