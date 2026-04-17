import { BasicColumn, FormSchema } from '/@/components/Table'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'

export const columns: BasicColumn[] = [
    {
        title: '确认单号',
        dataIndex: 'confirmNo',
    },
    {
        title: '确认日期',
        dataIndex: 'confirmDate',
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
        title: '申请数量',
        dataIndex: 'entryNumber',
        customRender: ({ record }) => {
            return record.entryNumber + record.unitName
        },
    },
    {
        title: '确认数量',
        dataIndex: 'confirmNumber',
        customRender: ({ record }) => {
            if (record.confirmResult === 'S') {
                return '-'
            }
            return record.confirmNumber + record.unitName
        },
    },
    {
        title: '数量差异',
        dataIndex: 'differenceNumber',
        customRender: ({ record }) => {
            if (record.confirmResult === 'S') {
                return '-'
            }
            return record.differenceNumber

        },
    },

    {
        title: '确认结果',
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
    {
        title: '确认人员',
        dataIndex: 'operator',
    },
]

export const searchFormSchema: FormSchema[] = [
    {
        field: 'confirmNo',
        label: '确认单号',
        component: 'Input',
        colProps: { span: 4 },
    },
    {
        field: 'confirmDate',
        label: '确认日期',
        component: 'RangePicker',
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        colProps: { span: 6 },
    },
    {
        field: 'confirmResult',
        label: '确认结果',
        component: 'Select',
        componentProps: {
            options: [
                { label: '通过', value: 'Y' },
                { label: '待确认', value: 'S' },
                { label: '拒绝', value: 'N' },
            ],
        },
        colProps: { span: 4 },
    },
]


