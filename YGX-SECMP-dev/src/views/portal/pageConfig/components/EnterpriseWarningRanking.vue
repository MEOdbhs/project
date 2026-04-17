<template>
    <a-card :bordered="false" class="warning-ranking-card">
        <template #title>
            <div class="card-header-box">
                <span>{{ props.workbenchType === 'enterprise' ? '企业预警排名' : '预警类型排名' }}</span>
                <div v-if="props.pageType === 'pageConfig'" class="card-actions">
                    <Icon icon="ant-design:swap-outlined" class="action-icon" @click="handleReplace" />
                    <Icon icon="ant-design:delete-outlined" class="action-icon" @click="handleDelete" />
                </div>
                <div v-else class="time-selector">
                    <span v-for="period in timePeriods" :key="period.value"
                        :class="['time-item', { active: selectedPeriod === period.value }]"
                        @click="changePeriod(period.value)">
                        {{ period.label }}
                    </span>
                </div>

            </div>
        </template>
        <div class="chart-wrapper">
            <div class="chart-area" ref="chartRef"></div>
        </div>
    </a-card>

</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { Icon } from '/@/components/Icon'
import * as echarts from 'echarts/core'
import type { EChartsType } from 'echarts/core'
import type { EChartsOption } from 'echarts'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getWarningStyle } from '../line.api'
import { useUserStore } from '/@/store/modules/user'
const userStore = useUserStore()

const props = defineProps<{
    pageType: 'workbench' | 'pageConfig'
    workbenchType: 'enterprise' | 'supervision'
}>()

type TimePeriod = {
    label: string
    value: string
}

const selectedPeriod = ref<string>('0')

const timePeriods: TimePeriod[] = [
    { label: '近一周', value: '0' },
    { label: '近一月', value: '1' },
    { label: '近三月', value: '2' },
]

echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer])

const emit = defineEmits(['replace', 'delete'])

const handleReplace = () => {
    emit('replace')
}

const handleDelete = () => {
    emit('delete')
}

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: EChartsType | null = null

function changePeriod(value: string) {
    selectedPeriod.value = value
    getEnterpriseWarningData()
}



// 预警数据
const redWarningCount = ref(0)
const orangeWarningCount = ref(0)
const yellowWarningCount = ref(0)
const blueWarningCount = ref(0)

const chartData = computed(() => [
    { name: '红色预警', value: redWarningCount.value, color: '#ff4d4f' },
    { name: '橙色预警', value: orangeWarningCount.value, color: '#ff7a45' },
    { name: '黄色预警', value: yellowWarningCount.value, color: '#ffc53d' },
    { name: '蓝色预警', value: blueWarningCount.value, color: '#91cc75' },
])

const renderChart = () => {
    if (!chartRef.value) return
    if (!chartInstance) {
        chartInstance = echarts.init(chartRef.value)
    }

    const option: EChartsOption = {
        grid: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 40,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
            formatter: (params: any) => {
                const param = Array.isArray(params) ? params[0] : params
                return `${param.name}<br/>${param.seriesName}: ${param.value}`
            },
        },
        xAxis: {
            type: 'category',
            data: chartData.value.map((item) => item.name),
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)',
                },
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: 12,
            },
        },
        yAxis: {
            type: 'value',
            min: 0,
            minInterval: 1,
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)',
                },
            },
            axisTick: {
                show: false,
            },

            splitLine: {
                show: false,
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: 12,
            },
        },
        series: [
            {
                name: '预警数量',
                type: 'bar',
                data: chartData.value.map((item) => ({
                    value: item.value,
                    itemStyle: {
                        color: item.color,
                    },
                })),
                barWidth: '40%',
                label: {
                    show: true,
                    position: 'top',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: 12,
                },
            },
        ],
    }

    chartInstance.setOption(option)
    chartInstance.resize()
}

const getEnterpriseWarningData = async () => {
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
    const res = await getWarningStyle(params)
    if (res) {
        redWarningCount.value = res.redWarningCount || 0
        orangeWarningCount.value = res.orangeWarningCount || 0
        yellowWarningCount.value = res.yellowWarningCount || 0
        blueWarningCount.value = res.blueWarningCount || 0
    }
    nextTick(() => {
        renderChart()
    })
}

onMounted(() => {
    window.addEventListener('resize', handleResize, { passive: true })
    getEnterpriseWarningData()
})

const handleResize = () => {
    chartInstance?.resize()
}

watch(() => userStore.currentEnterpriseCode, (newVal) => {
    if (newVal && props.workbenchType === 'enterprise') {
        getEnterpriseWarningData()
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
.warning-ranking-card {
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


.chart-area {
    flex: 1;
    width: 100%;
    min-height: 200px;
}

.table-list {
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
</style>
