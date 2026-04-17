<template>
  <!-- 列表页 -->
  <div v-if="!pageState.showDetail" class="enterprise-list-page">
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button
          type="primary"
          v-auth="'enterpriseList:add'"
          preIcon="ant-design:plus-outlined"
          @click="handleAdd"
        >
          新增企业
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <AddEnterprise @register="registerAddModal" @success="reload" />
  </div>

  <!-- 详情页（通过 v-if/v-else 切换，实现类似页面跳转效果） -->
  <div v-else class="enterprise-detail-page">
    <EnterpriseDetail
      :detail="pageState.currentDetail"
      :is-view="pageState.isView"
      :loading="pageState.detailLoading"
      @back="handleBack"
      @detail-updated="onDetailUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import { BasicTable, TableAction } from '/@/components/Table'
import { useModal } from '/@/components/Modal'
import { useListPage } from '/@/hooks/system/useListPage'
import { getDictTextByCode } from '/@/utils/dict'
import { useUserStore } from '/@/store/modules/user'
import EnterpriseDetail from './components/EnterpriseDetail.vue'
import AddEnterprise from './components/AddEnterprise.vue'
import { columns, searchFormSchema } from './enterprise.data'
import { listPage, deleteById, reportSubmit } from './enterprise.api'
import { buildListQueryParams } from './enterprise.transform'

const userStore = useUserStore()
const userType = computed(() => {
  const loginInfo = userStore.getLoginInfo as Record<string, any> | undefined
  return loginInfo?.userInfo?.userType ?? userStore.getUserInfo?.userType
})

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
    api: listPage,
    beforeFetch: (params) => buildListQueryParams({ params, getDictText: getDictTextByCode }),
    columns,
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

// ---------- 操作列（企业用户提交） ----------
function getTableAction(record: any) {
  const actions: any[] = [
    {
      label: '查看',
      auth: 'enterpriseList:view',
      onClick: () => openDetail(record, true),
    },
    {
      label: '修改',
      ifShow: record.checkState !== '02',
      auth: 'enterpriseList:edit',
      onClick: () => openDetail(record, false),
    },
    {
      label: '删除',
      ifShow: record.checkState !== '02',
      auth: 'enterpriseList:delete',
      popConfirm: {
        title: '确认删除该企业信息吗？',
        confirm: () => handleDelete(record),
      },
    },
  ]

  const type = userType.value
  const canSubmit = record.checkState === '01' || record.checkState === '03'
  if (type === 0 && canSubmit) {
    actions.push({
      label: '提交',
      auth: 'enterpriseList:submit',
      popConfirm: {
        title: `确认提交「${record.name}」企业数据吗？`,
        confirm: () => handleSubmit(record),
      },
    })
  }

  return actions
}

// ---------- 打开详情（查看 / 编辑） ----------
async function openDetail(record: any, isView: boolean) {
  pageState.showDetail = true
  pageState.isView = isView
  pageState.detailLoading = false
  pageState.currentDetail = { id: record.id, mineType: record.mineType, name: record.name }
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
  await deleteById(record.mineId)
  message.success('删除成功')
  reload()
}

// ---------- 提交 ----------
async function handleSubmit(record: any) {
  const id = record.id
  if (!id) {
    message.error('缺少提交所需的主键ID')
    return
  }
  await reportSubmit(id)
  message.success('提交成功')
  reload()
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
