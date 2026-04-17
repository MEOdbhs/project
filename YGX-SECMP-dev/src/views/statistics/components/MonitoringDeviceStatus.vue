<template>
  <div class="monitoring-device-status">
    <div class="card-header-box">
      <span class="card-title">监测设备状态</span>
      <!-- <div class="search-box">
        <Icon icon="ant-design:search-outlined" class="search-icon" />
        <input 
          type="text" 
          placeholder="设备名称" 
          class="search-input"
          v-model="searchKeyword"
        />
      </div> -->
    </div>
    <div class="card-content">
      <div class="stats-grid">
        <div class="stat-card" v-for="(item, index) in deviceStats" :key="index">
          <Icon :icon="item.icon" size="30" class="stat-icon" />
          <div class="stat-value-container">
            <div class="stat-label">{{ item.label }}</div>
            <div class="stat-value">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Icon } from '/@/components/Icon';
import { monitorDeviceStatistics } from '../api';

const searchKeyword = ref('');

interface DeviceStat {
  label: string;
  value: string | number;
  icon: string;
}

interface SnMonitorDeviceStatisticsPo {
  videoDeviceNum: number;
  sensorsDeviceNum: number;
  onlineDeviceNum: number;
  offlineDeviceNum: number;
  abnormalDeviceNum: number;
  onlineRate: string;
  timestamp: number;
}

const deviceStats = ref<DeviceStat[]>([
  {
    label: '视频设备',
    value: 0,
    icon: 'ant-design:camera-outlined'
  },
  {
    label: '传感器设备',
    value: 0,
    icon: 'ant-design:radar-chart-outlined'
  },
  {
    label: '在线设备',
    value: 0,
    icon: 'ant-design:cloud-server-outlined'
  },
  {
    label: '离线设备',
    value: 0,
    icon: 'ant-design:disconnect-outlined'
  },
  {
    label: '设备在线率',
    value: '0%',
    icon: 'ant-design:percentage-outlined'
  }
]);

// 获取监测设备统计数据
const fetchDeviceStatistics = async () => {
  try {
    const res = await monitorDeviceStatistics({});
    if (res ) {
      const data: SnMonitorDeviceStatisticsPo = res;
      deviceStats.value = [
        {
          label: '视频设备',
          value: data.videoDeviceNum || 0,
          icon: 'ant-design:camera-outlined'
        },
        {
          label: '传感器设备',
          value: data.sensorsDeviceNum || 0,
          icon: 'ant-design:radar-chart-outlined'
        },
        {
          label: '在线设备',
          value: data.onlineDeviceNum || 0,
          icon: 'ant-design:cloud-server-outlined'
        },
        {
          label: '离线设备',
          value: data.offlineDeviceNum || 0,
          icon: 'ant-design:disconnect-outlined'
        },
        {
          label: '设备在线率',
          value: data.onlineRate || '0%',
          icon: 'ant-design:percentage-outlined'
        }
      ];
    }
  } catch (error) {
    console.error('获取监测设备统计数据失败:', error);
  }
};

onMounted(() => {
  fetchDeviceStatistics();
});
</script>

<style lang="less" scoped>
.monitoring-device-status {
  background: rgba(11, 28, 54, 0.6);
  border: 1px solid rgba(64, 169, 255, 0.3);
  border-radius: 4px;
  padding: 16px;
  margin-top: 6px;
  
  .card-header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }
    
    .search-box {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(64, 169, 255, 0.3);
      border-radius: 4px;
      padding: 6px 12px;
      gap: 8px;
      
      .search-icon {
        font-size: 16px;
        color: #87ceeb;
      }
      
      .search-input {
        background: transparent;
        border: none;
        outline: none;
        color: #fff;
        font-size: 14px;
        width: 120px;
        
        &::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
  
  .card-content {
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      
      .stat-card {
        background: rgba(11, 28, 54, 0.8);
        border: 1px solid rgba(64, 169, 255, 0.3);
        border-radius: 4px;
        padding: 16px;
        text-align: center;
        display: flex;
        // flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        
        .stat-label {
          font-size: 14px;
          color: #fff;
          margin-bottom: 0;
        }
        .stat-value-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .stat-icon {
          font-size: 32px;
          color: #00ff00;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #00ff00;
        }
      }
    }
  }
}
</style>

