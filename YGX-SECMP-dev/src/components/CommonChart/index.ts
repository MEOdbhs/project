import * as echarts from 'echarts'
export const resizeChart = () => {
  let resizeObserver: ResizeObserver | null = null
  let observerDom: HTMLElement | null = null
  let observerChart: echarts.EChartsType | null = null
  const resize = () => {
    if (observerChart) {
      observerChart.resize()      
    }
  }
  const resizeChartFontSize = (size = 16) => {
    const clientWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    if (!clientWidth) {
      return size
    }
    const scale = clientWidth / 1920
    return size * scale
  }
  const addListener = (dom: HTMLElement, chart: echarts.EChartsType) => {
    if (dom && chart) {
      observerDom = dom
      observerChart = chart
      resizeObserver = new ResizeObserver(() => {
        window.requestAnimationFrame(() => {
          resize()
        })
      })
      resizeObserver.observe(observerDom)
    }
  }
  const removeListener = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  }
  return {
    addListener,
    removeListener,
    resizeChartFontSize,
  }
}
