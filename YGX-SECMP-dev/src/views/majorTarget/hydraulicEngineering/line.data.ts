import { FormSchema } from '/@/components/Table';
import { Tag } from 'ant-design-vue';
import { h } from 'vue';

// 基础信息列（已有）
export const baseColumns = [
  {
    title: '工程编号',
    dataIndex: 'no',
    width: 150,
  },
  {
    title: '工程名称',
    dataIndex: 'name',
    width: 180,
  },
  {
    title: '工程类型',
    dataIndex: 'waterprojTypeName',
    width: 120,
  },
  {
    title: '地理位置',
    dataIndex: 'loc',
    width: 200,
    ellipsis: true,
  },
  {
    title: '责任单位',
    dataIndex: 'dutyUnit',
    width: 150,
  },
  {
    title: '运行状态',
    dataIndex: 'waterprojStatusId',
    width: 120,
    customRender: ({ record }) => {
      let color = 'default';
      let text = '待确认';
      if (record.waterprojStatusId === 'maintenance') {
        color = 'grey';
        text = '需要维护';
      }
      if (record.waterprojStatusId === 'operating') {
        color = 'green';
        text = '正常运行';
      }
      if (record.waterprojStatusId === 'repairing') {
        color = 'red';
        text = '维修中';
      }
      return h(Tag, { color }, () => text);
    },
  },
];

export const baseSearchForm: FormSchema[] = [
  {
    field: 'name',
    label: '工程名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'waterprojTypeId',
    label: '工程类型',
    component: 'JDictSelectTag',
    componentProps: { dictCode: 'waterproj_type' },
    colProps: { span: 6 },
  },
  {
    field: 'dateRange',
    label: '开始日期至结束日期',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
      
    },
    colProps: { span: 8 },
  },
];

export const riskSearchForm: FormSchema[] = [
  {
    field: 'impactLevel',
    label: '影响等级',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'dateRange',
    label: '开始日期至结束日期',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
      
    },
    colProps: { span: 8 },
  },
];
export const siteNameForm: FormSchema[] = [
  {
    field: 'name',
    label: '站点名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];
export const systemNameForm: FormSchema[] = [
  {
    field: 'name',
    label: '制度名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];
export const identificationNameForm: FormSchema[] = [
  {
    field: 'name',
    label: '标识名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];
export const protectionForm: FormSchema[] = [
  {
    field: 'name',
    label: '防护名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];
export const scopeForm: FormSchema[] = [
  {
    field: 'name',
    label: '范围名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];

// 风险隐患信息列
export const riskColumns = [
  { title: '发生时间', dataIndex: 'occurTime', width: 150 },
  { title: '事故原因', dataIndex: 'cause', width: 200, ellipsis: true },
  { title: '影响等级', dataIndex: 'impactLevelName', width: 100 }, // 假设后端返回名称
  { title: '受灾范围', dataIndex: 'affectRange', width: 150, ellipsis: true },
  { title: '经济损失（元）', dataIndex: 'econLoss', width: 120 },
  { title: '人员伤亡情况', dataIndex: 'casualty', width: 120 },
  { title: '整改措施', dataIndex: 'rectify', width: 200, ellipsis: true },
  { title: '整改完成时间', dataIndex: 'finishTime', width: 150 },
  { title: '验收结果', dataIndex: 'acceptResult', width: 100 },
];

// 监测预警设施列
export const monitorColumns = [
  { title: '站点名称', dataIndex: 'name', width: 150 },
  { title: '位置', dataIndex: 'location', width: 200 },
  { title: '监测项目', dataIndex: 'monitor', width: 150 },
  { title: '建设日期', dataIndex: 'buildDatetime', width: 120 },
  { title: '运维起始日期', dataIndex: 'opsStartDatetime', width: 150 },
  { title: '设备品牌型号', dataIndex: 'model', width: 150 },
  { title: '设备参数', dataIndex: 'param', width: 150 },
  { title: '运维单位', dataIndex: 'unit', width: 150 },
  { title: '安装方式', dataIndex: 'mount', width: 100 },
  { title: '数据传输方式', dataIndex: 'trans', width: 120 },
];

// 工程防护及应急加固设施列
export const engineeringColumns = [
  { title: '防护名称', dataIndex: 'name', width: 150 },
  { title: '建设标准', dataIndex: 'standard', width: 120 },
  { title: '管护责任', dataIndex: 'duty', width: 150 },
  { title: '应急加固物资', dataIndex: 'supply', width: 150 },
  { title: '数量', dataIndex: 'count', width: 80 },
  { title: '存放位置', dataIndex: 'loc', width: 150 },
  { title: '管理责任人', dataIndex: 'manager', width: 120 },
  { title: '联系方式', dataIndex: 'contact', width: 120 },
];

// 管理制度列
export const managementColumns = [
  { title: '制度名称', dataIndex: 'name', },
  { title: '制度描述', dataIndex: 'memo', ellipsis: true },
  { title: '创建人', dataIndex: 'createBy'},
  { title: '创建时间', dataIndex: 'createDt' },
  { title: '最近修改时间', dataIndex: 'updateDt'},
];

// 工程管控范围列
export const scopeColumns = [
  { title: '范围名称', dataIndex: 'name', width: 150 },
  { title: '范围描述', dataIndex: 'memo', width: 250, ellipsis: true },
  { title: '关键词', dataIndex: 'keyword', width: 250 },
  { title: '创建人', dataIndex: 'createBy'},
  { title: '创建时间', dataIndex: 'createDt' },
  { title: '最近修改时间', dataIndex: 'updateDt'},
];

// 警示标识设置情况列
export const signColumns = [
  { title: '标识名称', dataIndex: 'name', width: 150 },
  { title: '数量(个)', dataIndex: 'count', width: 100 },
  { title: '最近检查时间', dataIndex: 'lastCheckDate', width: 150 },
  { title: '检查人', dataIndex: 'lastCheckStaff', width: 100 },
  { title: '检查结果描述', dataIndex: 'lastCheckResult', width: 200 },
];