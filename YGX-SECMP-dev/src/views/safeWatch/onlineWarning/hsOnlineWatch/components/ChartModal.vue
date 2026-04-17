<template>
  <BasicModal
    :title="modalTitle"
    :width="1000"
    :can-fullscreen="true"
    :keyboard="false"
    :destroy-on-close="true"
    v-bind="$attrs"
    :maskClosable="true"
    :footer="null"
    @register="registerModal"
  >
    <div v-loading="state.loading" class="chart-container">
      <!-- 筛选条件区域 -->
      <div class="filter-section">
        <a-form layout="inline" :model="state.filterParams">
          <a-form-item label="指标名称">
            <a-select
              v-model:value="state.filterParams.safeDeviceQuotaId"
              placeholder="请选择指标"
              style="width: 180px"
              allowClear
              @change="handleQuotaChange"
            >
              <a-select-option
                v-for="quota in state.quotaOptions"
                :key="quota.id"
                :value="quota.id"
              >
                {{ quota.quotaName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="监测时间">
            <a-range-picker
              v-model:value="state.filterParams.timeRange"
             
              format="YYYY-MM-DD"
              style="width: 380px"
              :placeholder="['开始时间', '结束时间']"
            />
          </a-form-item>
          
          <a-form-item>
            <a-button type="primary" @click="handleSearch">搜索</a-button>
          </a-form-item>
          
          <a-form-item>
            <a-button @click="handleReset">重置</a-button>
          </a-form-item>
        </a-form>
      </div>
      
      <!-- 图表区域 -->
      <div ref="chartRef" style="width: 100%; height: 450px"></div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, Ref, nextTick, onBeforeUnmount } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { getQuotaList, getQueryTrendChart } from '../line.api';
  import { QuotaOption, TrendChartData } from '../line.data';
  import { getDictTextByCode } from '/@/utils/dict';
  import dayjs, { Dayjs } from 'dayjs';
  
  const emit = defineEmits(['register']);
  
  const state = reactive({
    loading: false,
    cardData: null as any,
    quotaOptions: [] as QuotaOption[], // 指标选项
    filterParams: {
      safeDeviceQuotaId: undefined as string | undefined, // 选中的指标ID
      timeRange: undefined as [Dayjs, Dayjs] | undefined,
    },
    currentUnit: '', // 当前选中指标的单位（中文）
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  let echartsInstance: ReturnType<typeof useECharts> | null = null;
  
  // 初始化 ECharts 实例
  const initECharts = () => {
    if (chartRef.value && !echartsInstance) {
      echartsInstance = useECharts(chartRef as Ref<HTMLDivElement>);
    }
  };
  
  const modalTitle = computed(() => {
    const deviceName = state.cardData?.deviceSafeCheckName || state.cardData?.name || '设备';
    return `${deviceName} - 数据趋势`;
  });
  
  // 注册弹窗
  const [registerModal] = useModalInner(async (data) => {
    state.cardData = data.cardData;
    
    // 重置 ECharts 实例
    echartsInstance = null;
    
    // 加载指标选项
    await loadQuotaOptions();
    
    // 设置默认时间范围（前7天到当前日期）
    state.filterParams.timeRange = [
      dayjs().subtract(7, 'day'),
      dayjs(),
    ];
    
    // 等待 DOM 更新后初始化图表
    await nextTick();
    await nextTick(); // 双重 nextTick 确保 DOM 完全准备好
    initECharts();
    loadChartData();
  });
  
  // 组件卸载时清理
  onBeforeUnmount(() => {
    echartsInstance = null;
  });

  // 加载指标选项
  const loadQuotaOptions = async () => {
    if (!state.cardData?.deviceSafeCheckId) {
      console.warn('缺少deviceSafeCheckId参数');
      return;
    }
    
    try {
      const response = await getQuotaList({ deviceSafeCheckId: state.cardData.deviceSafeCheckId });
      state.quotaOptions = response || [];
      
      // 设置默认选中第一个指标
      if (state.quotaOptions.length > 0) {
        const firstQuota = state.quotaOptions[0];
        state.filterParams.safeDeviceQuotaId = firstQuota.id;
        
        // 获取单位的中文翻译
        if (firstQuota.unit) {
          state.currentUnit = getDictTextByCode(firstQuota.unit, 'safe_device_quota_unit') || firstQuota.unit;
        }
      }
    } catch (error) {
      console.error('加载指标选项失败:', error);
    }
  };

  const loadChartData = async () => {
    if (!state.filterParams.safeDeviceQuotaId || !state.cardData?.deviceSafeCheckId) {
      console.warn('缺少必要参数');
      return;
    }
    
    // 确保 ECharts 实例已初始化
    if (!echartsInstance) {
      initECharts();
    }
    
    if (!echartsInstance) {
      console.warn('ECharts 实例初始化失败');
      return;
    }
    
    state.loading = true;
    try {
      // 准备请求参数
      const params: any = {
        deviceSafeCheckId: state.cardData.deviceSafeCheckId,
        safeDeviceQuotaId: state.filterParams.safeDeviceQuotaId,
        pageSize: 999, // 固定分页大小
      };
      
      // 添加时间范围参数
      if (state.filterParams.timeRange && state.filterParams.timeRange.length === 2) {
        params.monitorDateStart = state.filterParams.timeRange[0].format('YYYY-MM-DD');
        params.monitorDateEnd = state.filterParams.timeRange[1].format('YYYY-MM-DD');
      }
      
      // 调用趋势图表接口
      const response: TrendChartData = await getQueryTrendChart(params);
      //console.log(response);
      
      // 获取当前选择的指标名称
      const currentQuota = state.quotaOptions.find(q => q.id === state.filterParams.safeDeviceQuotaId);
      const currentQuotaName = currentQuota?.quotaName || '监测指标';
      
      // 处理图表数据
      const chartData = response.records || [];
      const xData = chartData.map(item => item.monitorDate);
      const yData = chartData.map(item => item.monitorValue);
      
      const option: any = {
        backgroundColor: '#1f1f1f',
        title: {
          text: `${currentQuotaName}趋势`,
          left: 'center',
          textStyle: {
            fontSize: 14,
            color: '#d9d9d9',
          },
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#262626',
          borderColor: '#434343',
          textStyle: {
            color: '#d9d9d9',
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#434343',
              color: '#d9d9d9',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true,
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 50,
            bottom: '5%',
            height: 20,
            handleSize: '100%',
            textStyle: {
              color: '#8c8c8c',
            },
            backgroundColor: '#262626',
            borderColor: '#434343',
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 50,
          },
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData,
          axisLabel: {
            rotate: 45,
            interval: 0,
            color: '#8c8c8c',
          },
          axisLine: {
            lineStyle: {
              color: '#434343',
            },
          },
          axisTick: {
            lineStyle: {
              color: '#434343',
            },
          },
        },
        yAxis: {
          type: 'value',
          name: `${currentQuotaName}(${state.currentUnit})`,
          nameTextStyle: {
            color: '#8c8c8c',
          },
          axisLabel: {
            formatter: '{value}',
            color: '#8c8c8c',
          },
          axisLine: {
            lineStyle: {
              color: '#434343',
            },
          },
          axisTick: {
            lineStyle: {
              color: '#434343',
            },
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#434343',
            },
          },
        },
        series: [
          {
            name: currentQuotaName,
            type: 'line',
            smooth: false,
            data: yData,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(24, 144, 255, 0.3)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(24, 144, 255, 0.1)',
                  },
                ],
              },
            },
            lineStyle: {
              width: 2,
              color: '#1890ff',
            },
            itemStyle: {
              color: '#1890ff',
            },
            markLine: {
              silent: true,
              lineStyle: {
                color: '#ff4d4f',
                type: 'dashed',
              },
              data: [
                {
                  yAxis: 50,
                  label: {
                    formatter: `预警线: 50${state.currentUnit}`,
                    position: 'end',
                  },
                },
              ],
            },
          },
        ],
      };
      
      echartsInstance.setOptions(option);
    } catch (error) {
      console.error('加载图表数据失败:', error);
    } finally {
      state.loading = false;
    }
  };
  
  // 指标变更处理
  const handleQuotaChange = (quotaId: string) => {
    const selectedQuota = state.quotaOptions.find(q => q.id === quotaId);
    if (selectedQuota && selectedQuota.unit) {
      state.currentUnit = getDictTextByCode(selectedQuota.unit, 'safe_device_quota_unit') || selectedQuota.unit;
    }
    loadChartData();
  };

  // 搜索
  const handleSearch = () => {
    loadChartData();
  };
  
  // 重置
  const handleReset = () => {
    // 重置为默认值
    if (state.quotaOptions.length > 0) {
      const firstQuota = state.quotaOptions[0];
      state.filterParams.safeDeviceQuotaId = firstQuota.id;
      if (firstQuota.unit) {
        state.currentUnit = getDictTextByCode(firstQuota.unit, 'safe_device_quota_unit') || firstQuota.unit;
      }
    }
    state.filterParams.timeRange = [
      dayjs().subtract(7, 'day'),
      dayjs(),
    ];
    loadChartData();
  };
</script>

<style lang="less" scoped>
  .chart-container {
    padding: 0;
    
    .filter-section {
      padding: 20px;
      background: #1f1f1f;
      border-radius: 4px;
      margin-bottom: 20px;
      border: 1px solid #303030;
      
      :deep(.ant-form-inline .ant-form-item) {
        margin-bottom: 8px;
      }
      
      :deep(.ant-form-item-label > label) {
        color: #d9d9d9;
      }
      
      :deep(.ant-btn) {
        margin-right: 8px;
      }
    }
  }
</style>

