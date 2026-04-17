import { BasicColumn, FormSchema } from '/@/components/Table'
import { getDictTextByCode } from '/@/utils/dict'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'
import { defalutPackColumns } from './../../../system/tenant/tenant.data';

export const planColumns: BasicColumn[] = [
    {
        title: '预案名称',
        dataIndex: 'name',
    },
    {
        title: '预案类型',
        dataIndex: 'type',
        customRender: ({ record }) => {
            return getDictTextByCode(record.type, 'plan_type')
        },
    },

    {
        title: '编制日期',
        dataIndex: 'planDate',
    },

    {
        title: '预案演练次数',
        dataIndex: 'drillNum',
    },
]

export const drillColumn: BasicColumn[] = [
    {
        title: '演练时间',
        dataIndex: 'drillDateStart',
        width: 280,
        customRender: ({ record }) => {
            return record.drillDateStart + ' - ' + record.drillDateEnd
        },
    },
    {
        title: '演练形式',
        dataIndex: 'drillType',
        customRender: ({ record }) => {
            return getDictTextByCode(record.drillType, 'drill_format')
        },
    },

    {
        title: '演练名称',
        dataIndex: 'name',
    },

    {
        title: '演练预案',
        dataIndex: 'planName',
    },
    {
        title: '预案类别',
        dataIndex: 'typeText',
    },
    {
        title: '演练人员',
        dataIndex: 'drillPersonNum',
    },
    {
        title: '演练状态',
        dataIndex: 'drillStatusText',
        customRender: ({ record }) => {
            let color = 'defalut'
            if(record.drillStatusText === '未开始'){
                color = 'blue'
            }
            if(record.drillStatusText === '进行中'){
                color = 'green'
            }
            return h(Tag, { color: color }, () => record.drillStatusText);
        },
    },

]

export const searchFormSchema: FormSchema[] = [
    {
        field: 'name',
        label: '应急预案名称',
        component: 'Input',
        colProps: { span: 4 },
    },
    {
        field: 'type',
        label: '预案类别',
        component: 'JDictSelectTag',
        componentProps: {
            dictCode: 'plan_type',
            showChooseOption: false,
        },
        colProps: { span: 4 },
    },
    {
        field: 'planDate',
        component: 'RangePicker',
        label: '编制日期',
        componentProps: {
            valueType: 'Date',
        },
        colProps: {
            span: 6,
        },
    },
]
export const searchFormSchemaDrill: FormSchema[] = [
    {
        field: 'name',
        label: '应急演练名称',
        component: 'Input',
        colProps: { span: 4 },
    },
    {
        field: 'drillType',
        label: '演练形式',
        component: 'JDictSelectTag',
        componentProps: {
            dictCode: 'drill_format',
            showChooseOption: false,
        },
        colProps: { span: 4 },
    },
    {
        field: 'type',
        label: '预案类别',
        component: 'JDictSelectTag',
        componentProps: {
            dictCode: 'plan_type',
            showChooseOption: false,
        },
        colProps: { span: 4 },
    },
    {
        field: 'drillDate',
        component: 'RangePicker',
        label: '演练日期',
        componentProps: {
            valueType: 'Date',
        },
        colProps: {
            span: 6,
        },
    },
]

