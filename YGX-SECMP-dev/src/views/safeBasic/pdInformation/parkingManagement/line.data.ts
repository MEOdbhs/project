import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '装置名称',
    dataIndex: 'deviceName',
    width: 150,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 120,
    // customRender: ({ record }) => {
    //   return record.type === '1' ? '开车' : '停车';
    // }
  },
  {
    title: '计划开始时间',
    dataIndex: 'startTime',
    width: 150,
  },
  {
    title: '预计结束时间',
    dataIndex: 'endTime',
    width: 120,
  },
  {
    title: '开/停车原因',
    dataIndex: 'reason',
    width: 120,
  },
  
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'deviceName',
    label: '装置名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'type',
    label: '开停车类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'safeBasic-park-enum',
    },
    colProps: { span: 6 },
  },
];
