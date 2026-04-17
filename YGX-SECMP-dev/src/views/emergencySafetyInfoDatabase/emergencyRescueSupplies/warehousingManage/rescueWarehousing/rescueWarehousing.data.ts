import { BasicColumn, FormSchema } from '/@/components/Table'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'
import { getDictTextByCode } from '/@/utils/dict'

export const columns: BasicColumn[] = [
    {
        title: '入库单号',
        dataIndex: 'warehouseEntryNumber',
    },
    {
        title: '入库日期',
        dataIndex: 'warehouseEntryDate',
    },

    {
        title: '供应商',
        dataIndex: 'supplierName',
    },
    {
        title: '入库类型',
        dataIndex: 'storageType',
        customRender: ({ record }) => {
            return getDictTextByCode(record.storageType, 'storageType')
        },
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
        title: '金额（元）',
        dataIndex: 'allMoney',
    },

    {
        title: '状态',
        dataIndex: 'testResults',
        customRender: ({ record }) => {
            let color = 'defalut'
            let text = '待质检'
            if (record.testResults === 'N') {
                color = 'red'
                text = '质检不合格'
            }
            if (record.testResults === 'Y') {
                color = 'green'
                text = '已质检'
            }
            return h(Tag, { color: color }, () => text)
        }
    },
]

export const searchFormSchema: FormSchema[] = [
    {
        field: 'warehouseEntryNumber',
        label: '入库单号',
        component: 'Input',
        colProps: { span: 4 },
    },
    {
        field: 'supplierName',
        label: '供应商',
        component: 'Input',
        colProps: { span: 4 },
    },
    {
        field: 'warehouseEntryDate',
        label: '入库日期',
        component: 'RangePicker',
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        colProps: { span: 6 },
    },
    {
        field: 'testResults',
        label: '质检状态',
        component: 'Select',
        componentProps: {
            options: [
                { label: '已质检', value: 'Y' },
                { label: '待质检', value: 'S' },
                { label: '质检不合格', value: 'N' },
            ],
        },
        colProps: { span: 4 },
    },
]

export const materialColumns: BasicColumn[] = [
    {
        title: '物资编码',
        dataIndex: 'materialCode',
    },
    {
        title: '物资名称',
        dataIndex: 'materialName',
    },

    {
        title: '类型',
        dataIndex: 'materialTypeName',
    },
    {
        title: '规格',
        dataIndex: 'specification',
    },
    {
        title: '型号',
        dataIndex: 'model',
    },
    {
        title: '单价（元）',
        dataIndex: 'unitPrice',
    },
]

export const searchMaterialFormSchema: FormSchema[] = [
    {
        field: 'materialName',
        label: '物资名称',
        component: 'Input',
        colProps: { span: 6 },
    },
]


