<template>
  <div class="regional-handling-progress">
    <div class="card-header-box">
      <span class="card-title">区域处置进度</span>
      <!-- <div class="toggle-group">
        <span 
          :class="['toggle-item', activeTab === 'region' ? 'active' : '']"
          @click="activeTab = 'region'"
        >
          区域
        </span>
        <span 
          :class="['toggle-item', activeTab === 'street' ? 'active' : '']"
          @click="activeTab = 'street'"
        >
          街道
        </span>
      </div> -->
    </div>
    <div class="card-content">
      <div class="table-header">
        <div class="header-cell rank">排名</div>
        <div class="header-cell">区域</div>
        <div class="header-cell">预警总数</div>
        <div class="header-cell">预警处置</div>
        <div class="header-cell">处置率</div>
      </div>
      <div class="table-body">
        <div 
          class="table-row" 
          v-for="(item, index) in progressList" 
          :key="index"
        >
          <div class="table-cell rank">
            <span :class="['rank-badge', `rank-${index + 1}`]">
              {{ index + 1 }}
            </span>
          </div>
          <div class="table-cell">{{ item.areaName }}</div>
          <div class="table-cell">{{ item.totalCount }}</div>
          <div class="table-cell">{{ item.verifyCount }}</div>
          <div class="table-cell">
            <div class="progress-wrapper">
              <!-- <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${item.verifyRatio * 100}%` }"
                ></div>
              </div> -->
              <span class="progress-text">{{ item.verifyRatio }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { areaDisposalProgress } from '../api';

const activeTab = ref<'region' | 'street'>('region');

interface ProgressItem {
  areaName: string;
  totalCount: number;
  verifyCount: number;
  verifyRatio: number;
}

const progressList = ref<ProgressItem[]>([]);
const getAreaDisposalProgress = async () => {
  const res = await areaDisposalProgress({});
  if(res){
    progressList.value = res;
  }
};
onMounted(() => {
  getAreaDisposalProgress();
});
</script>

<style lang="less" scoped>
.regional-handling-progress {
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
    
    .toggle-group {
      display: flex;
      gap: 8px;
      
      .toggle-item {
        padding: 4px 12px;
        font-size: 13px;
        color: #87ceeb;
        cursor: pointer;
        border-radius: 2px;
        transition: all 0.3s;
        
        &.active {
          color: #fff;
          background: rgba(64, 169, 255, 0.3);
        }
        
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  
  .card-content {
    .table-header {
      display: grid;
      grid-template-columns: 60px 120px 70px 70px 70px;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      .header-cell {
        font-size: 13px;
        color: #87ceeb;
        font-weight: 500;
        
        &.rank {
          text-align: center;
        }
      }
    }
    
    .table-body {
      .table-row {
        display: grid;
        grid-template-columns: 60px 120px 70px 70px 70px;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        
        &:last-child {
          border-bottom: none;
        }
        
        .table-cell {
          font-size: 13px;
          color: #fff;
          display: flex;
          align-items: center;
          
          // 区域列特殊处理，允许长文本显示
          &:nth-child(2) {
            min-width: 0; // 允许文本溢出
            word-break: break-all; // 允许长单词换行
            overflow-wrap: break-word; // 允许在单词内换行
          }
          
          &.rank {
            justify-content: center;
            
            .rank-badge {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              font-size: 12px;
              font-weight: 600;
              
              &.rank-1 {
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                color: #000;
              }
              
              &.rank-2 {
                background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
                color: #000;
              }
              
              &.rank-3 {
                background: linear-gradient(135deg, #cd7f32, #e6a85c);
                color: #fff;
              }
              
              &.rank-4,
              &.rank-5 {
                background: rgba(64, 169, 255, 0.2);
                color: #40a9ff;
              }
            }
          }
          
          .progress-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            
            .progress-bar {
              flex: 1;
              height: 8px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
              overflow: hidden;
              
              .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #40a9ff, #52c41a);
                border-radius: 4px;
                transition: width 0.3s;
              }
            }
            
            .progress-text {
              font-size: 12px;
              color: #40a9ff;
              min-width: 35px;
              text-align: right;
            }
          }
        }
      }
    }
  }
}
</style>

