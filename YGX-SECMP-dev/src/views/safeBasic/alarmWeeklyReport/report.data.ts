import { BasicColumn, FormSchema } from '/@/components/Table'
import dayjs from 'dayjs';

export const columns: BasicColumn[] = [
    {
        title: '日期',
        dataIndex: 'weekLabel',
    },
    {
        title: '安防设备预警',
        dataIndex: 'videoAlarmCount',
    },

    {
        title: '危险源监测预警',
        dataIndex: 'hazardAlarmCount',
    },
    {
        title: '物联监测设备预警',
        dataIndex: 'monitorAlarmCount',
    },
    {
        title: '人工巡查报警',
        dataIndex: 'manualAlarmCount',
    },
]

export const searchFormSchema: FormSchema[] = [
    {
        field: 'date',
        label: '周报日期',
        component: 'RangePicker',
        colProps: { span: 6 },
        componentProps: {
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
            placeholder: ['开始日期', '结束日期'],
            disabledDate: (current) => {
                return current && current > dayjs().endOf('day');
            },
        },
    },
]



