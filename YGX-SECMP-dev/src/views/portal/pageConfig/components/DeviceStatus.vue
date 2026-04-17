<template>
    <a-card v-if="userStore?.userInfo?.userType === 0 || props.workbenchType === 'enterprise'" :bordered="false"
        class="device-status-card">
        <template #title>
            <div class="card-header-box">
                <span>设备运行情况统计</span>
                <div v-if="props.pageType === 'pageConfig'" class="card-actions">
                    <Icon icon="ant-design:swap-outlined" class="action-icon" @click="handleReplace" />
                    <Icon icon="ant-design:delete-outlined" class="action-icon" @click="handleDelete" />
                </div>
                <!-- <div v-else class="time-selector">
                    <span v-for="period in timePeriods" :key="period.value"
                        :class="['time-item', { active: selectedPeriod === period.value }]"
                        @click="handleTimePeriodClick(period.value)">
                        {{ period.label }}
                    </span>
                </div> -->
            </div>
        </template>
        <div class="status-wrapper">
            <div class="chart-area" ref="chartRef"></div>
            <div class="legend">
                <div class="legend-item">
                    <span class="dot online"></span>
                    <span>在线</span>
                    <span class="num">{{ online }}</span>
                </div>
                <div class="legend-item">
                    <span class="dot offline"></span>
                    <span>离线</span>
                    <span class="num">{{ offline }}</span>
                </div>
            </div>
        </div>
    </a-card>
    <a-card v-else :bordered="false" class="device-status-card">
        <template #title>
            <div class="card-header-box">
                <span>设备接入和运行情况</span>
                <div v-if="props.pageType === 'pageConfig'" class="card-actions">
                    <Icon icon="ant-design:swap-outlined" class="action-icon" @click="handleReplace" />
                    <Icon icon="ant-design:delete-outlined" class="action-icon" @click="handleDelete" />
                </div>
                <div v-else>
                    <a-input placeholder="企业名称" v-model:value="searchValue" @change="getEquipmentAccessData" />
                </div>
            </div>
        </template>
        <div class="table-wrapper">
            <a-table :columns="enterpriseColumns" :data-source="enterpriseDataSource" size="small" :pagination="false"
                row-key="id" :scroll="{ y: 260 }" />
        </div>

    </a-card>

</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import type { EChartsType } from 'echarts/core'
import type { EChartsOption } from 'echarts'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GraphicComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useUserStore } from '/@/store/modules/user'
import { getEquipmentAccess } from '../line.api'


const userStore = useUserStore()
echarts.use([PieChart, TitleComponent, TooltipComponent, LegendComponent, GraphicComponent, CanvasRenderer])

const props = defineProps<{
    pageType: 'workbench' | 'pageConfig'
    workbenchType: 'enterprise' | 'supervision'
}>()

const searchValue = ref('')

// 企业表格列定义
const enterpriseColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        align: 'center',
    },
    {
        title: '企业名称',
        dataIndex: 'enterpriseName',
        key: 'enterpriseName',
        width: 120,
        ellipsis: true,
        align: 'left',
    },
    {
        title: '接入设备',
        dataIndex: 'alreadyEquipment',
        key: 'alreadyEquipment',
        width: 120,
        align: 'center',
    },
    {
        title: '设备在线率',
        dataIndex: 'onlineEquipment',
        key: 'onlineEquipment',
        width: 120,
        align: 'center',
        customRender: ({ record }) => {
            return (record.onlineEquipment !== undefined && record.onlineEquipment !== null)
                ? `${record.onlineEquipment}%`
                : '--'
        },
    },
]

// 企业表格数据源
const enterpriseDataSource = ref<any[]>([])

const timePeriods = [
    { label: '近一周', value: '0' },
    { label: '近一月', value: '1' },
    { label: '近三月', value: '2' },
]

const selectedPeriod = ref('0')

const online = ref(0)
const offline = ref(0)
const total = computed(() => online.value + offline.value)

const emit = defineEmits(['replace', 'delete'])

const handleReplace = () => {
    emit('replace')
}

const handleDelete = () => {
    emit('delete')
}

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: EChartsType | null = null

const ONLINE_COLOR = '#52c41a'
const OFFLINE_COLOR = '#d9d9d9'

const renderChart = () => {
    if (!chartRef.value) return
    if (!chartInstance) {
        chartInstance = echarts.init(chartRef.value)
    }
    const option: EChartsOption = {
        tooltip: {
            trigger: 'item',
        },
        series: [
            {
                name: '设备状态',
                type: 'pie',
                radius: ['70%', '88%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: true,
                label: { show: false },
                labelLine: { show: false },
                data: [
                    { value: online.value, name: '在线', itemStyle: { color: ONLINE_COLOR } },
                    { value: offline.value, name: '离线', itemStyle: { color: OFFLINE_COLOR } },
                ],
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
                    text: '总量',
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
    getEquipmentAccessData()
}

const getEquipmentAccessData = async () => {
    try {
        let params = {}
        if (userStore?.userInfo?.userType === 1 && props.workbenchType === 'supervision') {
            params = {
                workType: 'manage',
                orgCode: '',
                dateType: selectedPeriod.value,
                name: searchValue.value,
            }
        } else {
            params = {
                workType: 'average',
                orgCode: userStore.currentEnterpriseCode,
                dateType: selectedPeriod.value,
                name: searchValue.value,
            }
        }
        const res = await getEquipmentAccess(params)

        // if (!Array.isArray(res)) {
        //     online.value = 0
        //     offline.value = 0
        //     enterpriseDataSource.value = []
        //     return
        // }

        if (props.workbenchType === 'enterprise') {
            const { online: on = 0, unOnline: off = 0 } = res[0] || {}
            online.value = on
            offline.value = off
            nextTick(() => {
                renderChart()
            })
        } else {
            enterpriseDataSource.value = res.map((item: any, idx: number) => ({
                id: idx + 1,
                index: idx + 1,
                enterpriseName: item.enterpriseName ?? '',
                alreadyEquipment: item.alreadyEquipment ?? 0,
                onlineEquipment: item.onlineEquipment ?? 0,
            }))
        }
    } catch (error) {
        online.value = 0
        offline.value = 0
        enterpriseDataSource.value = []
        console.error('获取设备接入数据失败:', error)
    }
}


onMounted(() => {
    window.addEventListener('resize', handleResize, { passive: true })
    getEquipmentAccessData()
})

const handleResize = () => {
    chartInstance?.resize()
}


watch(() => userStore.currentEnterpriseCode, (newVal) => {
    if (newVal && props.workbenchType === 'enterprise') {
        getEquipmentAccessData()
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
.device-status-card {
    height: 100%;
    background-color: #0b1c36;
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

            // &:hover {
            //   color: #40a9ff;
            // }
        }
    }
}

.status-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    height: 100%;
}

.chart-area {
    width: 70%;
    min-width: 220px;
    height: 100%;
    min-height: 220px;
}

.legend {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 8px;
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
}

.dot.online {
    background: #52c41a;
}

.dot.offline {
    background: #d9d9d9;
}

.num {
    margin-left: 8px;
    color: rgba(255, 255, 255, 0.85);
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

.table-wrapper {
    flex: 1;
    min-height: 0;
    overflow: hidden;

    :deep(.ant-table-body) {
        max-height: 100%;
        overflow-y: auto;
        padding-bottom: 12px;
        box-sizing: border-box;
    }
}
</style>
