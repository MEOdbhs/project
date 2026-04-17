<template>
  <BasicModal :title="'仿真测试'" :width="'80vw'" :height="650" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" @register="registerModal" @ok="handleApply"
    @cancel="handleCancel" :okText="'运用至配置中'" :cancelText="'关闭'">
    <div v-loading="state.loading">
      <!-- 查询条件行 -->
      <div class="search-wrapper">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="开始日期">
              <a-date-picker v-model:value="state.searchParams.startDate" format="YYYY-MM-DD" placeholder="请选择"
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="结束日期">
              <a-date-picker v-model:value="state.searchParams.endDate" format="YYYY-MM-DD" placeholder="请选择"
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="预警等级">
              <a-select v-model:value="state.searchParams.warningLevel" placeholder="请选择" allowClear
                style="width: 100%">
                <a-select-option value="红色预警">红色预警</a-select-option>
                <a-select-option value="橙色预警">橙色预警</a-select-option>
                <a-select-option value="黄色预警">黄色预警</a-select-option>
                <a-select-option value="蓝色预警">蓝色预警</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-space>
              <a-button type="primary" @click="handleSearch">搜索</a-button>
              <a-button @click="resetSearch">重置</a-button>
            </a-space>
          </a-col>
        </a-row>
      </div>

      <!-- 图表展示区 -->
      <div ref="chartRef" style="width: 100%; height: 300px; margin-top: 16px;"></div>

      <!-- 模拟测试结果表格（展示每个规则的触发情况） -->
      <a-table :dataSource="state.conditions" :columns="simulationColumns" :pagination="false" bordered
        style="margin-top: 16px">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'warningLevel'">
            <a-tag :color="getWarningColor(record.warningLevel)">{{ record.warningLevel }}</a-tag>
          </template>
          <template v-else-if="column.key === 'alarmLevelId'">
            <JDictSelectTag disabled v-model:value="record.alarmLevelId" placeholder="请选择" dictCode="monitor_alarm_level"
              style="width: 100%" />
          </template>
          <template v-else-if="column.key === 'durationUnitId'">
            <JDictSelectTag disabled v-model:value="record.durationUnitId" placeholder="请选择" dictCode="alarm_duration_unit"
              style="width: 100%" />
          </template>
          <template v-else-if="column.key === 'action'">
            <!-- 预留操作列，暂时不需要，但可保留占位 -->
          </template>
        </template>
      </a-table>
    </div>
  </BasicModal>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import * as echarts from 'echarts';
import { simulationTest } from '../line.api';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
const emit = defineEmits(['apply']);

const chartRef = ref();
let chart = null;

const state = reactive({
  loading: false,
  searchParams: {
    startDate: null,
    endDate: null,
    warningLevel: undefined,
  },
  simulationData: [],     // 模拟测试结果数据（表格）
  conditions: [],         // 传入的规则条件（来自父组件）
  monitorCode: '',        // 设备编码
});

// 表格列定义（与规则配置表格基本一致，增加操作列但可留空）
const simulationColumns = [
  { title: '数据类型', dataIndex: 'dataTypeName', width: 120 },
  { title: '类型参数', dataIndex: 'paramTypeName', width: 120 },
  { title: '条件', dataIndex: 'alarmConditionName', width: 100 },
  { title: '阈值', dataIndex: 'alarmThreshold', width: 100 },
  { title: '单位', dataIndex: 'alarmUnitName', width: 80 },
  { title: '持续时间', dataIndex: 'duration', width: 100 },
  { title: '持续时间单位', dataIndex: 'durationUnitId', key: 'durationUnitId', width: 120 },
  { title: '预警等级', key: 'alarmLevelId', width: 100 },
  { title: '生效开始时间', dataIndex: 'startEffectiveDatetime', key: 'startEffectiveDatetime', width: 160 },
  { title: '生效结束时间', dataIndex: 'endEffectiveDatetime', key: 'endEffectiveDatetime', width: 160 },
];

// 预警等级对应的标签颜色
const getWarningColor = (level) => {
  if (level === '红色预警') return 'red';
  if (level === '橙色预警') return 'orange';
  if (level === '黄色预警') return 'gold';
  if (level === '蓝色预警') return 'blue';
  return 'default';
};

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  // 接收父组件传入的参数
  state.conditions = data.conditions || [];
  state.monitorCode = data.deviceCode || '';
  // 重置搜索条件
  state.searchParams.startDate = null;
  state.searchParams.endDate = null;
  state.searchParams.warningLevel = undefined;
  state.simulationData = [];
  // 清除图表
  if (chart) chart.clear();
  // 如果已有设备编码，自动加载数据
  if (state.monitorCode && state.conditions.length > 0) {
    await handleSearch();
  }
});

// 构造接口请求参数
const buildRequestParams = () => {
  console.log('buildRequestParams', state.conditions);
  // 将父组件传入的 conditions 转换为 detailList
  const detailList = state.conditions.map(cond => ({
    // 保留原字段，供后端使用
    dataTypeId: cond.dataTypeId,
    paramTypeId: cond.paramTypeId,
    alarmConditionId: cond.alarmConditionId,
    alarmThreshold: cond.alarmThreshold,
    alarmUnitId: cond.alarmUnitId,
    duration: cond.duration,
    durationUnitId: cond.durationUnitId,
    alarmLevelId: cond.alarmLevelId,
    startEffectiveDatetime: cond.startEffectiveDatetime,
    endEffectiveDatetime: cond.endEffectiveDatetime,
    paramTypeValue: cond.paramTypeValue,
    alarmConditionValue: cond.alarmConditionValue,
    // 如果需要其他字段，可继续添加
    id: cond.id || '',
  }));

  return {
    startDate: state.searchParams.startDate ? state.searchParams.startDate.format('YYYY-MM-DD') : '',
    endDate: state.searchParams.endDate ? state.searchParams.endDate.format('YYYY-MM-DD') : '',
    warningLevel: state.searchParams.warningLevel || '',
    monitorCode: state.monitorCode,
    detailList: detailList,
  };
};

// 搜索并刷新图表和表格
const handleSearch = async () => {
  if (!state.monitorCode) {
    message.warning('缺少设备编码，请返回规则配置页重新打开');
    return;
  }
  if (state.conditions.length === 0) {
    message.warning('请先在规则配置中添加预警条件');
    return;
  }
  state.loading = true;
  try {
    const params = buildRequestParams();
    const res = await simulationTest(params);
    // 根据实际返回结构处理数据
    // 假设后端返回 { chartData: [], tableData: [] }
    const chartData = res.chartData || [];
    const tableData = res.tableData || [];
    state.simulationData = tableData;
    renderChart(chartData);
  } catch (error) {
    message.error(error.message || '获取仿真数据失败');
  } finally {
    state.loading = false;
  }
};

// 重置搜索
const resetSearch = () => {
  state.searchParams.startDate = null;
  state.searchParams.endDate = null;
  state.searchParams.warningLevel = undefined;
  if (state.monitorCode && state.conditions.length > 0) {
    handleSearch();
  } else {
    state.simulationData = [];
    if (chart) chart.clear();
  }
};

// 渲染图表
const renderChart = (dataPoints) => {
  if (!chart) {
    chart = echarts.init(chartRef.value);
  }
  const option = {
    title: { text: '历史监测与规则模拟测试' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['历史监测值', '规则模拟值'] },
    xAxis: {
      type: 'category',
      data: dataPoints.map(item => item.time),
      axisLabel: { rotate: 30 },
    },
    yAxis: { type: 'value', name: '数值' },
    series: [
      {
        name: '历史监测值',
        type: 'line',
        data: dataPoints.map(item => item.historyValue),
        smooth: true,
        lineStyle: { color: '#5470c6' },
      },
      {
        name: '规则模拟值',
        type: 'line',
        data: dataPoints.map(item => item.simulatedValue),
        smooth: true,
        lineStyle: { color: '#fac858' },
      },
    ],
    grid: { containLabel: true },
  };
  chart.setOption(option);
};

// 运用至配置中
const handleApply = () => {
  // 将模拟测试的结果（如调整后的阈值、预警等级）传递给父组件
  // 这里根据实际需求，可能只传递修改过的条件列表
  const updatedConditions = state.simulationData.map(item => ({
    dataTypeId: item.dataTypeId,
    paramTypeId: item.paramTypeId,
    alarmConditionId: item.alarmConditionId,
    alarmThreshold: item.alarmThreshold,
    alarmUnitId: item.alarmUnitId,
    duration: item.duration,
    durationUnitId: item.durationUnitId,
    alarmLevelId: item.alarmLevelId,
    startEffectiveDatetime: item.startEffectiveDatetime,
    endEffectiveDatetime: item.endEffectiveDatetime,
  }));
  emit('apply', { updatedConditions });
  closeModal();
};

const handleCancel = () => {
  closeModal();
};

onMounted(() => {
  window.addEventListener('resize', () => chart?.resize());
});

onUnmounted(() => {
  window.removeEventListener('resize', () => chart?.resize());
  chart?.dispose();
});
</script>

<style lang="less" scoped>
.search-wrapper {
  margin-bottom: 16px;
  padding: 16px;
  // background-color: #fafafa;
  border-radius: 4px;
}
</style>