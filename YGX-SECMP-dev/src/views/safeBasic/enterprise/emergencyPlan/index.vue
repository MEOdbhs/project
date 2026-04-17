<template>
    <div class="basic-container">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="应急预案">
                <BasicTable @register="registerPlanTable">
                    <template #tableTitle>
                        <a-button v-auth="'emergency:plan:add'" type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd">新增</a-button>
                        <a-button v-auth="'emergency:plan:export'" class="mr-2" type="primary" preIcon="ant-design:export-outlined" @click="handleExportPlan">导出</a-button>
                    </template>
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'action'">
                            <TableAction :actions="getTableAction(record)" />
                        </template>
                    </template>
                </BasicTable>
            </a-tab-pane>
            <a-tab-pane key="2" tab="应急演练" force-render>
                <BasicTable @register="registerDrillTable">
                    <template #tableTitle>
                        <a-button v-auth="'emergency:drill:add'" type="primary" preIcon="ant-design:plus-outlined"
                            @click="handleAddDrill">新增</a-button>
                        <a-button v-auth="'emergency:drill:export'" class="mr-2" type="primary" preIcon="ant-design:export-outlined" @click="handleExportDrill">导出</a-button>
                    </template>
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'action'">
                            <TableAction :actions="getTableActionDrill(record)" />
                        </template>
                    </template>
                </BasicTable>
            </a-tab-pane>
        </a-tabs>
        <AddOrEditPlan @register="registerModal" @success="reloadPlan" />
        <AddOrEditDrill @register="registerModalDrill" @success="reloadDrill" />
    </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { BasicTable, TableAction, useTable } from '/@/components/Table'
import { useModal } from '/@/components/Modal'
import AddOrEditPlan from './components/AddOrEditPlan.vue'
import AddOrEditDrill from './components/AddOrEditDrill.vue'
import { listPagePlan, listPageDrill, getViewByIdPlan, getViewByIdrill, deletePlan, deleteDrill, getExportUrlPlan, getExportUrlDrill } from './plan.api'
import { message } from 'ant-design-vue'
import { useMethods } from '/@/hooks/system/useMethods'
import { useUserStore } from '/@/store/modules/user'
const userStore = useUserStore()
import {
    planColumns,
    searchFormSchema,
    drillColumn,
    searchFormSchemaDrill,
} from './plan.data'
const activeKey = ref('1')
const { handleExportXls } = useMethods()

// 应急预案表格
const [registerPlanTable, { reload: reloadPlan, getForm: getPlanForm }] = useTable({
    title: '应急预案列表',
    api: listPagePlan,
    columns: planColumns,
    showIndexColumn: true,
    bordered: true,
    actionColumn: {
        width: 200,
        title: '操作',
        dataIndex: 'action',
    },
    useSearchForm: true,
    formConfig: {
        schemas: searchFormSchema,
        labelWidth: 100,
        fieldMapToTime: [['planDate', ['planDateStart', 'planDateEnd'], 'YYYY-MM-DD']],
    },
})

// 应急演练表格
const [registerDrillTable, { reload: reloadDrill, getForm: getDrillForm }] = useTable({
    title: '应急演练列表',
    api: listPageDrill,
    columns: drillColumn,
    showIndexColumn: true,
    bordered: true,
    actionColumn: {
        width: 200,
        title: '操作',
        dataIndex: 'action',
    },
    useSearchForm: true,
    formConfig: {
        schemas: searchFormSchemaDrill,
        labelWidth: 100,
        autoAdvancedCol: 4,
        fieldMapToTime: [['drillDate', ['drillDateStart', 'drillDateEnd'], 'YYYY-MM-DD']],
    },
})

const [registerModal, { openModal }] = useModal()
const [registerModalDrill, { openModal: openModalDrill }] = useModal()

const handleAdd = () => {
    openModal(true, {
        type: 'add',
    })
}

const handleAddDrill = () => {
    openModalDrill(true, {
        type: 'add',
    })
}

// 编辑应急预案
const handleEditPlan = async (record) => {
    try {
        const data = await getViewByIdPlan({ id: record.id })
        openModal(true, {
            row: data,
            type: 'edit',
        })
    } catch (error) {
        console.error('获取应急预案详情失败:', error)
        message.error('获取详情失败')
    }
}

// 查看应急预案
const handleViewPlan = async (record) => {
    try {
        const data = await getViewByIdPlan({ id: record.id })
        openModal(true, {
            row: data,
            type: 'view',
        })
    } catch (error) {
        console.error('获取应急预案详情失败:', error)
        message.error('获取详情失败')
    }
}

// 编辑应急演练
const handleEditDrill = async (record) => {
    try {
        const data = await getViewByIdrill({ id: record.id })
        openModalDrill(true, {
            row: data,
            type: 'edit',
        })
    } catch (error) {
        console.error('获取应急演练详情失败:', error)
        message.error('获取详情失败')
    }
}

// 查看应急演练
const handleViewDrill = async (record) => {
    try {
        const data = await getViewByIdrill({ id: record.id })
        openModalDrill(true, {
            row: data,
            type: 'view',
        })
    } catch (error) {
        console.error('获取应急演练详情失败:', error)
        message.error('获取详情失败')
    }
}

// 删除应急预案
const handleDeletePlan = async (record) => {
    try {
        await deletePlan(record.id, reloadPlan)
    } catch (error) {
        console.error('删除应急预案失败:', error)
        message.error('删除失败')
    }
}

// 删除应急演练
const handleDeleteDrill = async (record) => {
    try {
        await deleteDrill(record.id, reloadDrill)
    } catch (error) {
        console.error('删除应急演练失败:', error)
        message.error('删除失败')
    }
}

// 导出应急预案
const handleExportPlan = async () => {
    try {
        const formParams = await getPlanForm().validate()
        const params = {
            ...formParams,
            orgCode: userStore.currentEnterpriseCode
        }
        await handleExportXls('应急预案列表', getExportUrlPlan, params)
    } catch (error) {
        console.error('导出应急预案失败:', error)
    }
}

// 导出应急演练
const handleExportDrill = async () => {
    try {
        const formParams = await getDrillForm().validate()
        const params = {
            ...formParams,
            orgCode: userStore.currentEnterpriseCode
        }
        await handleExportXls('应急演练列表', getExportUrlDrill, params)
    } catch (error) {
        console.error('导出应急演练失败:', error)
    }
}

// 应急预案操作列
function getTableAction(record) {
    return [
        {
            label: '查看',
            onClick: handleViewPlan.bind(null, record),
        },
        {
            label: '编辑',
            onClick: handleEditPlan.bind(null, record),
            auth:'emergency:plan:edit'
        },
        {
            label: '删除',
            auth:'emergency:plan:delete',
            popConfirm: {
                title: '确定删除该应急预案吗?',
                confirm: handleDeletePlan.bind(null, record),
            },
        },
    ]
}

// 应急演练操作列
function getTableActionDrill(record) {
    return [
        {
            label: '查看',
            onClick: handleViewDrill.bind(null, record),
        },
        {
            label: '编辑',
            onClick: handleEditDrill.bind(null, record),
            auth:'emergency:drill:edit'
        },
        {
            label: '删除',
            auth:'emergency:drill:delete',
            popConfirm: {
                title: '确定删除该应急演练吗?',
                confirm: handleDeleteDrill.bind(null, record),
            },
        },
    ]
}
</script>

<style lang='less' scoped>
.basic-container {
    padding: 10px;
}
</style>