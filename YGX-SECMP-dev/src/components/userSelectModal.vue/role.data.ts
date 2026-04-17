import { FormSchema } from '/@/components/Table';
import type { BasicColumn } from '/@/components/Table';

export const userColumns: BasicColumn[] = [
  {
    title: '用户账号',
    dataIndex: 'username',
    width: 120,
    align: 'left',
  },
  {
    title: '用户姓名',
    dataIndex: 'realname',
    width: 120,
  },
  {
    title: '性别',
    dataIndex: 'sex_dictText',
    width: 50,
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    // width: 40,
  },
  {
    title: '状态',
    dataIndex: 'status_dictText',
    width: 80,
  },
];
export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleName',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
  // {
  //   field: 'roleCode',
  //   label: '角色编码',
  //   component: 'Input',
  //   colProps: { span: 6 },
  // },
];
/**
 * 角色用户搜索form
 */
export const searchUserFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户账号',
    component: 'Input',
    colProps: { span: 12 },
    labelWidth: 74,
  },
];
