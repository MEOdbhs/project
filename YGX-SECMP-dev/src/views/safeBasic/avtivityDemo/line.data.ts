import { FormSchema } from '/@/components/Table';
import { getDictTextByCode } from '/@/utils/dict';
export const columns = [
  {
    title: '姓名',
    dataIndex: 'staffName',
    width: 150,
  },
  {
    title: '工号',
    dataIndex: 'staffCode',
    width: 120,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 120,
  },
  {
    title: '线别',
    dataIndex: 'lineName',
    width: 120,
  },
  {
    title: '部门',
    dataIndex: 'deptName',
    width: 120,
  },
  {
    title: '分组',
    dataIndex: 'deptGroupName',
    width: 120,
  },
  {
    title: '岗位',
    dataIndex: 'positionName',
    width: 120,
  },
  {
    title: '奖惩类型',
    dataIndex: 'rewardPunishName',
    width: 120,
  },
  {
    title: '金额',
    dataIndex: 'amount',
    width: 120,
  },
  {
    title: '绩效分',
    dataIndex: 'performanceScore',
    width: 120,
  },
  {
    title: '奖惩依据',
    dataIndex: 'typeText',
    width: 150,
  },
  {
    title: '奖惩等级',
    dataIndex: 'grade',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'examStatusText',
    width: 200,
  },
  {
    title: '通报内容',
    dataIndex: 'content',
    width: 200,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'staffName',
    label: '人员',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'rewardPunishConfigId',
    label: '奖惩依据',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'staff_rp_by',
    },
    colProps: { span: 4 },
  },
  {
    field: 'type',
    label: '奖惩类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'staff_rp_type',
    },
    colProps: { span: 4 },
  },
];
