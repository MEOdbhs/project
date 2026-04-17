<template>
    <div class="enterprise-card">
        <div class="enterprise-card-header">
            <div class="enterprise-card-header-title">区域企业接入情况</div>
            <div class="icon-container">
                <div class="enterprise-card-header-icon">
                    <span class="dot"></span>
                    区域企业数
                </div>
                <div class="enterprise-card-header-icon">
                    <span class="dot" style="background-color: #8b5cf6;"></span>
                    已接入企业
                </div>
            </div>
        </div>
        <div class="enterprise-card-content">
            <div ref="chartRef" class="chart-container"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive, nextTick, type Ref } from 'vue'
import { useECharts } from '/@/hooks/web/useECharts'
import type { EChartsOption } from 'echarts'
import { statisticsZoneAndEnRelation } from '../index.api'

const state = reactive({
    regions: [] as string[],
    totalEnterprises: [] as number[],
    connectedEnterprises: [] as number[],
    unconnectedEnterprises: [] as number[],
})
const getStatisticsZoneAndEnRelation = async () => {
    const res = await statisticsZoneAndEnRelation({})
    state.regions = []
    state.totalEnterprises = []
    state.connectedEnterprises = []
    state.unconnectedEnterprises = []
    res.forEach(item => {
        state.regions.push(item.zoneName)
        state.totalEnterprises.push(item.zoneEnCount)
        state.connectedEnterprises.push(item.alreadyEnCount)
        state.unconnectedEnterprises.push(item.zoneEnCount - item.alreadyEnCount)
    })
    nextTick(() => {
        initChart()
    })

}
const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>, 'dark')

const initChart = () => {
    const option: EChartsOption = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
            formatter: (params: any) => {
                const param = params[0]
                const regionIndex = param.dataIndex
                const total = state.totalEnterprises[regionIndex]
                const connected = state.connectedEnterprises[regionIndex]

                return `
              <div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 8px;">${param.name}</div>
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <span style="display: inline-block; width: 12px; height: 12px; background: #3b82f6; margin-right: 8px; border-radius: 50%;"></span>
                  <span>区域企业数: ${total}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 12px; height: 12px; background: #8b5cf6; margin-right: 8px; border-radius: 50%;"></span>
                  <span>已接入企业: ${connected}</span>
                </div>
              </div>
            `
            },
        },
        legend: {
            show: false,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '10%',
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
        },
        yAxis: {
            type: 'value',
            minInterval: 1,
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
                name: '已接入企业',
                type: 'bar',
                stack: 'total',
                barMaxWidth: '20%',
                data: state.connectedEnterprises,
                itemStyle: {
                    color: '#a78bfa', // 浅紫色
                },
            },
            {
                name: '未接入企业',
                type: 'bar',
                stack: 'total',
                barMaxWidth: '20%',
                data: state.unconnectedEnterprises,
                itemStyle: {
                    color: '#3b82f6', // 深蓝色
                },
            },
        ],
    }

    setOptions(option)
}

onMounted(() => {
    getStatisticsZoneAndEnRelation()
    nextTick(() => {
        initChart()
    })
})
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
        color: #fff;
        height: 40px;
        display: flex;
        align-items: center;

        &-title {
            font-size: 16px;
            font-weight: bold;
        }

        .icon-container {
            display: flex;
            align-items: center;
            margin-left: auto;
            gap: 30px;
        }

        .enterprise-card-header-icon {

            // margin-left: auto;
            .dot {
                display: inline-block;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #3b82f6;
                vertical-align: -5px;
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