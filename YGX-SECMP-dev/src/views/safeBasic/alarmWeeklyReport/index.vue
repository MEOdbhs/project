<!-- 证照信息管理 -->
<template>
    <BasicTable @register="registerTable">
        <template #tableTitle>
            <a-button v-auth="'weekly:report:export'" @click="onExportXls" class="mr-2" type="primary"
                preIcon="ant-design:export-outlined">导出</a-button>

        </template>
    </BasicTable>
</template>
<script name="alarm-weekly-report" setup>
import { BasicTable } from '/@/components/Table'
import { columns, searchFormSchema } from './report.data'
import { listPage,getExportUrl } from './report.api'
import { useListPage } from '/@/hooks/system/useListPage'

// 列表页面公共参数、方法
const { tableContext, onExportXls } = useListPage({
    designScope: 'alarm-weekly-report-template',
    tableProps: {
        api: listPage,
        columns: columns,
        showIndexColumn: true,
        showTableSetting: true,
        showActionColumn: false,
        formConfig: {
            labelWidth: 100,
            autoAdvancedCol: 4,
            rowProps: { gutter: 24 },
            schemas: searchFormSchema,
            fieldMapToTime: [['date', ['startDate', 'endDate'], 'YYYY-MM-DD']],
        },
    },
    exportConfig: {
        name: '安全报警周报',
        url: getExportUrl,
    },
})
const [registerTable, { reload }] = tableContext

</script>