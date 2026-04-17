<template>
  <div class="timeline-flow-container">
    <!-- 流程图片区域 -->
    <div class="flow-img" v-if="viewFlowImageUrl">
      <a-image
        :width="'100%'"
        :src="viewFlowImageUrl"
        :fallback="fallbackImage"
        :preview="true"
      >
        <template #placeholder>
          <div class="image-placeholder">
            <PictureOutlined :style="{ fontSize: '50px', color: '#bfbfbf' }" />
          </div>
        </template>
      </a-image>
    </div>
    
    <!-- 审核记录表格 -->
    <div class="audit-table-wrapper">
      <TaskHistoryTimeLine :data="historyList" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { PictureOutlined } from '@ant-design/icons-vue';
import TaskHistoryTimeLine from './taskHistoryTimeLine.vue';
import { getTimeLineData, getTimeLineImg } from '/@/api/common/timeLine';

// 定义 props
interface Props {
  data?: Record<string, any>;
  dialog?: {
    id?: string;
    [key: string]: any;
  };
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  dialog: () => ({}),
});

// 定义响应式数据
const route = useRoute();
const viewFlowImageUrl = ref<string>('');
const historyList = ref<any[]>([]);
const id = ref<string>('');
const isLoading = ref<boolean>(false); // 添加加载标志，防止重复加载

// 默认的占位图片
const fallbackImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

// 初始化方法
const init = async () => {
  // 防止重复加载
  if (isLoading.value) {
    console.log('正在加载中，跳过重复请求');
    return;
  }
  
  console.log('开始初始化，businessId:', id.value);
  isLoading.value = true;
  
  try {
    // 先获取历史数据（表格）
    await getHistory();
    // 再获取流程图片
    getFlowImage();
  } finally {
    // 使用 setTimeout 延迟重置，确保短时间内的重复调用被拦截
    setTimeout(() => {
      isLoading.value = false;
      console.log('初始化完成，重置加载标志');
    }, 500);
  }
};

// 获取历史数据
const getHistory = async () => {
  try {
    console.log('开始获取审核记录，businessId:', id.value);
    const res = await getTimeLineData({ businessId: id.value });
    console.log('审核记录原始数据:', res);
    
    if (res && res.length) {
      const data = res;
      // 反转数组，最新的在最上面
      data.reverse();
      historyList.value = data;
      console.log('审核记录处理后:', historyList.value);
    } else {
      console.warn('审核记录数据为空');
      historyList.value = [];
    }
  } catch (error) {
    console.error('获取审核记录失败:', error);
    historyList.value = [];
  }
};

// 获取流程图片
const getFlowImage = () => {
  getTimeLineImg({ businessId: id.value })
    .then((result: any) => {
      if (result.code === 500) {
        message.error(result.msg);
      } else {
        viewFlowImageUrl.value = window.URL.createObjectURL(result);
      }
    })
    .catch((err: any) => {
      console.error('获取流程图片失败:', err);
    });
};

// 生命周期
onMounted(() => {
  viewFlowImageUrl.value = '';

  console.log('timeFlow onMounted - route.query:', route.query);
  console.log('timeFlow onMounted - props.dialog:', props.dialog);

  // 优先从路由获取 id
  if (route.query && route.query.id) {
    id.value = route.query.id as string;
  } else {
    id.value = props.dialog.id || '';
  }

  // 只在 onMounted 中初始化一次
  if (id.value) {
    init();
  }
});

// 监听 props.dialog.id 的变化（不使用 immediate，避免与 onMounted 重复调用）
// 这个 watch 用于处理组件已挂载后，dialog.id 动态变化的情况
watch(
  () => props.dialog.id,
  (newId, oldId) => {
    console.log('timeFlow watch - dialog.id 变化:', { newId, oldId, current: id.value });
    // 只有当 id 真正发生变化时才重新加载
    // oldId 存在说明不是组件初始化，而是后续的变化
    if (newId && oldId !== undefined && newId !== id.value) {
      id.value = newId;
      init();
    }
  }
);
</script>

<style lang="less" scoped>
.timeline-flow-container {
  width: 100%;
  padding: 0;
}

.flow-img {
  width: 100%;
  margin-bottom: 24px;
  
  :deep(.ant-image) {
    min-height: 300px;
    width: 100%;
  }
}

.image-placeholder {
  height: 300px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.audit-table-wrapper {
  width: 100%;
}
</style>
