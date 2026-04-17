<template>
  <!-- 列表页 -->
  <div v-if="!pageState.showDetail" class="infol-audit-page">
    <BasicTable @register="registerTable">
      <!-- 无新增按钮，此处留空 tableTitle 插槽（保留扩展入口） -->
      <template #tableTitle>
        <!-- 顶部统计 Tab + 搜索区 -->
        <div class="infol-audit-page__toolbar">
          <!-- 待审核 / 未提交退回 切换 -->
          <div class="stat-tabs">
            <div
              v-for="(tab, idx) in statTabs"
              :key="idx"
              :class="['stat-tab', { 'stat-tab--active': pageState.activeTab === idx }]"
              @click="handleTabChange(idx)"
            >
              {{ tab.label }}
              <span class="stat-tab__num">{{ tab.count }}</span>
              座
            </div>
          </div>
        </div>
      </template>

      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
  </div>

  <!-- 详情/审核页（绝对定位覆盖，模拟路由跳转效果） -->
  <div v-else class="infol-audit-detail-page">
    <EnterpriseDetail
      v-if="pageState.currentDetail"
      :detail="pageState.currentDetail"
      :is-view="pageState.isView"
      :loading="pageState.detailLoading"
      :show-audit-panel="!pageState.isView"
      @back="handleBack"
      @auditApprove="handleApprove"
      @auditReturn="handleReturn"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { BasicTable, TableAction } from '/@/components/Table'
import { useListPage } from '/@/hooks/system/useListPage'
import { useUserStore } from '/@/store/modules/user'
import EnterpriseDetail from '../enterpriseList/components/EnterpriseDetail.vue'
import { auditList, auditMine } from './infolAudit.api'
import {
    columnsToReview,
    columnsUnsubmitted,
    searchFormSchema,
    mockAuditStat,
    mockAuditDetail,
} from './infolAudit.data'

// ---------- 页面状态 ----------
const pageState = reactive({
  activeTab: 0, // 0: 待审核  1: 未提交/退回
  showDetail: false,
  isView: false,
  detailLoading: false,
  currentDetail: null as Record<string, any> | null,
  stat: { ...mockAuditStat },
})

// ---------- 统计 Tab 数据 ----------
const statTabs = computed(() => [
  { label: '待审核', count: pageState.stat.toReviewed },
  { label: '未提交与退回', count: pageState.stat.unSubmit + pageState.stat.refunded },
])

// ---------- 当前 Tab 的列定义 ----------
const currentColumns = computed(() =>
  pageState.activeTab === 0 ? columnsToReview : columnsUnsubmitted
)

// ---------- 列表（useListPage + 审核列表接口） ----------
const { tableContext } = useListPage({
  designScope: 'infol-audit-list',
  tableProps: {
    api: (params) => auditList(params),
    beforeFetch: (params) => {
      const query = { ...params }
      query.auditType = pageState.activeTab === 0 ? '1' : '2'
      return query
    },
    columns: currentColumns.value,
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: searchFormSchema,
    },
    actionColumn: { width: 160, fixed: 'right' },
  },
})
const [registerTable, { reload }] = tableContext

// ---------- 顶部统计：调用列表接口获取各类型总数 ----------
const userStore = useUserStore()

async function fetchAuditStat() {
  try {
    const baseParams: Record<string, any> = {
      pageNo: 1,
      pageSize: 1,
    }
    if (userStore.currentEnterpriseCode) {
      baseParams.orgCode = userStore.currentEnterpriseCode
    }

    const [toReviewRes, unSubmitRes] = await Promise.all([
      auditList({ ...baseParams, auditType: '1' }),
      auditList({ ...baseParams, auditType: '2' }),
    ])

    pageState.stat.toReviewed = (toReviewRes && (toReviewRes as any).total) || 0
    // 未提交与退回：直接使用 auditType=2 的 total
    pageState.stat.unSubmit = (unSubmitRes && (unSubmitRes as any).total) || 0
    pageState.stat.refunded = 0
  } catch (error) {
    // 简单兜底，避免统计异常导致页面报错
    console.error('获取审核统计失败', error)
  }
}

onMounted(() => {
  fetchAuditStat()
})

// ---------- Tab 切换 ----------
function handleTabChange(idx: number) {
  pageState.activeTab = idx
  reload()
}

// ---------- 操作列 ----------
function getTableAction(record: any) {
  const actions: any[] = [
    {
      label: '查看',
      auth: 'infolAudit:view',
      onClick: () => openDetail(record, true),
    },
  ]
  // 仅待审核 Tab 显示“审核”按钮
  if (pageState.activeTab === 0) {
    actions.push({
      label: '审核',
      auth: 'infolAudit:audit',
      onClick: () => openDetail(record, false),
    })
  }
  return actions
}

// ---------- 打开详情/审核页 ----------
async function openDetail(record: any, isView: boolean) {
  pageState.showDetail = true
  pageState.isView = isView
  pageState.detailLoading = true
  pageState.currentDetail = null

  // mock：模拟接口延迟；实际换成 await getAuditInfo({ id: record.waitCheckId })
  await new Promise((r) => setTimeout(r, 400))
  pageState.currentDetail = {
    ...mockAuditDetail,
    id: record.id,
    waitCheckId: record.waitCheckId,
    mineName: record.mineName,
    mineId: record.mineId,
    mineType: record.mineType,
    areaName: record.areaName,
    checkState: record.checkState,
    operationDatetime: record.operationDateTime || record.operationDatetime,
  }
  pageState.detailLoading = false
}

// ---------- 返回列表 ----------
function handleBack() {
  pageState.showDetail = false
  pageState.currentDetail = null
  reload()
}

async function handleReturn(reason: string) {
  const realReason = reason.trim()
  if (!realReason) {
    message.warning('请填写退回原因')
    return
  }
  const checkId = pageState.currentDetail?.waitCheckId
  if (!checkId) {
    message.error('缺少审核记录ID')
    return
  }
  await auditMine({ checkId, pass: false, checkComment: realReason })
  message.success('已退回')
  handleBack()
}

async function handleApprove() {
  const checkId = pageState.currentDetail?.waitCheckId
  if (!checkId) {
    message.error('缺少审核记录ID')
    return
  }
  await auditMine({ checkId, pass: true, checkComment: '' })
  message.success('审核通过')
  handleBack()
}
</script>

<style lang="less" scoped>
.infol-audit-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    &__toolbar {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        padding: 0 0 12px 0;
    }
}

// 统计 Tab 选择器
.stat-tabs {
    display: flex;
    align-items: center;
    background: #1a2540;
    border-radius: 10px;
    overflow: hidden;
    height: 40px;
    border: 1px solid #2a3a5c;
}

.stat-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    height: 100%;
    font-size: 12px;
    color: #7a9cc8;
    cursor: pointer;
    font-family: 'Courier New', Courier, monospace;
    transition: all 0.25s;
    white-space: nowrap;

    &__num {
        font-size: 18px;
        font-weight: bold;
        color: #7a9cc8;
        margin: 0 3px;
    }

    &:hover:not(&--active) {
        color: #a8c4e8;
        background: #243050;

        .stat-tab__num {
            color: #a8c4e8;
        }
    }

    &--active {
        background: linear-gradient(135deg, #273352, #394664);
        color: #e6f4ff;
        box-shadow: inset 0 0 12px rgba(57, 70, 100, 0.6);

        .stat-tab__num {
            color: #60b0ff;
        }
    }
}

.table-title-tip {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

// 详情页绝对定位撑满
.infol-audit-detail-page {
    position: absolute;
    inset: 0;
    overflow: hidden;

    :deep(.ant-spin-container) {
        width: 100%;
        height: 100%;
    }

    :deep(.ant-spin-nested-loading) {
        width: 100%;
        height: 100%;
    }
}
</style>
