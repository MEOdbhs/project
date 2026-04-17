import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/fundraisingPlan/listPage',
  saveOrUpdate = '/main-app/fundraisingPlan/saveOrUpdate',
  deleteById = '/main-app/fundraisingPlan/delete',
  getById = '/main-app/fundraisingPlan/getById',
}

export interface YjaqxxkFundraisingDetail {
  id?: string;
  rowId?: string;
  deleted?: number;
  version?: number;
  createBy?: string;
  createDt?: string;
  updateBy?: string;
  updateDt?: string;
  tenantId?: number;
  fundraisingPlanId?: string;
  materialType?: string;
  materialTypeName?: string;
  materialName?: string;
  quantity?: number;
  unit?: string;
  unitName?: string;
  estimatedBudget?: number;
  remarks?: string;
}

export interface FundraisingPlanRecord {
  id?: string;
  deleted?: number;
  version?: number;
  createBy?: string;
  createDt?: string;
  updateBy?: string;
  updateDt?: string;
  tenantId?: number;
  planName?: string;
  departmentId?: string;
  personInChargeId?: string;
  personInChargeName?: string;
  planDate?: string;
  demandDate?: string;
  estimatedBudget?: number;
  departmentName?: string;
  planStatus?: number;
  fundraisingDetailList?: YjaqxxkFundraisingDetail[];
}

export type FundraisingDetailRecord = YjaqxxkFundraisingDetail;

function parseRangeField(value: unknown): [string, string] | null {
  if (value == null || value === '') return null;
  if (Array.isArray(value) && value.length === 2) {
    const [a, b] = value;
    const start = typeof a === 'string' ? a : a?.format?.('YYYY-MM-DD') ?? String(a);
    const end = typeof b === 'string' ? b : b?.format?.('YYYY-MM-DD') ?? String(b);
    return [start, end];
  }
  if (typeof value === 'string' && value.includes(',')) {
    const [start, end] = value.split(',').map((s) => s.trim());
    if (start && end) return [start, end];
  }
  return null;
}

function mapListParams(params: Record<string, any>) {
  const { planDateRange, demandDateRange, ...rest } = params;
  const out: Record<string, any> = { ...rest };
  const planRange = parseRangeField(planDateRange);
  if (planRange) {
    out.startPlanDate = planRange[0];
    out.endPlanDate = planRange[1];
  }
  const demandRange = parseRangeField(demandDateRange);
  if (demandRange) {
    out.startDemandDate = demandRange[0];
    out.endDemandDate = demandRange[1];
  }
  if (out.planStatus !== undefined && out.planStatus !== '') out.planStatus = Number(out.planStatus);
  return out;
}

export function listPage(params: Record<string, any>) {
  const requestParams = mapListParams(params);
  return defHttp
    .get({
      url: Api.listPage,
      params: requestParams,
    })
    .then((res: any) => {
      const result = res?.result ?? res;
      return {
        records: result?.records ?? [],
        total: result?.total ?? 0,
        size: result?.size,
        current: result?.current,
      };
    });
}

export function deleteItem(id: string, handleSuccess?: () => void) {
  return defHttp
    .get({ url: Api.deleteById, params: { id } })
    .then(() => {
      message.success('删除成功');
      handleSuccess?.();
      return true;
    })
    .catch(() => {
      message.error('删除失败，请稍后重试');
      return false;
    });
}

export function saveOrUpdate(params: Partial<FundraisingPlanRecord>) {
  const payload: FundraisingPlanRecord = {
    ...params,
    fundraisingDetailList: (params.fundraisingDetailList ?? []).map((item) => ({ ...item })),
  };
  return defHttp.post({ url: Api.saveOrUpdate, params: payload });
}

export function getViewById(params: { id: string }) {
  return defHttp.get({ url: Api.getById, params }).then((res: any) => {
    const raw = res?.result ?? res;
    if (!raw) return null;
    const record: FundraisingPlanRecord = {
      ...raw,
      fundraisingDetailList: (raw.fundraisingDetailList ?? []).map((item: YjaqxxkFundraisingDetail) => ({
        ...item,
        rowId: item.id ?? `row_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      })),
    };
    return record;
  });
}
