<template>
  <div :id="domId" class="custom-chart-line-container"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import * as echarts from "echarts";
import "echarts-gl";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  dataZoomShow: {
    type: Boolean,
    default: () => {
      return true;
    },
  },
  domId: {
    type: String,
    default: () => {
      return "idCustomChartLine";
    },
  },
});

const renderChart = (opt: echarts.EChartsOption) => {
  const chartDom: HTMLElement | null = document.getElementById(props.domId);
  let myChart = echarts.getInstanceByDom(chartDom as HTMLElement);
  if (myChart === undefined) {
    myChart = echarts.init(chartDom as HTMLElement);
  }
  myChart.clear();
  let option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      containLabel: true,
    },
    dataZoom: [
      {
        show: false,
        realtime: true,
        start: 0,
        end: 100,
      },
      {
        type: "inside",
        realtime: true,
        start: 0,
        end: 100,
      },
    ],
    legend: {
      data: [],
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          type: "png",
          name: "image",
          title: "保存为图片",
        },
      },
    },
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: {
      type: "value",
    },
    series: [],
  };
  option = Object.assign(option, opt);
  option && myChart.setOption(option);
  myChart.resize();
};

watch(
  () => props.data,
  () => {
    nextTick(() => {
      renderChart(props.data);
    });
  }
);

onMounted(() => {});
</script>

<style scoped lang="less">
.custom-chart-line-container {
  width: 100%;
  height: 100%;
}
</style>
