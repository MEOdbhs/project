<!-- 证照信息管理 -->
<template>
    <BasicTable @register="registerTable">
        <template #tableTitle>
            <a-button v-auth="'enterprise:user:add'" type="primary" preIcon="ant-design:plus-outlined"
                @click="handleAdd">新增</a-button>
        </template>
        <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
        </template>
    </BasicTable>
    <DetailModal @register="registerModal" @success="reload" />
    <AddOrEditData @register="registerAddOrEditModal" @success="reload" />
</template>
<script name="license-info" setup>
import { BasicTable, TableAction } from '/@/components/Table'
import DetailModal from './components/DetailData.vue'
import AddOrEditData from './components/AddOrEditData.vue'
import { useModal } from '/@/components/Modal'
import { columns, searchFormSchema } from './user.data'
import { listPage, deleteUser } from './user.api'
import { useListPage } from '/@/hooks/system/useListPage'
const [registerModal, { openModal }] = useModal()
const [registerAddOrEditModal, { openModal: openAddOrEditModal }] = useModal()

// 列表页面公共参数、方法
const { tableContext } = useListPage({
    designScope: 'license-info-template',
    tableProps: {
        // title: '人员信息库',
        api: listPage,
        columns: columns,
        showIndexColumn: true,
        showTableSetting: true,
        formConfig: {
            labelWidth: 100,
            autoAdvancedCol: 4,
            rowProps: { gutter: 16 },
            schemas: searchFormSchema,
        },
        actionColumn: {
            width: 160,
        },
    },
})
const [registerTable, { reload }] = tableContext

function handleView(record) {
    openModal(true, { type: 'view', row: record, isUpdate: true })
}

function handleAdd() {
    openAddOrEditModal(true, { type: 'add' })
}
function handleEdit(record) {
    openAddOrEditModal(true, { type: 'edit', row: record, isUpdate: true })
}
function handleDelete(record) {
    deleteUser({ id: record.id }, reload)
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
            auth: 'enterprise:user:edit',
        },
        {
            label: '删除',
            popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
            },
            auth: 'enterprise:user:delete',
        },
    ]
}
</script>