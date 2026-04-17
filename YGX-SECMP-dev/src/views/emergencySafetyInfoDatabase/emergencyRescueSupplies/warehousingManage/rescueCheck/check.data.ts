import { BasicColumn, FormSchema } from '/@/components/Table'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'

export const columns: BasicColumn[] = [
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
        title: '检验数量',
        dataIndex: 'inspectionNum',
        customRender: ({ record }) => {
            if (record.testResults === 'S') {
                return ''
            }
            return record.inspectionNum + record.unitName
        }
    },
    {
        title: '合格数量',
        dataIndex: 'qualifiedNum',
        customRender: ({ record }) => {
            if (record.testResults === 'S') {
                return ''
            }
            return record.qualifiedNum + record.unitName || '-'
        }
    },
    {
        title: '合格率',
        dataIndex: 'passRate',
         customRender: ({ record }) => {
            if (record.testResults === 'S') {
                return ''
            }
            return record.passRate + '%'
        }
    },

    {
        title: '检验结果',
        dataIndex: 'testResults',
        customRender: ({ record }) => {
            let color = 'defalut'
            let text = '待质检'
            if (record.testResults === 'N') {
                color = 'red'
                text = '不合格'
            }
            if (record.testResults === 'Y') {
                color = 'green'
                text = '合格'
            }
            return h(Tag, { color: color }, () => text)
        }
    },
    {
        title: '质检人员',
        dataIndex: 'inspectionOperator',
    },
]

export const searchFormSchema: FormSchema[] = [
    {
        field: 'inspectionNo',
        label: '质检单号',
        component: 'Input',
        colProps: { span: 4 },
    },
    {
        field: 'inspectionDate',
        label: '质检日期',
        component: 'RangePicker',
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        colProps: { span: 6 },
    },
    {
        field: 'testResults',
        label: '质检结果',
        component: 'Select',
        componentProps: {
            options: [
                { label: '待质检', value: 'S' },
                { label: '合格', value: 'Y' },
                { label: '不合格', value: 'N' },
            ],
        },
        colProps: { span: 4 },
    },
]


