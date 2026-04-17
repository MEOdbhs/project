<template>
  <div class="key-area-monitoring" ref="containerRef" :class="{ 'is-fullscreen': isFullscreen }">
    <div class="card-header-box">
      <span class="card-title">重点区域监控</span>
      <div class="header-controls">
        <button class="control-btn"  @click="prevPage"  :disabled="currentPage === 1">
          上一页
        </button>
        <span class="page-info">{{ currentPage }}/{{ totalPages }}</span>
        <button 
          class="control-btn" 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
        >
          下一页
        </button>
        <!-- <button 
          class="control-btn" 
          @click="toggleCarousel"
          :class="{ active: !isPaused }"
        >
          {{ isPaused ? '开始轮巡' : '暂停轮巡' }}
        </button> -->
        <button 
          v-if="!isFullscreen" 
          class="control-btn" 
          @click="handleFullScreen"
        >
          全屏
        </button>
        <button 
          v-if="isFullscreen" 
          class="control-btn exit-fullscreen-btn" 
          @click="exitFullScreen"
        >
          退出全屏
        </button>
        <button 
          class="control-btn" 
          @click="goToVideoView"
        >
          视频监控
        </button>
      </div>
    </div>
    <div class="card-content" v-loading="loading">
      <div class="image-grid">
        <div 
          class="image-item" 
          v-for="(item, index) in currentVideos" 
          :key="`video-${currentPage}-${index}-${item.code || 'empty'}`"
        >
          <div class="item-title" v-if="item.code">
            {{ getDisplayName(item) }}
          </div>
          <!-- <VideoItem
            v-if="item.code"
            :key="`player-${currentPage}-${index}-${item.code}`"
            :player-id="`key-area-player-${currentPage}-${index}-${Date.now()}`"
            :node-code="item.code"
            :type="0"
            :width="item.width"
            :height="item.height"
          /> -->
          <div v-else class="image-placeholder">
            <Icon icon="ant-design:video-camera-outlined" class="camera-icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 视频监控弹窗 -->
  <!-- <a-modal
    v-if="videoViewModalVisible"
    v-model:open="videoViewModalVisible"
    :width="'100vw'"
    :style="{ top: 0, paddingBottom: 0, margin: 0 }"
    :bodyStyle="{ padding: 0, height: '100vh' }"
    :footer="null"
    :closable="true"
    :maskClosable="false"
    :destroyOnClose="true"
    wrapClassName="video-view-modal-wrap"
    @cancel="closeVideoViewModal"
  >
    <VideoView v-if="videoViewModalVisible" />
  </a-modal> -->
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '/@/components/Icon';
import { message } from 'ant-design-vue';
// import VideoItem from '/@/views/videoSurveillance/videoView/components/videoItem.vue';
// import VideoView from '/@/views/videoSurveillance/videoView/index.vue';
import { listPage } from '/@/views/safeBasic/device-basic/videoWatchDevice/line.api';


interface VideoItem {
  id?: string;
  code?: string;
  name?: string;
  collieryName?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}

const currentPage = ref(1);
const totalPages = ref(1);
const isPaused = ref(false);
const pageSize = 4; // 改为4，2x2布局
const isFullscreen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const loading = ref(false);
const currentVideos = ref<VideoItem[]>([]);
const total = ref(0);
const videoViewModalVisible = ref(false);
const router = useRouter();

// 获取显示名称：collieryName : name
const getDisplayName = (item: VideoItem) => {
  if (!item.code) return '';
  const parts: string[] = [];
  if (item.collieryName) {
    parts.push(item.collieryName);
  }
  if (item.name) {
    parts.push(item.name);
  }
  return parts.length > 0 ? parts.join(' : ') : '';
};

// 获取视频列表
const fetchVideoList = async () => {
  loading.value = true;
  // 先清空当前视频列表，确保旧组件被销毁，停止正在播放的视频
  currentVideos.value = [];
  // 等待一下确保 DOM 更新，旧组件被销毁
  await new Promise(resolve => setTimeout(resolve, 50));
  
  try {
    const res = await listPage({
      pageNo: currentPage.value,
      pageSize: pageSize,
      areaType: 0, // 重点区域
    });
    
    // 处理返回数据，适配不同的返回格式
    const items = res?.items || res?.records || res?.list || (Array.isArray(res) ? res : []);
    const totalCount = res?.total || res?.totalCount || items.length;
    
    currentVideos.value = items.map((item: any) => ({
      ...item,
      width: undefined, // 让组件自适应
      height: undefined,
    }));
    
    total.value = totalCount;
    totalPages.value = Math.ceil(totalCount / pageSize) || 1;
    
    // 如果当前页没有数据，确保至少有4个空位（2x2布局）
    while (currentVideos.value.length < pageSize) {
      currentVideos.value.push({});
    }
  } catch (error) {
    console.error('获取视频列表失败:', error);
    message.error('获取视频列表失败');
    currentVideos.value = Array.from({ length: pageSize }, () => ({}));
  } finally {
    loading.value = false;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchVideoList();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchVideoList();
  }
};

const toggleCarousel = () => {
  isPaused.value = !isPaused.value;
};

// 检查是否全屏
const checkFullscreen = () => {
  const doc = document as any;
  isFullscreen.value = !!(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );
};

// 进入全屏 - 打开视频监控弹窗
const handleFullScreen = async () => {
  // 全屏时打开视频监控弹窗（显示 videoView/index）
  openVideoViewModal();
};

// 退出全屏 - 关闭视频监控弹窗
const exitFullScreen = async () => {
  closeVideoViewModal();
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  checkFullscreen();
};

// 跳转到视频监控页面
const goToVideoView = () => {
  router.push('/videoSurveillance/videoView');
};

// 打开视频监控弹窗（全屏时使用）
const openVideoViewModal = () => {
  videoViewModalVisible.value = true;
  isFullscreen.value = true; // 设置全屏状态，用于显示"退出全屏"按钮
};

// 关闭视频监控弹窗
const closeVideoViewModal = () => {
  videoViewModalVisible.value = false;
  isFullscreen.value = false; // 重置全屏状态
};

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);
  // 初始加载数据
  fetchVideoList();
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
});
</script>

<style lang="less" scoped>

.video-page{
  width: 100vw;
  height: 100%;
}

:deep(.video-view-modal-wrap) {
  .ant-modal {
    max-width: 100vw !important;
    width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    height: 100vh !important;
    border-radius: 0 !important;
    
    .ant-modal-content {
      height: 100vh !important;
      width: 100vw !important;
      display: flex;
      flex-direction: column;
      border-radius: 0 !important;
      margin: 0 !important;
      
      .ant-modal-header {
        padding: 12px 16px;
        border-bottom: 1px solid #f0f0f0;
      }
      
      .ant-modal-body {
        flex: 1;
        padding: 0 !important;
        margin: 0 !important;
        overflow: hidden;
        height: calc(100vh - 55px) !important;
      }
    }
  }
  
  .ant-modal-mask {
    background-color: rgba(0, 0, 0, 0.45);
  }
}

.key-area-monitoring {
  background: rgba(11, 28, 54, 0.6);
  border: 1px solid rgba(64, 169, 255, 0.3);
  border-radius: 4px;
  padding: 16px;
  position: relative;
  overflow-y: auto;
  
  &.is-fullscreen {
    width: 100vw;
    height: 100vh;
    margin: 0;
    border-radius: 0;
    padding: 24px;
    display: flex;
    flex-direction: column;
    background: rgba(11, 28, 54, 0.95);
    
    .card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      
      .image-grid {
        flex: 1;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 16px;
        
        .image-item {
          .image-placeholder {
            .camera-icon {
              font-size: 48px;
            }
          }
        }
      }
    }
  }
  
  .card-header-box {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }
    
    .header-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .control-btn {
        padding: 4px 10px;
        background: rgba(64, 169, 255, 0.2);
        border: 1px solid rgba(64, 169, 255, 0.3);
        border-radius: 4px;
        color: #40a9ff;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s;
        white-space: nowrap;
        
        &:hover:not(:disabled) {
          background: rgba(64, 169, 255, 0.3);
          border-color: rgba(64, 169, 255, 0.5);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        &.active {
          background: rgba(64, 169, 255, 0.4);
          color: #fff;
        }
        
        &.exit-fullscreen-btn {
          background: rgba(255, 77, 79, 0.2);
          border-color: rgba(255, 77, 79, 0.3);
          color: #ff4d4f;
          
          &:hover {
            background: rgba(255, 77, 79, 0.3);
            border-color: rgba(255, 77, 79, 0.5);
            color: #fff;
          }
        }
      }
      
      .page-info {
        color: #87ceeb;
        font-size: 12px;
        padding: 0 6px;
        white-space: nowrap;
      }
    }
  }
  
  .card-content {
    .image-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4px;
      
      .image-item {
        aspect-ratio: 16 / 9;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(64, 169, 255, 0.3);
        border-radius: 4px;
        overflow: hidden;
        position: relative;
        min-height: 0;
        display: flex;
        flex-direction: column;
        
        .item-title {
          padding: 2px 6px;
          background: rgba(0, 0, 0, 0.6);
          border-bottom: 1px solid rgba(64, 169, 255, 0.3);
          color: #fff;
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-shrink: 0;
          line-height: 1.2;
        }
        
        // videoItem 组件样式
        :deep(.video-item-container) {
          width: 100%;
          flex: 1;
          min-height: 0;
        }
        
        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.3);
          
          .camera-icon {
            font-size: 32px;
          }
        }
      }
    }
  }
}
</style>

