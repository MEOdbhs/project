<template>
  <div class="hs-online-watch">
    <!-- 顶部筛选区域 -->
    <div class="filter-header">
      <div class="filter-left">
        <a-select
          v-model:value="state.searchParams.seriousOriginalId"
          placeholder="重大危险源"
          style="width: 200px"
          allowClear
          @change="handleSearch"
          :loading="state.loading"
        >
          <a-select-option value="">全部</a-select-option>
          <a-select-option 
            v-for="option in state.hazardOptions" 
            :key="option.id" 
            :value="option.id"
          >
            {{ option.hazardName }}
          </a-select-option>
        </a-select>
        
        <a-button type="primary" @click="handleSearch" :loading="state.loading">
          搜索
        </a-button>
      </div>
      
      <div class="filter-right">
        <a-button
          :class="{ active: state.activeTab === 'all' }"
          @click="handleTabChange('all')"
        >
          全部 {{ state.statistics.all }}
        </a-button>
       
        <a-button
          class="status-btn status-btn-warning"
          :class="{ active: state.activeTab === 'warning' }"
          @click="handleTabChange('warning')"
        >
          <span class="status-dot status-dot-warning"></span>
          预警 {{ state.statistics.alarm }}
        </a-button>
        <a-button
          class="status-btn status-btn-offline"
          :class="{ active: state.activeTab === 'offline' }"
          @click="handleTabChange('offline')"
        >
          <span class="status-dot status-dot-offline"></span>
          离线 {{ state.statistics.offline }}
        </a-button>
      </div>
    </div>

    <!-- 卡片列表区域 -->
    <div v-loading="state.loading" class="card-container">
      <div v-if="state.canAreaData.length === 0" class="empty-text">
        暂无数据
      </div>
      
      <div v-else class="card-grid">
        <!-- 直接使用接口返回的分组数据 -->
        <template v-for="canArea in state.canAreaData" :key="canArea.canId">
          <!-- 罐区标题 -->
          <div class="can-header">
            <span class="can-title">{{ canArea.seriousOriginalName }}</span>
            <span class="can-tag">{{ canArea.hazardLevelText || '' }}</span>
          </div>
          
          <!-- 罐区内的卡片 -->
          <div class="card-row">
            <a-card
              v-for="device in canArea.deviceList"
              :key="device.id"
              class="device-card"
              :class="[`card-${device.status}`]"
              :hoverable="true"
            >
              <!-- 卡片头部 -->
              <div class="card-header">
                <div class="card-title">
                  <span class="device-icon">
                    <svg
                      viewBox="0 0 1024 1024"
                      width="16"
                      height="16"
                      fill="currentColor"
                    >
                      <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32z m-40 632H136V232h752v560z"></path>
                    </svg>
                  </span>
                  <span class="device-name">{{ device.deviceSafeCheckName}}{{ device.deviceSafeCheckNo}}</span>
                 
                </div>
               
                <div class="card-actions">
                  <span class="device-status-tag" :class="`status-${device.status}`">
                    {{ getStatusText(device.status) }}
                  </span>
                  <span class="chart-icon" @click="handleShowChart(device)">
                    <svg
                      viewBox="0 0 1024 1024"
                      width="16"
                      height="16"
                      fill="currentColor"
                    >
                      <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 628.5c3.1 3.1 8.2 3.1 11.3 0l275.4-275.3c3.1-3.1 3.1-8.2 0-11.3l-39.6-39.6c-3.1-3.1-8.2-3.1-11.3 0l-230 229.9L461.4 404c-3.1-3.1-8.2-3.1-11.3 0L266.3 586.7c-3.1 3.1-3.1 8.2 0 11.3l39.5 39.7z"></path>
                    </svg>
                  </span>
                </div>
              </div>
              
              <!-- 卡片时间 -->
              <div class="card-time">{{ device.monitorDate }}</div>
              
              <!-- 卡片内容 - 设备属性数据 -->
              <div class="card-content">
                <div
                  v-for="(indexItem, index) in device.indexList"
                  :key="index"
                  class="sensor-item"
                >
                  <span class="sensor-label">{{ indexItem.safeDeviceQuotaName }}:</span>
                  <span
                    class="sensor-value"
                    :class="{ 'warning-value': isWarningValue(indexItem.monitorValue, device.status) }"
                    :style="getValueColorStyle(indexItem.warningColor)"
                  >
                    {{ indexItem.monitorValue }}{{ indexItem.unit || '' }}
                  </span>
                  <span v-if="indexItem.level" class="sensor-level">{{ indexItem.level }}</span>
                </div>
              </div>
            </a-card>
          </div>
        </template>
      </div>
    </div>
    
    <!-- 图表弹窗 -->
    <ChartModal @register="registerModal" />
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted } from 'vue';
  import { useModal } from '/@/components/Modal';
  import ChartModal from './components/ChartModal.vue';
  import { CanAreaInfo, DeviceInfo, HazardOption, CountStatistics } from './line.data';
  import { getHazardMonitorEquipmentList, getHazardManageList, getCountOuter } from './line.api';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
  const [registerModal, { openModal }] = useModal();
  
  const state = reactive({
    loading: false,
    activeTab: 'all' as 'all' | 'normal' | 'warning' | 'offline',
    searchParams: {
      deviceType: '',
      seriousOriginalId: '', // 重大危险源类型ID
    },
    hazardOptions: [] as HazardOption[], // 重大危险源选项
    canAreaData: [] as CanAreaInfo[], // 接口返回的分组数据（直接使用）
    statistics: {
      all: 0,
      normal: 0,
      warning: 0,
      offline: 0,
    } as CountStatistics,
  });
  
  // 加载重大危险源选项
  const loadHazardOptions = async () => {
    try {
      const response = await getHazardManageList({ orgCode: userStore.currentEnterpriseCode});
      state.hazardOptions = response || [];
    } catch (error) {
      console.warn('加载重大危险源选项失败:', error);
      // 使用模拟数据
      state.hazardOptions = [
        { id: '1', hazardName: '罐区' },
        { id: '2', hazardName: '仓库' },
        { id: '3', hazardName: '装置区' },
      ];
    }
  };

  // 加载统计数据
  const loadStatistics = async () => {
    try {
      const params = state.searchParams.seriousOriginalId ? { seriousOriginalId: state.searchParams.seriousOriginalId } : {};
      params.orgCode = userStore.currentEnterpriseCode;
      const response = await getCountOuter(params);
      
      if (response) {
        state.statistics =response;
      }
    } catch (error) {
      console.warn('加载统计数据失败:', error);
    }
  };



  // 加载数据
  const loadData = async () => {
    state.loading = true;
    try {
      // 调用真实API（如果API可用）或使用模拟数据
      let canAreaData: CanAreaInfo[] = [];
      
      try {
        // 尝试调用真实API
        const params: any = {};
        params.orgCode = userStore.currentEnterpriseCode;
        if (state.searchParams.seriousOriginalId) {
          params.seriousOriginalId = state.searchParams.seriousOriginalId;
        }
        // 添加状态筛选参数
        if (state.activeTab !== 'all') {
          if (state.activeTab === 'normal') {
            params.status = 0;
          } else if (state.activeTab === 'warning') {
            params.status = 2;
          } else if (state.activeTab === 'offline') {
            params.status = 1;
          }
        }
        canAreaData = await getHazardMonitorEquipmentList(params);
      } catch (apiError) {
        console.warn('API调用失败，使用模拟数据:', apiError);
        // 如果API调用失败，使用模拟数据
        //canAreaData = generateMockCanAreaData();
      }
      
      // 直接使用接口返回的分组数据
      state.canAreaData = canAreaData;
      
      // 加载统计数据（从API获取）
      await loadStatistics();
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      state.loading = false;
    }
  };
  
  
  // 搜索
  const handleSearch = () => {
    loadData(); // 重新加载数据和统计
  };
  
  // 切换Tab
  const handleTabChange = (tab: 'all' | 'normal' | 'warning' | 'offline') => {
    state.activeTab = tab;
    loadData(); // 重新加载数据，因为状态筛选现在通过API参数实现
  };
  
  // 显示图表
  const handleShowChart = (device: DeviceInfo) => {
    openModal(true, { cardData: device });
  };
  
  
  const getStatusText = (status: number) => {
    const statusMap = {
      0: '在线',
      1: '离线',
      2: '预警',
    };
    return statusMap[status] || '';
  };
  // 获取监测值的颜色样式
  const getValueColorStyle = (warningColor?: string) => {
    const colorMap = {
      red: '#ff4d4f',
      orange: '#fa8c16',
      yellow: '#fadb14',
      blue: '#1890ff',
    };
    return warningColor && colorMap[warningColor] ? { color: colorMap[warningColor] } : {};
  };

  // 判断是否为警告值（保持向后兼容）
  const isWarningValue = (value: string | number, status: number) => {
    return status === 2 && (
      (typeof value === 'string' && value.includes('56.5')) ||
      (typeof value === 'number' && value > 50)
    );
  };
  
  onMounted(() => {
    loadHazardOptions();
    loadData();
  });
</script>

<style lang="less" scoped>
  .hs-online-watch {
    padding: 20px;
    background: #141414;
    min-height: calc(100vh - 100px);
  }
  
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 20px 24px;
    background: #1f1f1f;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    border: 1px solid #303030;
    
    .filter-left {
      display: flex;
      gap: 12px;
      align-items: center;
      
      :deep(.ant-select) {
        .ant-select-selector {
          border: 1px solid #d9d9d9;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          transition: all 0.3s;
          
          &:hover {
            border-color: #1890ff;
          }
        }
        
        &.ant-select-focused .ant-select-selector {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
        }
      }
    }
    
    .filter-right {
      display: flex;
      gap: 10px;
      
      .ant-btn {
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 16px;
        height: auto;
        font-size: 14px;
        font-weight: 500;
        border: 1px solid #434343;
        background: #262626;
        color: #d9d9d9;
        transition: all 0.3s;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        
        &:hover {
          border-color: #1890ff;
          color: #1890ff;
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(24, 144, 255, 0.15);
        }
        
        &.active {
          font-weight: 600;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(255, 255, 255, 0.1);
        }
      }
      
      .status-btn {
        &.active {
          color: #fff;
          border-width: 1px;
        }
        
        &.status-btn-normal {
          &:hover {
            border-color: #52c41a;
            color: #52c41a;
          }
          
          &.active {
            background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
            border-color: #52c41a;
            box-shadow: 0 3px 8px rgba(82, 196, 26, 0.3);
          }
        }
        
        &.status-btn-warning {
          &:hover {
            border-color: #ff4d4f;
            color: #ff4d4f;
          }
          
          &.active {
            background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
            border-color: #ff4d4f;
            box-shadow: 0 3px 8px rgba(255, 77, 79, 0.3);
          }
        }
        
        &.status-btn-offline {
          &:hover {
            border-color: #8c8c8c;
            color: #8c8c8c;
          }
          
          &.active {
            background: linear-gradient(135deg, #8c8c8c 0%, #a6a6a6 100%);
            border-color: #8c8c8c;
            box-shadow: 0 3px 8px rgba(140, 140, 140, 0.3);
          }
        }
      }
      
      .status-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
        
        &.status-dot-normal {
          background: #52c41a;
        }
        
        &.status-dot-warning {
          background: #ff4d4f;
          animation: pulse-warning 2s infinite;
        }
        
        &.status-dot-offline {
          background: #8c8c8c;
        }
      }
    }
  }
  
  @keyframes pulse-warning {
    0%, 100% {
      box-shadow: 0 0 4px rgba(255, 77, 79, 0.4);
    }
    50% {
      box-shadow: 0 0 8px rgba(255, 77, 79, 0.8);
    }
  }
  
  .card-container {
    min-height: 400px;
    
    .empty-text {
      text-align: center;
      padding: 80px 50px;
      color: #8c8c8c;
      font-size: 16px;
      background: #1f1f1f;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border: 1px solid #303030;
    }
  }
  
  .card-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .can-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    background: #262626;
    border-left: 4px solid #1890ff;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    border: 1px solid #303030;
    border-left-width: 4px;
    transition: all 0.3s;
    
    &:hover {
      box-shadow: 0 3px 10px rgba(255, 255, 255, 0.1);
      transform: translateX(2px);
    }
    
    .can-title {
      font-size: 16px;
      font-weight: 600;
      color: #69c0ff;
      display: flex;
      align-items: center;
      gap: 8px;
      
      &::before {
        content: '📦';
        font-size: 18px;
      }
    }
    
    .can-tag {
      padding: 3px 14px;
      background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
      color: #fff;
      font-size: 12px;
      font-weight: 500;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(255, 77, 79, 0.3);
    }
  }
  
  .card-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 24px;
    
    @media (max-width: 1600px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 1200px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
  
  .device-card {
    border-radius: 8px;
    transition: all 0.3s;
    background: #1f1f1f;
    border: 1px solid #303030;
    overflow: hidden;
    
    &.card-2 { // 预警状态
      border-left: 5px solid #ff4d4f;
      background: #2a1f1f;
      
      :deep(.ant-card-body) {
        padding: 18px;
        background: transparent;
      }
    }
    
    &.card-0 { // 在线状态
      border-left: 5px solid #52c41a;
      background: #1f2a1f;
      
      :deep(.ant-card-body) {
        padding: 18px;
        background: transparent;
      }
    }
    
    &.card-1 { // 离线状态
      border-left: 5px solid #595959;
      background: #262626;
      opacity: 0.85;
      
      :deep(.ant-card-body) {
        padding: 18px;
        background: transparent;
      }
    }
    
    // 保持向后兼容
    &.card-warning {
      border-left: 5px solid #ff4d4f;
      background: #2a1f1f;
      
      :deep(.ant-card-body) {
        padding: 18px;
        background: transparent;
      }
    }
    
    &.card-normal {
      border-left: 5px solid #52c41a;
      background: #1f2a1f;
      
      :deep(.ant-card-body) {
        padding: 18px;
        background: transparent;
      }
    }
    
    &.card-offline {
      border-left: 5px solid #595959;
      background: #262626;
      opacity: 0.85;
      
      :deep(.ant-card-body) {
        padding: 18px;
        background: transparent;
      }
    }
    
    &:hover {
      box-shadow: 0 6px 16px rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
      border-color: #434343;
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    
    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      color: #f0f0f0;
      
      .device-icon {
        display: flex;
        align-items: center;
        color: #1890ff;
        padding: 4px;
        background: rgba(24, 144, 255, 0.1);
        border-radius: 4px;
      }
    }
    
    .card-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .device-status-tag {
        width: 4rem;
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        color: #fff;
        text-align: center;
        min-width: 40px;
        
        &.status-0 { // 在线
          background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
          border: 1px solid #52c41a;
        }
        
        &.status-1 { // 离线
          background: linear-gradient(135deg, #8c8c8c 0%, #a6a6a6 100%);
          border: 1px solid #8c8c8c;
        }
        
        &.status-2 { // 预警
          background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
          border: 1px solid #ff4d4f;
        }
      }

      .status-badge {
        :deep(.ant-badge-status-text) {
          font-size: 12px;
          font-weight: 500;
          color: #d9d9d9;
        }
      }
      
      .chart-icon {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #1890ff;
        padding: 6px;
        border-radius: 4px;
        background: rgba(24, 144, 255, 0.2);
        transition: all 0.3s;
        
        &:hover {
          color: #fff;
          background: #1890ff;
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
        }
      }
    }
  }
  
  .card-time {
    font-size: 12px;
    color: #8c8c8c;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    
    &::before {
      content: '🕐';
      font-size: 14px;
    }
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #262626;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #303030;
  }
  
  .sensor-item {
    display: flex;
    align-items: center;
    font-size: 13px;
    line-height: 22px;
    padding: 6px 8px;
    background: #1f1f1f;
    border-radius: 4px;
    transition: all 0.2s;
    border: 1px solid #303030;
    
    &:hover {
      box-shadow: 0 1px 4px rgba(255, 255, 255, 0.1);
    }
    
    .sensor-label {
      color: #8c8c8c;
      margin-right: 8px;
      min-width: 130px;
      font-weight: 500;
      
      &::before {
        content: '▪';
        color: #1890ff;
        margin-right: 6px;
      }
    }
    
    .sensor-value {
      color: #d9d9d9;
      font-weight: 600;
      font-size: 14px;
      
      &.warning-value {
        color: #ff7875;
        animation: pulse-value 2s infinite;
      }
    }
    
    .sensor-level {
      margin-left: 8px;
      color: #595959;
      font-size: 12px;
    }
  }
  
  @keyframes pulse-value {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
</style>

