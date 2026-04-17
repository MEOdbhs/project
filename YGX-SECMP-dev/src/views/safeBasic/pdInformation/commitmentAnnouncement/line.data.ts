import { FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
export const columns = [
  {
    title: '公告名称',
    dataIndex: 'noticeName',
    width: 150,
  },
  {
    title: '负责人',
    dataIndex: 'responsiblePerson',
    width: 120,
  },
  {
    title: '负责人电话',
    dataIndex: 'personPhone',
    width: 150,
  },
  {
    title: '最近编辑时间',
    dataIndex: 'updateDt',
    width: 120,
  },
  {
    title: '编辑人',
    dataIndex: 'updateBy',
    width: 120,
    customRender: ({ record }) => {
      if (record.updateBy) {
        return record.updateBy;
      }
      return record.createBy;
    }
  },
  {
    title: '发布状态',
    dataIndex: 'releaseType',
    width: 100,
    customRender: ({ record }) => {
      return record.releaseType === '1' ? '已发布' : '未发布';
    }
  },
  {
    title: '发布时间',
    dataIndex: 'createDt',
    width: 100,
  },

];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'noticeName',
    label: '公告名称',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'releaseType',
    label: '发布状态',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'safe-an-status',
    },
    colProps: { span: 4 },
  },
  {
    field: 'releaseTimeRange',
    label: '发布时间范围',
    component: 'RangePicker',
    componentProps: {
      valueType: 'DateTime', // 支持时分秒
      showTime: {
        format: 'HH:mm:ss',
        defaultValue: [
          dayjs('00:00:00', 'HH:mm:ss'),
          dayjs('23:59:59', 'HH:mm:ss'),
        ],
      },
      format: 'YYYY-MM-DD HH:mm:ss',
    },

    colProps: { span: 8 },
  },
];
