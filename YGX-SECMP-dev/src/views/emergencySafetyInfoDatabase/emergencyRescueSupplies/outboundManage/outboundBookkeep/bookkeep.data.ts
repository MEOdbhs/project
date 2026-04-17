import { BasicColumn, FormSchema } from '/@/components/Table'
import { getDictTextByCode } from '/@/utils/dict'
export const columns: BasicColumn[] = [
    {
        title: '凭证编号',
        dataIndex: 'voucherCode',
    },
    {
        title: '记账日期',
        dataIndex: 'voucherDate',
    },
    {
        title: '凭证类型',
        dataIndex: 'voucherType',
        customRender: ({ record }) => {
            return getDictTextByCode(record.voucherType, 'voucherType')
        },
    },

    {
        title: '关联出库单号',
        dataIndex: 'outboundNo',
    },
    {
        title: '物资名称',
        dataIndex: 'materialName',
    },
    {
        title: '数量',
        dataIndex: 'confirmNumber',
        customRender: ({ record }) => {
            return record.confirmNumber + record.unitName
        },
    },
    {
        title: '单价（元）',
        dataIndex: 'unitPrice',
    },
    {
        title: '金额（元）',
        dataIndex: 'allMoney',
    },
]

export const searchFormSchema: FormSchema[] = [
    {
        field: 'voucherCode',
        label: '凭证编号',
        component: 'Input',
        colProps: { span: 4 },
    },
    {
        field: 'voucherDate',
        label: '记账日期',
        component: 'RangePicker',
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        colProps: { span: 6 },
    },
    {
        field: 'voucherType',
        label: '凭证类型',
        component: 'JDictSelectTag',
        componentProps: {
            dictCode: 'voucherType',
        },
        colProps: { span: 4 },
    }
]


export const bookkeepColumns: BasicColumn[] = [
    {
        title: '确认单号',
        dataIndex: 'confirmNo',
    },

    {
        title: '关联出库单号',
        dataIndex: 'outboundNo',
    },
    {
        title: '物资名称',
        dataIndex: 'materialName',
    },
    {
        title: '出库数量',
        dataIndex: 'confirmNumber',
        customRender: ({ record }) => {
            return record.confirmNumber + record.unitName
        },
    },
]

export const searchBookkeepFormSchema: FormSchema[] = [
    {
        field: 'confirmNo',
        label: '确认单号',
        component: 'Input',
        colProps: { span: 6 },
    },
    {
        field: 'confirmDate',
        label: '确认日期',
        component: 'RangePicker',
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        colProps: { span: 8 },
    },

]
