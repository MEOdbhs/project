import { BasicColumn, FormSchema } from '/@/components/Table'
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
        title: '关联入库单号',
        dataIndex: 'warehouseEntryNo',
    },
    {
        title: '物资名称',
        dataIndex: 'materialName',
    },
    {
        title: '数量',
        dataIndex: 'entryNumber',
        customRender: ({ record }) => {
            return record.entryNumber + record.unitName
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
]


export const bookkeepColumns: BasicColumn[] = [
    {
        title: '质检单号',
        dataIndex: 'inspectionNo',
    },
    {
        title: '质检日期',
        dataIndex: 'inspectionDate',
    },

    {
        title: '关联入库单号',
        dataIndex: 'warehouseEntryNumber',
    },
    {
        title: '物资名称',
        dataIndex: 'materialName',
    },
    {
        title: '入库数量',
        dataIndex: 'entryNumber',
        customRender: ({ record }) => {
            return record.entryNumber + record.unitName
        },
    },
]

export const searchBookkeepFormSchema: FormSchema[] = [
    {
        field: 'confirmNo',
        label: '质检单号',
        component: 'Input',
        colProps: { span: 6 },
    },
    {
        field: 'inspectionDate',
        label: '质检日期',
        component: 'RangePicker',
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        colProps: { span: 8 },
    },

]