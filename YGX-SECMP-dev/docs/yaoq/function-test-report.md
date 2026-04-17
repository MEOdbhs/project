# 功能验证测试报告

## 覆盖模块

- DataIntelligence：数据智能巡查（任务/问题 tab、筛选条、表格）
- DynamicRisk：地震实时评估 / 边坡风险评价 / 企业安全生产风险评价（echarts 图表 + 列表）
- MonitoringSurveillance：设备管理 / 设备生命周期台账管理 / 设备实时监控（表格、弹窗表单、echarts 图表）

## 本地命令验证

- 依赖安装：
  - `npm install --legacy-peer-deps`
- 产物构建：
  - `npm run build:prod` 在当前沙盒内出现 Node heap out of memory
  - `npm run build` 在当前沙盒内输出被截断，未能拿到最终失败原因（需要更高内存或在业务环境中复现）
- 类型检查（增大内存）：
  - `NODE_OPTIONS=--max-old-space-size=8192 npx vue-tsc --noEmit -p tsconfig.json`
    - 该项目本身存在多处既有 TS 报错（非本次改动引入），会导致全量 typecheck 失败

## 变更范围自检

- 新增/编辑弹窗：
  - 设备管理：新增/编辑使用 `DeviceModal`（BasicModal + BasicForm）
  - 生命周期台账：查看/变更使用 `LifecycleModal`（showFooter=false 时为只读查看）
- 表格规范：
  - 设备管理、生命周期台账、数据智能巡查均使用 `BasicTable`
- 图表规范：
  - 动态风险与设备实时监控折线图使用 `useECharts` 渲染

