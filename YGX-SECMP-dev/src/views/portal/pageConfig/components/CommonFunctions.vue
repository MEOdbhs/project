<template>
  <a-card :bordered="false" class="common-functions-card">
    <template #title>
      <div class="card-header-box">
        <span>常用功能</span>
        <div v-if="props.pageType === 'pageConfig'" class="card-actions">
          <Icon icon="ant-design:swap-outlined" class="action-icon" @click="handleReplace" />
          <Icon icon="ant-design:delete-outlined" class="action-icon" @click="handleDelete" />
        </div>
      </div>
    </template>
    
    <div class="functions-grid">
      <div 
        class="function-item" 
        v-for="(item, index) in functionsData" 
        :key="index"
        @click="handleFunctionClick(item)"
      >
        <div class="function-icon">
          <Icon size="30" :icon="item.icon" />
        </div>
        <div class="function-label">{{ item.label }}</div>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { ref,computed } from 'vue';
import { Icon } from '/@/components/Icon';
import { useUserStore } from '/@/store/modules/user';
import { useRouter } from 'vue-router';

const router = useRouter();
interface FunctionItem {
  icon: string;
  label: string;
  path?: string;
}

const props = defineProps<{
  pageType: 'workbench' | 'pageConfig';
  workbenchType: 'enterprise' | 'supervision';
}>();

// 模拟数据
const emit = defineEmits(['replace', 'delete']);
const userStore = useUserStore();
const functions = ref<FunctionItem[]>([
  {
    icon: 'ant-design:bell-outlined',
    label: '消息通知',
    path: '/system/notice'
  },
  {
    icon: 'ant-design:warning-outlined',
    label: '危险化学品',
    path: '/chemicalsDangerous'
  },
  {
    icon: 'ant-design:experiment-outlined',
    label: '危险化化工工艺',
    path: '/chemicalProcess'
  },
  {
    icon: 'ant-design:thunderbolt-outlined',
    label: '危险源管理',
    path: '/hSManagement'
  },
  {
    icon: 'ant-design:dashboard-outlined',
    label: '安全监测设备',
    path: '/safetyDeviceWatch'
  },
  {
    icon: 'ant-design:file-text-outlined',
    label: '设备健康档案',
    path: '/deviceHealthDoc'
  },
  {
    icon: 'ant-design:radar-chart-outlined',
    label: '危险源在线监测',
    path: '/hsOnlineWatch'
  }
]);

const functionsData = computed(() => {
  if (props.workbenchType === 'supervision') {
    // return [...functions.value, {
    //   icon: 'ant-design:video-camera-outlined',
    //   label: '视频监控',
    //   path: '/videoSurveillance/ImageMonitoring'
    // }];
    return [...functions.value, {
      icon: 'ant-design:dashboard-outlined',
      label: '企业统计分析',
      path: '/enterprise/statisticAnalysis'
    }];
  } else {
    return [...functions.value];
  }
})

const handleReplace = () => {
  emit('replace');
};

const handleDelete = () => {
  emit('delete');
};

const handleFunctionClick = (item: FunctionItem) => {
  if (item.path && props.pageType === 'workbench') {
    router.push(item.path);
  }
};
</script>

<style lang="less" scoped>
.common-functions-card {
  height: 100%;
  background-color: #0b1c36;
  overflow-y: auto;
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
        
        &:hover {
          color: #40a9ff;
        }
      }
    }
  }
  
  .functions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  
  .function-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 8px;
    border: 1px solid #303030;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      border-color: #1890ff;
      // background-color: #f0f7ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
    }
    
    .function-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      font-size: 24px;
      color: #fff;
      
      :deep(.anticon) {
        font-size: 24px;
      }
    }
    
    .function-label {
      font-size: 13px;
      color: #fff;
      text-align: center;
    }
  }
}
</style>
