import { BasicColumn, FormSchema } from '/@/components/Table'
import { getDictTextByCode } from '/@/utils/dict'

export const columns: BasicColumn[] = [
  {
    title: '金属冶炼单元从业人员总数',
    dataIndex: 'smeltingStaffTotal',
  },
  {
    title: '企业内部煤气输配管道长度(米)',
    dataIndex: 'gasPipeLength',
  },
  {
    title: '粗钢设计产能(万吨/年)',
    dataIndex: 'crudeSteelDesignCap',
  },
  {
    title: '工艺流程',
    dataIndex: 'processFlow',
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'creditCode',
  },
  
]

export const searchFormSchema: FormSchema[] = [
 
]

/** mock 列表数据 */
export const mockListData = {
  records: [
    // {
    //   id: 'mock-001',
    //   name: '永靖县盛达煤矿有限公司',
    //   mineId: 'MINE-YJX-0001',
    //   meTyshxydm: '91620122MA6ABCDE12',
    //   mineType: '2',
    //   areaId: '620122',
    //   areaName: '永靖县',
    //   rcjgzt: '永靖县应急管理局',
    //   operationDatetime: '2026-03-01 10:20:00',
    //   checkStateText: '审核通过',
    //   legalName: '张伟',
    //   legalPhone: '13909301001',
    //   directorName: '刘强',
    //   directorPhone: '13909301002',
    //   contactsPhone: '0930-8888888',
    //   productionStatus: '01',
    //   address: '甘肃省临夏回族自治州永靖县工业园区矿山路8号',
    //   buildMineDate: '2008-03-15',
    //   productDate: '2009-09-01',
    //   industry: '煤炭',
    //   companyEconomyType: '有限责任公司',
    //   safeManageOrgName: '安全生产管理部',
    //   fullTimeSafePersonCount: 8,
    //   safeDirectorName: '王磊',
    //   safeDirectorPhone: '13909301003',
    //   contacts: '陈明',
    //   contactsMailbox: 'chenming@yjxmine.com',
    //   seniorManagementCount: 5,
    //   professionalTechniciansCount: 15,
    //   specialOperationPersonCount: 30,
    //   employeesCount: 200,
    //   longitude: 103.317520,
    //   latitude: 35.940130,
    //   postalCode: '731600',
    //   // 安全许可证信息
    //   safeLicenceDTO: {
    //     aqxkzLicenceNumber: 'AQ-2024-YJX-0001',
    //     aqxkzStartDate: '2024-01-01',
    //     aqxkzExpiresDate: '2027-01-01',
    //     aqxkzIssuanceOrg: '甘肃省应急管理厅',
    //     aqxkzFirstCertificatesDate: '2009-09-01',
    //     aqxkzBusinessNature: '开采煤矿',
    //   },
    // },
  ],
  total: 1,
  size: 20,
  current: 1,
}

/** mock 详情数据 */
export const mockDetailData = {}
