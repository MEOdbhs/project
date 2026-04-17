<template>
  <div 
    ref="containerRef"
    class="alarm-event-list-modal" 
    v-if="visible"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <div class="modal-content">
      <div 
        class="modal-header"
        @mousedown="handleMouseDown"
      >
        <span class="modal-title">预警事件列表</span>
        <Icon 
          icon="ant-design:close-outlined" 
          class="close-icon"
          @click="handleClose"
        />
      </div>
      <div class="modal-body">
        <div class="table-header">
          <div class="header-cell">预警等级</div>
          <div class="header-cell">企业名称</div>
          <div class="header-cell">预警值</div>
          <div class="header-cell">预警时间</div>
        </div>
        <div class="table-body">
          <div 
            class="table-row" 
            v-for="(item, index) in formattedList" 
            :key="index"
            @click="handleItemClick(item)"
          >
            <div class="table-cell">
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
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onBeforeUnmount, watch, nextTick } from 'vue';
import { Icon } from '/@/components/Icon';

interface AlarmEvent {
  id?: string;
  level: string;
  levelText: string;
  enterpriseName: string;
  alarmContent: string;
  alarmTime: string;
  [key: string]: any;
}

const props = defineProps<{
  visible: boolean;
  data: any[];
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'select-alarm', payload: AlarmEvent): void;
}>();

// 拖动相关状态
const position = ref({ x: 100, y: 100 });
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const containerRef = ref<HTMLElement | null>(null);

const formattedList = computed(() => {
  if (!props.data || !Array.isArray(props.data)) {
    return [];
  }
  return props.data.map((item: any) => {
    const id = item.id ?? `${item.orgName || ''}-${item.alarmTime || ''}-${item.warningType || ''}`;
    return {
      id,
      level: item.warningType === '红色预警' ? 'red' : item.warningType === '橙色预警' ? 'orange' : item.warningType === '黄色预警' ? 'yellow' : 'blue',
      levelText: item.warningType,
      enterpriseName: item.orgName,
      alarmContent: item.alarmContent,
      alarmTime: item.alarmTime,
      ...item // 保留原始数据
    };
  });
});

const handleClose = () => {
  emit('update:visible', false);
};

const handleItemClick = (item: AlarmEvent) => {
  emit('select-alarm', item);
  handleClose();
};

// 拖动处理函数
const handleMouseDown = (e: MouseEvent) => {
  // 如果点击的是关闭按钮，不触发拖动
  if ((e.target as HTMLElement).closest('.close-icon')) {
    return;
  }
  
  if (!containerRef.value) return;
  
  isDragging.value = true;
  // 获取父容器位置
  const parentElement = containerRef.value.parentElement;
  if (!parentElement) return;
  
  const parentRect = parentElement.getBoundingClientRect();
  
  // 计算鼠标相对于父容器的位置，再减去弹窗相对于父容器的位置
  dragOffset.value = {
    x: e.clientX - parentRect.left - position.value.x,
    y: e.clientY - parentRect.top - position.value.y
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  e.preventDefault();
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return;
  
  // 获取父容器（MapWithAlarmDetails组件）的位置
  const parentElement = containerRef.value.parentElement;
  if (!parentElement) return;
  
  const parentRect = parentElement.getBoundingClientRect();
  const modalWidth = 800; // 弹窗宽度
  const modalHeight = 400; // 估算弹窗最小高度
  
  // 计算相对于父容器的位置
  const newX = e.clientX - parentRect.left - dragOffset.value.x;
  const newY = e.clientY - parentRect.top - dragOffset.value.y;
  
  // 限制在父容器范围内
  const maxX = parentRect.width - modalWidth;
  const maxY = parentRect.height - modalHeight;
  
  position.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY))
  };
};

const handleMouseUp = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};

// 监听 visible 变化，重置位置
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        // 弹窗打开时，重置到初始位置
        position.value = { x: 100, y: 100 };
      });
    }
  }
);

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style lang="less" scoped>
.alarm-event-list-modal {
  position: absolute;
  z-index: 1000;
  
  .modal-content {
    position: relative;
    width: 800px;
    max-width: 90vw;
    max-height: 80vh;
    background: rgba(11, 28, 54, 0.95);
    border: 1px solid rgba(64, 169, 255, 0.5);
    border-radius: 4px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      cursor: move;
      user-select: none;
      
      .modal-title {
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
    
    .modal-body {
      padding: 16px;
      overflow-y: auto;
      flex: 1;
      
      .table-header {
        display: grid;
        grid-template-columns: 100px 1fr 1fr 200px;
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
        max-height: 500px;
        overflow-y: auto;
        
        .table-row {
          display: grid;
          grid-template-columns: 100px 1fr 1fr 200px;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: background-color 0.2s;
          
          &:hover {
            background-color: rgba(64, 169, 255, 0.1);
          }
          
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
}
</style>

