import { BasicColumn, FormSchema } from '/@/components/Table'
import { getDictTextByCode } from '/@/utils/dict'
import { getAreaTree } from '../enterpriseList/enterprise.api'

/** 审核状态映射 */
export const checkStateMap: Record<string, string> = {
  '01': '待提交',
  '02': '待审核',
  '03': '退回',
  '04': '审核通过',
}

/** 待审核 Tab 列定义 */
export const columnsToReview: BasicColumn[] = [
  { title: '企业名称', dataIndex: 'mineName', width: 260 },
  { title: '区域', dataIndex: 'areaName', width: 130 },
  {
    title: '企业类型（矿山）',
    dataIndex: 'mineTypeName',
    width: 160
  },
  { title: '企业编码（矿山）', dataIndex: 'mineId', width: 170 },
  {
    title: '企业状态',
    dataIndex: 'mineState',
    width: 120
  },
  { title: '操作时间', dataIndex: 'operationDatetime', width: 170 },
  {
    title: '审核状态',
    dataIndex: 'checkState',
    width: 110,
    customRender: ({ value }) => checkStateMap[value] || '-',
  },
]

/** 未提交/退回 Tab 列定义 */
export const columnsUnsubmitted: BasicColumn[] = [
  { title: '企业名称', dataIndex: 'mineName', width: 260 },
  { title: '区域', dataIndex: 'areaName', width: 130 },
  {
    title: '企业类型（矿山）',
    dataIndex: 'mineType',
    width: 160,
    customRender: ({ value }) => getDictTextByCode(value, 'MineType') || '-',
  },
  { title: '企业编码（矿山）', dataIndex: 'mineId', width: 170 },
  {
    title: '企业状态',
    dataIndex: 'mineState',
    width: 120,
    customRender: ({ value }) => getDictTextByCode(value, 'MineState') || '-',
  },
  { title: '操作时间', dataIndex: 'operationDatetime', width: 170 },
  {
    title: '审核状态',
    dataIndex: 'checkState',
    width: 110,
    customRender: ({ value }) => checkStateMap[value] || '-',
  },
]

/** 搜索表单 Schema */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'mineType',
    label: '企业类型',
    component: 'JDictSelectTag',
    colProps: { span: 6 },
    componentProps: {
      dictCode: 'MineType',
      placeholder: '请选择企业类型',
      allowClear: true,
    },
  },
  {
    field: 'areaCode',
    label: '区域',
    component: 'ApiTreeSelect',
    colProps: { span: 6 },
    componentProps: {
      api: getAreaTree,
      resultField: 'children',
      fieldNames: { label: 'label', value: 'value', children: 'children' },
      treeDefaultExpandAll: true,
      placeholder: '请选择区域',
      allowClear: true,
    },
  },
  {
    field: 'name',
    label: '企业名称',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: { placeholder: '请输入企业名称' },
  },
]

/** mock：审核统计（待审核数 / 未提交+退回数） */
export const mockAuditStat = {
  toReviewed: 0,
  unSubmit: 0,
  refunded: 0,
  reviewed: 0,
}

/** mock：待审核列表 */
export const mockToReviewList = {
  records: [
    {
      id: 'audit-001',
      waitCheckId: 'wc-001',
      mineName: '永靖县盛达煤矿有限公司',
      mineId: 'MINE-YJX-0001',
      mineType: '2',
      areaName: '永靖县',
      areaCode: '620122',
      mineState: '01',
      operationDatetime: '2026-03-01 09:30:00',
      checkState: '02',
    },
    {
      id: 'audit-002',
      waitCheckId: 'wc-002',
      mineName: '永靖县宏远铁矿有限公司',
      mineId: 'MINE-YJX-0002',
      mineType: '3',
      areaName: '永靖县',
      areaCode: '620122',
      mineState: '01',
      operationDatetime: '2026-02-28 14:20:00',
      checkState: '02',
    },
    {
      id: 'audit-003',
      waitCheckId: 'wc-003',
      mineName: '永靖县金鑫矿业有限公司',
      mineId: 'MINE-YJX-0003',
      mineType: '1',
      areaName: '永靖县',
      areaCode: '620122',
      mineState: '02',
      operationDatetime: '2026-02-25 16:45:00',
      checkState: '02',
    },
  ],
  total: 3,
}

/** mock：未提交/退回列表 */
export const mockUnsubmittedList = {
  records: [
    {
      id: 'audit-004',
      waitCheckId: 'wc-004',
      mineName: '永靖县瑞丰矿业股份有限公司',
      mineId: 'MINE-YJX-0004',
      mineType: '2',
      areaName: '永靖县',
      areaCode: '620122',
      mineState: '01',
      operationDatetime: '2026-01-15 10:00:00',
      checkState: '01',
    },
    {
      id: 'audit-005',
      waitCheckId: 'wc-005',
      mineName: '永靖县华锋石灰岩矿有限公司',
      mineId: 'MINE-YJX-0005',
      mineType: '5',
      areaName: '永靖县',
      areaCode: '620122',
      mineState: '03',
      operationDatetime: '2026-02-10 08:55:00',
      checkState: '03',
    },
    {
      id: 'audit-006',
      waitCheckId: 'wc-006',
      mineName: '永靖县天成非金属矿业有限公司',
      mineId: 'MINE-YJX-0006',
      mineType: '4',
      areaName: '永靖县',
      areaCode: '620122',
      mineState: '01',
      operationDatetime: '2026-01-20 11:30:00',
      checkState: '03',
    },
  ],
  total: 3,
}

/** mock：企业详情（审核页/查看页使用） */
export const mockAuditDetail = {
  id: 'audit-001',
  waitCheckId: 'wc-001',
  mineName: '永靖县盛达煤矿有限公司',
  mineId: 'MINE-YJX-0001',
  meTyshxydm: '91620122MA6XTEST12',
  mineType: '2',
  areaCode: '620122',
  areaName: '永靖县',
  mineState: '01',
  checkState: '02',
  operationDatetime: '2026-03-01 09:30:00',
  legalName: '张伟',
  legalPhone: '13900139001',
  directorName: '刘强',
  directorPhone: '13900139002',
  contacts: '陈明',
  contactsPhone: '028-66666666',
  contactsMailbox: 'chenming@test.com',
  address: '甘肃省临夏回族自治州永靖县工业园区矿山路8号',
  productionStatus: '01',
  buildMineDate: '2008-03-15',
  productDate: '2009-09-01',
  industry: '煤炭',
  companyEconomyType: '有限责任公司',
  safeManageOrgName: '安全生产管理部',
  fullTimeSafePersonCount: 8,
  safeDirectorName: '王磊',
  safeDirectorPhone: '13900139003',
  seniorManagementCount: 5,
  professionalTechniciansCount: 15,
  specialOperationPersonCount: 30,
  employeesCount: 200,
  longitude: 103.317520,
  latitude: 35.940130,
  postalCode: '731600',
  rcjgzt: '永靖县应急管理局',
  // 退回原因（checkState === '03' 时有值）
  content: '',
  returnDateTime: '',
  safeLicenceDTO: {
    aqxkzLicenceNumber: 'AQ-2024-010023',
    aqxkzStartDate: '2024-01-01',
    aqxkzExpiresDate: '2027-01-01',
    aqxkzIssuanceOrg: '四川省应急管理厅',
    aqxkzFirstCertificatesDate: '2009-09-01',
    aqxkzBusinessNature: '开采煤矿',
  },
}
