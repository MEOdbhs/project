<template>
  <div class="enterprise-access-stats">
    <div class="stat-card" v-for="(item, index) in statsList" :key="index">
      <div class="stat-label">{{ item.label }}</div>
      <div class="stat-value-wrapper">
        <span class="stat-value">{{ item.value }}<span class="stat-unit">{{ item.unit ? item.unit : '' }}</span></span>
      </div>
      <div class="stat-change">
        <Icon
          :icon="parseFloat(item.change) < 0 ? 'ant-design:arrow-down-outlined' : 'ant-design:arrow-up-outlined'"
          class="arrow-icon"
          :style="{ color: parseFloat(item.change) < 0 ? '#ff4d4f' : '#52c41a' }"
        />
        <span class="change-value" :style="{ color: parseFloat(item.change) < 0 ? '#ff4d4f' : '#52c41a' }">
          {{ Math.abs(parseFloat(item.change)) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Icon } from '/@/components/Icon';
import { entAccessStatistics } from '../api';

interface StatItem {
  label: string;
  value: string | number;
  unit?: string;
  change: string;
}

const statsList = ref<StatItem[]>([
  {
    label: '接入企业数',
    value: 248,
    change: '5.2%'
  },
  {
    label: '登记企业数',
    value: 312,
    change: '2.1%'
  },
  {
    label: '企业接入率',
    value: 79.5,
    unit: '%',
    change: '1.8%'
  }
]);
const getEntAccessStatistics = async () => {
  const res = await entAccessStatistics({});
  if(res){
    const {accessEntNum,registerEntNum,accessEntRate,accessEntContrastRate,registerEntContrastRate,accessEntRateContrastRate} = res;
    statsList.value = [
      {
        label: '接入企业数',
        value: accessEntNum,
        change: accessEntContrastRate
      },
      
      {
        label: '登记企业数',
        value: registerEntNum,
        change: registerEntContrastRate
      },
      {
        label: '企业接入率',
        value: accessEntRate,
        unit: '%',
        change: accessEntRateContrastRate
      }
    ];
  }
};
onMounted(() => {
  getEntAccessStatistics();
});
</script>

<style lang="less" scoped>
.enterprise-access-stats {
  padding: 16px;
  background: rgba(11, 28, 54, 0.6);
  border: 1px solid rgba(64, 169, 255, 0.3);
  border-radius: 4px;
  display: flex;
  gap: 16px;
  min-height: 190px;
  .stat-card {
    flex: 1;
    background-color: rgba(44, 99, 182, 0.3);
    border: 1px solid rgba(64, 169, 255, 0.3);
    border-radius: 4px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .stat-label {
      font-size: 14px;
      color: #fff;
      margin-bottom: 12px;
    }
    
    .stat-value-wrapper {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 8px;
      
      .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: #fff;
        .stat-unit {
          font-size: 12px;
          color: #fff;
        }
      }
      
      .stat-unit {
        font-size: 14px;
        color: #fff;
      }
    }
    
    .stat-change {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #ff7a00;
      
      .arrow-icon {
        font-size: 14px;
      }
      
      .change-value {
        font-size: 14px;
      }
    }
  }
}
</style>

