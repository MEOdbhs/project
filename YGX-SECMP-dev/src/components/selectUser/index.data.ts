import { BasicColumn } from '/@/components/Table';

export const userInfoColumns: BasicColumn[] = [
  {
    title: '用户账号',
    dataIndex: 'username',
    width: 150,
  },
  {
    title: '用户名称',
    dataIndex: 'realname',
    width: 180,
  },
  {
    title: '部门',
    dataIndex: 'orgCode',
    width: 200,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 80,
    customRender: ({ text }) => {
      if (text === 1 || text === '1') return '男';
      if (text === 0 || text === '0') return '女';
      return '-';
    },
  },
  {
    title: '电话',
    dataIndex: 'phone',
    width: 120,
  },
];
