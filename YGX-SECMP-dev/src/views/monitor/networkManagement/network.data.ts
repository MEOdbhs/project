import { BasicColumn, FormSchema } from '/@/components/Table';
import { getLabelByValue } from '/@/utils/dict';
import dayjs from 'dayjs';

// 设备类别选项列表（公共变量，文件内外均可引用）
export const deviceTypeOptions = [
  { label: '监测摄像机', value: '1' },
  { label: '编码设备', value: '2' },
  { label: '储存设备', value: '3' },
  { label: '解码设备', value: '4' },
  { label: '视频综合矩阵', value: '5' },
  { label: 'NVR', value: '6' },
  { label: 'CVR', value: '7' },
  { label: '云储存', value: '8' },
  { label: '门禁设备', value: '9' },
  { label: '门禁点', value: '10' },
  { label: '读卡器', value: '11' },
  { label: '梯控设备', value: '12' },
  { label: '梯控读卡器', value: '13' },
  { label: '可视对讲', value: '14' },
  { label: '其他', value: '15' },
];

// 巡检方式选项列表（公共变量，文件内外均可引用）
export const inspectionMethodOptions = [
  { label: '一次性', value: 0 },
  { label: '每天', value: 1 },
  { label: '每周', value: 2 },
  { label: '每月', value: 3 },
  { label: '每季度', value: 4 },
  { label: '每年', value: 5 },
];

export const inspectionStateOptions = [
  { label: '启用', value: 0 },
  { label: '停用', value: 1 },
  { label: '已过期', value: 2 },
];

export const columns: BasicColumn[] = [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    align: 'left',
  },
  {
    title: '设备编号',
    dataIndex: 'deviceSerialNumber',
  },
  {
    title: '设备类型',
    dataIndex: 'deviceTypeName',
  },
];

/**
 * 操作日志需要操作类型
 */
export const operationLogColumn: BasicColumn[] = [
  ...columns,
  {
    title: '告警值',
    dataIndex: 'alarmValue',
  },
  {
    title: '阈值上限',
    dataIndex: 'thresholdUpper',
  },
  {
    title: '阈值下限',
    dataIndex: 'thresholdLower',
  },
];

/**
 * 运维报表
 */

export const operationReportColumn: BasicColumn[] = [
  ...columns,
  {
    title: '区域排名',
    dataIndex: 'areaRank',
  },
  {
    title: '录像完整性',
    dataIndex: 'recordRate',
    customRender: ({ record }) => {
      return `${record.recordRate}%`;
    },
  },
  {
    title: '达标情况',
    dataIndex: 'reachSituation',
  },
  {
    title: '在线状态',
    dataIndex: 'onlineStatus',
    customRender: ({ record }) => {
      return record.onlineStatus == 0 ? '在线' : '离线';
    },
  },
  {
    title: '离线时长',
    dataIndex: 'offlineDuration',
  },
];

export const exceptionColumns: BasicColumn[] = [
  {
    title: '异常标题',
    dataIndex: 'logContent',
    width: 100,
    align: 'left',
  },
  {
    title: '请求地址',
    dataIndex: 'requestUrl',
    width: 100,
  },
  {
    title: '请求参数',
    dataIndex: 'method',
    width: 60,
  },
  {
    title: '操作人',
    dataIndex: 'username',
    width: 60,
    customRender: ({ record }) => {
      let pname = record.username;
      let pid = record.userid;
      if(!pname && !pid){
        return "";
      }
      return pname + " (账号: "+ pid + " )";
    },
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    width: 60,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    width: 60,
  },
  {
    title: '客户端类型',
    dataIndex: 'clientType_dictText',
    width: 60,
  },
];

/**
 * 巡检计划列表
 */

export const inspectionPlanColumns: BasicColumn[] = [
  {
    title: '巡检计划名称',
    dataIndex: 'inspectionPlanName',
    align: 'left',
  },
  {
    title: '巡检方法',
    dataIndex: 'inspectionWay',
    align: 'left',
    // customRender: ({ record }) => {
    //   // 项目中巡检方法的dictCode假设为'pm_device_video_inspection_way'
    //   // 回显使用字典回显优先，若没有则兼容原本字段
    //   return getDictTextByCode(record.inspectionWay, 'pm_device_video_inspection_way') || '-';
        
    // },
  },
  {
    title: '检查频次',
    dataIndex: 'frequency',
    align: 'left',
    customRender: ({ record }) => {
      return getLabelByValue(record.frequency, inspectionMethodOptions) || '-';
      
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'left',
    slots: { customRender: 'status' },
  },
];
/**
 * 运维报表
 */
export const operationFormSchema: FormSchema[] = [
  {
    field: 'deviceNameOrCode',
    label: '设备名称/编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'deviceTypeId',
    label: '设备类别',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'pm_device_network_video_type',
    },
    colProps: { span: 6 },
  },

];

/**
 * 告警信息查询表单
 */

export const searchFormSchema: FormSchema[] = [
  {
    field: 'inspectionPlanName',
    label: '巡检名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'inspectionWay',
    label: '巡检方法',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'pm_device_video_inspection_way',
    },
    colProps: { span: 6 },
  },
  {
    field: 'status',
    component: 'JDictSelectTag',
    label: '状态',
    componentProps: {
      options: inspectionStateOptions
    },
    colProps: {
      span: 6,
    },
  },
];

/**
 * 告警信息列表
 */
export const AlarmInfoTableColumns: FormSchema[] = [
 {
    field: 'deviceNameOrCode',
    label: '设备名称/编号',
    component: 'Input',
    colProps: { span: 6 },
  },
 {
    field: 'deviceTypeId',
    label: '设备类别',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'pm_device_network_video_type',
    },
    colProps: { span: 6 },
  },
  {
    field: 'fieldTime',
    component: 'RangePicker',
    label: '告警时间',
    componentProps: {
      valueType: 'DateTime', // 支持时分秒
      showTime: {
        format: 'HH:mm',
        defaultValue: [
          dayjs('00:00', 'HH:mm'),
          dayjs('23:59', 'HH:mm'),
        ],
      },
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    colProps: {
      span: 8,
    },
  },
];

export const operationSearchFormSchema: FormSchema[] = [
  ...searchFormSchema,
  {
    field: 'operateType',
    label: '嘻嘻',
    component: 'JDictSelectTag',
    colProps: { span: 4 },
    componentProps: {
      dictCode: 'operate_type',
    },
  },
];
