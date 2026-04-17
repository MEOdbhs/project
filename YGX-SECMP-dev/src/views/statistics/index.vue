<template>
  <div class="statistics-page">
    <!-- 顶部导航栏 -->
    <div class="header-bar">
      <!-- 左侧返回按钮 -->
      <div class="back-button" @click="handleBack">
        <div class="back-icon-wrapper">
          <Icon icon="ant-design:left-outlined" class="back-icon" />
          <span class="back-dot"></span>
        </div>
        <span class="back-text">返回</span>
      </div>
      
      <!-- 中间标题 -->
      <div class="header-title-box">
        安全生产综合监管一张图
      </div>
      
      <!-- 右侧天气预报 -->
      <div class="header-weather">
        <WeatherWidget />
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="content-area">
      <div class="content-layout">
        <!-- 左侧列 -->
        <div class="left-column">
          <EnterpriseInfoStats class="left-panel stretchable" />
          <EnterpriseAccessStats class="left-panel auto-height" />
          <AlarmLevelProportion class="left-panel auto-height" />
        </div>
        
        <!-- 中间列 -->
        <div class="center-column">
          <div class="map-section">
            <MapWithAlarmDetails
              :alarm-detail="selectedAlarm"
              v-model:visible="alarmPopupVisible"
              @update:visible="handlePopupVisibleChange"
            />
          </div>
          <MonitoringDeviceStatus />
        </div>
        
        <!-- 右侧列 -->
        <div class="right-column">
          <KeyAreaMonitoring class="right-panel auto-height" />
          <AlarmEventList
            class="right-panel stretchable"
            @select-alarm="handleAlarmSelect"
          />
          <RegionalHandlingProgress class="right-panel stretchable" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="statistics-page">
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Icon } from '/@/components/Icon';
  import WeatherWidget from './components/WeatherWidget.vue';
  import EnterpriseInfoStats from './components/EnterpriseInfoStats.vue';
  import EnterpriseAccessStats from './components/EnterpriseAccessStats.vue';
  import AlarmLevelProportion from './components/AlarmLevelProportion.vue';
  import MapWithAlarmDetails from './components/MapWithAlarmDetails.vue';
  import MonitoringDeviceStatus from './components/MonitoringDeviceStatus.vue';
  import KeyAreaMonitoring from './components/KeyAreaMonitoring.vue';
  import AlarmEventList from './components/AlarmEventList.vue';
  import RegionalHandlingProgress from './components/RegionalHandlingProgress.vue';

  const router = useRouter();

  interface SelectedAlarmDetail {
    id?: string;
    level?: string;
    levelText?: string;
    enterpriseName?: string;
    alarmContent?: string;
    alarmTime?: string;
  }

  const selectedAlarm = ref<any>(null);
  const alarmPopupVisible = ref(false);

  const handleBack = () => {
    //router.back();
    router.push('/portal/workbench');
  };

  const handleAlarmSelect = (alarm: SelectedAlarmDetail) => {
    const isSameAlarm =
      selectedAlarm.value &&
      alarm.id &&
      selectedAlarm.value.id === alarm.id;

    if (isSameAlarm && alarmPopupVisible.value) {
      alarmPopupVisible.value = false;
      selectedAlarm.value = null;
      return;
    }

    selectedAlarm.value = { ...alarm };
    alarmPopupVisible.value = true;
  };

  const handlePopupVisibleChange = (visible: boolean) => {
    if (!visible) {
      selectedAlarm.value = null;
    }
  };

  onMounted(() => {});
</script>

<style lang="less" scoped>
  .statistics-page {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(180deg, rgba(11, 28, 54, 0.95) 0%, rgba(11, 28, 54, 0.85) 100%);
    box-sizing: border-box;
  }

  .header-bar {
    position: relative;
    width: 100%;
    height: 80px;
   
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    // 中间装饰条
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent 0%,
        rgba(64, 169, 255, 0.3) 20%,
        rgba(64, 169, 255, 0.6) 50%,
        rgba(64, 169, 255, 0.3) 80%,
        transparent 100%
      );
      box-shadow: 0 0 20px rgba(64, 169, 255, 0.3);
    }
    
    // 左右装饰曲线
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 20px;
      background: radial-gradient(ellipse at center, rgba(64, 169, 255, 0.2) 0%, transparent 70%);
      border-radius: 50%;
    }
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 1;
    
    &:hover {
      opacity: 0.8;
    }
    
    .back-icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      
      .back-icon {
        font-size: 18px;
        color: #40a9ff;
        z-index: 2;
        position: relative;
      }
      
      .back-dot {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        background: #ff7a00;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(255, 122, 0, 0.8), 0 0 12px rgba(255, 122, 0, 0.6);
        animation: pulse 2s infinite;
        z-index: 3;
      }
    }
    
    .back-text {
      font-size: 16px;
      color: #fff;
      font-weight: 400;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(0.9);
    }
  }

  .header-title-box {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32px;
    font-weight: 600;
    color: #fff;
    text-align: center;
    letter-spacing: 2px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  .header-weather {
    z-index: 1;
  }

  .content-area {
    padding: 24px;
    min-height: calc(100vh - 80px);
    box-sizing: border-box;
    
    .content-layout {
      display: flex;
      gap: 16px;
      height: calc(100vh - 128px);
      
      .left-column {
        flex: 0 0 25%;
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 100%;
        overflow: hidden;
        min-width: 0;
        
        :deep(.left-panel) {
          flex: 0 0 auto;
        }

        :deep(.left-panel.stretchable) {
          flex: 1 1 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        :deep(.left-panel.auto-height) {
          flex: 0 0 auto;
          flex-shrink: 0;
          flex-grow: 0;
        }
      }
      
      .center-column {
        flex: 0 0 50%;
        display: flex;
        flex-direction: column;
        min-width: 0;
        
        .map-section {
          flex: 1;
          min-height: 0;
        }
      }
      
      .right-column {
        flex: 0 0 25%;
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 100%;
        overflow-y: auto;
        min-width: 0;
        
        &::-webkit-scrollbar {
          width: 6px;
        }
        
        &::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        &::-webkit-scrollbar-thumb {
          background: rgba(64, 169, 255, 0.3);
          border-radius: 3px;
          
          &:hover {
            background: rgba(64, 169, 255, 0.5);
          }
        }

        :deep(.right-panel) {
          flex: 0 0 auto;
        }

        :deep(.right-panel.stretchable) {
          flex: 1 1 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
</style>
