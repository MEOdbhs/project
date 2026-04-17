import { BasicColumn, FormSchema } from '/@/components/Table'
import { getAllRolesListNoByTenant } from './user.api'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'
import { rules } from '/@/utils/helper/validator';
import { useUserStore } from '/@/store/modules/user'

export const columns: BasicColumn[] = [
    {
        title: '账号/手机号',
        dataIndex: 'username',
    },
    {
        title: '姓名',
        dataIndex: 'realname',
    },

    {
        title: '角色',
        dataIndex: 'roleNames',
    },
    {
        title: '备注',
        dataIndex: 'remark',
    },
    {
        title: '账号状态',
        dataIndex: 'status',
        customRender: ({ text }) => {
            let color = 'defalut'
            if (text === 1) {
                color = 'green'
            }
            return h(Tag, { color: color }, () => text === 1 ? '启用' : '禁用')
        }
    },
]

export const searchFormSchema: FormSchema[] = [
    {
        field: 'username',
        label: '账号/手机号',
        component: 'Input',
        colProps: { span: 4 },
    },
    {
        field: 'realname',
        label: '姓名',
        component: 'Input',
        colProps: { span: 4 },
    },
    {
        label: '角色',
        field: 'roleId',
        component: 'ApiSelect',
        componentProps: {
            api: getAllRolesListNoByTenant,
            labelField: 'roleName',
            valueField: 'id',
            immediate: false,
        },
        colProps: { span: 4 },
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
        colProps: { span: 4 },
    },
]


export const formSchema: FormSchema[] = [
    {
      label: '',
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      label: '用户账号',
      field: 'username',
      component: 'Input',
      required: true,
      dynamicDisabled: ({ values }) => {
        return !!values.id;
      },
      dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('sys_user', 'username', model, schema, true),
    },
    {
      label: '用户姓名',
      field: 'realname',
      required: true,
      component: 'Input',
    },
    {
      label: '用户类型',
      field: 'userType',
      required: true,
      component: 'RadioGroup',
      defaultValue: 0,
      show: false,
    },
    {
      label: '手机号码',
      field: 'phone',
      component: 'Input',
      required: true,
      dynamicRules: ({ model, schema }) => {
        return [
          { ...rules.duplicateCheckRule('sys_user', 'phone', model, schema, true)[0], trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式有误', trigger: 'blur' },
        ];
      },
    },
    {
      label: '登录密码',
      field: 'password',
      component: 'StrengthMeter',
      componentProps: {
        autocomplete: 'new-password',
      },
      defaultValue: 'enterprise@2025',
      show: false,
      rules: [
        {
          required: true,
          message: '请输入登录密码',
        },
        {
          // pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/,
          pattern: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
          message: '数字+英文,8位数及以上,英文不区分大小写', //'密码由8位数字、大小写字母和特殊符号组成!',
        },
      ],
    },
    {
      label: '确认密码',
      field: 'confirmPassword',
      component: 'InputPassword',
      defaultValue: 'enterprise@2025',
      dynamicRules: ({ values }) => rules.confirmPassword(values, true),
      show: false,
    },
  
    {
      label: '身份证号',
      field: 'workNo',
      component: 'Input',
      rules: [{ pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号' }],
    },
    {
      label: '邮箱',
      field: 'email',
      component: 'Input',
    },
    {
      label: '备注',
      field: 'remark',
      required: false,
      component: 'InputTextArea',
      componentProps: {
        autosize: { minRows: 2, maxRows: 4 },
        showCount: true,
        maxLength: 300,
      },
    },
    {
      label: '所属部门',
      field: 'selecteddeparts',
      component: 'JSelectDept',
      show:({values}) => {
        return !values.id;
      },
      rules: [
        {
          required: true,
          message: '请选择所属部门',
        },
      ],
      componentProps: ({ formActionType, formModel }) => {
        const userStore = useUserStore()
        return {
          sync: false,
          checkStrictly: true,
          defaultExpandLevel: 2,
          params:{
            orgCode: formModel.orgCode || userStore.currentEnterpriseCode,
          },
  
          onSelect: (options, values) => {
            const { updateSchema } = formActionType;
            //所属部门修改后更新负责部门下拉框数据
            updateSchema([
              {
                field: 'departIds',
                componentProps: { options },
              },
            ]);
            //update-begin---author:wangshuai---date:2024-05-11---for:【issues/1222】用户编辑界面“所属部门”与“负责部门”联动出错整---
            if (!values) {
              formModel.departIds = [];
              return;
            }
            //update-end---author:wangshuai---date:2024-05-11---for:【issues/1222】用户编辑界面“所属部门”与“负责部门”联动出错整---
            //所属部门修改后更新负责部门数据
            formModel.departIds && (formModel.departIds = formModel.departIds.filter((item) => values.value.indexOf(item) > -1));
          },
        };
      },
    },
    {
      label: '性别',
      field: 'sex',
      component: 'JDictSelectTag',
      componentProps: {
        placeholder: '请选择性别',
        stringToNumber: true,
        options: [
          { label: '男', value: 1, key: '1' },
          { label: '女', value: 2, key: '2' },
        ],
      },
    },
  ];

