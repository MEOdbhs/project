import { BasicColumn, FormSchema } from '/@/components/Table';
import { getDictTextByCode } from '/@/utils/dict'
export const columns: BasicColumn[] = [

  {
    title: '类别',
    dataIndex: 'monitorCategoryName',
    width: 100,
  },
  {
    title: '设备类型',
    dataIndex: 'monitorTypeName',
    width: 100,
  },
  {
    title: '设备名称',
    dataIndex: 'monitorName',
    width: 150,
  },
  {
    title: '设备编号',
    dataIndex: 'monitorCode',
    width: 150,
  },
  {
    title: '校准循环周期',
    dataIndex: 'cyclePeriod',
    width: 120,
    customRender: ({ record }) => {
      return record.cyclePeriod + record.cyclePeriod
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: 100,
    slots: { customRender: 'state' },
  },
  {
    title: '任务人员',
    dataIndex: 'userNames',
    width: 120,
  },
  {
    title: '计划开始时间',
    dataIndex: 'startPlan',
    width: 160,
  },
  {
    title: '创建时间',
    dataIndex: 'createDt',
    width: 160,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'category',
    label: '类别',
    component: 'Select',
    componentProps: {
      options: [
        { label: '矿山', value: '矿山' },
        { label: '水利', value: '水利' },
        { label: '交通', value: '交通' },
      ],
      placeholder: '请选择',
    },
    colProps: { span: 6 },
  },
  {
    field: 'deviceType',
    label: '设备类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '表面位移', value: '表面位移' },
        { label: '内部位移', value: '内部位移' },
        { label: '渗压', value: '渗压' },
        { label: '雨量', value: '雨量' },
      ],
      placeholder: '请选择',
    },
    colProps: { span: 6 },
  },
  {
    field: 'keyword',
    label: '设备名称/编号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入设备名称或编号',
    },
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '未开始', value: '0' },
        { label: '进行中', value: '1' },
        { label: '已逾期', value: '2' },
        { label: '已完成', value: '3' },
      ],
      placeholder: '请选择',
    },
    colProps: { span: 6 },
  },
  {
    field: 'createTime',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    colProps: { span: 12 },
  },
  {
    field: 'rangTime',
    label: '开始时间',
    component: 'RangePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    colProps: { span: 12 },
  },
];