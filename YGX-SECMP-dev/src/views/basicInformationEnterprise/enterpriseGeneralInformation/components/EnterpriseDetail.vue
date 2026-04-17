<template>
  <div class="enterprise-detail" v-if="!loading">
    <TabFormLayout :detail="detail" :is-view="isView" @back="emit('back')">
      <!-- 左侧菜单 -->
      <template #sider>
        <div v-for="tab in tabs" :key="tab.key" :class="['sider-item', { active: activeTab === tab.key }]"
          @click="activeTabClick(tab.key)">
          {{ tab.label }}
        </div>
      </template>

      <!-- 动态组件：key 与左侧菜单 key 一一对应，组件命名即 key -->
      <Transition name="tab-fade" mode="out-in">
        <component :is="currentComponent" :key="activeTab" ref="activeFormRef" :detail="detail" :disabled="isView" />
      </Transition>

      <!-- 保存按钮 -->
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
import type { } from '../enterprise.api'
// 预留保存接口，对接真实 API 时取消注释
import { addEnterprise, saveParentCompany, saveDetailProperty, getDetailCompany, saveIndTradeChemDir, getIndTradeChemDir, saveIndTradeChemFac, getIndTradeChemFac } from '../enterprise.api'

// ---------- Tab 组件映射表（key → 组件）----------
// 组件命名与 mine-field.ts 中的 key 保持一致
// markRaw 避免组件对象被 Vue 响应式代理，提升性能
import BaseInfoDTO from '../formClassComponent/BaseInfoDTO.vue'
import ParentCompanyDTO from '../formClassComponent/ParentCompanyDTO.vue'
import SafeLicenceDTO from '../formClassComponent/SafeLicenceDTO.vue'
import FactoryInformationDTO from '../formClassComponent/FactoryInformationDTO.vue'

import { constant } from 'lodash-es'

const TAB_COMPONENTS: Record<string, any> = {
  baseInfoDTO: markRaw(BaseInfoDTO),
  parentCompanyDTO: markRaw(ParentCompanyDTO),
  safeLicenceDTO: markRaw(SafeLicenceDTO),
  factoryInformationDTO: markRaw(FactoryInformationDTO),
}

// ---------- 保存接口策略表 ----------
// baseInfoDTO / parentCompanyDTO / safeLicenceDTO 走独立接口，其余走通用接口（mineDetailProperty 区分）
type SaveStrategy = 'baseInfo' | 'parentCompany' | 'detailProperty' | 'safeLicence' | 'factoryInfor'
const SAVE_STRATEGY: Record<string, SaveStrategy> = {
  baseInfoDTO: 'baseInfo',
  parentCompanyDTO: 'parentCompany',
  safeLicenceDTO: 'safeLicence',
  factoryInformationDTO: 'factoryInfor',
  // 默认未注册的 key 走 detailProperty
}

// ---------- Tab 菜单配置 ----------
// showFor: 限制显示的 mineType 值数组；不填则所有类型都显示
// 字典值：1=露天煤矿 2=露天矿山 3=井工煤矿 4=地下矿山 5=尾矿库
const ALL_TABS: { key: string; label: string; showFor?: string[] }[] = [
  { key: 'baseInfoDTO', label: '工贸信息' },
  { key: 'parentCompanyDTO', label: '企业注册信息' },
  { key: 'safeLicenceDTO', label: '工厂目录' },
  { key: 'factoryInformationDTO', label: '工厂基本信息' },
  // { key: 'productDesignParamDTO',          label: '设计参数',            showFor: ['2', '4', '5'] },
  // { key: 'productNowParamDTO',             label: '安全生产现状',        showFor: ['2', '4', '5'] },
  // { key: 'dataDesignDTO',                  label: '资料图纸上传',        showFor: ['2', '4', '5'] },
  // { key: 'dataNowDTO',                     label: '现状资料',            showFor: ['2', '4', '5'] },
  // { key: 'lastYearSafeProductSituationDTO',label: '上年度安全生产情况',  showFor: ['2', '4', '5'] },
  // { key: 'coalOverviewDTO',                label: '矿井概况',            showFor: ['1', '3'] },
  // { key: 'personInfoDTO',                  label: '人员信息',            showFor: ['1', '3'] },
  // { key: 'resourceInfoDTO',                label: '资源信息',            showFor: ['1', '3'] },
  // { key: 'fiveLeaderDTOList',              label: '"五职"矿长信息',       showFor: ['1', '2', '3', '4'] },
  // { key: 'fivePersonDTOList',              label: '"五科"人员信息',       showFor: ['1', '2', '3', '4'] },
  // { key: 'wasteDumpDesignParamDTOList',    label: '排土场参数',          showFor: ['2', '4'] },
  // { key: 'outsourceTeamDTOList',           label: '外包工程队信息',      showFor: ['2', '4', '5'] },
  // { key: 'miningDTOList',                  label: '采掘施工单位信息',    showFor: ['2'] },
  // { key: 'dzExplorationDTOList',           label: '地质勘探单位信息',    showFor: ['2', '4', '5'] },
  // { key: 'riskControlDTOList',             label: '风险管控',            showFor: ['2', '4', '5'] },
  // { key: 'accidentCasualtyDTOList',        label: '生产安全事故伤亡情况', showFor: ['2', '4', '5'] },
]

const currentMineType = computed(() => {
  const raw = props.detail?.mineType ?? props.detail?.companyType
  return raw == null ? '' : String(raw)
})

const tabs = computed(() =>
  ALL_TABS.filter((t) => !t.showFor || t.showFor.includes(currentMineType.value))
)

// ---------- Props / Emits ----------
interface Props {
  detail: Record<string, any> | null
  isView?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isView: false,
  loading: false,
})

const emit = defineEmits<{
  back: []
  detailUpdated: [data: Record<string, any>]
}>()

// ---------- 状态 ----------
const activeTab = ref('baseInfoDTO')
const activeFormRef = ref<{ validate: () => Promise<Record<string, any>> } | null>(null)
const saving = ref(false)

const currentComponent = computed(() => TAB_COMPONENTS[activeTab.value] ?? null)
const currentTabLabel = computed(() => tabs.value.find((t) => t.key === activeTab.value)?.label ?? '')

watch(
  () => props.detail?.id,
  () => { activeTab.value = 'baseInfoDTO' }
)

// 企业类型变化时，若当前 tab 已不在可见列表，重置到第一个
watch(tabs, (newTabs) => {
  if (!newTabs.find((t) => t.key === activeTab.value)) {
    activeTab.value = newTabs[0]?.key ?? 'baseInfoDTO'
  }
})
async function activeTabClick(value) {
  activeTab.value = value
  console.log('value', value)
  if (value === 'parentCompanyDTO' && props.detail?.id) {
    try {
      const res = await getDetailCompany({ indTradeid: props.detail.id })
      if (res) {
        emit('detailUpdated', {
          ...props.detail,
          parentCompanyDTO: res
        })
      } else {
        console.warn('返回数据为空', res)
      }
    } catch (error) {
      message.error('获取企业注册信息失败')
      console.error(error)
    }
  }
  if (value === 'safeLicenceDTO' && props.detail?.id) {
    try {
      const res = await getIndTradeChemDir({ indTradeid: props.detail.id })
      if (res) {
        emit('detailUpdated', {
          ...props.detail,
          safeLicenceDTO: res
        })
      } else {
        console.warn('返回数据为空', res)
      }
    } catch (error) {
      message.error('获取企业注册信息失败')
    }
  }
  if (value === 'factoryInformationDTO' && props.detail?.id) {
    try {
      const res = await getIndTradeChemFac({ indTradeid: props.detail.id })
      if (res) {
        emit('detailUpdated', {
          ...props.detail,
          factoryInformationDTO: res
        })
      } else {
        console.warn('返回数据为空', res)
      }
    } catch (error) {
      message.error('获取企业注册信息失败')
    }
  }
}

// ---------- 统一保存调度 ----------
async function handleSave() {
  if (!activeFormRef.value) return
  saving.value = true

  //只有 企业注册信息 parentCompanyDTO  和  基本信息 baseInfoDTO 是单独的2个保存接口
  //其他都是通用接口，注意维护，此处容易出屎山
  try {
    const formData = await activeFormRef.value.validate()
    const key = activeTab.value
    const strategy: SaveStrategy = SAVE_STRATEGY[key] ?? 'detailProperty'
    if (strategy === 'baseInfo') {
      // mock: 实际替换为 await saveBaseInfo({ id: props.detail?.id, ...formData })
      await addEnterprise({ indTradeId: props.detail?.id, ...formData })
      message.success('基本信息保存成功')
      emit('detailUpdated', { ...props.detail, ...formData })

    } else if (strategy === 'parentCompany') {
      // mock: 实际替换为 await saveParentCompany({ id: props.detail?.id, ...formData })
      await saveParentCompany({ indTradeId: props.detail?.id, ...formData })
      message.success('企业注册信息保存成功')
      emit('detailUpdated', { ...props.detail, parentCompanyDTO: formData })

    } else if (strategy === 'safeLicence') {
      await saveIndTradeChemDir({ indTradeId: props.detail?.id, ...formData })
      message.success('工厂目录保存成功')
      emit('detailUpdated', { ...props.detail, safeLicenceDTO: formData })

    } else if (strategy === 'factoryInfor') {
      await saveIndTradeChemFac({ indTradeId: props.detail?.id, ...formData })
      message.success('工厂基本信息保存成功')
      emit('detailUpdated', { ...props.detail, factoryInformationDTO: formData })

    } else {
      // 通用接口：附带 mineDetailProperty 区分来源
      // mock: 实际替换为 await saveDetailProperty({ id: props.detail?.id, mineDetailProperty: key, ...formData })
      await new Promise((r) => setTimeout(r, 600))
      message.success(`${currentTabLabel.value}保存成功`)
      emit('detailUpdated', { ...props.detail, [key]: formData })
    }
  } catch {
    // validate 失败时静默，ant-design 会自动显示字段错误
  } finally {
    saving.value = false
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
