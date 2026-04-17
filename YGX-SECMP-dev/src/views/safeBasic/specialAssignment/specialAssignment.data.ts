import { BasicColumn, FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { userList } from './specialAssignment.api';

export const columns: BasicColumn[] = [
  {
    title: '特殊作业类型',
    dataIndex: 'workType',
    customRender: ({ text }) => {
      return render.renderDict(text, 'operation_type');
    },
  },
  {
    title: '作业开始时间',
    dataIndex: 'startTime',
  },
  {
    title: '作业结束时间',
    dataIndex: 'endTime',
  },
  {
    title: '作业单位',
    dataIndex: 'workUnit',
  },
  {
    title: '作业地点',
    width: 150,
    dataIndex: 'workPlace',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'workType',
    label: '作业类型',
    component: 'JSearchSelect',
    componentProps: {
      placeholder: '请选择作业类型',
      dict: 'operation_type',
      async: true,
    },
  },
  {
    field: 'startTimeRange',
    label: '作业开始时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      // showTime: { format: 'HH:mm' },
    },
  },
  // {
  //   field: 'endTime',
  //   label: '作业结束时间',
  //   component: 'DatePicker',
  //   componentProps: {
  //     format: 'YYYY-MM-DD HH:mm:ss',
  //     valueFormat: 'YYYY-MM-DD HH:mm:ss',
  //   },
  // },
];
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'workType',
    label: '作业类型',
    component: 'JSearchSelect',
    required: true,
    componentProps: {
      placeholder: '请选择作业类型',
      dict: 'operation_type',
      async: true,
    },
  },
  {
    field: 'startTime',
    label: '作业开始时间',
    required: true,
    component: 'DatePicker',
  },
  {
    field: 'endTime',
    label: '作业结束时间',
    required: true,
    component: 'DatePicker',
  },
  {
    field: 'isOther',
    label: '是否第三方单位作业',
    component: 'JDictSelectTag',
    required: true,
    componentProps: {
      placeholder: '请选择作业类型',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
  {
    field: 'workUnit',
    label: '作业单位',
    component: 'Input',
    required: true,
  },
  {
    field: 'workPlace',
    label: '作业地点',
    component: 'Input',
    required: true,
  },
  {
    field: 'workContent',
    label: '作业内容',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入作业内容',
      minRows: 2,
      maxRows: 4,
      length: 300,
    },
    required: true,
  },
  {
    field: 'workPerson',
    label: '作业负责人',
    required: true,
    component: 'ApiSelect',
    slot: 'workPerson',
    componentProps: ({ formModel }) => {
      return {
        api: userList,
        params: {},
        labelField: 'realname',
        valueField: 'id',
        resultField: 'records',
        onChange: (e) => {
          console.log('selected:', e, this, formModel);
        },
      };
    },
  },
  {
    field: 'personPhone',
    label: '负责人手机号',
    required: true,
    component: 'Input',
    componentProps: {
      placeholder: '请输入作业负责人手机号',
      disabled: true,
    },
  },
  {
    field: 'specialPerson',
    label: '特殊作业人员',
    component: 'ApiSelect',
    componentProps: {
      api: userList,
      params: {},
      labelField: 'realname',
      valueField: 'id',
      resultField: 'records',
    },
  },
];
