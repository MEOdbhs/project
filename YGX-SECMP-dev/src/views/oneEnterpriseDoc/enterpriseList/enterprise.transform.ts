export type DictTextGetter = (value: string, code: string) => string

export function normalizeArrayValue({ value }: { value: unknown }): string[] {
  if (Array.isArray(value)) return value.map((item) => `${item}`).filter(Boolean)
  if (typeof value === 'string') return value ? value.split(',').filter(Boolean) : []
  return []
}

export function buildListQueryParams({
  params,
  getDictText,
}: {
  params: Record<string, any>
  getDictText: DictTextGetter
}) {
  const queryParams = { ...params }
  const productionStatusValues = normalizeArrayValue({ value: queryParams.productionStatus })
  if (productionStatusValues.length > 0) {
    queryParams.mineStateList = productionStatusValues.map(
      (value) => getDictText(value, 'mine_product_status') || value,
    )
  } else {
    delete queryParams.mineStateList
  }

  if (queryParams.speciality) queryParams.mineType = queryParams.speciality
  if (!queryParams.mineType) delete queryParams.mineType
  if (!queryParams.areaCode) delete queryParams.areaCode
  if (!queryParams.name) delete queryParams.name

  delete queryParams.speciality
  delete queryParams.productionStatus
  return queryParams
}

export function buildListPageBody({ queryParams }: { queryParams: Record<string, any> }) {
  return queryParams 
}

export function buildRemoveMineBody({ id }: { id: string }) {
  return { id }
}

export function buildAddCompanyInfoBody({
  values,
  getDictText,
}: {
  values: Record<string, any>
  getDictText: DictTextGetter
}) {
  return {
    name: values.name,
    code: values.code,
    areaId: values.areaId,
    areaName: values.areaName,
    deptId: values.deptId,
    speciality: getDictText(values.speciality, 'mine_speciality') || values.speciality,
    sortNo: Number(values.sortNo),
    productionStatus:
      getDictText(values.productionStatus, 'mine_product_status') || values.productionStatus,
  }
}
