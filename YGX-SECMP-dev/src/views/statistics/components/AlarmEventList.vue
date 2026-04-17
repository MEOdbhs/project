<template>
  <div class="alarm-event-list">
    <div class="card-header-box">
      <span class="card-title">预警事件列表</span>
      <span class="more-btn" @click="handleMore">更多</span>
    </div>
    <div class="card-content">
      <div class="table-header">
        <div class="header-cell">预警等级</div>
        <div class="header-cell">企业名称</div>
        <div class="header-cell">预警值</div>
        <div class="header-cell">预警时间</div>
      </div>
      <div class="table-body">
        <div 
          class="table-row" 
          v-for="(item, index) in alarmList" 
          :key="index"
        >
          <div class="table-cell" @click="handleAlarmDetail(item)">
            <span :class="['alarm-level-badge', `level-${item.level}`]">
              {{ item.levelText }}
            </span>
          </div>
          <div class="table-cell">{{ item.enterpriseName }}</div>
          <div class="table-cell">{{ item.warningValue }}</div>
          <div class="table-cell">{{ item.alarmTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { warnEventsList } from '../api';
import { useUserStore } from '/@/store/modules/user';

const userStore = useUserStore();
interface AlarmEvent {
  id: string;
  level: string;
  levelText: string;
  enterpriseName: string;
  alarmContent: string;
  warningValue: string|number;
  alarmTime: string;
  any: any;
}

const alarmList = ref<AlarmEvent[]>([]);
const emit = defineEmits<{
  (e: 'select-alarm', payload: AlarmEvent): void;
}>();

const handleMore = () => {
  console.log('查看更多');
};
const getWarnEventsList = async () => {
  const res = await warnEventsList({});
  if(res){
    alarmList.value = res.map((item: any) => {
      const id = item.id ?? `${item.orgName || ''}-${item.alarmTime || ''}-${item.warningType || ''}`;
      return {
        ...item,
        id,
        level: item.warningType === '红色预警' ? 'red' : item.warningType === '橙色预警' ? 'orange' : item.warningType === '黄色预警' ? 'yellow' : 'blue',
        levelText: item.warningType,
        enterpriseName: item.orgName,
        alarmContent: item.alarmContent,
        warningValue: item.warningValue,
        alarmTime: item.alarmTime
      }
    });
  }
};

const handleAlarmDetail = (item: AlarmEvent) => {
  emit('select-alarm', item);
};
onMounted(() => {
  getWarnEventsList();
});
</script>

<style lang="less" scoped>
.alarm-event-list {
  background: rgba(11, 28, 54, 0.6);
  border: 1px solid rgba(64, 169, 255, 0.3);
  border-radius: 4px;
  padding: 16px;
  overflow-y: auto;
  
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
    
    .more-btn {
      font-size: 14px;
      color: #40a9ff;
      cursor: pointer;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  .card-content {
    .table-header {
      display: grid;
      grid-template-columns: 80px 100px 1fr 150px ;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      .header-cell {
        font-size: 13px;
        color: #87ceeb;
        font-weight: 500;
      }
    }
    
    .table-body {
      max-height: 300px;
      overflow-y: auto;
      
      .table-row {
        display: grid;
        grid-template-columns: 80px 100px 1fr 150px ;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        
        &:last-child {
          border-bottom: none;
        }
        
        .table-cell {
          font-size: 13px;
          color: #fff;
          display: flex;
          align-items: center;
          
          .alarm-level-badge {
            padding: 2px 8px;
            border-radius: 2px;
            font-size: 12px;
            
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
</style>

