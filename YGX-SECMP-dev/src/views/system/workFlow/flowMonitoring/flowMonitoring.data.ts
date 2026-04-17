import { FormSchema } from '/@/components/Table';
export const columns = [
  {
    title: '流程实例编号',
    dataIndex: 'processInstanceId',
    width: 180,
  },
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
    title: '是否挂起',
    dataIndex: 'suspended',
    width: 120,
    customRender: ({ record }) => {
      return record.suspended ? '是' : '否';
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
