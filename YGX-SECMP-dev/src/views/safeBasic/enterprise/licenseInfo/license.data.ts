import { BasicColumn, FormSchema } from '/@/components/Table'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'

export const columns: BasicColumn[] = [
    {
        title: '证照名称',
        dataIndex: 'name',
    },
    {
        title: '证照编号',
        dataIndex: 'code',
    },

    {
        title: '初次申领日期',
        dataIndex: 'claimDate',
    },
    {
        title: '有效开始日期',
        dataIndex: 'certDateStart',
    },
    {
        title: '证书到期日期',
        dataIndex: 'certDateEnd',
    },
    {
        title: '发证机关',
        dataIndex: 'issuingAuthority',
    },

    {
        title: '状态',
        dataIndex: 'statusText',
        customRender: ({ record }) => {
            let color = 'defalut'
            if (record.statusText === '已过期') {
                color = 'red'
            }
            if (record.statusText === '未过期') {
                color = 'green'
            }
            return h(Tag, { color: color }, () => record.statusText)
        }
    },
    {
        title: '许可范围',
        dataIndex: 'licenceScope',
    },
]

export const searchFormSchema: FormSchema[] = [
    {
        field: 'name',
        label: '证照名称',
        component: 'Input',
        colProps: { span: 4 },
    },
    {
        field: 'statusText',
        label: '证照状态',
        component: 'Select',
        componentProps: {
            options: [
                { label: '已过期', value: '已过期' },
                { label: '未过期', value: '未过期' },
            ],
        },
        colProps: { span: 4 },
    },
]


export const basicFormSchema: FormSchema[] = [
    {
        label: 'id',
        field: 'id',
        component: 'Input',
        show: false,
    },
    {
        label: 'operateType',
        field: 'operateType',
        component: 'Input',
        show: false,
    },
    {
        label: 'fileIds',
        field: 'fileIds',
        component: 'Input',
        show: false,
    },
    {
        field: 'name',
        label: '证照名称',
        component: 'Input',
        colProps: {
            span: 12,
        },
        required: true,
    },
    {
        field: 'code',
        label: '证照编号',
        component: 'Input',
        colProps: {
            span: 12,
        },
        required: true,
    },
    {
        field: 'claimDate',
        label: '初次申领日期',
        component: 'DatePicker',
        colProps: {
            span: 12,
        },
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        required: true,
    },
    {
        field: 'issuingAuthority',
        label: '发证机关',
        component: 'Input',
        colProps: {
            span: 12,
        },
        required: true,
    },
    {
        field: 'certDateStart',
        label: '有效开始日期',
        component: 'DatePicker',
        colProps: {
            span: 12,
        },
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        required: true,
    },
    {
        field: 'certDateEnd',
        label: '证书到期日期',
        component: 'DatePicker',
        colProps: {
            span: 12,
        },
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        required: true,
    },
    {
        field: 'licenceScope',
        label: '许可范围',
        component: 'InputTextArea',
        colProps: {
            span: 24,
        },
    },
    {
        field: 'fileIds',
        label: '附件',
        component: 'SimpleImageUpload',
        changeEvent: 'update:value', // 使用 v-model 的事件名
        componentProps: ({ formModel }) => {
            return {
                value: formModel.fileIds,
                bizId: formModel.id,
                readonly: formModel.operateType === 'view',
            }
        },
        colProps: { span: 24 },
        rules: [{ required: true, message: '请上传附件', trigger: 'blur' }],
    }
];

