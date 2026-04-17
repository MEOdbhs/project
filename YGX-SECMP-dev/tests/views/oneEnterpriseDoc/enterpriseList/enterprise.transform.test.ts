import {
  buildAddCompanyInfoBody,
  buildListPageBody,
  buildListQueryParams,
  buildRemoveMineBody,
} from '../../../../src/views/oneEnterpriseDoc/enterpriseList/enterprise.transform'

function createDictTextGetter() {
  return (value: string, code: string) => {
    if (code === 'mine_product_status' && value === '01') return '正常生产'
    if (code === 'mine_product_status' && value === '02') return '停产'
    if (code === 'mine_speciality' && value === '03') return '尾矿库'
    return ''
  }
}

describe('enterprise.transform', () => {
  it('筛选条件: 应转换 mineType 与 mineStateList', () => {
    const queryParams = buildListQueryParams({
      params: {
        speciality: '03',
        productionStatus: '01,02',
        areaCode: '620100',
        name: '测试企业',
      },
      getDictText: createDictTextGetter(),
    })

    expect(queryParams).toEqual({
      mineType: '03',
      mineStateList: ['正常生产', '停产'],
      areaCode: '620100',
      name: '测试企业',
    })
  })

  it('筛选条件: 空值应被清理', () => {
    const queryParams = buildListQueryParams({
      params: {
        speciality: '',
        productionStatus: '',
        areaCode: '',
        name: '',
      },
      getDictText: createDictTextGetter(),
    })
    expect(queryParams).toEqual({})
  })

  it('分页: 应封装为 govMinePageDTO', () => {
    const body = buildListPageBody({ queryParams: { pageNo: 1, pageSize: 20, name: 'A' } })
    expect(body).toEqual({ govMinePageDTO: { pageNo: 1, pageSize: 20, name: 'A' } })
  })

  it('删除: 应按 removeMine 参数格式组装', () => {
    expect(buildRemoveMineBody({ id: 'abc-123' })).toEqual({ id: 'abc-123' })
  })

  it('新增页面: 应转换字典文本并封装 riskCompanyInfo', () => {
    const body = buildAddCompanyInfoBody({
      values: {
        name: '测试企业',
        code: 'M123',
        areaId: '620100',
        areaName: '兰州市',
        speciality: '03',
        sortNo: '8',
        productionStatus: '01',
      },
      getDictText: createDictTextGetter(),
    })

    expect(body).toEqual({
      riskCompanyInfo: {
        name: '测试企业',
        code: 'M123',
        areaId: '620100',
        areaName: '兰州市',
        speciality: '尾矿库',
        sortNo: 8,
        productionStatus: '正常生产',
      },
    })
  })
})
