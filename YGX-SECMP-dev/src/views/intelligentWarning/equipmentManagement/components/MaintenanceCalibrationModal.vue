<template>
  <BasicModal :title="'维护校准记录'" :width="1000" :destroyOnClose="true" @register="registerModal"
    @visible-change="handleVisibleChange">
    <div class="calibration-container">
      <!-- 搜索条件栏 -->
      <div class="search-bar">
        <a-form layout="inline" :colon="false">
          <a-form-item style="margin-right: 16px; margin-bottom: 0;">
           <span>校准时间: </span> <a-range-picker v-model:value="searchParams.dateRange" :placeholder="['开始日期', '结束日期']" format="YYYY-MM-DD"
              style="width: 260px" />
          </a-form-item>
          <a-form-item  style="margin-right: 16px; margin-bottom: 0;">
            <span>状态: </span> <a-select v-model:value="searchParams.status" placeholder="请选择" style="width: 120px">
              <a-select-option value="Y">有效</a-select-option>
              <a-select-option value="N">无效</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item style="margin-bottom: 0;">
            <a-button type="primary" @click="handleSearch">搜索</a-button>
            <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- 数据表格 -->
      <a-table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
        @change="handleTableChange" bordered size="small">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === 'Y' ? 'green' : 'red'">
              {{ record.status === 'Y' ? '有效' : '无效' }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
// 预留接口路径，需根据实际情况调整
import { getCalibrationList, } from '../line.api';

// 表格列定义
const columns = [
  { title: '序号', dataIndex: 'index', width: 60, customRender: ({ index }) => index + 1 },
  { title: '校准时间', dataIndex: 'calibrationTime', width: 160 },
  { title: '有效期至', dataIndex: 'expiryDate', width: 160 },
  { title: '校准人员', dataIndex: 'calibrator', width: 120 },
  { title: '状态', dataIndex: 'status', width: 100, align: 'center' },
];

// 模态框注册
const [registerModal, { closeModal }] = useModalInner(async (data) => {
  
    deviceInfo.value = data.device;
    // console.log(deviceInfo.value,'deviceInfo.valuedeviceInfo.valuedeviceInfo.value');
    console.log('deviceInfo.value');
    fetchCalibrationList();
    // 重置搜索条件并加载数据
    resetSearch();
});

const deviceInfo = ref<any>({});

// 搜索参数
const searchParams = reactive({
  dateRange: null as [string, string] | null,
  status: undefined as string | undefined,
});

// 表格数据
const dataSource = ref<any[]>([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
});

// 模拟获取校准记录数据（实际应调用接口）
const fetchCalibrationList = async () => {
  loading.value = true;
  try {
    // 构建请求参数
    const params: any = {
      id: deviceInfo.value.id,
    };
    // 实际接口调用（替换为真实接口）
    const res = await getCalibrationList(params);
    dataSource.value = res.records;
    pagination.total = res.total;
  } catch (error) {
    message.error('获取校准记录失败');
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.current = 1;
  fetchCalibrationList();
};

// 重置搜索
const resetSearch = () => {
  searchParams.dateRange = null;
  searchParams.status = undefined;
  handleSearch();
};

// 表格翻页
const handleTableChange = (paginationConfig: any) => {
  pagination.current = paginationConfig.current;
  pagination.pageSize = paginationConfig.pageSize;
  fetchCalibrationList();
};

// 弹窗可见性变化时，若可见则加载数据
const handleVisibleChange = (visible: boolean) => {
  if (visible) {
    fetchCalibrationList();
  }
};
</script>

<style scoped lang="less">
.calibration-container {
  .search-bar {
    margin-bottom: 16px;
    padding: 12px 0;
    //   background: #fafafa;
    border-radius: 4px;
  }
}
</style>