const postMock = jest.fn()
const getMock = jest.fn()

jest.mock('/@/utils/http/axios', () => ({
  defHttp: {
    post: postMock,
    get: getMock,
  },
}))

import {
  addEnterprise,
  deleteById,
  getAreaTree,
  listPage,
  queryMineDetail,
  saveBaseInfo,
} from '../../../../src/views/oneEnterpriseDoc/enterpriseList/enterprise.api'

describe('enterprise.api', () => {
  beforeEach(() => {
    postMock.mockReset()
    getMock.mockReset()
  })

  it('分页接口: 应调用 /api/v1/mine/listPage 并封装 govMinePageDTO', () => {
    const params = { pageNo: 1, pageSize: 20, name: 'A' }
    listPage(params)
    expect(postMock).toHaveBeenCalledWith({
      url: '/main-app/api/v1/mine/listPage',
      params: { govMinePageDTO: params },
    })
  })

  it('删除接口: 应调用 /api/v1/mine/removeMine', () => {
    deleteById('mine-1')
    expect(postMock).toHaveBeenCalledWith({
      url: '/main-app/api/v1/mine/removeMine',
      params: { id: 'mine-1' },
    })
  })

  it('新增接口: 应调用 /api/v1/riskCompanyInfo/addCompanyInfo', () => {
    const body = { riskCompanyInfo: { name: '测试企业' } }
    addEnterprise(body)
    expect(postMock).toHaveBeenCalledWith({
      url: '/main-app/api/v1/riskCompanyInfo/addCompanyInfo',
      params: body,
    })
  })

  it('区域树接口: 应调用 /api/v1/area/city/all', () => {
    getAreaTree()
    expect(getMock).toHaveBeenCalledWith({
      url: '/main-app/api/v1/area/city/all',
    })
  })

  it('详情接口: 应调用 /api/v1/mine/queryMineDetail', () => {
    queryMineDetail({ id: 'mine-1' })
    expect(getMock).toHaveBeenCalledWith({
      url: '/main-app/api/v1/mine/queryMineDetail',
      params: { id: 'mine-1' },
    })
  })

  it('基本信息保存: 应调用 /api/v1/mine/v1/check/mines', () => {
    const body = { id: 'mine-1', name: '测试矿山', type: '01', areaId: '620100' }
    saveBaseInfo(body)
    expect(postMock).toHaveBeenCalledWith({
      url: '/main-app/api/v1/mine/v1/check/mines',
      params: body,
    })
  })
})
