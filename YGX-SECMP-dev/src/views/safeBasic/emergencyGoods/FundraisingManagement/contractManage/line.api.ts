import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/contractInfo/listPage',
  saveOrUpdate = '/main-app/contractInfo/saveOrUpdate',
  deleteById = '/main-app/contractInfo/delete',
  getById = '/main-app/contractInfo/getById',
}

export interface YjaqxxkContractPayment {
  id?: string;
  contractId?: string;
  paymentMethod?: string;
  paymentAmount?: number;
  paymentRatio?: number;
  paymentDate?: string;
  remarks?: string;
}

export interface ContractRecord {
  id?: string;
  contractCode?: string;
  contractName?: string;
  contractAmount?: number;
  isTerminated?: number;
  partyAName?: string;
  partyAContact?: string;
  partyAPhone?: string;
  partyBName?: string;
  partyBContact?: string;
  partyBPhone?: string;
  signDate?: string;
  effectiveDate?: string;
  expiryDate?: string;
  contractDuration?: number;
  contractDesc?: string;
  remarks?: string;
  contractStatus?: number;
  contractPaymentList?: YjaqxxkContractPayment[];
}

export type PaymentRecord = YjaqxxkContractPayment & { rowId?: string };

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
  const { signDateRange, ...rest } = params;
  const out: Record<string, any> = { ...rest };
  const range = parseRangeField(signDateRange);
  if (range) {
    out.startTime = range[0];
    out.endTime = range[1];
  }
  if (out.contractStatus !== undefined && out.contractStatus !== '') out.contractStatus = Number(out.contractStatus);
  return out;
}

export function listPage(params: Record<string, any>) {
  const requestParams = mapListParams(params);
  return defHttp.get({
    url: Api.listPage,
    params: requestParams,
  }).then((res: any) => {
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

function paymentToApi(item: PaymentRecord): YjaqxxkContractPayment {
  return {
    id: item.id,
    contractId: item.contractId,
    paymentMethod: item.paymentMethod,
    paymentAmount: item.paymentAmount,
    paymentRatio: item.paymentRatio,
    paymentDate: item.paymentDate,
    remarks: item.remarks,
  };
}

function paymentFromApi(item: YjaqxxkContractPayment): PaymentRecord {
  return {
    ...item,
    rowId: item.id ?? `row_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  };
}

export function saveOrUpdate(params: Partial<ContractRecord>) {
  const payload: Record<string, any> = {
    id: params.id,
    contractCode: params.contractCode,
    contractName: params.contractName,
    contractAmount: params.contractAmount,
    isTerminated: params.isTerminated ?? 2,
    partyAName: params.partyAName,
    partyAContact: params.partyAContact,
    partyAPhone: params.partyAPhone,
    partyBName: params.partyBName,
    partyBContact: params.partyBContact,
    partyBPhone: params.partyBPhone,
    signDate: params.signDate,
    effectiveDate: params.effectiveDate,
    expiryDate: params.expiryDate,
    contractDuration: params.contractDuration,
    contractDesc: params.contractDesc,
    remarks: params.remarks,
    contractStatus: params.contractStatus,
  };
  payload.contractPaymentList = (params.contractPaymentList ?? []).map(paymentToApi);
  return defHttp.post({ url: Api.saveOrUpdate, params: payload });
}

export function getViewById(params: { id: string }) {
  return defHttp.get({ url: Api.getById, params }).then((res: any) => {
    const raw = res?.result ?? res;
    if (!raw) return null;
    const record: ContractRecord = {
      ...raw,
      contractPaymentList: (raw.contractPaymentList ?? []).map(paymentFromApi),
    };
    return record;
  });
}

export function getNextContractCode() {
  return Promise.resolve(`HT-${new Date().getFullYear()}-${String(Date.now()).slice(-8)}`);
}
