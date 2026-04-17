<template>
  <!-- 列表页 -->
  <div v-if="!pageState.showDetail" class="enterprise-list-page">
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd">新增</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <AddEnterprise @register="registerAddModal" @success="reload" />
  </div>

  <!-- 详情页（通过 v-if/v-else 切换，实现类似页面跳转效果） -->
  <div v-else class="enterprise-detail-page">
    <EnterpriseDetail :detail="pageState.currentDetail" :is-view="pageState.isView" :loading="pageState.detailLoading"
      @back="handleBack" @detail-updated="onDetailUpdated" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { BasicTable, TableAction } from '/@/components/Table'
import { useModal } from '/@/components/Modal'
import { useListPage } from '/@/hooks/system/useListPage'
import EnterpriseDetail from './components/EnterpriseDetail.vue'
import AddEnterprise from './components/AddEnterprise.vue'
import { columns, searchFormSchema, mockListData, mockDetailData } from './enterprise.data'
import { listPage, getDetail, deleteById } from './enterprise.api'

// ---------- 页面状态（列表 / 详情切换） ----------
const pageState = reactive({
  showDetail: false,
  isView: false,
  detailLoading: false,
  currentDetail: null as Record<string, any> | null,
})

// ---------- 列表 ----------
const { tableContext } = useListPage({
  designScope: 'enterprise-list',
  tableProps: {
    // mock: 实际接口时换成 api: listPage
    title: '配置管理',
    api: listPage,
    columns: columns,
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: searchFormSchema,
    },
    actionColumn: {
      width: 180,
      fixed: 'right',
    },
  },
})
const [registerTable, { reload }] = tableContext

// ---------- 操作列 ----------
function getTableAction(record: any) {
  return [
    {
      label: '查看',
      onClick: () => openDetail(record, true),
    },
    {
      label: '修改',
      onClick: () => openDetail(record, false),
    },
    {
      label: '删除',
      popConfirm: {
        title: '确认删除该企业信息吗？',
        confirm: () => handleDelete(record),
      },
    },
  ]
}

// ---------- 打开详情（查看 / 编辑） ----------
async function openDetail(record: any, isView: boolean) {
  pageState.showDetail = true
  pageState.isView = isView
  pageState.detailLoading = true
  pageState.currentDetail = null

  try {
    // mock: 直接使用 mockDetailData；实际换成 await getDetail({ id: record.id })
    await getDetail({ id: record.id }).then((res) => {
      pageState.currentDetail = { ...res, id: record.id, name: record.name }
    })
  } finally {
    pageState.detailLoading = false
  }
}

// ---------- 返回列表 ----------
function handleBack() {
  pageState.showDetail = false
  pageState.currentDetail = null
  reload()
}

// ---------- 详情保存回调 ----------
function onDetailUpdated(data: Record<string, any>) {
  pageState.currentDetail = data
}

// ---------- 删除 ----------
async function handleDelete(record: any) {
  // mock: 实际调用 await deleteById(record.id)
  await deleteById(record.id).then(() => {
    message.success('删除成功')
    reload()
  })
}

// ---------- 新增弹窗 ----------
const [registerAddModal, { openModal: openAddModal }] = useModal()

function handleAdd() {
  openAddModal(true, { type: 'add', row: null })
}
</script>

<style scoped>
.enterprise-list-page {
  width: 100%;
  height: 100%;
}

/* 绝对定位撑满父容器，彻底脱离父容器 height 是否明确的影响 */
.enterprise-detail-page {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
</style>
