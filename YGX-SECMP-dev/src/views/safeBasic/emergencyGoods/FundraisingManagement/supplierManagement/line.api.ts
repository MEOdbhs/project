import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/supplierInfo/listPage',
  saveOrUpdate = '/main-app/supplierInfo/saveOrUpdate',
  getViewById = '/main-app/supplierInfo/getById',
  deleteItem = '/main-app/supplierInfo/delete',
}

export interface SupplierRecord {
  id?: string;
  supplierName?: string;
  supplierType?: string;
  contactPerson?: string;
  contactPhone?: string;
  address?: string;
  supplierLevel?: string;
  cooperationStatus?: number;
  cooperationStartTime?: string;
  remarks?: string;
  supplierTypeName?: string;
  supplierLevelName?: string;
}

export function listPage(params: Record<string, any>) {
  return defHttp
    .get({ url: Api.listPage, params })
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

export function saveOrUpdate(params: SupplierRecord) {
  return defHttp.post({ url: Api.saveOrUpdate, params });
}

export function getViewById(params: { id: string }) {
  return defHttp.get({ url: Api.getViewById, params });
}

export function deleteItem(id: string, handleSuccess?: () => void) {
  return defHttp
    .get({ url: Api.deleteItem, params: { id } })
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

