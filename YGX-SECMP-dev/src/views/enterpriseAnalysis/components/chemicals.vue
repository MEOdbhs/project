<template>
    <div class="chemicals-card">
        <div class="chemicals-card-header">
            <div class="chemicals-card-header-title">危险化学品统计</div>
            <a-radio-group v-model:value="activeTimeRange" button-style="solid" @change="handleTimeRangeChange"
                class="time-range-buttons">
                <a-radio-button v-for="item in timeRanges" :key="item.value" :value="item.value">
                    {{ item.label }}
                </a-radio-button>
            </a-radio-group>
        </div>
        <div class="chemicals-card-summary">
            <div class="summary-icon">

            </div>
            <div class="summary-content">
                <span class="summary-label">危险化学品总数:</span>
                <span class="summary-value">{{ totalCount }}</span>
            </div>
        </div>
        <div class="chemicals-card-content">
            <div ref="chartRef" class="chart-container"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive, nextTick, type Ref } from 'vue'
import { useECharts } from '/@/hooks/web/useECharts'
import type { EChartsOption } from 'echarts'
import { statisticsDangerChemicals } from '../index.api'

const state = reactive({
    chartData: {
        months: [] as string[],
        values: [] as number[],
        allData:[] as any[],
    },
})
const getChemicalManage = async () => {
    const res = await statisticsDangerChemicals({ intervalType: activeTimeRange.value })
    state.chartData.months = [] as string[]
    state.chartData.values = [] as number[]
    state.chartData.allData = res
    res.forEach(item => {
        state.chartData.months.push(item.yearMonth)
        state.chartData.values.push(item.chemicalsCount)
    })
    nextTick(() => {
        initChart()
    })
}
const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>, 'dark')

const activeTimeRange = ref(1)
const totalCount = ref(0)

const timeRanges = [
    { label: '近半年', value: 1 as const },
    { label: '近一年', value: 2 as const },
    { label: '全部', value: '' as const },
]

const handleTimeRangeChange = () => {
    getChemicalManage()
}

const initChart = () => {
    const { months, values } = state.chartData
    const option: EChartsOption = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            // backgroundColor: 'rgba(0, 0, 0, 0.8)',
            // borderColor: '#FF8800',
            // borderWidth: 1,
            textStyle: {
                // color: '#fff',
                // fontSize: 12,
            },
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '10%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: months,
            axisLabel: {
                color: '#fff',
                fontSize: 12,
            },
            axisLine: {
                lineStyle: {
                    color: '#4b5563',
                },
            },
            axisTick: {
                show: false,
            },
        },
        yAxis: {
            type: 'value',
            minInterval:1,
            axisLabel: {
                color: '#fff',
                fontSize: 12,
            },
            axisLine: {
                lineStyle: {
                    color: '#4b5563',
                },
            },
            splitLine: {
                lineStyle: {
                    color: '#1f2937',
                    type: 'dashed',
                },
            },
        },
        series: [
            {
                name: '危险化学品总数',
                type: 'line',
                data: values,
                smooth: false,
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    color: '#FF8800',
                },
                lineStyle: {
                    color: '#FF8800',
                    width: 2,
                },
                // areaStyle: {
                //     color: {
                //         type: 'linear',
                //         x: 0,
                //         y: 0,
                //         x2: 0,
                //         y2: 1,
                //         colorStops: [
                //             {
                //                 offset: 0,
                //                 color: 'rgba(255, 136, 0, 0.3)',
                //             },
                //             {
                //                 offset: 1,
                //                 color: 'rgba(255, 136, 0, 0.05)',
                //             },
                //         ],
                //     },
                // },
            },
        ],
    }

    setOptions(option)

    // 更新总数
    totalCount.value = state.chartData.allData.at(-1)?.totalCount || 0
}

onMounted(() => {
    getChemicalManage()
    nextTick(() => {
        initChart()
    })
})
</script>

<style lang="less" scoped>
.chemicals-card {
    width: 100%;
    height: calc(100% - 20px);
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;

    &-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        margin-bottom: 15px;

        &-title {
            font-size: 16px;
            font-weight: bold;
            color: #fff;
        }

        .time-range-buttons {
            :deep(.ant-radio-button-wrapper) {
                font-size: 12px;
                padding: 4px 12px;
                height: auto;
                line-height: 1.5;
                color: #9ca3af;
                background: transparent;
                border-color: #4b5563;
                transition: all 0.3s;

                &:hover {
                    color: #fff;
                    border-color: #3b82f6;
                }

                &.ant-radio-button-wrapper-checked {
                    color: #fff;
                    background: #3b82f6;
                    border-color: #3b82f6;
                    box-shadow: -1px 0 0 0 #3b82f6;

                    &:hover {
                        border-color: #3b82f6;
                    }
                }
            }
        }
    }

    &-summary {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 15px;
        justify-content: flex-end;

        .summary-icon {
            flex-shrink: 0;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #FF8800;
            margin-top: 9px;
        }

        .summary-content {
            display: flex;
            align-items: baseline;
            gap: 8px;

            .summary-label {
                font-size: 14px;
                color: #fff;
            }

            .summary-value {
                font-size: 28px;
                font-weight: bold;
                color: #fff;
            }
        }
    }

    &-content {
        flex: 1;
        position: relative;
        min-height: 0;

        .chart-container {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
