<template>
    <div class="process-card">
        <div class="process-card-header">
            <div class="process-card-header-title">重点化学工艺统计</div>
            <div class="process-card-summary">
                <div class="summary-icon">
                   
                </div>
                <div class="summary-content">
                    <span class="summary-label">重点化工工艺总数:</span>
                    <span class="summary-value">{{ totalCount }}</span>
                </div>
            </div>
        </div>
        <div class="process-card-content">
            <div ref="chartRef" class="chart-container"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ref, onMounted,reactive, nextTick, type Ref } from 'vue';
    import { useECharts } from '/@/hooks/web/useECharts';
    import type { EChartsOption } from 'echarts';
    import { statisticsDangerWorkmanship } from '../index.api';
    const totalCount = ref(0);
    const state = reactive({
        regions:[] as string[],
        values:[] as number[],
    })
    const getDangerProcess = async () => {
        const res = await statisticsDangerWorkmanship({})
        console.log(res, '重点化学工艺统计')
        state.regions = [] as string[]
        state.values = [] as number[]
        res.forEach(item => {
            state.regions.push(item.zoneName)
            state.values.push(item.dataCount)
        })
        totalCount.value = state.values.reduce((sum, item) => sum + Number(item), 0)
        nextTick(() => {
            initChart()
        })
    }
    const chartRef = ref<HTMLDivElement | null>(null);
    const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>, 'dark');



    const initChart = () => {
        const option: EChartsOption = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
                // backgroundColor: 'rgba(0, 0, 0, 0.8)',
                // borderColor: '#3b82f6',
                borderWidth: 1,
                textStyle: {
                    // color: '#fff',
                    // fontSize: 12,
                },
            },
            grid: {
                left: '5%',
                right: '5%',
                bottom: '10%',
                top: '5%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: state.regions,
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
                    name: '重点化学工艺',
                    type: 'bar',
                    data: state.values,
                    itemStyle: {
                        color: '#3b82f6',
                    },
                    barMaxWidth: '15%',
                },
            ],
        };

        setOptions(option);
    };

    onMounted(() => {
        getDangerProcess()
    })
</script>

<style lang="less" scoped>
    .process-card {
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
                background-color: #3b82f6;
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

