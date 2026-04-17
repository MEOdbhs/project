<template>
  <a-card :bordered="false" class="safety-commitment-card">
    <template #title>
      <div class="card-header-box">
        <span>安全生产承诺公告</span>
        <div v-if="props.pageType === 'pageConfig'" class="card-actions">
          <Icon icon="ant-design:swap-outlined" class="action-icon" @click="handleReplace" />
          <Icon icon="ant-design:delete-outlined" class="action-icon" @click="handleDelete" />
        </div>
      </div>
    </template>
    
    <div class="filter-section">
      <a-date-picker
        v-model:value="filters.year"
        placeholder="选择年份"
        picker="year"
        valueFormat="YYYY"
        format="YYYY"
        style="width: 100px"
        @change="handleChange"
        allow-clear
      />
      
      <a-select
        v-model:value="filters.releaseType"
        placeholder="发布状态"
        style="width: 120px"
        @change="handleChange"
        allow-clear
      >
        <a-select-option value="1">已发布</a-select-option>
        <a-select-option value="0">未发布</a-select-option>
      </a-select>
      
      <a-input
        v-model:value="filters.name"
        placeholder="企业名称"
        style="width: 200px"
        allow-clear
        @change="handleChange"
      />
    </div>
    
    <div class="table-section">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        size="small"
        :scroll="{ y: 200 }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'releaseType'">
            <a-tag :color="record.releaseType === '1' ? 'green' : 'default'">
              {{ record.releaseType === '1' ? '已发布' : '未发布' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button type="link" size="small" @click="handleView(record)">
              查看
            </a-button>
          </template>
        </template>
      </a-table>
    </div>
    <a-modal
      v-model:open="detailVisible"
      title="安全承诺详情"
      :footer="null"
      width="680px"
      destroy-on-close
    >
    <div class="detail-content">
      <a-spin :spinning="detailLoading">
        <a-descriptions v-if="detailData" bordered :column="1" size="small">
          <a-descriptions-item label="公告名称">
            {{ detailData.noticeName || '—' }}
          </a-descriptions-item>
          <!-- <a-descriptions-item label="发布时间">
            {{ detailData.noticeDate || '—' }}
          </a-descriptions-item> -->
          <a-descriptions-item label="发布状态">
            {{ detailData.releaseType === '1' ? '已发布' : '未发布' }}
          </a-descriptions-item>
          <a-descriptions-item label="承诺内容">
            <div class="detail-content" v-html="detailData.noticeContent || detailData.content || '暂无内容'"></div>
          </a-descriptions-item>
          <a-descriptions-item label="附件">
            <FileUploadRecord v-model:value="detailData.fileIds as unknown as string[]" :bizId="detailData.id as string"
                :readonly="true" />
            <!-- <div class="detail-content" v-html="detailData.noticeContent || detailData.content || '暂无内容'"></div> -->
          </a-descriptions-item>
        </a-descriptions>
        <div v-else class="detail-empty">暂无数据</div>
      </a-spin>
    </div>
      
    </a-modal>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
import FileUploadRecord from '/@/components/FileUpload/FileUploadRecord.vue';
import { getSafeNotice, getSafeNoticeViewById } from '../line.api';


type PageType = 'workbench' | 'pageConfig';

interface Filters {
  year?: string;
  releaseType?: string;
  name?: string;
}

interface SafetyNoticeItem {
  index: number;
  enterpriseName: string;
  noticeDate: string;
  releaseType: string;
  id?: string | number;
}

interface SafeNoticeApiItem {
  enterpriseName: string;
  noticeDate: string;
  releaseType: string;
  id?: string | number;
  [key: string]: unknown;
}

const props = defineProps<{
  pageType: PageType;
  workbenchType: 'enterprise' | 'supervision';
}>();

const emit = defineEmits(['replace', 'delete']);

const filters = reactive<Filters>({
  year: undefined,
  releaseType: undefined,
  name: undefined,
});

const columns: TableColumnType<SafetyNoticeItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    align: 'center' as const,
  },
  {
    title: '企业名称',
    dataIndex: 'enterpriseName',
    key: 'enterpriseName',
    ellipsis: true,
  },
  {
    title: '发布时间',
    dataIndex: 'noticeDate',
    key: 'noticeDate',
    width: 160,
    align: 'center' as const,
  },
  {
    title: '发布状态',
    dataIndex: 'releaseType',
    key: 'releaseType',
    width: 100,
    align: 'center' as const,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    align: 'center' as const,
  },
];

const tableData = ref<SafetyNoticeItem[]>([]);
const detailVisible = ref(false);
const detailLoading = ref(false);
const detailData = ref<Record<string, unknown> | null>(null);

const handleChange = () => {
  getSafeNoticeData();
};

const handleReplace = () => {
  emit('replace');
};

const handleDelete = () => {
  emit('delete');
};

const handleView = async (record: SafetyNoticeItem) => {
  
  if (!record.id) {
    detailData.value = { ...record };
    detailVisible.value = true;
    return;
  }
  detailVisible.value = true;
  detailLoading.value = true;
  try {
    const res = await getSafeNoticeViewById({ id: record.id });
    detailData.value = res || null;
  } catch (error) {
    detailData.value = null;
  } finally {
    detailLoading.value = false;
  }
};

const getSafeNoticeData = async () => {
  const res = await getSafeNotice({
    ...filters
  });

  if (res) {
    tableData.value = res.map((item: SafeNoticeApiItem, index: number) => ({
      index: index + 1,
      enterpriseName: item.enterpriseName,
      noticeDate: item.noticeDate,
      releaseType: item.releaseType,
      id: item.id,
    }));
  }
};

onMounted(() => {
  getSafeNoticeData();
});
</script>

<style lang="less" scoped>
.safety-commitment-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #0b1c36;

  :deep(.ant-card-body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .card-header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
      color: #fff;
      font-size: 16px;
      font-weight: 500;
    }
    
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
  
  .filter-section {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  

  .table-section {
    flex: 1;
    min-height: 0;
    overflow: hidden;

    :deep(.ant-table) {
      background-color: transparent;
      color: #fff;
      
      .ant-table-thead > tr > th {
        background-color: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.85);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .ant-table-tbody > tr > td {
        background-color: transparent;
        color: rgba(255, 255, 255, 0.85);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .ant-table-tbody > tr:hover > td {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
    
    :deep(.ant-table-body) {
      max-height: 100%;
      overflow-y: auto;
      padding-bottom: 12px;
      box-sizing: border-box;
    }

    :deep(.ant-input),
    :deep(.ant-select-selector) {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: #fff;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
    }
    
    :deep(.ant-select-arrow) {
      color: rgba(255, 255, 255, 0.65);
    }
    
    :deep(.ant-btn-link) {
      color: #1890ff;
      padding: 0;
    }
  }
}

:deep(.detail-content) {
  line-height: 1.6;
  word-break: break-all;

  :deep(p) {
    margin-bottom: 8px;
  }
}

:deep(.detail-empty) {
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
  padding: 32px 0;
}

.detail-content {
    padding: 16px;
  }
</style>
