<template>
    <div class="enterprise-card">
        <div class="enterprise-card-header">
            企业接入统计
        </div>
        <div class="enterprise-card-content">
            <div ref="chartRef" class="chart-container"></div>
        </div>
        <div class="enterprise-card-footer">
            <div class="footer-icon">
                <div class="icon-wrapper">
                    <Icon icon="ant-design:file-text-outlined" :size="24" color="#8B5CF6" />
                    <Icon icon="ant-design:arrow-up-outlined" :size="12" color="#8B5CF6" class="arrow-icon" />
                </div>
            </div>
            <div class="footer-stats">
                <div class="stat-item">
                    <div class="stat-value">{{ state.data.shouldEnCount }}</div>
                    <div class="stat-label">应接入</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ state.data.alreadyEnCount }}</div>
                    <div class="stat-label">已接入</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">
                        {{ state.data.enRate }}<span class="stat-unit">%</span>
                    </div>
                    <div class="stat-label">企业接入率</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">
                        {{ state.data.enOnlineRate }}<span class="stat-unit">%</span>
                    </div>
                    <div class="stat-label">企业在线率</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref,reactive, onMounted, nextTick, type Ref } from 'vue'
import { Icon } from '/@/components/Icon'
import { useECharts } from '/@/hooks/web/useECharts'
import type { EChartsOption } from 'echarts'
import { statisticsEnRegister } from '../index.api'

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)

const initChart = () => {

    const option: EChartsOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            right: '10%',
            top: 'center',
            itemWidth: 20,
            itemHeight: 20,
            selectedMode: false,
            textStyle: {
                color: '#fff',
                fontSize: 16,
            },
            formatter: (name: string) => {
                const data = [
                    { name: '未接入企业', value: state.data.unEnCount },
                    { name: '已接入企业', value: state.data.alreadyEnCount },
                ]
                const item = data.find((d) => d.name === name)
                return `${name} ${item?.value || 0}`
            },
        },
        series: [
            {
                name: '企业接入率',
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
                data: [
                    {
                        value: state.data.unEnCount,
                        name: '未接入企业',
                        itemStyle: {
                            color: 'gray',
                        },
                        label:{
                            show: true,
                            position: 'center',
                            formatter: `{a|${state.data.enRate}%}\n\n{b|企业接入率}`,
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
                        }
                    },
                    {
                        value: state.data.alreadyEnCount,
                        name: '已接入企业',
                        itemStyle: {
                            color: '#8b5cf6',
                        },
                    },
                ],
            },
        ],
    }

    setOptions(option)
}
const state = reactive({
    data: {
        shouldEnCount: 0, // 应接入企业数
        alreadyEnCount: 0, // 已接入企业数
        unEnCount: 0, // 未接入企业数
        enRate: 0, // 企业接入率
        enOnlineRate: 0, // 企业在线率
    }
})
const getStatisticsEnRegister = async () => {
    const res = await statisticsEnRegister({})
    state.data.shouldEnCount = res.shouldEnCount
    state.data.alreadyEnCount = res.alreadyEnCount
    state.data.enRate = res.enRate
    state.data.enOnlineRate = res.enOnlineRate
    state.data.unEnCount = res.shouldEnCount - res.alreadyEnCount
    nextTick(() => {
        initChart()
    })
}

onMounted(() => {
    getStatisticsEnRegister()
});
</script>

<style lang="less" scoped>
.enterprise-card {
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

        .footer-icon {
            flex-shrink: 0;

            .icon-wrapper {
                position: relative;
                width: 48px;
                height: 48px;
                background: #e9d5ff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;

                :deep(.anticon) {
                    color: #6d28d9;
                }

                .arrow-icon {
                    position: absolute;
                    bottom: 2px;
                    right: 2px;
                    background: #fff;
                    border-radius: 50%;
                    padding: 2px;
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }

        .footer-stats {
            flex: 1;
            display: flex;
            justify-content: space-around;
            align-items: center;
            gap: 20px;

            .stat-item {
                flex: 1;
                text-align: center;

                .stat-value {
                    font-size: 32px;
                    font-weight: bold;
                    color: #fff;
                    line-height: 1.2;
                    margin-bottom: 6px;

                    .stat-unit {
                        font-size: 20px;
                        vertical-align: super;
                        margin-left: 2px;
                    }
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
</style>