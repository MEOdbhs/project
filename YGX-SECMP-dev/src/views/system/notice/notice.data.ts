import { BasicColumn, FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { listPageUserByOrgCode } from './notice.api';
import { useUserStore } from '/@/store/modules/user';

export const columns: BasicColumn[] = [
  {
    title: '标题',
    width: 150,
    dataIndex: 'titile',
  },
  {
    title: '消息类型',
    dataIndex: 'msgCategory_dictText',
    width: 100,
  },
  {
    title: '发布人',
    width: 100,
    dataIndex: 'sender',
  },
  {
    title: '优先级',
    dataIndex: 'priority_dictText',
    width: 70,
    // customRender: ({ text }) => {
    //   const color = text == 'L' ? 'blue' : text == 'M' ? 'yellow' : 'red';
    //   return render.renderTag(render.renderDict(text, 'priority'), color);
    // },
  },
  {
    title: '通告对象',
    dataIndex: 'msgType',
    width: 100,
    customRender: ({ text }) => {
      return render.renderDict(text, 'msg_type');
    },
  },
  {
    title: '发布状态',
    dataIndex: 'sendStatus_dictText',
    width: 70,
    // customRender: ({ text }) => {
    //   const color = text == '0' ? 'red' : text == '1' ? 'green' : 'gray';
    //   return render.renderTag(render.renderDict(text, 'send_status'), color);
    // },
  },
  {
    title: '发布时间',
    width: 100,
    dataIndex: 'sendTime',
  },
  {
    title: '撤销时间',
    width: 100,
    dataIndex: 'cancelTime',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'msgCategory',
    label: '消息类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'msg_category',
    },
  },
  {
    label:'发布时间开始',
    field: 'startTime',
    component: 'DatePicker',
    componentProps: {
      valueType: 'Date',
      showTime: false,
      format: 'YYYY-MM-DD',
    },
  },
  {
    label:'发布时间结束',
    field: 'endTime',
    component: 'DatePicker',
    componentProps: {
      valueType: 'Date',
      showTime: false,
      format: 'YYYY-MM-DD',
    },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'msgCategory',
    label: '消息类型',
    required: true,
    component: 'JDictSelectTag',
    defaultValue: '1',
    componentProps: {
      type: 'radio',
      dictCode: 'msg_category',
      placeholder: '请选择类型',
    },
  },
  {
    field: 'titile',
    label: '标题',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入标题',
    },
    // update-begin--author:liaozhiyang---date:20240701---for：【TV360X-1632】标题过长保存报错，长度校验
    dynamicRules() {
      return [
        {
          validator: (_, value) => {
            return new Promise<void>((resolve, reject) => {
              if (value.length > 100) {
                reject('最长100个字符');
              }
              resolve();
            });
          },
        },
      ];
    },
    // update-end--author:liaozhiyang---date:20240701---for：【TV360X-1632】标题过长保存报错，长度校验
  },
  {
    field: 'msgAbstract',
    label: '摘要',
    component: 'InputTextArea',
    required: true,
  },
  // {
  //   field: 'endTime',
  //   label: '截至日期',
  //   component: 'DatePicker',
  //   componentProps: {
  //     showTime: true,
  //     valueFormat: 'YYYY-MM-DD HH:mm:ss',
  //     placeholder: '请选择截至日期',
  //   },
  //   dynamicRules: ({ model }) => rules.endTime(model.startTime, true),
  // },
  {
    field: 'msgType',
    label: '接收用户',
    defaultValue: 'ALL',
    component: 'JDictSelectTag',
    required: true,
    componentProps: {
      type: 'radio',
      dictCode: 'msg_type',
      placeholder: '请选择发布范围',
    },
  },
  {
    field: 'userIds',
    label: '指定用户',
    component: 'ApiSelect',
    required: true,
    ifShow: ({ values }) => values.msgType !== 'ALL',
    dynamicRules: ({ values }) => {
      return values.msgType !== 'ALL'
        ? [{ required: true, message: '请选择指定用户' }]
        : [];
    },
    componentProps: () => {
      const userStore = useUserStore()
      return {
        api: listPageUserByOrgCode,
        params: {
          orgCode: userStore.currentEnterpriseCode,
        },
        labelField: 'realname',
        valueField: 'id',
        immediate: false,
        mode: "multiple",
        maxTagCount: 3,
      }
    },
  },
  {
    field: 'priority',
    label: '优先级',
    defaultValue: 'H',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'priority',
      type: 'radio',
      placeholder: '请选择优先级',
    },
  },
  // {
  //   field: 'priority',
  //   label: '优先级',
  //   defaultValue: 'H',
  //   component: 'JDictSelectTag',
  //   componentProps: {
  //     dictCode: 'notice_priority',
  //     type: 'radio',
  //     placeholder: '请选择优先级',
  //   },
  // },
  {
    field: 'msgContent',
    label: '内容',
    component: 'Input',
    render: render.renderTinymce,
  },
  /**
   * 文件上传功能 - 使用 a-upload
   */
  //  {
  //     field: 'fileJson',
  //     label: '附件',
  //     customRender: render.renderAvatar,
  //   },
  {
    label: '附件',
    field: 'fileJson',
    component: 'JImageUpload',
    componentProps: {
      fileMax: 1,
    },
  }

  // {
  //   field: 'fileJson',
  //   label: '附件',
  //   component: 'JUpload',
  //   componentProps: {
  //     //是否显示选择按钮
  //     text: '文件上传',
  //     //最大上传数
  //     maxCount: 2,
  //     //是否显示下载按钮
  //     download: true,
  //     //是否支持预览
  //     preview: true,
  //   },
  // },
];
