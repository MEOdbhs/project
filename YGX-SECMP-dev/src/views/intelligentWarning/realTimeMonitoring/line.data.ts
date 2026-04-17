import { BasicColumn, FormSchema } from '/@/components/Table';
import { getDictTextByCode } from '/@/utils/dict';

// ========== 矿山、工贸、化学品共用列（根据类型动态生成） ==========
export const getIndustryColumns = (type: string): BasicColumn[] => {
  // 第一列：矿山类型 或 行业类型
  const firstColumn: BasicColumn = {
    title: type === 'mine' ? '矿山类型' : '行业类型',
    dataIndex: 'type',
    width: 100,
    customRender: ({ record }) => {
      if (type === 'mine') {
        // 矿山：映射为文字
        return record.type === '1' ? '露天矿山' : '地下矿山';
      } else {
        // 工贸、化学品：直接显示原值
        return getDictTextByCode(record.type, 'mine_belong_industry_08') || '--';
      }
    },
  };

  const columns: BasicColumn[] = [
    firstColumn,
    { title: '企业名称', dataIndex: 'companyName', width: 180 },
    { title: '地址', dataIndex: 'address', width: 200, ellipsis: true },
  ];

  // 仅矿山添加“企业生产状态”列
  if (type === 'mine') {
    columns.push({
      title: '企业生产状态',
      dataIndex: 'state',
      customRender: ({ record }) => getDictTextByCode(record.state, 'production_status'),
      width: 100,
    });
  }

  // 公共列：企业编码、传感器监测、视频监控
  columns.push(
    { title: '企业编码', dataIndex: 'companyCode', width: 150 },
    {
      title: '传感器监测',
      dataIndex: 'sensorNum',
      width: 100,
      customRender: ({ record }: any) => `${record.sensorNum}/${record.sensorLineNum || 0}`,
    },
    { title: '视频监控', dataIndex: 'videoNum', width: 100 },
  );

  return columns;
};

// ========== 矿山搜索表单 ==========
export const mineSearchSchema: FormSchema[] = [
  {
    field: 'type',
    label: '矿山类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '露天矿山', value: '1' },
        { label: '地下矿山', value: '2' },
      ],
      placeholder: '请选择',
      allowClear: true,
    },
    colProps: { span: 6 },
  },
  {
    field: 'state',
    label: '生产状态',
    component: 'JDictSelectTag',
    componentProps: { dictCode: 'production_status' },
    colProps: { span: 6 },
  },
  {
    field: 'companyName',
    label: '企业名称',
    component: 'Input',
    componentProps: { placeholder: '请输入企业名称' },
    colProps: { span: 6 },
  },
];

// ========== 工贸搜索表单 ==========
export const industrySearchSchema: FormSchema[] = [
   {
    field: 'type',
    label: '行业类型',
    component: 'JDictSelectTag',
    componentProps: { dictCode: 'mine_belong_industry_08' },
    colProps: { span: 6 },
  },
  {
    field: 'companyName',
    label: '企业名称',
    component: 'Input',
    componentProps: { placeholder: '请输入企业名称' },
    colProps: { span: 6 },
  },
];

// ========== 危险化学品搜索表单 ==========
export const chemicalSearchSchema: FormSchema[] = [
  {
    field: 'type',
    label: '行业类型',
    component: 'JDictSelectTag',
    componentProps: { dictCode: 'mine_belong_industry_08' },
    colProps: { span: 6 },
  },
  {
    field: 'companyName',
    label: '企业名称',
    component: 'Input',
    componentProps: { placeholder: '请输入企业名称' },
    colProps: { span: 6 },
  },
];

// ========== 地质灾害、水文、森林防火共用搜索表单 ==========
export const sensingSearchSchema: FormSchema[] = [
  {
    field: 'monitorTypeId',
    label: '设备类型',
    component: 'Input',
    componentProps: { placeholder: '请输入设备类型' },
    colProps: { span: 6 },
  },
  {
    field: 'monitorNameAndCode',
    label: '设备名称/编号',
    component: 'Input',
    componentProps: { placeholder: '请输入设备名称或编号' },
    colProps: { span: 6 },
  },
  {
    field: 'onlineStatus',
    label: '在线状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '在线', value: 'Y' },
        { label: '离线', value: 'N' },
      ],
      placeholder: '请选择',
      allowClear: true,
    },
    colProps: { span: 6 },
  },
];

// 地质灾害额外字段：隐患点名称/编号
export const geologySearchSchema: FormSchema[] = [
  ...sensingSearchSchema,
  {
    field: 'monitorName',
    label: '隐患点名称/编号',
    component: 'Input',
    componentProps: { placeholder: '请输入隐患点名称或编号' },
    colProps: { span: 6 },
  },
];

// ========== 传感器/视频监控动态列定义 ==========
// 地质灾害传感器列
export const geologySensorColumns: BasicColumn[] = [
  { title: '隐患点编号', dataIndex: 'monitorCode', width: 150 },
  { title: '隐患点名称', dataIndex: 'monitorName', width: 180 },
  { title: '设备类型', dataIndex: 'monitorTypeId', width: 120 },
  { title: '设备名称', dataIndex: 'deviceName', width: 150 },
  { title: '设备编号', dataIndex: 'deviceCode', width: 150 },
  { title: '安装位置', dataIndex: 'installLocation', width: 180, ellipsis: true },
  { title: '最近采集时间', dataIndex: 'collectTime', width: 160 },
  { title: '在线状态', dataIndex: 'onlineStatus', width: 100 },
];

// 地质灾害监控列
export const geologyVideoColumns: BasicColumn[] = [
  { title: '设备名称', dataIndex: 'deviceName', width: 150 },
  { title: '设备编号', dataIndex: 'deviceCode', width: 150 },
  { title: '安装位置', dataIndex: 'installLocation', width: 200 },
  { title: '在线状态', dataIndex: 'onlineStatus', width: 100 },
];

// 水文传感器列
export const hydrologySensorColumns: BasicColumn[] = [
  { title: '监测类型', dataIndex: 'monitorTypeName', width: 120 },
  { title: '设备名称', dataIndex: 'deviceName', width: 150 },
  { title: '设备编号', dataIndex: 'deviceCode', width: 150 },
  { title: '安装位置', dataIndex: 'installLocation', width: 180 },
  { title: '关联测站', dataIndex: 'stationName', width: 120 },
  { title: '测站编号', dataIndex: 'stationCode', width: 120 },
  { title: '最近采集时间', dataIndex: 'collectTime', width: 160 },
  { title: '在线状态', dataIndex: 'onlineStatus', width: 100 },
];

// 水文监控列（复用地质灾害监控列）
export const hydrologyVideoColumns = geologyVideoColumns;

// 森林防火传感器列（复用水文传感器列）
export const forestSensorColumns = hydrologySensorColumns;

// 森林防火监控列（复用地质灾害监控列）
export const forestVideoColumns = geologyVideoColumns;