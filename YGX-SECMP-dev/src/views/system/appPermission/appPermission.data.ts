import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

export const dataTypeList = [
  {
    label: '字符串',
    value: 'string',
  },
  {
    label: '整数',
    value: 'integer',
  },
  {
    label: '浮点数',
    value: 'double',
  },
  {
    label: '布尔',
    value: 'boolean',
  },
  {
    label: '日期时间',
    value: 'datetime',
  },
  {
    label: 'JSON',
    value: 'json',
  },
];
export const interfaceOptionList = [
  {
    label: 'GET',
    value: 0,
  },
  {
    label: 'POST',
    value: 1,
  },
  {
    label: 'POST',
    value: 2,
  },
  {
    label: 'DELETE',
    value: 3,
  },
  {
    label: 'OPTIONS',
    value: 4,
  },
  {
    label: 'HEAD',
    value: 5,
  },
  {
    label: 'PATCH',
    value: 6,
  },
  {
    label: 'TRACE',
    value: 7,
  },
];
export const columns = [
  {
    title: '应用名称',
    dataIndex: 'appName',
    width: 200,
  },
  {
    title: '关联账号',
    dataIndex: 'appAccount',
    width: 100,
  },
  {
    title: '是否启用',
    dataIndex: 'status',
    width: 80,
    customRender: (text) => {
      const label = text.value === 1 ? '是' : '否';
      const color = text.value === 1 ? 'blue' : 'red';
      return render.renderTag(label, color);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createDt',
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'memo',
    width: 300,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'appName',
    label: '应用名称',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'status',
    label: '是否启用',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ], //
      labelField: 'label',
      valueField: 'value',
      placeholder: '请选择',
    },
    colProps: { span: 3 },
  },
];

export const columnsInterface = [
  {
    title: '接口名称',
    dataIndex: 'interfaceName',
    width: 140,
  },
  {
    title: '接口地址',
    dataIndex: 'url',
    width: 140,
  },
  {
    title: '请求方式',
    dataIndex: 'interfaceOption',
    width: 80,
    customRender: (text) => {
      const item = interfaceOptionList.find((i) => i.value === text.value);
      return item?.label || '';
    },
  },
  {
    title: '是否鉴权',
    dataIndex: 'authType',
    width: 80,
    customRender: (text) => {
      const label = text.value === 1 ? '是' : '否';
      const color = text.value === 1 ? 'blue' : 'red';
      return render.renderTag(label, color);
    },
  },
  {
    title: '是否启用',
    dataIndex: 'status',
    width: 80,
    customRender: (text) => {
      // 是否启用 0：停用 1：启用
      const label = text.value === 1 ? '是' : '否';
      const color = text.value === 1 ? 'blue' : 'red';
      return render.renderTag(label, color);
    },
  },
  {
    title: '标签',
    dataIndex: 'interfaceTag',
    width: 80,
    customRender: (text) => {
      // 是否启用 0：停用 1：启用
      const label = text.value;
      const color = 'green';
      return render.renderTag(label, color);
    },
  },
  {
    title: '接口描述',
    dataIndex: 'memo',
    width: 160,
  },
];

export const searchFormSchemaInterface: FormSchema[] = [
  {
    field: 'interfaceName',
    label: '接口名称',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'status',
    label: '是否启用',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ], //
      labelField: 'label',
      valueField: 'value',
      placeholder: '请选择',
    },
    colProps: { span: 3 },
  },
];
