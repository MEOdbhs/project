<template>
    <a-card :bordered="false" class="hidden-danger-card">
        <template #title>
            <div class="card-header-box">
                <span>隐患处置情况分布</span>
                <div v-if="props.pageType === 'pageConfig'" class="card-actions">
                    <Icon icon="ant-design:swap-outlined" class="action-icon" @click="handleReplace" />
                    <Icon icon="ant-design:delete-outlined" class="action-icon" @click="handleDelete" />
                </div>
                <div v-else class="time-selector">
                    <span v-for="period in timePeriods" :key="period.value"
                        :class="['time-item', { active: selectedPeriod === period.value }]"
                        @click="handleTimePeriodClick(period.value)">
                        {{ period.label }}
                    </span>
                </div>
            </div>
        </template>
        <div class="chart-wrapper">
            <div class="content-area">
                <div class="chart-area" ref="chartRef"></div>
                <div class="legend">
                    <div class="legend-item" v-for="item in chartData" :key="item.name">
                        <span class="dot" :style="{ backgroundColor: item.color }"></span>
                        <span class="label">{{ item.name }}</span>
                        <span class="num">{{ item.value }}</span>
                    </div>
                </div>
            </div>
        </div>
    </a-card>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch,nextTick } from 'vue'
import { Icon } from '/@/components/Icon'
import * as echarts from 'echarts/core'
import type { EChartsType } from 'echarts/core'
import type { EChartsOption } from 'echarts'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GraphicComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getHiddenDanger } from '../line.api'
import { useUserStore } from '/@/store/modules/user'

const userStore = useUserStore()
echarts.use([PieChart, TitleComponent, TooltipComponent, LegendComponent, GraphicComponent, CanvasRenderer])

const props = defineProps<{
    pageType: 'workbench' | 'pageConfig'
    workbenchType: 'enterprise' | 'supervision'
}>()

const emit = defineEmits(['replace', 'delete'])

const handleReplace = () => {
    emit('replace')
}

const handleDelete = () => {
    emit('delete')
}

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: EChartsType | null = null

const timePeriods = [
    { label: '近一周', value: '0' },
    { label: '近一月', value: '1' },
    { label: '近三月', value: '2' },
]

const selectedPeriod = ref('0')

// 隐患处置数据
const pendingDisposalCount = ref(0)
const alreadyDisposalCount = ref(0)

const total = computed(() => pendingDisposalCount.value + alreadyDisposalCount.value)

const chartData = computed(() => [
    { name: '待处置', value: pendingDisposalCount.value, color: '#1890ff' },
    { name: '已处置', value: alreadyDisposalCount.value, color: '#9254de' },
])

const renderChart = () => {
    if (!chartRef.value) return
    if (!chartInstance) {
        chartInstance = echarts.init(chartRef.value)
    }

    const option: EChartsOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)',
        },
        series: [
            {
                name: '隐患处置',
                type: 'pie',
                radius: ['70%', '88%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: true,
                label: { show: false },
                labelLine: { show: false },
                data: chartData.value.map((item) => ({
                    value: item.value,
                    name: item.name,
                    itemStyle: { color: item.color },
                })),
            },
        ],
        graphic: [
            {
                type: 'text',
                left: 'center',
                top: '44%',
                style: {
                    text: String(total.value),
                    fill: '#ffffff',
                    fontSize: 28,
                    fontWeight: 600,
                    textAlign: 'center',
                    textVerticalAlign: 'middle',
                } as any,
            },
            {
                type: 'text',
                left: 'center',
                top: '60%',
                style: {
                    text: '任务总量',
                    fill: 'rgba(255,255,255,0.65)',
                    fontSize: 12,
                    textAlign: 'center',
                    textVerticalAlign: 'middle',
                } as any,
            },
        ],
    }

    chartInstance.setOption(option)
    chartInstance.resize()
}

const handleTimePeriodClick = (value: string) => {
    selectedPeriod.value = value
    getHiddenDangerData()
}

const getHiddenDangerData = async () => {
    let params = {}
    if (userStore?.userInfo?.userType === 1 && props.workbenchType === 'supervision') {
        params = {
            workType: 'manage',
            orgCode: '',
            dateType: selectedPeriod.value,
        }
    } else {
        params = {
            workType: 'average',
            orgCode: userStore.currentEnterpriseCode,
            dateType: selectedPeriod.value,
        }
    }
    const res = await getHiddenDanger(params)
    if (res) {
        pendingDisposalCount.value = res.pendingDisposalCount || 0
        alreadyDisposalCount.value = res.alreadyDisposalCount || 0
    }
    nextTick(()=> {
        renderChart()
    })
}

onMounted(() => {
    window.addEventListener('resize', handleResize, { passive: true })
    getHiddenDangerData()
})

const handleResize = () => {
    chartInstance?.resize()
}

watch(() => userStore.currentEnterpriseCode, (newVal) => {
    if (newVal && props.workbenchType === 'enterprise') {
        getHiddenDangerData()
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
    }
})
</script>

<style lang="less" scoped>
.hidden-danger-card {
    height: 100%;
    background-color: #0b1c36;

    :deep(.ant-card-body) {
        height: 80%;
    }
}

.card-header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-actions {
        display: flex;
        gap: 12px;

        .action-icon {
            cursor: pointer;
            font-size: 16px;
            color: #1890ff;
        }
    }
}

.chart-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 8px 0;
}

.time-selector {
    display: inline-flex;
    align-items: center;
    padding: 4px 6px;
    border-radius: 6px;
    background: rgba(24, 144, 255, 0.08);
    border: 1px solid rgba(24, 144, 255, 0.25);
    gap: 4px;
}

.time-item {
    min-width: 64px;
    padding: 4px 12px;
    font-size: 12px;
    text-align: center;
    color: #d9e8ff;
    cursor: pointer;
    border-radius: 4px;
    border: none;
    background: transparent;
    transition: all 0.3s;

    &:hover {
        color: #40a9ff;
    }

    &.active {
        color: #ffffff;
        background: rgba(64, 169, 255, 0.2);
        box-shadow: 0 0 0 1px rgba(64, 169, 255, 0.8) inset;
    }
}

.content-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.chart-area {
    width: 60%;
    height: 100%;
    min-height: 200px;
    min-width: 200px;
}

.legend {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-right: 8px;
    flex: 1;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
}

.label {
    flex: 1;
    color: rgba(255, 255, 255, 0.85);
}

.num {
    color: rgba(255, 255, 255, 0.85);
    font-weight: 500;
}
</style>
