<template>
    <div class="dashboard-page">
      <!-- 统计图表区域：图表 + 指标卡片并排 -->
      <div class="chart-container">
        <div class="chart-card chart-main">
          <div class="section-title">设备在线率统计</div>
          <div ref="onlineRateChartRef" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="chart-card mtbf-card">
          <div class="section-title">平均无故障时间</div>
          <div ref="mtbfChartRef" style="width: 100%; height: 450px;"></div>
        </div>
      </div>
  
      <!-- 设备可靠性分析 -->
      <div class="section-title">设备可靠性分析</div>
      <div class="search-form">
        <a-form layout="inline" :model="searchParams" @finish="handleSearch">
          <a-form-item name="category">
            <span>类别： </span>
            <a-select v-model:value="searchParams.category" placeholder="请选择" allowClear style="width: 150px">
              <a-select-option value="矿山">矿山</a-select-option>
              <a-select-option value="地质灾害">地质灾害</a-select-option>
              <a-select-option value="水文">水文</a-select-option>
              <a-select-option value="工贸">工贸</a-select-option>
              <a-select-option value="危险化学品">危险化学品</a-select-option>
              <a-select-option value="森林防火">森林防火</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="deviceType">
            <span>设备类型： </span>
            <a-select v-model:value="searchParams.deviceType" placeholder="请选择" allowClear style="width: 150px">
              <a-select-option value="表面位移">表面位移</a-select-option>
              <a-select-option value="内部位移">内部位移</a-select-option>
              <a-select-option value="渗压">渗压</a-select-option>
              <a-select-option value="雨量">雨量</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="deviceName">
            <div style="display: flex; width: 300px; align-items: center;">
              <div style="width: 100px;">设备名称： </div>
              <a-input style="float: right;" v-model:value="searchParams.deviceName" placeholder="请输入" allowClear />
            </div>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">搜索</a-button>
            <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
          </a-form-item>
        </a-form>
      </div>
  
      <a-table :columns="reliabilityColumns" :data-source="reliabilityData" :loading="reliabilityLoading"
        :pagination="pagination" @change="handleTableChange" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'failureRate'">
            {{ record.failureRate }}%
          </template>
        </template>
      </a-table>
  
      <!-- 维修成本分析 -->
      <div class="section-title">设备可靠性分析</div>
      <div ref="costChartRef" style="width: 100%; height: 400px; margin-top: 16px;"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted, onUnmounted } from 'vue';
  import * as echarts from 'echarts';
  import { message } from 'ant-design-vue';
  import {
    getOnlineRateData,
    getMtbfData,
    getReliabilityList,
    getCostData,
  } from './line.api';
  
  // 图表实例
  let onlineRateChart: echarts.ECharts | null = null;
  let mtbfChart: echarts.ECharts | null = null;
  let costChart: echarts.ECharts | null = null;
  
  // DOM 引用
  const onlineRateChartRef = ref<HTMLElement>();
  const mtbfChartRef = ref<HTMLElement>();
  const costChartRef = ref<HTMLElement>();
  
  // 搜索参数
  const searchParams = reactive({
    category: undefined,
    deviceType: undefined,
    deviceName: undefined,
  });
  
  // 可靠性表格数据
  const reliabilityData = ref([]);
  const reliabilityLoading = ref(false);
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
  });
  
  // 可靠性分析表格列
  const reliabilityColumns = [
    { title: '序号', dataIndex: 'index', width: 60, customRender: ({ index }) => index + 1 },
    { title: '品牌', dataIndex: 'brand', width: 120 },
    { title: '类别', dataIndex: 'category', width: 100 },
    { title: '设备类型', dataIndex: 'deviceType', width: 120 },
    { title: '设备名称', dataIndex: 'deviceName', width: 150 },
    { title: '设备数量', dataIndex: 'deviceCount', width: 100 },
    { title: '故障率', key: 'failureRate', width: 100, align: 'center' },
  ];
  
  // 加载在线率图表数据
  const loadOnlineRateData = async () => {
    try {
      const res = await getOnlineRateData();
      if (onlineRateChart) {
        const option = {
          title: {
            text: '设备在线率统计',
            left: 'center',
            textStyle: { color: '#fff' }
          },
          tooltip: { trigger: 'axis' },
          legend: {
            data: res.series.map(s => s.name),
            top: 30,
            textStyle: { color: '#fff' },        // 图例文字颜色白色
            inactiveColor: '#aaa'                // 隐藏时的颜色（可选）
          },
          grid: { top: 80, left: 50, right: 30, bottom: 30 },
          xAxis: { type: 'category', data: res.categories },
          yAxis: { type: 'value', name: '' },
          // 自定义曲线颜色（蓝色系为主）
          color: ['#5470c6', '#3ba272', '#73c0de', '#fac858', '#ee6666', '#9a60b4', '#ea7ccc'],
          series: res.series.map(s => ({
            name: s.name,
            type: 'line',
            data: s.data,
            smooth: true,
          })),
        };
        onlineRateChart.setOption(option);
      }
    } catch (error) {
      message.error('获取在线率数据失败');
    }
  };
  
  // 加载平均无故障时间柱状图
  const loadMtbfChart = async () => {
    try {
      const res = await getMtbfData(); // 返回格式 [{ category, mtbf }]
      if (mtbfChart) {
        const categories = res.map(item => item.category);
        const values = res.map(item => item.mtbf);
  
        const colors = ['#ADD8E6', '#90EE90', '#FFD580', '#FFB6C1']; // 浅蓝、浅绿、浅橘、浅粉
  
        const option = {
          title: { text: '平均无故障时间', left: 'center', textStyle: { color: '#fff' } },
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          legend: {
            show: false,  // 柱状图只有一个系列，不显示图例
          },
          xAxis: { type: 'category', data: categories, axisLabel: { rotate: 15 } },
          yAxis: { type: 'value', name: '' },
          series: [{
            type: 'bar',
            data: values.map((value, index) => ({
              value: value,
              itemStyle: { color: colors[index % colors.length] }
            })),
            barWidth: '50%',
            label: { show: true, position: 'top' }
          }]
        };
        mtbfChart.setOption(option);
      }
    } catch (error) {
      message.error('获取平均无故障时间数据失败');
    }
  };
  
  // 加载可靠性列表
  const loadReliabilityList = async () => {
    reliabilityLoading.value = true;
    try {
      const params = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      };
      const res = await getReliabilityList(params);
      reliabilityData.value = res.records;
      pagination.total = res.total;
    } catch (error) {
      message.error('获取可靠性列表失败');
    } finally {
      reliabilityLoading.value = false;
    }
  };
  
  // 加载维修成本图表
  const loadCostData = async () => {
    try {
      const res = await getCostData();
      if (costChart) {
        const option = {
          title: { text: '', left: 'center', textStyle: { color: '#fff' } },
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          legend: { textStyle: { color: '#fff' } },
          xAxis: { type: 'category', data: res.months },
          yAxis: { type: 'value', name: '成本(万元)' },
          series: [{ name: '', type: 'bar', data: res.costs, itemStyle: { color: '#5470c6' } }],
        };
        costChart.setOption(option);
      }
    } catch (error) {
      message.error('获取成本数据失败');
    }
  };
  
  // 搜索
  const handleSearch = () => {
    pagination.current = 1;
    loadReliabilityList();
  };
  
  // 重置搜索
  const resetSearch = () => {
    searchParams.category = undefined;
    searchParams.deviceType = undefined;
    searchParams.deviceName = undefined;
    handleSearch();
  };
  
  // 表格翻页
  const handleTableChange = (paginationConfig) => {
    pagination.current = paginationConfig.current;
    pagination.pageSize = paginationConfig.pageSize;
    loadReliabilityList();
  };
  
  // 监听窗口大小变化，自适应图表
  const handleResize = () => {
    onlineRateChart?.resize();
    mtbfChart?.resize();
    costChart?.resize();
  };
  
  onMounted(() => {
    onlineRateChart = echarts.init(onlineRateChartRef.value);
    mtbfChart = echarts.init(mtbfChartRef.value);
    costChart = echarts.init(costChartRef.value);
  
    loadOnlineRateData();
    loadMtbfChart();
    loadReliabilityList();
    loadCostData();
  
    window.addEventListener('resize', handleResize);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    onlineRateChart?.dispose();
    mtbfChart?.dispose();
    costChart?.dispose();
  });
  </script>
  
  <style scoped lang="less">
  .dashboard-page {
    padding: 20px;
    background-image: url(/src/assets/business/img/content-bg.png);
    background-size: 100% 100%;
  }
  
  .chart-container {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
  }
  
  .chart-card {
    flex: 1;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .chart-main {
    flex: 1;
  }
  
  .mtbf-card {
    flex: 1;
  }
  
  .chart-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 24px 0 16px;
    padding-left: 10px;
    border-left: 4px solid #1677ff;
  }
  
  .search-form {
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  }
  </style>