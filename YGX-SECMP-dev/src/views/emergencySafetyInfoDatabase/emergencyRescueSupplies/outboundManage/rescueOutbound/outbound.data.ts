import { BasicColumn, FormSchema } from '/@/components/Table'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'
import { getDictTextByCode } from '/@/utils/dict'

export const columns: BasicColumn[] = [
    {
        title: '出库单号',
        dataIndex: 'outboundNo',
    },
    {
        title: '出库日期',
        dataIndex: 'outboundDate',
    },

    {
        title: '接收单位',
        dataIndex: 'supplierName',
    },
    {
        title: '出库类型',
        dataIndex: 'storageType',
        customRender: ({ record }) => {
            return getDictTextByCode(record.storageType, 'outboundType')
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
        title: '确认状态',
        dataIndex: 'confirmResult',
        customRender: ({ record }) => {
            let color = 'defalut'
            let text = '待确认'
            if (record.confirmResult === 'N') {
                color = 'red'
                text = '拒绝'
            }
            if (record.confirmResult === 'Y') {
                color = 'green'
                text = '通过'
            }
            return h(Tag, { color: color }, () => text)
        }
    },
]

export const searchFormSchema: FormSchema[] = [
    {
        field: 'outboundNo',
        label: '出库单号',
        component: 'Input', 
        colProps: { span: 4 },
    },
    {
        field: 'supplierName',
        label: '接收单位',
        component: 'Input',
        colProps: { span: 4 },
    },
    {
        field: 'outboundDate',
        label: '出库日期',
        component: 'RangePicker',
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        colProps: { span: 6 },
    },
    {
        field: 'confirmResult',
        label: '确认状态',
        component: 'Select',
        componentProps: {
            options: [
                { label: '待确认', value: 'S' },
                { label: '通过', value: 'Y' },
                { label: '拒绝', value: 'N' },
            ],
        },
        colProps: { span: 4 },
    },
]

