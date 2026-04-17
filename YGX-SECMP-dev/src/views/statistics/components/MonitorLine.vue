<template>
    <div class="monitor-line">
        <div class="left-tree">
            <div class="top-filter">
                <div class="mine-name">{{ mineInfo.name }}</div>
                <a-input-search v-model:value="searchValue" placeholder="请输入关键字搜索" />
            </div>
            <div class="bottom-tree">
                <a-tree v-model:selectedKeys="selectedKeys" v-model:expandedKeys="expandedKeys"
                    :tree-data="filteredTreeData"
                    :fieldNames="{ title: 'deviceName', key: 'deviceId', children: 'children' }" :show-line="false"
                    :show-icon="true" @select="handleSelect">
                    <template #title="{ dataRef, deviceName, title, children = [], isParent }">
                        {{ formatNodeTitle({ dataRef, deviceName, title, children, isParent }) }}
                    </template>
                </a-tree>
            </div>
        </div>
        <div class="right-content-box">
            <div class="header-filter">
                <div class="day-select">
                    <span v-for="item in dayOptions" :class="{ act: chooseDay === item }" :key="item"
                        @click="changeDay(item)">{{ item }}日</span>
                </div>
                <div class="time-select">
                    <a-range-picker v-model:value="dateRange" :show-time="false" :disabled-date="disabledDate"
                        format="YYYY-MM-DD" value-format="YYYY-MM-DD" :placeholder="['开始时间', '结束时间']"
                        @change="changeDateRange" />
                </div>
                <Button type="primary" class="mr-2" preIcon="ant-design:search-outlined" @click="handleSearch">
                    查询
                </Button>
                <Button type="default" class="mr-2" preIcon="ic:baseline-restart-alt">
                    重置
                </Button>
            </div>
            <div class="table-content relative-for-type-chart" v-loading="loading">
                <!-- <a-radio-group v-if="switchChartShow" v-model:value="typeChart" class="set-type-chart"
                    @change="changeTypeChart">
                    <a-radio :value="1" class="set-txt-color distance-col-radio">一般曲线</a-radio>
                    <a-radio :value="2" class="set-txt-color">三维曲线</a-radio>
                </a-radio-group> -->
                <div class="custom-chart-parent" :class="{ overAuto: isShowSpeeChart && needShowChart }"
                    v-if="isShowLineCharts">
                    <template v-if="currentDevice?.sensorName === '倾角计'">
                        <custom-chart-line class="qjj-dom" domId="qjj1" :data="chartData"
                            :data-zoom-show="isShowDataZoom" />
                        <custom-chart-line class="qjj-dom" domId="qjj2" :data="chartDataQjj"
                            :data-zoom-show="isShowDataZoom" />
                    </template>
                    <template v-else>
                        <custom-chart-line :class="{ 'speed-dom': isShowLineCharts && needShowChart }" :data="chartData"
                            :data-zoom-show="isShowDataZoom" />
                        <custom-chart-line :class="{ 'speed-dom': isShowLineCharts && needShowChart }"
                            :data="speedchartData1" domId="speed1" :data-zoom-show="isShowDataZoom" />
                        <custom-chart-line :class="{ 'speed-dom': isShowLineCharts && needShowChart }"
                            :data="speedchartData2" domId="speed2" :data-zoom-show="isShowDataZoom" />
                    </template>
                </div>
                <div class="custom-chart-parent" v-else>
                    <div class="content_box">
                        <div class="right_box_lineContent" :style="{
                            width: currentDevice?.showDirection === 'x' ? '100%' : '50%',
                        }">
                            <custom-chart-line :data="chartData" :data-zoom-show="isShowDataZoom"
                                domId="leftChartDom" />
                        </div>
                        <!-- 纵向安装的才有两个位移图表 -->
                        <div class="right_box_lineContent" v-if="currentDevice?.showDirection === 'y'">
                            <custom-chart-line :data="rightChartData" :data-zoom-show="rightCharShowDataZoom"
                                domId="rightChartDom"></custom-chart-line>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { deviceTreeData, monitorLineData, monitorLineQjjsdData } from '../api'
import dayjs from 'dayjs'
import { Button } from '/@/components/Button'
import CustomChartLine from '/@/components/CustomChartLine/index.vue'
import { buildSurfaceMultiLineOptions, buildSurface3DOptions, buildWaterlineOptions, buildRainfallOptions, buildMiningStressOptions, buildInclinationDeviceOptions, buildNbwyLineOptionsNew, buildCdydlBpzdLineOptionsNew, buildLfjLineOptions,buildLtksNbwyBmwySpeedLineOptions,buildLtksNbwyBmwyLineOptions } from "./optionBuilders"
const props = defineProps({
    mineInfo: {
        type: Object,
        default: () => ({})
    }
})
const sensorType = ref(1)
const searchValue = ref('')
const dayOptions = [1, 3, 7, 15, 30]
const chooseDay = ref(1)
const dateRange = ref([])
const treeSource = ref([])
const selectedKeys = ref([])
const expandedKeys = ref([])
const activeTab = ref(1)
const needShowChart = ref(false)
const typeChart = ref(1)
let chartData = ref({})
let chartDataQjj = ref({})
let speedchartData1 = ref({}) // 速度图表数据
let speedchartData2 = ref({}) // 表面位移加速度图表数据
let rightChartData = ref({})
let rightCharShowDataZoom = ref(true)
let isShowDataZoom = ref(true)
let isShowLineCharts = ref(true)
const loading = ref(false)
const switchChartShow = computed(() => {
    if (currentDevice.value?.sensorName === "表面位移" && activeTab.value === 1) {
        return true
    } else {
        return false
    }
})
const changeTypeChart = () => {
    handleSearch()
}
const changeTabType = (type) => {
    activeTab.value = type
    handleSearch()
}
const isShowSpeeChart = computed(() => {
    if (currentDevice.value?.mineName === '露天矿山' && (currentDevice.value?.sensorName === "表面位移" || currentDevice.value?.sensorName === "内部位移")) {
        return true
    }
    return false
})
const filteredTreeData = computed(() => {
    const keyword = searchValue.value.trim()
    if (!keyword) return treeSource.value
    const matchNode = (node) => node.deviceName.toLowerCase().includes(keyword.toLowerCase())
    const dfs = (nodes) => {
        const result = []
        nodes.forEach(node => {
            const children = node.children ? dfs(node.children) : []
            if (matchNode(node) || children.length) {
                result.push({
                    ...node,
                    children,
                })
            }
        })
        return result
    }
    return dfs(treeSource.value)
})
const formatNodeTitle = ({ dataRef, deviceName, title, children = [], isParent }) => {
    const label = deviceName || title || ''
    let length = children.length
    if (dataRef.firstLevelNode) {
        length = children.reduce((acc, curr) => {
            return acc + curr.children.length
        }, 0)
    }
    return isParent ? `${label}（${length}）` : label
}
const changeDay = (item) => {
    chooseDay.value = item
    //   timeSelect.value = "";
    //   dateRange.value = "";
    //   //   月颗粒度下 切换日期
    //   if (timeTypeSelect.value === 3) {
    //     timeTypeSelect.value = 2;
    //   }
    //   search();
}
const changeDateRange = (value) => {
    console.log(value)
}
const range = (start, end) => {
    const result = []
    for (let i = start; i < end; i++) {
        result.push(i)
    }
    return result
}
const disabledDate = current => {
    return current && current > dayjs().endOf('day')
}
const disabledRangeTime = (current) => {
    if (!current) return {}
    const now = dayjs()
    if (current.isBefore(now, 'day')) return {}
    if (current.isAfter(now, 'day')) return {}
    const disabledHours = () => range(now.hour() + 1, 24)
    const disabledMinutes = () => current.hour() === now.hour() ? range(now.minute() + 1, 60) : []
    const disabledSeconds = () =>
        current.hour() === now.hour() && current.minute() === now.minute()
            ? range(now.second() + 1, 60)
            : []
    return {
        disabledHours,
        disabledMinutes,
        disabledSeconds,
    }
}
const currentDevice = ref(null)
const collectParentKeys = (nodes, targetId, parents = []) => {
    for (const node of nodes) {
        const currentParents = [...parents, node.deviceId]
        if (node.deviceId === targetId) {
            return parents
        }
        if (node.children?.length) {
            const result = collectParentKeys(node.children, targetId, currentParents)
            if (result !== null) return result
        }
    }
    return null
}
const syncTreeSelection = (device) => {
    // if (!device?.deviceId) return
    // selectedKeys.value = [device.deviceId]
    // expandedKeys.value = collectParentKeys(treeSource.value, device.deviceId) || []
}
const getDeviceTree = async () => {
    const res = await deviceTreeData({
        orgCode: props.mineInfo.orgCode
    })
    treeSource.value = res?.map(item => {
        if (item.children.length) {
            item.children = item.children.map(child => {
                child.children = child.children.map(childChild => {
                    return {
                        ...childChild,
                        sensorName: child.label,
                    }
                })
                return {
                    ...child,
                    deviceName: child.label,
                    isParent: true,
                    deviceId: new Date().getTime() + Math.random().toString(36).substring(2, 15)
                }
            })
        }
        return {
            ...item,
            deviceName: item.label,
            deviceId: new Date().getTime() + Math.random().toString(36).substring(2, 15),
            isParent: true,
            firstLevelNode: true
        }
    })
    nextTick(() => {
        if (treeSource.value.length > 0) {
            const firstParent = treeSource.value[0]?.children?.[0] || treeSource.value[0]
            currentDevice.value = firstParent.children?.[0] || firstParent
            // 展示注释 选中后不折叠其他展开的数据
            // syncTreeSelection(currentDevice.value)
            selectedKeys.value = [currentDevice.value.deviceId]
            expandedKeys.value = collectParentKeys(treeSource.value, currentDevice.value.deviceId) || []
            handleSearch()
        }
    })
}

const createQueryParams = () => {
    const params = {
        collectDateStart: "",
        collectDateEnd: "",
    }
    const hasCustomRange = Array.isArray(dateRange.value) && dateRange.value.length === 2 && dateRange.value[0] && dateRange.value[1]
    if (hasCustomRange) {
        params.collectDateStart = dayjs(dateRange.value[0]).startOf("day").format("YYYY-MM-DD")
        params.collectDateEnd = dayjs(dateRange.value[1]).endOf("day").format("YYYY-MM-DD")
    } else if (chooseDay.value) {
        params.collectDateStart = dayjs().subtract(chooseDay.value, "day").startOf("day").format("YYYY-MM-DD")
        params.collectDateEnd = dayjs().endOf("day").format("YYYY-MM-DD")
    }
    return params
}
const tableData = ref([])
const handleSearch = async () => {
    loading.value = true
    const params = {
        deviceId: currentDevice.value.deviceId,
        ...createQueryParams()
    }
    try {
    const res = await monitorLineData(params)
        loading.value = false
        tableData.value = res
        buildChartData()
    } catch (error) {
        loading.value = false
    }
}

const buildChartData = () => {
    // 根据情况处理图表数据
    needShowChart.value = false
    const cacheFlag = currentDevice.value.sensorName
    const mineName = currentDevice.value.mineName
    const cacheData = tableData.value
    let unit = currentDevice.value.deviceUnit ?? ''
    if (cacheData.length === 0) {
        const opt = {
            title: {
                text: '暂无数据',
                left: 'center',
                top: 'middle',
                textStyle: { color: 'rgba(0,0,0,1)', fontSize: 14 },
            },
            xAxis: { show: false },
            yAxis: { show: false },
            series: [],
        }
        chartData.value = opt
        return
    }
    if (mineName === '地下矿山') {
        let xData = []
        const opt = {
            legend: {
                data: [],
            },
            xAxis: {
                data: [],
            },
            series: [],
            yAxis: {
                name: unit,
            },
        }
        const seriesV = {
            name: "当前值",
            type: "line",
            symbol: "none",
            barMaxWidth: 30,
            data: [],
            tooltip: {
                valueFormatter: function (value) {
                    return value + unit
                },
            },
        }
        cacheData.forEach((item) => {
            xData.push(item.dataTime)
            seriesV.data.push(item.pointsRawValue)
        })
        opt.xAxis.data = xData
        opt.series = [seriesV]
        isShowDataZoom.value = true
        chartData.value = opt
        return

    } else if (mineName === '尾矿库') {
        if (cacheFlag === "表面位移") {
            const opt = buildSurfaceMultiLineOptions(cacheData, unit)
            isShowDataZoom.value = true
            chartData.value = opt
            return
        } else if (cacheFlag === "内部位移") {
            const opt = buildNbwyLineOptionsNew(cacheData, unit)
            isShowDataZoom.value = true
            chartData.value = opt
            return
        } else {
            let xData = []
            const opt = {
                legend: {
                    data: [],
                },
                xAxis: {
                    data: [],
                },
                series: [],
                yAxis: {
                    name: unit,
                },
            }
            const seriesV = {
                name: "当前值",
                type: cacheFlag === "降雨量" ? "bar" : "line",
                symbol: "none",
                barMaxWidth: 30,
                data: [],
                tooltip: {
                    valueFormatter: function (value) {
                        return value + unit
                    },
                },
            }
            cacheData.forEach((item) => {
                xData.push(item.collectdate)
                seriesV.data.push(item.wkkRawValue)
            })
            opt.xAxis.data = xData
            opt.series = [seriesV]
            isShowDataZoom.value = true
            chartData.value = opt
            return
        }

    } else if (mineName === '露天矿山') {
        if (['表面位移', '内部位移'].includes(cacheFlag)) {
            needShowChart.value = true
            const opt = buildLtksNbwyBmwyLineOptions(cacheData, unit)
            isShowDataZoom.value = true
            chartData.value = opt
            const opt1 = buildLtksNbwyBmwySpeedLineOptions(cacheData, 'mm/h²', true)
            speedchartData1.value = opt1
            const opt2 = buildLtksNbwyBmwySpeedLineOptions(cacheData, 'mm/h', false)
            speedchartData2.value = opt2
            return
        } else if (['采动应力', '震动', '采动应动力', '爆破震动'].includes(cacheFlag)) { // 采动应力 震动 是测试数据 爆破震动 采动应动力 是正式数据
            const isbpzd = ['震动', '爆破震动'].includes(cacheFlag)
            const opt = buildCdydlBpzdLineOptionsNew(cacheData, unit, isbpzd)
            isShowDataZoom.value = true
            chartData.value = opt
            return
        } else if (cacheFlag === '裂缝计') {
            const opt = buildLfjLineOptions(cacheData, unit)
            isShowDataZoom.value = true
            chartData.value = opt
            return
        } else {
            let xData = []
            const opt = {
                legend: {
                    data: [],
                },
                xAxis: {
                    data: [],
                },
                series: [],
                yAxis: {
                    name: unit,
                },
            }
            const seriesV = {
                name: "当前值",
                type: cacheFlag === "雨量计" ? "bar" : "line",
                symbol: "none",
                barMaxWidth: 30,
                data: [],
                tooltip: {
                    valueFormatter: function (value) {
                        return value + unit
                    },
                },
            }
            cacheData.forEach((item) => {
                if (cacheFlag === "边坡雷达") {
                    xData.push(item.radarMonitorTime)
                    seriesV.data.push(item.monitorData)
                } else {
                    // 地下水位 渗透压⼒ 雨量计
                    xData.push(item.monitorTime)
                    seriesV.data.push(item.monitorValue)
                }
            })
            opt.xAxis.data = xData
            opt.series = [seriesV]
            isShowDataZoom.value = true
            chartData.value = opt
            return
        }
    }
}
const handleSelect = (selectedKeys, { node }) => {
    const device = node?.dataRef || node
    if (device.isParent) return
    currentDevice.value = device
    syncTreeSelection(device)
    handleSearch()
}
watch(() => props.mineInfo, (newVal) => {
    if (newVal) {
        getDeviceTree()
    }
}, {
    immediate: true,
    deep: true
})
</script>

<style lang='less' scoped>
.monitor-line {
    display: flex;
    flex-direction: row;
    height: 100%;
    overflow: hidden;

    .left-tree {
        width: 300px;
        height: 100%;
        border-right: 1px solid rgba(253, 253, 253, 0.12);
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .top-filter {
            padding: 20px 15px 0 15px;

            .mine-name {
                margin-bottom: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

        }

        .bottom-tree {
            flex: 1;
            margin-top: 10px;
            padding-left: 10px;
            overflow-y: auto;
        }
    }

    .right-content-box {
        flex: 1;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .header-filter {
            height: 78px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(253, 253, 253, 0.12);
        }

        .table-content {
            flex: 1;
            margin: 10px 18px 18px 12px;
            overflow: hidden;
        }

        .day-select {
            margin-left: 10px;
            width: 380px;
            height: 34px;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #FFFFFF;
            justify-content: space-around;
            background: linear-gradient(90deg, rgba(72, 132, 167, 0.2) 1%, rgba(72, 132, 167, 0.5) 100%);

            span {
                text-align: center;
                cursor: pointer;

                &.act {
                    width: 66px;
                    height: 22px;
                    line-height: 22px;
                    background: rgba(72, 132, 167, 0.549);
                }
            }
        }

        .time-select {
            width: 360px;
            margin-left: 15px;
            margin-right: 35px;
        }
    }
}

.tab-data {
    height: 40px;
    display: flex;

    .each-tab {
        margin: 0 20px;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        color: #fff;

        &:nth-of-type(1) {
            margin-left: 10px;
        }

        &.active {
            color: #51d1ff;
            border-bottom: 1px solid #51d1ff;
        }
    }
}

.relative-for-type-chart {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff !important;
}

.set-type-chart {
    position: absolute;
    top: 6px;
    right: 30px;
    z-index: 10;

    .distance-col-radio {
        margin-right: 10px;
    }
}

.custom-chart-parent {
    width: 100%;
    height: calc(100% - 10px);

    .content_box {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .right_box_lineContent {
            width: 50%;
            height: calc(100% - 10px);

            .custom-chart-line-container {
                width: 100%;
                height: 100%;
            }
        }
    }
}

.overAuto {
    overflow-y: auto;
}

.speed-dom {
    height: 400px;
    width: 100%;
}

.qjj-dom {
    height: 50%;
    width: 100%;
}

:deep(.ant-radio-wrapper) {
    color: #000;
}
</style>