# 组件使用说明

## DeviceModal

- 位置：[DeviceModal.vue](file:///workspace/YGX-SECMP-dev/src/views/MonitoringSurveillance/equipmentManagement/components/DeviceModal.vue)
- 用途：设备新增/编辑弹窗（BasicModal + BasicForm）
- 注册方式：
  - 父组件通过 `useModal()` 获取 `openModal`，并在模板上绑定 `@register`
  - 示例：[equipmentManagement/index.vue](file:///workspace/YGX-SECMP-dev/src/views/MonitoringSurveillance/equipmentManagement/index.vue)
- Props（通过 openModal 传入的数据对象）：
  - `isUpdate: boolean` 是否编辑
  - `showFooter: boolean` 是否显示底部按钮
  - `record: Recordable` 表单回填数据
- Emits：
  - `register`（BasicModal 标准注册事件）
  - `success({ isUpdate, values })` 表单提交成功回调
- Form 字段：
  - `devNo` 设备编号（必填）
  - `devName` 设备名称（必填）
  - `devType` 设备类型（必填）
  - `category` 所属类别（必填）
  - `location` 安装位置
  - `manufacturer` 厂商
  - `installDate` 安装日期
  - `status` 设备状态（必填：online/offline/warning）
  - `signalStrength` 信号强度(%)

## LifecycleModal

- 位置：[LifecycleModal.vue](file:///workspace/YGX-SECMP-dev/src/views/MonitoringSurveillance/PeriodicLedger/components/LifecycleModal.vue)
- 用途：生命周期详情/变更弹窗（BasicModal + BasicForm）
- 注册方式：
  - 父组件通过 `useModal()` 获取 `openModal`，并在模板上绑定 `@register`
  - 示例：[PeriodicLedger/index.vue](file:///workspace/YGX-SECMP-dev/src/views/MonitoringSurveillance/PeriodicLedger/index.vue)
- Props（通过 openModal 传入的数据对象）：
  - `isUpdate: boolean` 是否更新
  - `showFooter: boolean` 是否显示底部按钮（false 时为只读详情）
  - `record: Recordable` 表单回填数据
- Emits：
  - `register`
  - `success({ isUpdate, values })`
- Form 字段：
  - `devNo` 设备编号（必填）
  - `devName` 设备名称（必填）
  - `stage` 生命周期阶段（必填：入库/运行/维修/报废）
  - `installDate` 安装日期
  - `warrantyEnd` 保修截止
  - `age` 已用年限
  - `health` 健康度(%)
  - `maintenance` 累计维护次数
  - `nextMaintenance` 下次维护

