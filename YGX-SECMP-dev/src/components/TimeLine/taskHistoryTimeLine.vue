<template>
  <div class="audit-record-table">
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :row-key="(_record, index) => index"
      bordered
      size="middle"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          <span :class="getRowClass(record, index)">{{ index + 1 }}</span>
        </template>
        <template v-else-if="column.key === 'taskName'">
          <span :class="getRowClass(record, index)">{{ record.taskName || '/' }}</span>
        </template>
        <template v-else-if="column.key === 'assigneeName'">
          <span :class="getRowClass(record, index)">{{ record.assigneeName || '/' }}</span>
        </template>
        <template v-else-if="column.key === 'comment'">
          <span :class="getRowClass(record, index)">{{ record.comment || '/' }}</span>
        </template>
        <template v-else-if="column.key === 'startTime'">
          <span :class="getRowClass(record, index)">{{ record.startTime || '/' }}</span>
        </template>
        <template v-else-if="column.key === 'endTime'">
          <span :class="getRowClass(record, index)">{{ record.endTime || '/' }}</span>
        </template>
        <template v-else-if="column.key === 'duration'">
          <span :class="getRowClass(record, index)">{{ formatDuration(record) }}</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
interface TimeLineItem {
  startTime?: string;
  endTime?: string;
  assigneeName?: string;
  taskName?: string;
  comment?: string;
  [key: string]: any;
}

interface Props {
  data?: TimeLineItem[];
}

withDefaults(defineProps<Props>(), {
  data: () => [],
});

// 表格列定义
const columns = [
  {
    title: '序号',
    key: 'index',
    width: 80,
    align: 'center',
  },
  {
    title: '流程节点',
    key: 'taskName',
    dataIndex: 'taskName',
    width: 150,
  },
  {
    title: '审核意见',
    key: 'comment',
    dataIndex: 'comment',
    ellipsis: true,
  },
  {
    title: '审核人',
    key: 'assigneeName',
    dataIndex: 'assigneeName',
    width: 150,
  },
  {
    title: '节点开始时间',
    key: 'startTime',
    dataIndex: 'startTime',
    width: 180,
  },
  {
    title: '节点结束时间',
    key: 'endTime',
    dataIndex: 'endTime',
    width: 180,
  },
  {
    title: '审核时长',
    key: 'duration',
    width: 100,
    align: 'center',
  },
];

// 获取行样式类
const getRowClass = (record: TimeLineItem, index: number) => {
  let className='';

  // 第一条记录（index = 0）是最新的，显示绿色
  if (record.endTime) {
    className='task-approved';
  }
  
  // 如果包含"驳回"，显示红色
  if (record.type==2) {
    className='task-rejected';
  }

//已通过的节点，显示黑色
  if (!record.endTime) {
    className='task-current';
  }
  
  return className;
};

// 计算时长
const formatDuration = (record: TimeLineItem) => {
  if (!record.startTime || !record.endTime) {
    return '/';
  }
  
  try {
    const start = new Date(record.startTime).getTime();
    const end = new Date(record.endTime).getTime();
    const diff = end - start;
    
    if (diff < 0) return '/';
    
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}天${hours % 24}时`;
    } else if (hours > 0) {
      return `${hours}时${minutes % 60}分`;
    } else if (minutes > 0) {
      return `${minutes}分`;
    } else {
      return '0分';
    }
  } catch (error) {
    console.error('计算时长失败:', error);
    return '/';
  }
};
</script>

<style lang="less" scoped>
.audit-record-table {
  width: 100%;
  
  :deep(.ant-table) {
    font-size: 14px;
    
    .ant-table-thead > tr > th {
      background-color: #fafafa;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      text-align: center;
    }
    
    .ant-table-tbody > tr > td {
      color: rgba(0, 0, 0, 0.65);
    }
    
    .ant-table-tbody > tr:hover > td {
      background-color: #f5f5f5;
    }
  }
  
  // 任务状态样式
  .task-current {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
  }
  
  .task-approved {
    color: #52c41a;
    font-weight: 500;
  }
  
  .task-rejected {
    color: #ff4d4f;
    font-weight: 500;
  }
}
</style>
