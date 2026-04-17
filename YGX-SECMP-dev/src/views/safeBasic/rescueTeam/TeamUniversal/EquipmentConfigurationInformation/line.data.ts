import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '装备总目录',
    dataIndex: 'equipmentCatalog',
    width: 200,
    ellipsis: true,
  },
  {
    title: '特种装备清单',
    dataIndex: 'specialName',
    width: 150,
  },
  {
    title: '装备数量',
    dataIndex: 'equipmentQuantity',
    width: 100,
    align: 'right',
  },
  {
    title: '装备完好率(%)',
    dataIndex: 'equipmentIntactRate',
    width: 120,
    align: 'right',
  },
  {
    title: '采购日期',
    dataIndex: 'equipmentPurchaseDate',
    width: 150,
  },
  {
    title: '维保记录',
    dataIndex: 'equipmentMaintenanceRecords',
    width: 200,
    ellipsis: true,
  },
  {
    title: '车辆类型',
    dataIndex: 'rescueVehicleName',
    width: 120,
  },
  {
    title: '车牌号',
    dataIndex: 'rescueVehiclePlate',
    width: 120,
  },
  {
    title: '核定载员',
    dataIndex: 'rescueVehicleApprovedNum',
    width: 100,
    align: 'right',
  },
  {
    title: '最大续航里程(km)',
    dataIndex: 'rescueVehicleMaxMileage',
    width: 140,
    align: 'right',
  },
  {
    title: '随车装备',
    dataIndex: 'rescueVehicleOnboardEquipment',
    width: 200,
    ellipsis: true,
  },
  {
    title: '个人防护配置标准',
    dataIndex: 'ppeConfigStandard',
    width: 180,
    ellipsis: true,
  },
  {
    title: '个人防护库存数量',
    dataIndex: 'ppeStockQuantity',
    width: 140,
    align: 'right',
  },
  {
    title: '存储地点',
    dataIndex: 'equipmentStorageLocation',
    width: 150,
    ellipsis: true,
  },
  {
    title: '管理责任人',
    dataIndex: 'equipmentManagerName',
    width: 120,
  },
];

export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'paramName',
  //   label: '参数名',
  //   component: 'Input',
  //   colProps: { span: 6 },
  // },
  // {
  //   field: 'paramTypeId',
  //   label: '参数类型',
  //   component: 'JDictSelectTag',
  //   componentProps: {
  //     dictCode: 'sys_param_type',
  //   },
  //   colProps: { span: 6 },
  // },
];
