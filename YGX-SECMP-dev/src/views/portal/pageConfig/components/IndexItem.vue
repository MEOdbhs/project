<template>
    <!-- 头部切换按钮：企业 / 监管 -->
    <div v-if="pageType === 'workbench' && userStore?.userInfo?.userType === 1" class="page-config-header">
        <div class="header-toggle-group">
            <span class="header-toggle-item" :class="{ activeStyle: workbenchType === 'enterprise' }"
                @click="handleWorkbenchType('enterprise')">
                企业
            </span>
            <span class="header-toggle-divider">|</span>
            <span class="header-toggle-item" :class="{ activeStyle: workbenchType === 'supervision' }"
                @click="handleWorkbenchType('supervision')">
                监管
            </span>
        </div>
    </div>

    <div class="page-config-container">
        <a-row :gutter="24">
            <a-col v-for="(w, idx) in widgets" :key="w.key" :span="8">
                <div class="widget-box" :class="{
                    'is-draggable': isPageConfig,
                    dragging: draggingIndex === idx,
                }" :draggable="isPageConfig" @dragstart="handleDragStart(idx, $event)"
                    @dragover="handleDragOver(idx, $event)" @drop="handleDrop(idx, $event)" @dragend="handleDragEnd">
                    <component :is="componentMap[w.type]" :pageType="pageType" :workbenchType="workbenchType"
                        @replace="openReplace(idx)" @delete="handleDelete(idx)" />
                </div>
            </a-col>

            <a-col :span="8" v-if="isPageConfig">
                <div class="placeholder-card" @click="openAdd">
                    <span class="plus">+</span>
                </div>
            </a-col>
        </a-row>

        <div class="submit-button" v-if="isPageConfig">
            <a-button @click="handleSubmit" type="primary">提交</a-button>
        </div>

        <a-modal v-model:open="selector.open" :title="selector.mode === 'add' ? '选择组件添加' : '选择组件替换'" @ok="confirmSelect" class="selector-modal"
            @cancel="cancelSelect" destroyOnClose>
            <div style="padding: 12px;">
                <a-select v-model:value="selector.selected" placeholder="请选择组件" style="width: 100%">
                    <a-select-option v-for="item in selectableList" :key="item.type" :value="item.type"
                        :disabled="isTypeUsed(item.type)">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, toRef, watch } from 'vue'
import DataOverview from './DataOverview.vue'
import Notifications from './Notifications.vue'
import CommonFunctions from './CommonFunctions.vue'
import RiskTrend from './RiskTrend.vue'
import MajorHazardStats from './MajorHazardStats.vue'
import DeviceStatus from './DeviceStatus.vue'
import EnterpriseWarningRanking from './EnterpriseWarningRanking.vue'
import RiskLevelDistribution from './RiskLevelDistribution.vue'
import HiddenDangerHandling from './HiddenDangerHandling.vue'
import SafetyProductionCommitment from './SafetyProductionCommitment.vue'
import { getViewList, saveOrUpdate, getRuleList } from '../line.api'
import { Modal } from 'ant-design-vue'

import { useUserStore } from '/@/store/modules/user'
const userStore = useUserStore()
type WidgetType =
    | 'DataOverview'
    | 'Notifications'
    | 'CommonFunctions'
    | 'RiskTrend'
    | 'MajorHazardStats'
    | 'DeviceStatus'
    | 'EnterpriseWarningRanking'
    | 'RiskLevelDistribution'
    | 'HiddenDangerHandling'
    | 'SafetyProductionCommitment'

interface WidgetItem {
    key: string
    type: WidgetType
    value: string
}

type ComponentOption = {
    type: WidgetType
    label: string
    value: string
}

interface RuleApiItem {
    menuCode: string
    menuName: string
    [key: string]: unknown
}

interface RuleItem {
    type: string
    label: string
}

const props = defineProps<{
    pageType: 'workbench' | 'pageConfig'
}>()

// 工作台类型切换（企业 / 监管）
const workbenchType = ref<'enterprise' | 'supervision' | null>(null)

const handleWorkbenchType = (type: 'enterprise' | 'supervision') => {
    console.log(type, 'type')

    if (workbenchType.value === type) return
    workbenchType.value = type
    resetData()
}

const pageType = toRef(props, 'pageType')
const isPageConfig = computed(() => pageType.value === 'pageConfig')

const componentMap: Record<WidgetType, any> = {
    DataOverview,
    Notifications,
    CommonFunctions,
    RiskTrend,
    MajorHazardStats,
    DeviceStatus,
    EnterpriseWarningRanking,
    RiskLevelDistribution,
    HiddenDangerHandling,
    SafetyProductionCommitment,
}

const allComponents: ComponentOption[] = [
    { type: 'DataOverview', label: '数据概览', value: 'SJGL' }, // 已完成
    { type: 'Notifications', label: '通知公告', value: 'TZGG' }, //接口绑定好但是未通
    { type: 'CommonFunctions', label: '常用功能', value: 'CYGN' }, // 逻辑已完成需要把对应版块的路由加进来
    { type: 'RiskTrend', label: '企业风险趋势', value: 'QYYJPM' }, // 接口绑定好但是未打通
    { type: 'MajorHazardStats', label: '重大危险源统计', value: 'ZDWXYTJ' }, // 已完成
    { type: 'DeviceStatus', label: '设备运行情况统计', value: 'SBJRYXQK' }, //已完成（接口接通、企业逻辑对接完成监管还没测试）
    { type: 'EnterpriseWarningRanking', label: '企业预警排名', value: 'YJLXPM' }, //已完成
    { type: 'RiskLevelDistribution', label: '风险等级分布', value: 'FXDJFB' }, //已完成
    { type: 'HiddenDangerHandling', label: '隐患处置情况分布', value: 'YHCZFQKFB' }, //已完成
    { type: 'SafetyProductionCommitment', label: '安全生产承诺公告', value: 'AQSCCNGG' },//已完成
]

const widgets = ref<WidgetItem[]>([])

const ruleList = ref<RuleItem[]>([])
const selectableList = ref<ComponentOption[]>([...allComponents])

type SelectorMode = 'add' | 'replace'

interface SelectorState {
    open: boolean
    mode: SelectorMode
    selected: WidgetType | undefined
    replaceIndex: number | null
}

const createSelectorState = (overrides: Partial<SelectorState> = {}): SelectorState => ({
    open: false,
    mode: 'add',
    selected: undefined,
    replaceIndex: null,
    ...overrides,
})

const selector = ref<SelectorState>(createSelectorState())
const draggingIndex = ref<number | null>(null)

const getValueByType = (type: WidgetType): string => {
    const component = allComponents.find((c) => c.type === type)
    return component?.value || ''
}

const getTypeByValue = (value: string): WidgetType | undefined => {
    const component = allComponents.find((c) => c.value === value)
    return component?.type
}

const createWidgetItem = (type: WidgetType): WidgetItem => ({
    key: type,
    type,
    value: getValueByType(type),
})

const isTypeUsed = (t: WidgetType) => {
    if (selector.value.mode === 'replace' && selector.value.replaceIndex !== null) {
        const currentType = widgets.value[selector.value.replaceIndex]?.type
        if (currentType === t) return false
    }
    return widgets.value.some((w) => w.type === t)
}

const openAdd = () => {
    selector.value = createSelectorState({ open: true })
}

const openReplace = (index: number) => {
    selector.value = createSelectorState({
        open: true,
        mode: 'replace',
        replaceIndex: index,
    })
}

const confirmSelect = () => {
    const t = selector.value.selected
    if (!t) return

    if (selector.value.mode === 'add') {
        if (isTypeUsed(t)) return
        widgets.value.push(createWidgetItem(t))
    } else if (selector.value.mode === 'replace' && selector.value.replaceIndex !== null) {
        const idx = selector.value.replaceIndex
        const current = widgets.value[idx]
        if (!current) return
        if (isTypeUsed(t) && current.type !== t) return
        widgets.value[idx] = createWidgetItem(t)
    }

    selector.value = createSelectorState()
}

const cancelSelect = () => {
    selector.value = createSelectorState()
}

const handleDelete = (index: number) => {
    widgets.value.splice(index, 1)
}

const moveWidget = (from: number, to: number) => {
    if (from === to) return
    const updated = [...widgets.value]
    const [moved] = updated.splice(from, 1)
    if (!moved) return
    updated.splice(to, 0, moved)
    widgets.value = updated
}

const handleDragStart = (index: number, event: DragEvent) => {
    if (!isPageConfig.value) return
    draggingIndex.value = index
    event.dataTransfer?.setData('text/plain', String(index))
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
    }
}

const handleDragOver = (_index: number, event: DragEvent) => {
    if (!isPageConfig.value) return
    event.preventDefault()
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
    }
}

const handleDrop = (index: number, event: DragEvent) => {
    if (!isPageConfig.value) return
    event.preventDefault()
    if (draggingIndex.value === null) return
    moveWidget(draggingIndex.value, index)
    draggingIndex.value = null
}

const handleDragEnd = () => {
    draggingIndex.value = null
}

const getViewListData = async () => {
    let params = {}
    // 监管用户查看企业工作台的配置
    if (userStore?.userInfo?.userType === 1 && workbenchType.value === 'enterprise') {
        params = {
            manage: 1
        }
    }
    const res = await getViewList(params)
    if (res && Array.isArray(res)) {
        /**
         * res 数组根据item中的menuSort进行排序
         */
        res.sort((a: any, b: any) => a.menuSort - b.menuSort)
        widgets.value = res.reduce<WidgetItem[]>((acc, item: any) => {
            const type = getTypeByValue(item.menuCode)
            if (type) {
                acc.push(createWidgetItem(type))
            }
            return acc
        }, [])
    }
}

const handleSubmit = () => {
    const configList = widgets.value.map((item, index) => {
        return {
            menuCode: item.value,
            menuSort: index + 1,
        }
    })

    Modal.confirm({
        title: '确定要提交配置吗？',
        content: '请再次确认配置信息无误，提交后将生效。',
        okText: '确认提交',
        cancelText: '取消',
        async onOk() {
            await saveOrUpdate({ configList: configList })
        },
    })
}

const getRuleListData = async () => {
    const res = await getRuleList({
        workType: userStore?.userInfo?.userType === 0 ? 'average' : 'manage',
    })
    if (res && Array.isArray(res)) {
        const availableCodes = new Set<string>()

        ruleList.value = res.map((item: RuleApiItem) => {
            availableCodes.add(item.menuCode)
            return {
                type: item.menuCode,
                label: item.menuName,
            }
        })

        selectableList.value = allComponents.filter((component) =>
            availableCodes.has(component.value),
        )
    } else {
        ruleList.value = []
        selectableList.value = [...allComponents]
    }
}

onMounted(() => {
    workbenchType.value = userStore.userInfo?.userType === 0 ? 'enterprise' : 'supervision'
    getRuleListData()
    getViewListData()
})

const resetData = () => {
    selectableList.value = []
    widgets.value = []
    getRuleListData()
    getViewListData()
}

watch(
    () => userStore?.userInfo?.userType,
    (newCode, oldCode) => {
        if (!newCode || newCode === oldCode) return
        resetData()
    },
)
</script>

<style lang="less" scoped>
.page-config-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 8px 12px 0;
    background-color: #0b1c36;

    .header-toggle-group {
        display: inline-flex;
        align-items: center;
        background: rgba(24, 144, 255, 0.08);
        border-radius: 6px;
        padding: 4px 8px;
    }

    .header-toggle-item {
        font-size: 13px;
        color: #fff;
        cursor: pointer;
        padding: 4px 10px;
        transition: all 0.3s;

        &.activeStyle {
            color: #40a9ff;
            font-weight: 500;
        }

        &:hover {
            color: #40a9ff;
        }
    }

    .header-toggle-divider {
        margin: 0 4px;
        color: rgba(255, 255, 255, 0.45);
    }
}

.page-config-container {
    // overflow-y: auto;
    padding: 12px;
    padding-bottom: 80px; // 为底部固定按钮预留空间

    .ant-col {
        margin-bottom: 12px;
    }

    .widget-box {
        width: 100%;
        aspect-ratio: 3 / 2;

        &.is-draggable {
            cursor: move;
        }

        &.dragging {
            opacity: 0.7;
        }
    }

    .placeholder-card {
        width: 100%;
        aspect-ratio: 3 / 2;
        border: 2px dashed #5482d1;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #0b1c36;
        user-select: none;
        cursor: pointer;
    }

    .placeholder-card .plus {
        font-size: 40px;
        line-height: 1;
        color: #9fb2d3;
    }

    .submit-button {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px 24px;
        // background-color: #fff;
        // box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
        text-align: right;
        z-index: 100;
    }
}

:deep(.ant-card-body) {
    padding: 12px;
}

</style>