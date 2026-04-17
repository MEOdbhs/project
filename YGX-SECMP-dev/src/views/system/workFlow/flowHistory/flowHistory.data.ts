import { FormSchema } from '/@/components/Table';
export const columns = [
  {
    title: '业务号',
    dataIndex: 'businessKey',
    width: 180,
  },
  {
    title: '模型名称',
    dataIndex: 'name',
    width: 180,
  },
  {
    title: '当前节点',
    dataIndex: 'currentTask',
    width: 180,
  },
  {
    title: '当前处理人',
    dataIndex: 'assignee',
    width: 140,
  },
  {
    title: '是否结束',
    dataIndex: 'ended',
    width: 120,
    customRender: ({ record }) => {
      return record.ended ? '是' : '否';
    },
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    width: 180,
  },
  {
    title: '发起人',
    dataIndex: 'startName',
    width: 140,
  },
];
export const columnsHistory = [
  {
    title: '活动名称',
    dataIndex: 'taskName',
    width: 140,
  },
  {
    title: '办理人',
    dataIndex: 'assignee',
    width: 120,
  },
  {
    title: '审批意见',
    dataIndex: 'comment',
    width: 140,
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    width: 140,
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: 140,
  },
];
export const columnsLet = [
  {
    title: '变量名',
    dataIndex: 'variableName',
    width: 140,
  },
  {
    title: '变量类型',
    dataIndex: 'variableTypeName',
    width: 120,
  },
  {
    title: '变量值',
    dataIndex: 'value',
    width: 140,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 140,
  },
  {
    title: '最后修改时间',
    dataIndex: 'lastUpdatedTime',
    width: 140,
  },
];
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '模型名称',
    component: 'Input',
    colProps: { span: 4 },
    componentProps: {
      placeholder: '关键词',
    },
  },
  {
    field: 'bussinesskey',
    label: '业务号',
    component: 'Input',
    colProps: { span: 4 },
    componentProps: {
      placeholder: '关键词',
    },
  },
];
