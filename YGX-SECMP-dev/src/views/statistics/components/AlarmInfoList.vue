<!-- 预警信息列表 -->
<template>
    <BasicTable @register="registerTable">
        <template #tableTitle>
            <a-button v-auth="'OnlineWarning-export'" @click="onExportXls" class="mr-2" type="primary"
                preIcon="ant-design:export-outlined">导出</a-button>
        </template>
        <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
        </template>
    </BasicTable>
    <AddOrEditData @register="registerModal" @success="reload" />
</template>
<script name="alarm-info-list" setup>
import { BasicTable, TableAction } from '/@/components/Table'
import AddOrEditData from '/@/views/safeWatch/onlineWarning/onlineWarning/components/AddOrEditData.vue'
import { useModal } from '/@/components/Modal'
import { columns, searchFormSchema } from '../data'
import { listPage, getExportUrl } from '../api'
import { useListPage } from '/@/hooks/system/useListPage'
const [registerModal, { openModal }] = useModal()

const props = defineProps({
    mineInfo: {
        type: Object,
        default: () => ({})
    }
})

// 列表页面公共参数、方法
const { tableContext, onExportXls } = useListPage({
    designScope: 'alarm-info-list-template',
    tableProps: {
        api: listPage,
        columns: columns,
        showIndexColumn: true,
        autoOrgCode: false,
        formConfig: {
            labelWidth: 120,
            rowProps: { gutter: 24 },
            schemas: searchFormSchema,
            fieldMapToTime: [['alarmTime', ['startTime', 'endTime'], 'YYYY-MM-DD']],
        },
        actionColumn: {
            width: 200,
            fixed: 'right',
        },
        beforeFetch: (params) => {
            params.orgCode = props.mineInfo.orgCode
            return params
        },
    },
    exportConfig: {
        name: '预警信息',
        url: getExportUrl,
        params: {
            orgCode: props.mineInfo.orgCode,
        },
    },
})
const [registerTable, { reload }] = tableContext

/**
 * 查看
 */
function handleView(record) {
    openModal(true, { type: 'view', record })
}
/**
 * 编辑
 */
function handleEdit(record) {
    openModal(true, { type: 'edit', record })
}

/**
 * 操作栏
 */
function getTableAction(record) {
    return [
        {
            label: '查看',
            onClick: handleView.bind(null, record),
            auth: 'OnlineWarning-view',
        },
        {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            auth: 'OnlineWarning-edit',
        },
    ]
}
</script>