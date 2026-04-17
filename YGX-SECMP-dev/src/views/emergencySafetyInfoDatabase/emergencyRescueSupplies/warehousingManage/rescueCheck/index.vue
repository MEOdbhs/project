<!-- 证照信息管理 -->
<template>
    <BasicTable @register="registerTable">
        <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
        </template>
    </BasicTable>
    <AddOrEditData @register="registerModal" @success="reload" />
</template>
<script name="rescue-warehousing" setup>
import { BasicTable, TableAction } from '/@/components/Table'
import AddOrEditData from './components/AddOrEditData.vue'
import { useModal } from '/@/components/Modal'
import { columns, searchFormSchema } from './check.data'
import { listPage } from './check.api'
import { useListPage } from '/@/hooks/system/useListPage'
const [registerModal, { openModal }] = useModal()

// 列表页面公共参数、方法
const { tableContext } = useListPage({
    designScope: 'rescue-warehousing-template',
    tableProps: {
        api: listPage,
        columns: columns,
        showIndexColumn: true,
        formConfig: {
            labelWidth: 80,
            rowProps: { gutter: 24 },
            schemas: searchFormSchema,
            autoAdvancedCol:4,
            fieldMapToTime: [['inspectionDate', ['startInspectionDate', 'endInspectionDate'], 'YYYY-MM-DD']],
        },
        actionColumn: {
            width: 160,
        },
    },
})
const [registerTable, { reload }] = tableContext

/**
 * 查看
 */
function handleView(record) {
    openModal(true, { type: 'view', row: record, isUpdate: true })
}
/**
 * 编辑
 */
function handleEdit(record) {
    openModal(true, { type: 'edit', row: record, isUpdate: true })
}
/**
 * 操作栏
 */
function getTableAction(record) {
    return [
        {
            label: '查看',
            onClick: handleView.bind(null, record),
        },
        {
            label: '质检',
            onClick: handleEdit.bind(null, record),
            auth:'rescueCheck:edit',
            ifShow:() => record.testResults === 'S',
        },
    ]
}
</script>