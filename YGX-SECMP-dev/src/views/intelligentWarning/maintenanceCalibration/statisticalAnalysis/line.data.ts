import { BasicColumn, FormSchema } from '/@/components/Table';

// 设备可靠性分析表格列定义
export const columns: BasicColumn[] = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 60,
    customRender: ({ index }) => index + 1,
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    width: 120,
  },
  {
    title: '类别',
    dataIndex: 'category',
    width: 100,
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: 120,
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: 150,
  },
  {
    title: '设备数量',
    dataIndex: 'deviceCount',
    width: 100,
    align: 'center',
  },
  {
    title: '故障率',
    dataIndex: 'failureRate',
    width: 100,
    align: 'center',
    customRender: ({ text }) => `${text}%`,
  },
];

// 设备可靠性分析搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'category',
    label: '类别',
    component: 'Select',
    componentProps: {
      options: [
        { label: '矿山', value: '矿山' },
        { label: '地质灾害', value: '地质灾害' },
        { label: '水文', value: '水文' },
        { label: '工贸', value: '工贸' },
        { label: '危险化学品', value: '危险化学品' },
        { label: '森林防火', value: '森林防火' },
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
    field: 'deviceName',
    label: '设备名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入设备名称',
    },
    colProps: { span: 6 },
  },
];