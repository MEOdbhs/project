<template>
    <div class="dangerous-card">
        <div class="dangerous-card-header">
            危险源设施统计
        </div>
        <div class="dangerous-card-content">
            <div ref="chartRef" class="chart-container"></div>
        </div>
        <div class="dangerous-card-footer">
            <div class="footer-stats">
                <template v-for="(item, index) in state.result">
                    <template v-if="index === 0">
                        <div class="stat-item stat-item-level1">
                            <div class="stat-icon">
                                <Icon icon="ant-design:warning-outlined" :size="20" color="#FF4444" />
                            </div>
                            <div class="stat-content">
                                <div class="stat-value">{{ item.hazardLevelCount }}</div>
                                <div class="stat-label">{{ item.hazardLevelName }}</div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="stat-item stat-item-level{{ index + 1 }}">
                            <div class="stat-content">
                                <div class="stat-value">{{ item.hazardLevelCount }}</div>
                                <div class="stat-label">{{ item.hazardLevelName }}</div>
                            </div>
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick, reactive, type Ref } from 'vue'
import { Icon } from '/@/components/Icon'
import { useECharts } from '/@/hooks/web/useECharts'
import type { EChartsOption } from 'echarts'
import { statisticsHazardManage } from '../index.api'

const state = reactive({
    result: [] as any[],
})
const getDangerousFacilityStatistics = async () => {
    const res = await statisticsHazardManage({})
    state.result = res
    let color = ['#FF4444', '#FF8800', '#FFD700', '#4A90E2']
    const chartData = res.map((item, index) => ({
        name: item.hazardLevelName,
        value: item.hazardLevelCount,
        color: color[index],
    }))
    nextTick(() => {
        initChart(chartData)
    })
}
const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)

const initChart = (data: any[]) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    const option: EChartsOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            right: '10%',
            top: 'center',
            itemWidth: 12,
            itemHeight: 12,
            selectedMode: false,
            textStyle: {
                color: '#fff',
                fontSize: 14,
            },
            formatter: (name: string) => {
                const item = data.find((d) => d.name === name)
                if (item) {
                    const percentage = ((item.value / total) * 100).toFixed(0)
                    return `${name}: ${percentage}%, ${item.value}`
                }
                return name
            },
        },
        series: [
            {
                name: '危险源设施统计',
                type: 'pie',
                radius: ['65%', '90%'],
                center: ['30%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 0,
                    borderColor: '#0b1c36',
                    borderWidth: 2,
                },
                label: {
                    show: false,
                },
                emphasis: {
                    label: {
                        show: false,
                    },
                },
                labelLine: {
                    show: false,
                },
                data:data.map((item,index) => {
                    if(index === 0) {
                        return {
                            value: item.value,
                            name: item.name,
                            itemStyle: {
                                color: item.color,
                            },
                            label:{
                                show: true,
                                position: 'center',
                                formatter: `{a|${total}}\n\n{b|危险源总数}`,
                                rich: {
                                    a: {
                                        fontSize: 32,
                                        fontWeight: 'bold',
                                        color: '#fff',
                                    },
                                    b: {
                                        fontSize: 12,
                                        color: '#fff',
                                    }
                                }
                            },
                        }
                    }
                    return {
                        value: item.value,
                        name: item.name,
                        itemStyle: {
                            color: item.color,
                        },
                    }
                })
            },
        ],
    }

    setOptions(option)
}

onMounted(() => {
    getDangerousFacilityStatistics()
})
</script>

<style lang="less" scoped>
.dangerous-card {
    width: 100%;
    height: calc(100% - 20px);
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;

    &-header {
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        height: 40px;
        line-height: 40px;
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

    &-footer {
        height: 100px;
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 15px 20px;
        background: #0f375f;

        .footer-stats {
            flex: 1;
            display: flex;
            justify-content: space-around;
            align-items: center;
            gap: 20px;

            .stat-item {
                flex: 1;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;

                .stat-icon {
                    flex-shrink: 0;
                }

                .stat-content {
                    flex: 1;
                    text-align: center;

                    .stat-value {
                        font-size: 32px;
                        font-weight: bold;
                        color: #fff;
                        line-height: 1.2;
                        margin-bottom: 6px;
                    }

                    .stat-label {
                        font-size: 13px;
                        color: #fff;
                        line-height: 1.2;
                    }
                }
            }
        }
    }
}
</style>
