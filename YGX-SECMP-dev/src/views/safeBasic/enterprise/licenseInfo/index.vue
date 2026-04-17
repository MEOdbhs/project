<!-- 证照信息管理 -->
<template>
    <BasicTable @register="registerTable">
        <template #tableTitle>
            <a-button v-auth="'license:add'" type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd">新增</a-button>
            <a-button v-auth="'license:export'" @click="onExportXls" class="mr-2" type="primary"
                preIcon="ant-design:export-outlined">导出</a-button>

        </template>
        <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
        </template>
    </BasicTable>
    <AddOrEditData @register="registerModal" @success="reload" />
</template>
<script name="license-info" setup>
import { BasicTable, TableAction } from '/@/components/Table'
import AddOrEditData from './components/AddOrEditData.vue'
import { useModal } from '/@/components/Modal'
import { columns, searchFormSchema } from './license.data'
import { listPage, deleteFlagById,getExportUrl } from './license.api'
import { useListPage } from '/@/hooks/system/useListPage'
const [registerModal, { openModal }] = useModal()

// 列表页面公共参数、方法
const { tableContext, onExportXls } = useListPage({
    designScope: 'license-info-template',
    tableProps: {
        title: '证照信息',
        api: listPage,
        columns: columns,
        showIndexColumn: true,
        formConfig: {
            labelWidth: 80,
            rowProps: { gutter: 24 },
            schemas: searchFormSchema,
        },
        actionColumn: {
            width: 200,
        },
    },
    exportConfig: {
        name: '证照信息',
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
            auth:'license:edit',
            ifShow: () => {
                return record.statusText !== '已过期'
            }
        },
        {
            label: '删除',
            auth:'license:delete',
            popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
            },
        },

    ]
}
</script>