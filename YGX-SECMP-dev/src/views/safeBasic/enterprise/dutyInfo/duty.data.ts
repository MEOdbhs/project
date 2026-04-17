import { BasicColumn, FormSchema } from '/@/components/Table'
import { listPageUserByOrgCode } from './duty.api'
import { useUserStore } from '/@/store/modules/user'


export const columns: BasicColumn[] = [
    {
        title: '日期',
        dataIndex: 'dutyDate',
    },
    {
        title: '带班领导',
        dataIndex: 'leader',
    },

    {
        title: '值班人员',
        dataIndex: 'dutyStaffNames',
    },
    {
        title: '开始值班时间',
        dataIndex: 'dutyDateStart',
    },
    {
        title: '结束值班时间',
        dataIndex: 'dutyDateEnd',
    },
    {
        title: '备注',
        dataIndex: 'remark',
    },
]

export const searchFormSchema: FormSchema[] = [
    {
        field: 'dutyDate',
        label: '值班日期',
        component: 'RangePicker',
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        colProps: { span: 6 },
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
        label: 'dutyDateStart',
        field: 'dutyDateStart',
        component: 'Input',
        show: false,
    },
    {
        label: 'dutyDateEnd',
        field: 'dutyDateEnd',
        component: 'Input',
        show: false,
    },
    {
        field: 'dutyDate',
        label: '值班日期',
        component: 'DatePicker',
        colProps: { span: 12 },
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        required: true,
    },
    {
        field: 'leader',
        label: '带班领导',
        component: 'Input',
        colProps: { span: 12 },
        required: true,
    },
    {
        field: 'dutyStaffIds',
        label: '值班人员',
        component: 'ApiSelect',
        colProps: { span: 12 },
        required: true,
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
                mode:"multiple",
                maxTagCount: 3,
            }
        },
    },
    {
        field: 'dutyDateStartRange',
        label: '值班时间段',
        component: 'RangePicker',
        colProps: {
            span: 12,
        },
        required: true,
        componentProps: ({ formModel }) => {
            return {
                valueFormat: 'YYYY-MM-DD HH:mm',
                format: 'YYYY-MM-DD HH:mm',
                showTime: { format: 'HH:mm' },
                placeholder: ['开始值班时间', '结束值班时间'],
                onChange: (value) => {
                    if(value) {
                        formModel.dutyDateStart = value[0]
                        formModel.dutyDateEnd = value[1]
                    }
                }
            }
        }
    },
    {
        field: 'remark',
        label: '备注',
        component: 'InputTextArea',
        colProps: {
            span: 24,
        },
    },
];

