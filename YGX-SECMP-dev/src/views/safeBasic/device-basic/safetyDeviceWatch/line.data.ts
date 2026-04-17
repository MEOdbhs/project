import { FormSchema } from '/@/components/Table';
import { getDictTextByCode } from '/@/utils/dict';
import { getHazardManageList } from './line.api';
import { useUserStore } from '/@/store/modules/user';

const userStore = useUserStore();
let orgCode = '';
orgCode = userStore.currentEnterpriseCode || '';
console.log(orgCode);

export const columns = [
  {
    title: '监测对象',
    dataIndex: 'checkTargetId',
    customRender: ({ record }) => {
      return getDictTextByCode(record.checkTargetId, 'safe_device_check_target');
    },
    width: 150,
  },
  {
    title: '重大危险源',
    dataIndex: 'seriousOriginalId',
    width: 150,
    customRender: ({ record }) => {
      return record.seriousOriginalName || record.seriousOriginalId || '';
    },
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: 200,
  },
    {
      title:'设备类别',
      dataIndex:'deviceCategoryName',
      width: 150,
    },
    {
      title:'设备类型',
      dataIndex:'deviceTypeName',
      width: 150,
    },

  {
    title: '位置描述',
    dataIndex: 'locationDesc',
    width: 200,
  },
  {
    title: '地点坐标',
    dataIndex: 'longitude',
    width: 200,
    customRender: ({ record }) => {
      if (record.longitude && record.latitude) {
        return `${record.longitude},${record.latitude}`;
      }
      return '';
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'checkTargetId',
    label: '监测对象',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'safe_device_check_target',
      placeholder: '请选择监测对象',
    },
    colProps: { span: 6 },
  },
  {
    field: 'seriousOriginalId',
    label: '重大危险源',
    component: 'ApiSelect',
    componentProps: {
      api: getHazardManageList,
      params: { orgCode: orgCode },
      labelField: 'hazardName',
      valueField: 'id',
      placeholder: '请选择重大危险源',
    },
    colProps: { span: 6 },
  },
  {
    field: 'deviceName',
    label: '设备名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入设备名称',
    },
    colProps: { span: 6 },
  },
];
