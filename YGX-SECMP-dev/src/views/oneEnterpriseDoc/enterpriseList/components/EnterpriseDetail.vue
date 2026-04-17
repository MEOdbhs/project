<template>
  <div class="enterprise-detail" v-if="!innerLoading">
    <TabFormLayout :detail="detailData" :is-view="props.isView || props.showAuditPanel" :show-footer="showFooterBar"
      @back="emit('back')">
      <!-- 左侧菜单 -->
      <template #sider>
        <a-tooltip v-for="tab in tabs" :key="tab.key" :title="tab.label" placement="right">
          <div :class="['sider-item', { active: activeTab === tab.key }]" @click="activeTab = tab.key">
            {{ tab.label }}
          </div>
        </a-tooltip>
      </template>

      <!-- 动态组件 + （可选）右侧审核面板 -->
      <div class="detail-main" :class="{ 'detail-main--with-audit': props.showAuditPanel }">
        <div class="detail-main__content">
          <Transition name="tab-fade" mode="out-in">
            <component :is="currentComponent" :key="activeTab" ref="activeFormRef" :detail="currentTabDetail"
              :disabled="props.isView || props.showAuditPanel" @saveRecord="handleSaveOneRecord" />
          </Transition>
        </div>

        <div v-if="props.showAuditPanel" class="detail-main__audit">
          <div class="audit-panel">
            <div class="audit-panel__title">退回原因</div>
            <a-textarea v-model:value="auditComment" placeholder="请输入退回原因（退回时必填）"
              :auto-size="{ minRows: 10, maxRows: 16 }" class="audit-panel__textarea" />
            <div class="audit-panel__btns">
              <a-button danger block @click="handleAuditReturn">退回</a-button>
              <a-button type="primary" block @click="handleAuditApprove">通过</a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 保存按钮（显隐由 TabFormLayout 的 show-footer / showFooterBar 控制） -->
      <template #footer>
        <a-button type="primary" :loading="saving" @click="handleSave">
          保存{{ currentTabLabel }}
        </a-button>
      </template>
    </TabFormLayout>
  </div>

  <div v-else class="detail-loading">
    <a-spin size="large" tip="正在加载企业信息..." />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, markRaw } from 'vue'
import { message } from 'ant-design-vue'
import TabFormLayout from '../formClassComponent/TabFormLayout.vue'
import { queryMineDetail, saveBaseInfo, saveParentCompany, saveDetailProperty } from '../enterprise.api'

// ---------- Tab 组件映射表（key → 组件）----------
// 组件命名与 mine-field.ts 中的 key 保持一致
// markRaw 避免组件对象被 Vue 响应式代理，提升性能
import BaseInfoDTO from '../formClassComponent/BaseInfoDTO.vue'
import ParentCompanyDTO from '../formClassComponent/ParentCompanyDTO.vue'
import SafeLicenceDTO from '../formClassComponent/SafeLicenceDTO.vue'
import MineLicenceDTO from '../formClassComponent/MineLicenceDTO.vue'
import ProductDesignParamDTO from '../formClassComponent/ProductDesignParamDTO.vue'
import ProductNowParamDTO from '../formClassComponent/ProductNowParamDTO.vue'
import DataDesignDTO from '../formClassComponent/DataDesignDTO.vue'
import DataNowDTO from '../formClassComponent/DataNowDTO.vue'
import LastYearSafeProductSituationDTO from '../formClassComponent/LastYearSafeProductSituationDTO.vue'
import CoalOverviewDTO from '../formClassComponent/CoalOverviewDTO.vue'
import PersonInfoDTO from '../formClassComponent/PersonInfoDTO.vue'
import ResourceInfoDTO from '../formClassComponent/ResourceInfoDTO.vue'
import FiveLeaderDTOList from '../formClassComponent/FiveLeaderDTOList.vue'
import FivePersonDTOList from '../formClassComponent/FivePersonDTOList.vue'
import WasteDumpDesignParamDTOList from '../formClassComponent/WasteDumpDesignParamDTOList.vue'
import OutsourceTeamDTOList from '../formClassComponent/OutsourceTeamDTOList.vue'
import MiningDTOList from '../formClassComponent/MiningDTOList.vue'
import DzExplorationDTOList from '../formClassComponent/DzExplorationDTOList.vue'
import RiskControlDTOList from '../formClassComponent/RiskControlDTOList.vue'
import AccidentCasualtyDTOList from '../formClassComponent/AccidentCasualtyDTOList.vue'

const TAB_COMPONENTS: Record<string, any> = {
  baseInfoDTO: markRaw(BaseInfoDTO),
  parentCompanyDTO: markRaw(ParentCompanyDTO),
  safeLicenceDTO: markRaw(SafeLicenceDTO),
  mineLicenceDTO: markRaw(MineLicenceDTO),
  productDesignParamDTO: markRaw(ProductDesignParamDTO),
  productNowParamDTO: markRaw(ProductNowParamDTO),
  dataDesignDTO: markRaw(DataDesignDTO),
  dataNowDTO: markRaw(DataNowDTO),
  lastYearSafeProductSituationDTO: markRaw(LastYearSafeProductSituationDTO),
  coalOverviewDTO: markRaw(CoalOverviewDTO),
  personInfoDTO: markRaw(PersonInfoDTO),
  resourceInfoDTO: markRaw(ResourceInfoDTO),
  fiveLeaderDTOList: markRaw(FiveLeaderDTOList),
  fivePersonDTOList: markRaw(FivePersonDTOList),
  wasteDumpDesignParamDTOList: markRaw(WasteDumpDesignParamDTOList),
  outsourceTeamDTOList: markRaw(OutsourceTeamDTOList),
  miningDTOList: markRaw(MiningDTOList),
  dzExplorationDTOList: markRaw(DzExplorationDTOList),
  riskControlDTOList: markRaw(RiskControlDTOList),
  accidentCasualtyDTOList: markRaw(AccidentCasualtyDTOList),
}

// ---------- 保存接口策略表 ----------
// baseInfoDTO / parentCompanyDTO 走独立接口，其余走通用接口（mineDetailProperty 区分）
type SaveStrategy = 'baseInfo' | 'parentCompany' | 'detailProperty'
const SAVE_STRATEGY: Record<string, SaveStrategy> = {
  baseInfoDTO: 'baseInfo',
  parentCompanyDTO: 'parentCompany',
  // 默认未注册的 key 走 detailProperty
}

// ---------- Tab 菜单配置 ----------
// showFor: 限制显示的 mineType 值数组；不填则所有类型都显示
// 字典值：00=金属非金属地下矿山 01=金属非金属露天矿山（含排土场）03=尾矿库 07=井工煤矿 08=露天煤矿
const ALL_TABS: { key: string; label: string; showFor?: string[] }[] = [
  { key: 'baseInfoDTO', label: '基本信息' },
  { key: 'parentCompanyDTO', label: '上级企业信息' },
  { key: 'safeLicenceDTO', label: '安全许可证登记信息' },
  { key: 'mineLicenceDTO', label: '采矿许可证登记信息', showFor: ['01', '00'] },
  { key: 'productDesignParamDTO', label: '设计参数', showFor: ['01', '00', '03'] },
  { key: 'productNowParamDTO', label: '安全生产现状', showFor: ['01', '00', '03'] },
  { key: 'dataDesignDTO', label: '资料图纸上传', showFor: ['01', '00', '03'] },
  { key: 'dataNowDTO', label: '现状资料', showFor: ['01', '00', '03'] },
  { key: 'lastYearSafeProductSituationDTO', label: '上年度安全生产情况', showFor: ['01', '00', '03'] },
  { key: 'coalOverviewDTO', label: '矿井概况', showFor: ['08', '07'] },
  { key: 'personInfoDTO', label: '人员信息', showFor: ['08', '07'] },
  { key: 'resourceInfoDTO', label: '资源信息', showFor: ['08', '07'] },
  { key: 'fiveLeaderDTOList', label: '"五职"矿长信息', showFor: ['08', '01', '07', '00'] },
  { key: 'fivePersonDTOList', label: '"五科"人员信息', showFor: ['08', '01', '07', '00'] },
  { key: 'wasteDumpDesignParamDTOList', label: '排土场参数', showFor: ['01', '00'] },
  { key: 'outsourceTeamDTOList', label: '外包工程队信息', showFor: ['01', '00', '03'] },
  { key: 'miningDTOList', label: '采掘施工单位信息', showFor: ['01'] },
  { key: 'dzExplorationDTOList', label: '地质勘探单位信息', showFor: ['01', '00', '03'] },
  { key: 'riskControlDTOList', label: '风险管控', showFor: ['01', '00', '03'] },
  { key: 'accidentCasualtyDTOList', label: '生产安全事故伤亡情况', showFor: ['01', '00', '03'] },
]

const currentMineType = computed(() => {
  const raw =
    detailData.value?.mineType ??
    props.detail?.mineType
  if (raw == null) return ''
  const s = String(raw)

  console.log(s);
  
  return s.length >= 2 ? s : s.padStart(2, '0')
})

const tabs = computed(() =>
  ALL_TABS.filter((t) => !t.showFor || t.showFor.includes(currentMineType.value))
)

const LIST_TAB_KEYS = [
  'fiveLeaderDTOList', 'fivePersonDTOList', 'wasteDumpDesignParamDTOList',
  'outsourceTeamDTOList', 'miningDTOList', 'dzExplorationDTOList',
  'riskControlDTOList', 'accidentCasualtyDTOList',
]

/** 子组件内逐条保存，不需要底部「保存当前 Tab」栏 */
const FOOTER_SAVE_HIDDEN_TAB_KEYS: string[] = [
  'accidentCasualtyDTOList',
  'outsourceTeamDTOList',
  'miningDTOList',
  'wasteDumpDesignParamDTOList',
  'dzExplorationDTOList',
]

// ---------- Props / Emits ----------
interface Props {
  detail: Record<string, any> | null
  isView?: boolean
  loading?: boolean
  // 审核模式：展示右侧 20% 的审核意见 + 审核按钮区
  showAuditPanel?: boolean
  /** 是否展示底部全局「保存」按钮；部分嵌套页可关闭 */
  showFooterSave?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isView: false,
  loading: false,
  showAuditPanel: false,
  showFooterSave: true,
})

const emit = defineEmits<{
  back: []
  detailUpdated: [data: Record<string, any>]
  auditApprove: []
  auditReturn: [reason: string]
}>()

// ---------- 状态 ----------
const activeTab = ref('baseInfoDTO')
const activeFormRef = ref<{ validate: () => Promise<Record<string, any>> } | null>(null)
const saving = ref(false)
const detailLoading = ref(false)
const detailData = ref<Record<string, any> | null>(null)
const innerLoading = computed(() => props.loading || detailLoading.value)

// 审核模式下右侧意见输入
const auditComment = ref('')

const currentComponent = computed(() => TAB_COMPONENTS[activeTab.value] ?? null)
const currentTabLabel = computed(() => tabs.value.find((t) => t.key === activeTab.value)?.label ?? '')

const showFooterBar = computed(
  () => props.showFooterSave && !FOOTER_SAVE_HIDDEN_TAB_KEYS.includes(activeTab.value)
)
const currentTabDetail = computed(() => {
  const source = detailData.value
  if (!source) return null
  if (activeTab.value !== 'baseInfoDTO') return source
  const baseInfoDTO = source.baseInfoDTO ?? {}
  return {
    ...baseInfoDTO,
    id: baseInfoDTO.id ?? source.id,
    name: baseInfoDTO.name ?? source.name,
    type: baseInfoDTO.type ?? source.type,
    areaId: baseInfoDTO.areaId ?? source.areaId,
    mineId: baseInfoDTO.mineId ?? source.mineId,
    mineType: baseInfoDTO.mineType ?? source.mineType,
    areaName: baseInfoDTO.areaName ?? source.areaName,
  }
})

watch(
  () => props.detail?.id,
  async (id) => {
    activeTab.value = 'baseInfoDTO'
    if (!id) {
      detailData.value = props.detail ?? null
      return
    }
    await fetchDetail(id)
  },
  { immediate: true }
)

// 企业类型变化时，若当前 tab 已不在可见列表，重置到第一个
watch(tabs, (newTabs) => {
  if (!newTabs.find((t) => t.key === activeTab.value)) {
    activeTab.value = newTabs[0]?.key ?? 'baseInfoDTO'
  }
})

// ---------- 统一保存调度 ----------
async function handleSave() {
  if (!activeFormRef.value) return
  saving.value = true

  //只有 上级企业信息 parentCompanyDTO  和  基本信息 baseInfoDTO 是单独的2个保存接口
  //其他都是通用接口，注意维护，此处容易出屎山
  try {
    const formData = await activeFormRef.value.validate()
    const key = activeTab.value
    const strategy: SaveStrategy = SAVE_STRATEGY[key] ?? 'detailProperty'

    if (strategy === 'baseInfo') {
      await saveBaseInfo(formData)
      message.success('基本信息保存成功')
      detailData.value = { ...(detailData.value || {}), baseInfoDTO: { ...(detailData.value?.baseInfoDTO || {}), ...formData } }
      emit('detailUpdated', detailData.value as Record<string, any>)

    } else if (strategy === 'parentCompany') {
      const companyId = detailData.value?.id ?? props.detail?.id
      const meMineId = detailData.value?.mineId ?? formData.meMineId
      const payload = {
        ...formData,
        companyId,
        meMineId,
      }

      await saveParentCompany(payload)
      message.success('上级企业信息保存成功')
      detailData.value = {
        ...(detailData.value || {}),
        parentCompanyDTO: payload,
      }
      emit('detailUpdated', detailData.value as Record<string, any>)

    } else {
      const mineDetail = { ...formData, companyId: detailData.value?.id }
      await saveDetailProperty({
        mineDetailProperty: key,
        mineDetail,
      })
      if (!LIST_TAB_KEYS.includes(key)) {
        detailData.value = { ...(detailData.value || {}), [key]: formData }
      }
      emit('detailUpdated', detailData.value as Record<string, any>)
      fetchDetail(detailData.value?.id)
    }
  } catch {
    // validate 失败时静默，ant-design 会自动显示字段错误
  } finally {
    saving.value = false
  }
}

async function handleSaveOneRecord(record?: Record<string, any>) {
  const key = activeTab.value
  saving.value = true
  try {
    const shouldPersist = record != null && Object.keys(record).length > 0
    if (shouldPersist) {
      await saveDetailProperty({
        mineDetailProperty: key,
        mineDetail: { ...record, companyId: detailData.value?.id },
      })
      message.success('保存成功')
    }
    await fetchDetail(detailData.value?.id)
    emit('detailUpdated', detailData.value as Record<string, any>)
  } catch (e) {
    console.error(e)
    message.error('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

function handleAuditReturn() {
  const reason = auditComment.value.trim()
  if (!reason) {
    // 仅在审核模式下提示，避免影响普通查看/编辑
    // 具体错误提示交由上层统一风格处理
    return
  }
  emit('auditReturn', reason)
}

function handleAuditApprove() {
  emit('auditApprove')
}

async function fetchDetail(id: string) {
  if (!id) return
  detailLoading.value = true
  try {
    const result = await queryMineDetail({ id })
    const mineType = props.detail?.mineType
    const normalizedMineType =
      mineType != null ? (String(mineType).length >= 2 ? String(mineType) : String(mineType).padStart(2, '0')) : undefined
    detailData.value = result
      ? { ...result, ...(normalizedMineType !== undefined ? { mineType: normalizedMineType } : {}) }
      : null
  } catch (error) {
    console.error(error)
    message.error('矿山详情加载失败，请稍后重试')
  } finally {
    detailLoading.value = false
  }
}
</script>

<style lang="less" scoped>
/* 作为 TabFormLayout 绝对定位的基准容器 */
.enterprise-detail {
  position: relative;
  width: 100%;
  height: 100%;
}

.detail-main {
  display: flex;
  gap: 16px;

  &__content {
    flex: 4;
    min-width: 0;
  }

  &__audit {
    flex: 1;
    min-width: 220px;
    max-width: 360px;
  }
}

.detail-main--with-audit {
  align-items: stretch;
}

.audit-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px 12px 0;
  background: #001b33;
  border-left: 1px solid #0d2a45;

  &__title {
    font-size: 13px;
    font-weight: 600;
    color: #a8c4e8;
    margin-bottom: 8px;
  }

  &__textarea {
    flex: 1;
    resize: none;
  }

  &__btns {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
    padding-bottom: 12px;
  }
}

.detail-loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #001529;
}

.sider-item {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 13px;
  color: #8fbcdb;
  border-left: 3px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: #002040;
    color: #40a9ff;
  }

  &.active {
    background: #002d57;
    color: #40a9ff;
    border-left-color: #1677ff;
    font-weight: 500;
  }
}

.tab-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease;
}

.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
}
</style>
