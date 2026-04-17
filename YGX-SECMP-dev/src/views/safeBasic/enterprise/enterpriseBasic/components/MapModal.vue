<template>
    <BasicModal 
        :title="isViewMode ? '查看地图' : '地图绘制'" 
        :width="'80vw'" 
        :height="600" 
        :can-fullscreen="true" 
        :keyboard="false"
        :destroy-on-close="true" 
        v-bind="$attrs" 
        :maskClosable="false" 
        :okText="isViewMode ? undefined : '确定'" 
        :cancelText="isViewMode ? '关闭' : '取消'"
        :showOkBtn="!isViewMode"
        @register="registerModal" 
        @ok="handleOk"
        @cancel="handleCancel">
        <div class="map-container">
            <div id="tiandituMap" style="width: 100%; height: 600px;"></div>
            <div class="map-tools" v-if="!isViewMode">
                <a-button type="primary" @click="startDrawing">开始绘制</a-button>
                <a-button @click="clearDrawing">清除绘制</a-button>
                <a-button type="primary" danger @click="deleteSelected">删除选中</a-button>
            </div>
        </div>
    </BasicModal>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
import { message } from 'ant-design-vue'

const emit = defineEmits(['success', 'register'])

// 天地图相关变量
let map = null
let polygon = null
let referencePolygon = null // 参考边界多边形（用于定位）
let currentPolygonPoints = []
let isDrawing = ref(false)
let drawnCoordinates = ref([])
let currentType = ref('')
let isViewMode = ref(false)
let boundaryData = ref('')
let locateBoundary = ref('') // 用于定位的边界数据
let editBoundary = ref('') // 用于编辑的边界数据
let currentMarkers = []

function clearCurrentMarkers() {
    if (!map || !currentMarkers.length) {
        currentMarkers = []
        return
    }
    currentMarkers.forEach(marker => {
        map.removeOverLay(marker)
    })
    currentMarkers = []
}

// 注册弹窗
const [registerModal, { closeModal }] = useModalInner(async (data) => {
    currentType.value = data.type || 'boundary'
    isViewMode.value = data.mode === 'view'
    boundaryData.value = data.boundary || ''
    locateBoundary.value = data.locateBoundary || ''
    editBoundary.value = data.editBoundary || ''
    drawnCoordinates.value = []
    
    // 等待DOM渲染完成后初始化地图
    await nextTick()
    setTimeout(() => {
        initMap()
        // 如果是查看模式且有边界数据，渲染边界
        if (isViewMode.value && boundaryData.value) {
            renderBoundary(boundaryData.value)
        }
        // // 如果有定位边界数据，渲染参考边界并定位
        // else if (locateBoundary.value && !isViewMode.value) {
        //     renderReferenceBoundary(locateBoundary.value)
        // }
        // 如果有定位边界数据，渲染参考边界并定位
        if (locateBoundary.value) {
            renderReferenceBoundary(locateBoundary.value)
        }
        // 如果有编辑边界数据，渲染编辑边界
        if (editBoundary.value && !isViewMode.value) {
            renderEditBoundary(editBoundary.value)
        }
    }, 100)
})

// 初始化天地图
const initMap = () => {
    // 检查天地图API是否加载
    if (typeof T === 'undefined') {
        message.error('天地图API未加载，请检查配置')
        return
    }

    // 如果地图已存在，先销毁
    if (map) {
        map.clearOverLays()
        map = null
    }

    // 创建地图实例
    // 中心点：北纬29.83°、东经91.73°
    const centerPoint = new T.LngLat(91.73, 29.83)
    
    map = new T.Map('tiandituMap')
    map.centerAndZoom(centerPoint, 14)
    
    // 启用滚轮缩放
    map.enableScrollWheelZoom()
    
    // 添加地图控件
    // const zoom = new T.Control.Zoom()
    // map.addControl(zoom)
    
    // const scale = new T.Control.Scale()
    // map.addControl(scale)
    
    const mapType = new T.Control.MapType()
    map.addControl(mapType)
    map.addControl((window).TMAP_HYBRID_MAP);
}

// 开始绘制
const startDrawing = () => {
    if (!map) {
        message.warning('地图未初始化')
        return
    }
    
    // 清除之前的绘制（但保留参考边界）
    if (polygon) {
        map.removeOverLay(polygon)
        polygon = null
    }
    clearCurrentMarkers()
    currentPolygonPoints = []
    drawnCoordinates.value = []
    
    isDrawing.value = true
    
    message.info('请在地图上点击添加边界点，双击完成绘制')
    
    // 监听地图点击事件
    map.addEventListener('click', handleMapClick)
    map.addEventListener('dblclick', handleMapDblClick)
}

// 处理地图点击事件
const handleMapClick = (e) => {
    if (!isDrawing.value) return
    
    const lngLat = e.lnglat
    currentPolygonPoints.push(lngLat)
    
    // 在点击位置添加标记
    const marker = new T.Marker(lngLat)
    map.addOverLay(marker)
    currentMarkers.push(marker)
    
    // 如果有多个点，绘制临时线条
    if (currentPolygonPoints.length > 1) {
        // 清除之前的临时多边形
        if (polygon) {
            map.removeOverLay(polygon)
        }
        
        // 绘制新的多边形
        polygon = new T.Polygon(currentPolygonPoints, {
            color: '#3388ff',
            weight: 3,
            opacity: 0.8,
            fillColor: '#3388ff',
            fillOpacity: 0.3
        })
        map.addOverLay(polygon)
    }
}

// 处理地图双击事件（完成绘制）
const handleMapDblClick = (e) => {
    if (!isDrawing.value) return
    
    // 停止绘制
    isDrawing.value = false
    map.removeEventListener('click', handleMapClick)
    map.removeEventListener('dblclick', handleMapDblClick)
    
    if (currentPolygonPoints.length < 3) {
        message.warning('至少需要3个点才能形成多边形')
        clearDrawing()
        return
    }
    
    // 保存坐标
    drawnCoordinates.value = currentPolygonPoints.map(p => [p.lng, p.lat])
    
    message.success(`绘制完成！共${drawnCoordinates.value.length}个点`)
}

// 清除绘制
const clearDrawing = (needRenderLocateBoundary=true) => {
    // 清除所有覆盖物
    if (map) {
        map.clearOverLays()
    }
    
    polygon = null
    referencePolygon = null
    currentPolygonPoints = []
    drawnCoordinates.value = []
    isDrawing.value = false
    clearCurrentMarkers()
    
    // 移除事件监听
    if (map) {
        map.removeEventListener('click', handleMapClick)
        map.removeEventListener('dblclick', handleMapDblClick)
    }
    
    // 如果有定位边界数据，重新渲染参考边界
    if (locateBoundary.value && !isViewMode.value && needRenderLocateBoundary) {
        setTimeout(() => {
            renderReferenceBoundary(locateBoundary.value)
        }, 100)
    }
}

// 删除选中的图形
const deleteSelected = () => {
    clearDrawing()
    message.success('已清除绘制内容')
}

// 确定按钮
const handleOk = () => {
    if (drawnCoordinates.value.length === 0) {
        message.warning('请先绘制边界')
        return
    }

    // 将坐标转换为字符串格式
    const coordinateString = drawnCoordinates.value
        .map(coord => `${coord[0].toFixed(6)},${coord[1].toFixed(6)}`)
        .join(';')

    emit('success', {
        type: currentType.value,
        coordinates: drawnCoordinates.value,
        coordinateString: coordinateString
    })
    
    message.success('边界数据已保存')
    closeModal()
}

// 取消按钮
const handleCancel = () => {
    clearDrawing(false)
}

// 渲染边界数据（用于查看模式）
const renderBoundary = (boundaryString) => {
    if (!map || !boundaryString) return
    
    try {
        // 解析边界字符串格式: "91.591990,29.870720;91.583060,29.764380;91.723820,29.764680;91.732060,29.871020"
        const points = boundaryString.split(';').map(point => {
            const [lng, lat] = point.split(',').map(Number)
            return new T.LngLat(lng, lat)
        })
        
        if (points.length < 3) {
            message.warning('边界数据格式不正确，至少需要3个点')
            return
        }
        
        // 清除之前的覆盖物
        map.clearOverLays()
        
        // 绘制多边形
        polygon = new T.Polygon(points, {
            color: '#3388ff',
            weight: 3,
            opacity: 0.8,
            fillColor: '#3388ff',
            fillOpacity: 0.3
        })
        map.addOverLay(polygon)
        
        // 在每个点上添加标记
        points.forEach(point => {
            const marker = new T.Marker(point)
            map.addOverLay(marker)
        })
        
        // 调整地图视野以适应所有点
        const lngs = points.map(p => p.lng)
        const lats = points.map(p => p.lat)
        const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2
        const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2
        map.centerAndZoom(new T.LngLat(centerLng, centerLat), 14)
        
        message.success('边界数据加载完成')
    } catch (error) {
        console.error('渲染边界数据失败', error)
        message.error('边界数据格式错误')
    }
}

// 渲染参考边界（用于定位，显示为半透明）
const renderReferenceBoundary = (boundaryString) => {
    if (!map || !boundaryString) return
    
    try {
        // 解析边界字符串格式
        const points = boundaryString.split(';').map(point => {
            const [lng, lat] = point.split(',').map(Number)
            return new T.LngLat(lng, lat)
        })
        
        if (points.length < 3) {
            return
        }
        
        // 绘制半透明参考边界（企业边界）
        referencePolygon = new T.Polygon(points, {
            color: '#ff9800',
            weight: 2,
            opacity: 0.5,
            fillColor: '#ff9800',
            fillOpacity: 0.1
        })
        map.addOverLay(referencePolygon)
        
        // 调整地图视野以适应参考边界
        const lngs = points.map(p => p.lng)
        const lats = points.map(p => p.lat)
        const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2
        const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2
        map.centerAndZoom(new T.LngLat(centerLng, centerLat), 14)
        
        message.info('橙色区域为企业参考边界')
    } catch (error) {
        console.error('渲染参考边界失败', error)
    }
}

// 渲染编辑边界（用于编辑已有的边界数据）
const renderEditBoundary = (boundaryString) => {
    if (!map || !boundaryString) return
    
    try {
        // 解析边界字符串格式
        const points = boundaryString.split(';').map(point => {
            const [lng, lat] = point.split(',').map(Number)
            return new T.LngLat(lng, lat)
        })
        
        if (points.length < 3) {
            return
        }
        
        // 绘制编辑边界
        polygon = new T.Polygon(points, {
            color: '#3388ff',
            weight: 3,
            opacity: 0.8,
            fillColor: '#3388ff',
            fillOpacity: 0.3
        })
        map.addOverLay(polygon)
        
        // 在每个点上添加标记
        points.forEach(point => {
            const marker = new T.Marker(point)
            map.addOverLay(marker)
            currentMarkers.push(marker)
        })
        
        // 保存坐标到已绘制的坐标中
        currentPolygonPoints = points
        drawnCoordinates.value = points.map(p => [p.lng, p.lat])
        
        // 调整地图视野
        const lngs = points.map(p => p.lng)
        const lats = points.map(p => p.lat)
        const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2
        const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2
        map.centerAndZoom(new T.LngLat(centerLng, centerLat), 14)
        
        message.success('已加载现有边界数据，可以重新绘制或直接确定')
    } catch (error) {
        console.error('渲染编辑边界失败', error)
    }
}

</script>

<style lang="less" scoped>
.map-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.map-tools {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    background: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    .ant-btn {
        margin-left: 8px;
        
        &:first-child {
            margin-left: 0;
        }
    }
}

.coordinate-display {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 1000;
    background: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    max-width: 300px;
    font-size: 14px;
}

#tiandituMap {
    border-radius: 4px;
}
</style>

