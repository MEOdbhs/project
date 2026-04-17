<!-- 证照信息管理 -->
<template>
    <BasicTable @register="registerTable">
        <template #tableTitle>
            <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd" v-auth="'duty:add'">新增</a-button>
            <a-button @click="onExportXls" class="mr-2" type="primary"
                preIcon="ant-design:export-outlined" v-auth="'duty:export'">导出</a-button>

        </template>
        <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
        </template>
    </BasicTable>
    <AddOrEditData @register="registerModal" @success="reload" />
</template>
<script name="duty-info" setup>
import { BasicTable, TableAction } from '/@/components/Table'
import AddOrEditData from './components/AddOrEditData.vue'
import { useModal } from '/@/components/Modal'
import { columns, searchFormSchema } from './duty.data'
import { listPage, deleteFlagById,getExportUrl } from './duty.api'
import { useListPage } from '/@/hooks/system/useListPage'
const [registerModal, { openModal }] = useModal()

// 列表页面公共参数、方法
const { tableContext, onExportXls } = useListPage({
    designScope: 'duty-info-template',
    tableProps: {
        api: listPage,
        columns: columns,
        showIndexColumn: true,
        formConfig: {
            labelWidth: 80,
            rowProps: { gutter: 24 },
            schemas: searchFormSchema,
            fieldMapToTime: [['dutyDate', ['dutyDateStart', 'dutyDateEnd'], 'YYYY-MM-DD']],
        },
        actionColumn: {
            width: 200,
            fixed: 'right',
        },
    },
    exportConfig: {
        name: '值班值守列表',
        url: getExportUrl,
    },
})
const [registerTable, { reload }] = tableContext

/**
 * 新增
 */
function handleAdd() {
    openModal(true, { type: 'add', row: null, isUpdate: false })
}
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
 * 删除事件
 */
async function handleDelete(record) {
    await deleteFlagById(record.id, reload)
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
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            auth: 'duty:edit'
        },
        {
            label: '删除',
            popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
            },
            auth: 'duty:delete'
        },

    ]
}
</script>