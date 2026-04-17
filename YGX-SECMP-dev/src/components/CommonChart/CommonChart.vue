<template>
  <div
    class="chart-box"
    :style="{
      width: props.width,
      height: props.height,
    }"
  >
    <div
      ref="myChartRef"
      class="my-chart"
    />
    <div
      v-show="isEmpty"
      class="no-data"
      :style="{
        top: props.emptyTop,
      }"
    >
      <!-- <el-empty :image-size="100" /> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, onUnmounted, nextTick, PropType, watch } from 'vue'
import { resizeChart } from './index'
const props = defineProps({
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
  option: {
    type: Object as PropType<echarts.EChartsOption>,
    default: () => {},
  },
  // 为使界面美观，添加一个empty图片，该属性仅针对于特定模块的折线图使用
  isEmpty: {
    type: Boolean,
    default: false,
  },
  emptyTop: {
    type: String,
    default: '0%',
  },
})

let myChartRef = ref()
let myChart: null | echarts.ECharts = null
const { addListener, removeListener } = resizeChart()
onMounted(() => {
  nextTick(() => {
    init()
  })
})
const init = () => {
  if (myChart) {
    dipose()
  }
  myChart = echarts.init(myChartRef.value as HTMLDivElement)
  myChart.clear()
  myChart.setOption(props.option)
  addListener(myChartRef.value, myChart)
}
const dipose = () => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
}
const getEcharts = () => {
  return myChart
}
const setOption = (option: echarts.EChartsOption) => {
  if (!myChart) return
  myChart.clear()
  myChart.setOption(option)
}
watch(
  () => props.option,
  () => {    
    setOption(props.option)
  }
)
defineExpose({
  getEcharts,
  setOption,
})
// 组件销毁时
onUnmounted(() => {
  dipose()
  removeListener()
})
</script>
<style scoped lang="less">
.chart-box {
  position: relative;
  .no-data {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    .el-empty {
      margin: 0;
      padding: 0;
    }
  }
}
.my-chart {
  width: 100%;
  height: 100%;
  :deep(.my-tooltip) {
    text-align: left;
  }
}
</style>
