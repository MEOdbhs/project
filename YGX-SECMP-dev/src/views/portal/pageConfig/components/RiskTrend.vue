<template>
    <div class="risk-trend-container">
        <a-card v-if="userStore?.userInfo?.userType === 0 || props.workbenchType === 'enterprise'" :bordered="false"
            class="risk-trend-card">
            <template #title>
                <div class="card-header-box">
                    <span>企业风险趋势</span>
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
            <div ref="chartRef" class="risk-trend-chart"></div>
        </a-card>
        <a-card v-else :bordered="false" class="risk-trend-card">
            <template #title>
                <div class="card-header-box">
                    <span>企业预警排名</span>
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
            <div class="table-list">
                <a-table class="ranking-table" :columns="columns" :data-source="tableData" :pagination="false"
                    size="small" :row-key="rowKey" :scroll="{ y: 260 }" />
            </div>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useUserStore } from '/@/store/modules/user'
import type { TableColumnsType } from 'ant-design-vue'
import { getEnterpriseWarning } from '../line.api'
import { resolve } from 'path'

// 类型定义
type RiskTrendPoint = { date: string; value: number }

interface RankingItem {
    dateDay: string
    warningCount: number
    enterpriseName: string
}

type TimePeriod = {
    label: string
    value: string
}

type PageType = 'workbench' | 'pageConfig'

const timePeriods: TimePeriod[] = [
    { label: '近一周', value: '0' },
    { label: '近一月', value: '1' },
    { label: '近三月', value: '2' },
]

// ECharts 初始化
echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

// Store
const userStore = useUserStore()

// Props
const props = defineProps<{
    dates?: string[]
    values?: number[]
    data?: RiskTrendPoint[]
    max?: number
    pageType: PageType
    workbenchType: 'enterprise' | 'supervision'
}>()

// Emits
const emit = defineEmits<{
    replace: []
    delete: []
}>()

// Refs
const chartRef = ref<HTMLDivElement | null>(null)
const selectedPeriod = ref<string>('0')

// Chart 实例
let chart: echarts.ECharts | null = null

const tableData = ref<RankingItem[]>([])

const columns = computed<TableColumnsType<RankingItem>>(() => [
    {
        title: '排名',
        dataIndex: 'rank',
        width: 80,
        align: 'center',
        customRender: ({ index }) => index + 1,
    },
    {
        title: '企业名称',
        dataIndex: 'enterpriseName',
        ellipsis: true,
    },
    {
        title: '预警次数',
        dataIndex: 'warningCount',
        align: 'center',
        width: 120,
    },
])

// Methods
const rowKey = (record: RankingItem) => `${selectedPeriod.value}-${record.enterpriseName}-${record.warningCount}`

function getXAxisData(): string[] {
    if (tableData.value?.length) return tableData.value.map((item) => item.dateDay)
    return []
}

function getSeriesData(): number[] {
    if (tableData.value?.length) return tableData.value.map((item) => item.warningCount)
    return []
}

function renderChart() {
    if (!chartRef.value) return

    if (!chart) {
        chart = echarts.init(chartRef.value)
    }

    const xAxisData = getXAxisData()
    const seriesData = getSeriesData()
    const hasData = xAxisData.length > 0 && seriesData.length > 0

    chart.clear()

    const option: echarts.EChartsCoreOption = hasData
        ? {
              grid: { top: 16, right: 36, bottom: 28, left: 36 },
              tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'line' },
                  formatter: (params: any) => {
                      const param = Array.isArray(params) ? params[0] : params
                      return `${param.axisValue}<br/>风险预警设备： ${param.data}`
                  },
              },
              xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: xAxisData,
                  axisTick: { show: false },
                  axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
              },
              yAxis: {
                  type: 'value',
                  min: 0,
                  minInterval: 1,
                  axisLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
                  axisTick: { show: false },
                  splitLine: { show: false },
              },
              series: [
                  {
                      type: 'line',
                      smooth: true,
                      symbol: 'circle',
                      symbolSize: 6,
                      itemStyle: { color: '#fa8c16' },
                      lineStyle: { color: '#fa8c16', width: 2 },
                      areaStyle: { color: 'rgba(250,140,22,0.08)' },
                      data: seriesData,
                  },
              ],
          }
        : {
              title: {
                  text: '暂无数据',
                  left: 'center',
                  top: 'middle',
                  textStyle: { color: 'rgba(255,255,255,1)', fontSize: 14 },
              },
              xAxis: { show: false },
              yAxis: { show: false },
              series: [],
          }

    chart.setOption(option)
}

function handleResize() {
    chart?.resize()
}

function changePeriod(value: string) {
    selectedPeriod.value = value
    getEnterpriseWarningData()
}

function handleReplace() {
    emit('replace')
}

function handleDelete() {
    emit('delete')
}

async function getEnterpriseWarningData() {
    let params = {}
    // 监管用户查看企业工作台的通知公告
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
    const res = await getEnterpriseWarning(params)
    tableData.value = res
    if (props.workbenchType === 'enterprise') {
        nextTick(() => {
            renderChart()
        })
    }
}

watch(
    () => userStore.currentEnterpriseCode,
    (newVal) => {
        if (newVal && props.workbenchType === 'enterprise') {
            getEnterpriseWarningData()
        }
    }
)
// Lifecycle
onMounted(async () => {
    // await nextTick()
    // renderChart()
    window.addEventListener('resize', handleResize)
    getEnterpriseWarningData()
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    if (chart) {
        chart.dispose()
        chart = null
    }
})

</script>

<style lang="less" scoped>
.risk-trend-container {
    height: 100%;
}

.risk-trend-card {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.ant-card-body) {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
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

.risk-trend-chart {
    background-color: #0b1c36;
    height: 100%;
    width: 100%;
}

.risk-trend-card {
    background-color: #0b1c36;
    height: 100%;

    :deep(.ant-card-body) {
        height: 80%;
    }
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
