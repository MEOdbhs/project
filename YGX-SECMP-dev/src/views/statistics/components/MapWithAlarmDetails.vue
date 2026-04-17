<template>
    <div class="map-with-alarm-details">
        <div class="map-container">
            <div :id="mapContainerId" class="map-canvas"></div>
            <div class="map-placeholder" v-if="!isMapInitialized">
                <Icon icon="ant-design:environment-outlined" class="map-icon" />
                <div class="map-text">地图加载中...</div>
            </div>
            <!-- 预警详情弹窗 -->
            <div class="alarm-details-popup" v-if="showAlarmDetails">
                <div class="popup-header">
                    <span class="popup-title">预警详情</span>
                    <Icon icon="ant-design:close-outlined" class="close-icon" @click="handleClosePopup" />
                </div>
                <div class="popup-content">
                    <!-- 处置反馈 -->
                    <div class="section">
                        <div class="section-title">处置反馈</div>
                        <div class="section-content">
                            <div class="info-row">
                                <span class="label">反馈人员：</span>
                                <span class="value">{{ alarmInfo.feedbackPerson || '未反馈' }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">处置情况说明：</span>
                                <span class="value">{{ alarmInfo.disposalContent || '未反馈' }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">预警核实：</span>
                                <span class="value">{{ alarmInfo.warningVerify ? (alarmInfo.warningVerify === '1' ?
                                    '存在报警' : '误报警') : '' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 预警推送 -->
                    <div class="section">
                        <div class="section-title">预警推送</div>
                        <div class="section-content">
                            <div class="info-row">
                                <span class="label">推送时间：</span>
                                <span class="value">{{ alarmInfo.cancellationTime }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">设备名称：</span>
                                <span class="value">{{ alarmInfo.deviceName }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">预警值：</span>
                                <span class="value">{{ alarmInfo.warningValue || '' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 预警信息 -->
                    <div class="section">
                        <div class="section-title">预警信息</div>
                        <div class="section-content">
                            <div class="info-row">
                                <span class="label">预警等级：</span>
                                <span :class="['alarm-level', `level-${alarmInfo.level}`]">
                                    {{ alarmInfo.levelText }}
                                </span>
                            </div>
                            <div class="info-row">
                                <span class="label">企业名称：</span>
                                <span class="value">{{ alarmInfo.enterpriseName }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">预警时间：</span>
                                <span class="value">{{ alarmInfo.alarmTime }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">消警状态：</span>
                                <span class="value status-cleared">{{ alarmInfo.cancellationType
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 地图图例 -->
            <div class="map-legend">
                <div class="legend-item">
                    <img :src="zctpImage" alt="企业" class="legend-icon" />
                    <span class="legend-text">企业</span>
                </div>
                <div class="legend-item">
                    <img :src="ksqyImage" alt="矿山" class="legend-icon" />
                    <span class="legend-text">矿山</span>
                </div>
                <div class="legend-item">
                    <img :src="orangeMarkerIconUrl" alt="企业预警" class="legend-icon" />
                    <span class="legend-text">企业预警</span>
                </div>
                <div class="legend-item">
                    <img :src="ksqyyjImage" alt="矿山预警" class="legend-icon" />
                    <span class="legend-text">矿山预警</span>
                </div>
            </div>

            <!-- 企业信息悬停卡片 -->
            <div 
                class="enterprise-hover-card" 
                v-if="hoveredEnterprise"
                :style="hoverCardStyle"
            >
                <div class="card-header">
                    <Icon icon="ant-design:shop-outlined" class="card-icon" />
                    <span class="card-title">企业信息</span>
                </div>
                <div class="card-body">
                    <div class="card-main-content">
                        <div class="enterprise-name">{{ hoveredEnterprise?.name }}</div>
                    </div>
                    <div class="card-info-list">
                        <!-- <div class="info-item">
                            <span class="info-label">
                                <Icon icon="ant-design:environment-outlined" class="label-icon" />
                                区域：
                            </span>
                            <span class="info-value">{{ hoveredEnterprise?.areaName || '未设置' }}</span>
                        </div> -->
                        <div class="info-item">
                            <span class="info-label">
                                <Icon icon="ant-design:appstore-outlined" class="label-icon" />
                                企业类型：
                            </span>
                            <span class="info-value">{{ hoveredEnterprise?.typeText || '未设置' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">
                                <Icon icon="ant-design:build-outlined" class="label-icon" />
                                所属行业：
                            </span>
                            <span class="info-value">{{ hoveredEnterprise?.industryText || '未设置' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 预警事件列表弹窗 -->
        <AlarmEventListModal v-model:visible="showAlarmListModal" :data="alarmListData"
            @select-alarm="handleSelectAlarm" />

        <!-- 矿山弹窗 -->
        <MonitorLineDialog @register="registerModal" />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, onBeforeUnmount, computed, watch } from 'vue'
import { Icon } from '/@/components/Icon'
import { message } from 'ant-design-vue'
import { points } from '../data'
import { enterpriseListData, warnEventsList } from '../api'
import zctpImage from '@/assets/images/map/zctp.png'
import ksqyImage from '@/assets/images/map/ksqy.png'
import ksqyyjImage from '@/assets/images/map/ksqyyj.png'
import AlarmEventListModal from './AlarmEventListModal.vue'
import MonitorLineDialog from './MonitorLineDialog.vue'
import { useModal } from '/@/components/Modal'

declare const T: any
const [registerModal, { openModal }] = useModal()
interface AlarmDetail {
    id?: string
    feedbackPerson?: string
    handlingDescription?: string
    verification?: string
    pushTime?: string
    deviceName?: string
    alarmContent?: string
    level?: string
    levelText?: string
    enterpriseName?: string
    alarmTime?: string
    clearanceStatus?: string
}

const props = defineProps<{
    alarmDetail?: AlarmDetail | null
    visible?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
}>()

const showAlarmDetails = ref(false)
const showAlarmListModal = ref(false)
const alarmListData = ref<any[]>([])
const mapContainerId = 'alarmDetailMap'
const isMapInitialized = ref(false)
let map: any = null
const markers: any[] = []
let boundaryPolygon: any = null

// const defaultAlarmDetail: AlarmDetail = {
//   feedbackPerson: '',
//   handlingDescription: '',
//   verification: '',
//   pushTime: '2025-09-25 23:18:46',
//   deviceName: '差压式液位计-001Q0001',
//   alarmContent: 'XXX监测设备超过预警值',
//   level: 'orange',
//   levelText: '橙色预警',
//   enterpriseName: '西藏巨龙铜业有限公司',
//   alarmTime: '2025-10-11 13:14:24',
//   clearanceStatus: '已消警'
// };

const alarmInfo = ref<any>({})

const setPopupVisible = (visible: boolean) => {
    showAlarmDetails.value = visible
    emit('update:visible', visible)
}

watch(
    () => props.visible,
    value => {
        if (typeof value === 'boolean') {
            showAlarmDetails.value = value
        }
    },
    { immediate: true }
)

watch(
    () => props.alarmDetail,
    value => {
        if (value) {
            alarmInfo.value = {
                ...value
            }
            if (props.visible === undefined) {
                showAlarmDetails.value = true
            }
        } else {
            alarmInfo.value = {}
        }
    },
    { deep: true, immediate: true }
)

const handleClosePopup = () => setPopupVisible(false)

interface AlarmPoint {
    id?: string
    lng: number
    lat: number
    name: string
    orgCode: string
    entWarnText?: string
    alarmPoints?: string
    type: string
    areaName?: string
    typeText?: string
    industryText?: string
}

const alarmPoints = ref<AlarmPoint[]>([])
// 存储原始企业数据，以 id 为 key
const enterpriseDataMap = ref<Map<string, any>>(new Map())
const hoveredEnterprise = ref<any | null>(null)
const hoverCardPosition = ref({ x: 0, y: 0 })
const hoverCardStyle = computed(() => {
    if (!hoveredEnterprise.value) return {}
    return {
        left: `${hoverCardPosition.value.x}px`,
        top: `${hoverCardPosition.value.y}px`
    }
})


// 将扁平数组转换为对象数组格式
const mozhugongkaBoundary: { lng: number; lat: number }[] = []
for (let i = 0; i < points.length; i += 2) {
    mozhugongkaBoundary.push({
        lng: points[i],
        lat: points[i + 1]
    })
}

const initMap = () => {
    if (typeof T === 'undefined') {
        console.error('天地图API未加载，请检查配置')
        return
    }

    isMapInitialized.value = false

    if (map) {
        map.clearOverLays()
        map = null
    }

    const centerPoint = new T.LngLat(91.73, 29.83)
    map = new T.Map(mapContainerId)
    map.centerAndZoom(centerPoint, 14)
    map.enableScrollWheelZoom()

    const zoomControl = new T.Control.Zoom()
    map.addControl(zoomControl)

    const mapTypeControl = new T.Control.MapType()
    map.addControl(mapTypeControl)

    const hybridControl = (window as any)?.TMAP_HYBRID_MAP
    if (hybridControl) {
        map.addControl(hybridControl)
    }

    renderAlarmPoints()
    renderCountyBoundary()
    fitMapToPoints()

    isMapInitialized.value = true
}

const renderAlarmPoints = () => {
    if (!map || alarmPoints.value.length === 0) return

    clearMarkers()

    // 使用 map 创建标记点数组，确保每个闭包捕获正确的数据
    const currentPoints = [...alarmPoints.value] // 创建数组副本，避免引用问题
    
    currentPoints.forEach((point) => {
        // 使用立即执行函数创建闭包，确保每个事件处理函数捕获正确的 point
        // 创建 point 的副本，避免引用污染
        ((currentPoint: AlarmPoint) => {
            // 创建 point 的副本，确保数据不被污染
            const pointCopy: AlarmPoint = {
                id: currentPoint.id,
                lng: currentPoint.lng,
                lat: currentPoint.lat,
                name: currentPoint.name,
                orgCode: currentPoint.orgCode,
                entWarnText: currentPoint.entWarnText,
                alarmPoints: currentPoint.alarmPoints,
                type: currentPoint.type,
                areaName: currentPoint.areaName,
                typeText: currentPoint.typeText,
                industryText: currentPoint.industryText
            }
            
            const lngLat = new T.LngLat(pointCopy.lng, pointCopy.lat)
            // 如果有预警信息(entWarnText)或alarmPoints为'是'，使用红色预警标记，否则使用白色企业标记
            const color = pointCopy.entWarnText === '是' ? 'red' : 'white'
            const markerIcon = createMarkerIcon(color, pointCopy.type)
            const marker = new T.Marker(lngLat, { icon: markerIcon })
            marker.addEventListener('click', () => handleMarkerClick(pointCopy))
            // 添加鼠标悬停事件
            marker.addEventListener('mouseover', () => handleMarkerMouseover(pointCopy))
            marker.addEventListener('mouseout', () => handleMarkerMouseout())
            map.addOverLay(marker)
            markers.push(marker)
        })(point)
    })
}

const clearMarkers = () => {
    if (!map || markers.length === 0) return
    markers.forEach(marker => map.removeOverLay(marker))
    markers.length = 0
}

/**
 * 绘制墨竹工卡县边界
 */
const renderCountyBoundary = () => {
    if (!map) return

    // 清除之前的边界
    if (boundaryPolygon) {
        map.removeOverLay(boundaryPolygon)
        boundaryPolygon = null
    }

    // 创建边界坐标点数组
    const boundaryPoints = mozhugongkaBoundary.map(
        point => new T.LngLat(point.lng, point.lat)
    )

    // 创建多边形样式
    const polygonStyle = {
        color: '#40a9ff',        // 边界线颜色
        weight: 5,              // 边界线宽度
        opacity: 0.9,           // 边界线透明度
        fillColor: '#2c63b6',   // 填充颜色
        fillOpacity: 0.7       // 填充透明度
    }

    // 创建多边形覆盖物
    boundaryPolygon = new T.Polygon(boundaryPoints, polygonStyle)

    // 添加到地图
    map.addOverLay(boundaryPolygon)
}

const fitMapToPoints = () => {
    if (!map || alarmPoints.value.length === 0) return
    // 包含所有点位和边界范围
    const allPoints = [
        ...alarmPoints.value.map(p => new T.LngLat(p.lng, p.lat)),
        ...mozhugongkaBoundary.map(p => new T.LngLat(p.lng, p.lat))
    ]
    map.setViewport(allPoints)
}

// 生成橙色标记的 SVG URL（用于图例）
const orangeMarkerIconUrl = computed(() => {
    const svg = `
    <svg width="32" height="40" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
      <!-- 地图标记外边框（橙色） -->
      <path d="M 20 0 Q 30 0 35 5 Q 40 10 40 20 Q 40 25 38 28 L 20 50 L 2 28 Q 0 25 0 20 Q 0 10 5 5 Q 10 0 20 0 Z" 
            fill="#ff7a00" 
            stroke="#ff7a00" 
            stroke-width="2.5" 
            stroke-linejoin="round"/>
      <!-- 顶部白色圆形区域 -->
      <circle cx="20" cy="18" r="17" fill="#ffffff" stroke="#ff7a00" stroke-width="2"/>
      <!-- 橙色三角形（增大尺寸） -->
      <path d="M 20 8 L 29 22 L 11 22 Z" fill="#ff7a00"/>
      <!-- 白色感叹号 -->
      <text x="20" y="24" font-size="12" font-family="Arial, sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">!</text>
    </svg>
  `
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
})

const createMarkerIcon = (color: 'red' | 'white', type: string) => {
    const isRed = color === 'red'
    if (type === '矿山类') {
        if (isRed) {
            return new T.Icon({
                iconUrl: ksqyyjImage,
                iconSize: new T.Point(32, 40),
                iconAnchor: new T.Point(16, 40)
            })
        } else {
            return new T.Icon({
                iconUrl: ksqyImage,
                iconSize: new T.Point(30, 30),
                iconAnchor: new T.Point(15, 30)
            })
        }
    }

    if (isRed) {
        // 红色标记点：地图标记形状，橙色边框，白色圆形内橙色三角形加白色感叹号
        const svg = `
      <svg width="32" height="40" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
        <!-- 地图标记外边框（橙色） -->
        <path d="M 20 0 Q 30 0 35 5 Q 40 10 40 20 Q 40 25 38 28 L 20 50 L 2 28 Q 0 25 0 20 Q 0 10 5 5 Q 10 0 20 0 Z" 
              fill="#ff7a00" 
              stroke="#ff7a00" 
              stroke-width="2.5" 
              stroke-linejoin="round"/>
        <!-- 顶部白色圆形区域 -->
        <circle cx="20" cy="18" r="17" fill="#ffffff" stroke="#ff7a00" stroke-width="2"/>
        <!-- 橙色三角形（增大尺寸） -->
        <path d="M 20 8 L 29 22 L 11 22 Z" fill="#ff7a00"/>
        <!-- 白色感叹号 -->
        <text x="20" y="24" font-size="12" font-family="Arial, sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">!</text>
      </svg>
    `
        const iconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
        return new T.Icon({
            iconUrl,
            iconSize: new T.Point(32, 40),
            iconAnchor: new T.Point(16, 40)
        })
    } else {
        // 白色标记点使用图片
        return new T.Icon({
            iconUrl: zctpImage,
            iconSize: new T.Point(30, 30),
            iconAnchor: new T.Point(15, 30)
        })
    }
}

/**
 * 标记点鼠标悬停事件
 * @param point 标记点
 */
const handleMarkerMouseover = (point: AlarmPoint) => {
    if (!map ) return // 矿山类不显示悬停卡片
    
    // 通过 id 从原始数据中获取企业信息，避免使用被污染的数据
    if (point.id && enterpriseDataMap.value.has(point.id)) {
        const originalData = enterpriseDataMap.value.get(point.id)
        hoveredEnterprise.value = {
            name: originalData.name || '',
            areaName: originalData.areaName || '',
            typeText: originalData.typeText || '',
            industryText: originalData.industryText || ''
        }
    } else {
        // 如果没有找到原始数据，使用 point 中的数据（降级处理）
        hoveredEnterprise.value = {
            name: point.name || '',
            areaName: point.areaName || '',
            typeText: point.typeText || '',
            industryText: point.industryText || ''
        }
    }
    
    // 卡片位置固定在地图组件左上角
    hoverCardPosition.value = {
        x: 20,
        y: 20
    }
}

/**
 * 标记点鼠标离开事件
 */
const handleMarkerMouseout = () => {
    hoveredEnterprise.value = null
}

/**
 * 点击标记点事件
 * @param point 标记点
 */
const handleMarkerClick = async (point: AlarmPoint) => {
    try {
        if (point.type === '矿山类') {
            openModal(true, { mineInfo: point })
            return
        }
        const res = await warnEventsList({ orgCode: point.orgCode })
        if (Array.isArray(res) && res.length > 0) {
            if (res.length === 1) {
                alarmInfo.value = {
                    ...res[0]
                }
                setPopupVisible(true)
            } else {
                // 多条数据时弹出列表弹窗
                alarmListData.value = res
                showAlarmListModal.value = true
            }
        } else {
            message.info('该企业暂无预警事件')
        }
    } catch (error) {
        console.error('获取预警事件列表失败:', error)
        message.error('获取预警事件列表失败')
    }
}

/**
 * 处理选择预警事件
 * @param item 选中的预警事件
 */
const handleSelectAlarm = (item: any) => {
    // 确保数据格式正确，兼容原始字段名和转换后的字段名
    alarmInfo.value = {
        ...item,
        // 如果存在转换后的字段，使用转换后的字段，否则使用原始字段
        enterpriseName: item.enterpriseName || item.orgName,
        level: item.level || (item.warningType === '红色预警' ? 'red' : item.warningType === '橙色预警' ? 'orange' : item.warningType === '黄色预警' ? 'yellow' : 'blue'),
        levelText: item.levelText || item.warningType
    }
    setPopupVisible(true)
}

const getEnterpriseList = async () => {
    try {
        const res = await enterpriseListData({})
        if (res && Array.isArray(res)) {
            if (res.length > 0) {
                // 清空之前的数据
                enterpriseDataMap.value.clear()
                
                // 存储原始数据，以 id 或 orgCode 为 key
                // 使用深拷贝确保数据不被污染
                res.forEach((item: any) => {
                    const key = item.id || item.orgCode || item.code || ''
                    if (key) {
                        // 深拷贝每个 item，避免引用污染
                        enterpriseDataMap.value.set(key, JSON.parse(JSON.stringify(item)))
                    }
                })
                
                alarmPoints.value = res
                    .filter((item: any) => item.latAndLng && typeof item.latAndLng === 'string' && item.latAndLng.includes(','))
                    .map((item: any) => {
                        const [lngStr, latStr] = item.latAndLng.split(',')
                        const lng = parseFloat(lngStr?.trim())
                        const lat = parseFloat(latStr?.trim())
                        // 使用 id、orgCode 或 code 作为唯一标识
                        const id = item.id || item.orgCode || item.code || ''
                        return {
                            id,
                            lng,
                            lat,
                            entWarnText: item.entWarnText,
                            name: item.name || '',
                            orgCode: item.orgCode || '',
                            alarmPoints: item.alarmPoints,
                            type: item.typeText,
                            areaName: item.areaName || '',
                            typeText: item.typeText || '',
                            industryText: item.industryText || ''
                        }
                    })
                    .filter((point: AlarmPoint) => !isNaN(point.lng) && !isNaN(point.lat) && point.lng !== 0 && point.lat !== 0) // 过滤掉无效坐标
                // 重新渲染地图标记点
                if (map) {
                    renderAlarmPoints()
                    fitMapToPoints()
                }
            } else {
                alarmPoints.value = []
                enterpriseDataMap.value.clear()
            }
        }
    } catch (error) {
        console.error('获取企业列表失败:', error)
        message.error('获取企业列表失败')
    }
}

onMounted(async () => {
    await nextTick()
    setTimeout(() => {
        initMap()
        // 地图初始化后再获取企业列表
        getEnterpriseList()
    }, 100)
})

onBeforeUnmount(() => {
    if (map) {
        clearMarkers()
        if (boundaryPolygon) {
            map.removeOverLay(boundaryPolygon)
            boundaryPolygon = null
        }
        map.clearOverLays()
        map = null
    }
    hoveredEnterprise.value = null
})
</script>

<style lang="less" scoped>
.map-with-alarm-details {
    width: 100%;
    height: 100%;
    position: relative;

    .map-container {
        width: 100%;
        height: 100%;
        background: rgba(11, 28, 54, 0.6);
        border: 1px solid rgba(64, 169, 255, 0.3);
        border-radius: 4px;
        position: relative;
        overflow: hidden;

        .map-canvas {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            z-index: 1;
        }

        .map-placeholder {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.6);
            background: rgba(11, 28, 54, 0.85);
            z-index: 5;

            .map-icon {
                font-size: 64px;
                margin-bottom: 16px;
            }

            .map-text {
                font-size: 16px;
            }
        }

        .alarm-details-popup {
            pointer-events: auto;
            position: absolute;
            top: 20px;
            left: 100px;
            width: 400px;
            background: rgba(11, 28, 54, 0.95);
            border: 1px solid rgba(64, 169, 255, 0.5);
            border-radius: 4px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            z-index: 50;

            .popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);

                .popup-title {
                    font-size: 16px;
                    font-weight: 500;
                    color: #fff;
                }

                .close-icon {
                    font-size: 18px;
                    color: #87ceeb;
                    cursor: pointer;

                    &:hover {
                        color: #fff;
                    }
                }
            }

            .popup-content {
                padding: 16px;
                max-height: 500px;
                overflow-y: auto;

                .section {
                    margin-bottom: 20px;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .section-title {
                        font-size: 15px;
                        font-weight: 500;
                        color: #40a9ff;
                        margin-bottom: 12px;
                        padding-bottom: 8px;
                        border-bottom: 1px solid rgba(64, 169, 255, 0.3);
                    }

                    .section-content {
                        .info-row {
                            display: flex;
                            align-items: flex-start;
                            margin-bottom: 10px;
                            font-size: 14px;

                            &:last-child {
                                margin-bottom: 0;
                            }

                            .label {
                                color: #87ceeb;
                                min-width: 100px;
                                flex-shrink: 0;
                            }

                            .value {
                                color: #fff;
                                flex: 1;
                                word-break: break-all;

                                &.status-cleared {
                                    color: #52c41a;
                                }
                            }

                            .alarm-level {
                                padding: 2px 8px;
                                border-radius: 2px;
                                font-size: 13px;

                                &.level-blue {
                                    color: #1890ff;
                                    background: rgba(24, 144, 255, 0.2);
                                }

                                &.level-yellow {
                                    color: #faad14;
                                    background: rgba(250, 173, 20, 0.2);
                                }

                                &.level-orange {
                                    color: #ff7a00;
                                    background: rgba(255, 122, 0, 0.2);
                                }

                                &.level-red {
                                    color: #ff4d4f;
                                    background: rgba(255, 77, 79, 0.2);
                                }
                            }
                        }
                    }
                }
            }
        }

        .map-legend {
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(35, 108, 182, 0.7);
            border-radius: 4px;
            padding: 12px 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            z-index: 50;
            pointer-events: auto;

            .legend-item {
                display: flex;
                align-items: center;
                margin-bottom: 8px;

                &:last-child {
                    margin-bottom: 0;
                }

                .legend-icon {
                    width: 24px;
                    height: 24px;
                    margin-right: 8px;
                    object-fit: contain;
                }

                .legend-text {
                    font-size: 14px;
                    color: #fff;
                }
            }
        }

        .enterprise-hover-card {
            position: absolute;
            width: 320px;
            background: linear-gradient(135deg, rgba(11, 28, 54, 0.98) 0%, rgba(20, 40, 70, 0.98) 100%);
            border: 1px solid rgba(64, 169, 255, 0.6);
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(64, 169, 255, 0.2);
            z-index: 100;
            pointer-events: none;
            backdrop-filter: blur(10px);
            animation: fadeInUp 0.2s ease-out;

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .card-header {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid rgba(64, 169, 255, 0.3);
                background: rgba(64, 169, 255, 0.1);

                .card-icon {
                    font-size: 18px;
                    color: #40a9ff;
                    margin-right: 8px;
                }

                .card-title {
                    font-size: 15px;
                    font-weight: 600;
                    color: #40a9ff;
                    letter-spacing: 0.5px;
                }
            }

            .card-body {
                padding: 16px;

                .card-main-content {
                    margin-bottom: 16px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid rgba(64, 169, 255, 0.2);

                    .enterprise-name {
                        font-size: 18px;
                        font-weight: 600;
                        color: #fff;
                        line-height: 1.5;
                        word-break: break-all;
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                    }
                }

                .card-info-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;

                    .info-item {
                        display: flex;
                        align-items: flex-start;
                        font-size: 13px;
                        line-height: 1.6;

                        .info-label {
                            display: flex;
                            align-items: center;
                            color: #87ceeb;
                            min-width: 90px;
                            flex-shrink: 0;
                            margin-right: 8px;

                            .label-icon {
                                font-size: 14px;
                                margin-right: 4px;
                                color: #40a9ff;
                            }
                        }

                        .info-value {
                            flex: 1;
                            color: #fff;
                            word-break: break-all;
                            font-weight: 500;
                        }
                    }
                }
            }
        }
    }
}
</style>
