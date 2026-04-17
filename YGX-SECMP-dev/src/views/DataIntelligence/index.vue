<template>
  <!-- 数据智能巡查 -->
  <div class="tech-page">
    <div class="tech-stats">
      <div v-for="s in statsData" :key="s.label" class="tech-stat">
        <div class="tech-stat__value" :style="{ color: s.color }">{{ s.value }}</div>
        <div class="tech-stat__label">{{ s.label }}</div>
      </div>
    </div>

    <div class="tech-tabs">
      <button
        v-for="t in tabs"
        :key="t.key"
        class="tech-tab"
        :class="{ 'tech-tab--active': tab === t.key }"
        type="button"
        @click="tab = t.key"
      >
        {{ t.label }}
      </button>
    </div>

    <div class="tech-filter">
      <div class="tech-filter__item">
        <span class="tech-filter__label">巡查类型：</span>
        <div class="tech-filter__select">
          <select v-model="filterValues.type" class="tech-select">
            <option value="">请选择巡查类型</option>
            <option value="completeness">完整性</option>
            <option value="anomaly">异常检测</option>
            <option value="offline">离线检测</option>
            <option value="consistency">一致性</option>
          </select>
        </div>
      </div>
      <div class="tech-filter__item">
        <span class="tech-filter__label">任务状态：</span>
        <div class="tech-filter__select">
          <select v-model="filterValues.status" class="tech-select">
            <option value="">请选择任务状态</option>
            <option value="running">运行中</option>
            <option value="paused">已暂停</option>
          </select>
        </div>
      </div>
      <button class="tech-btn tech-btn--primary" type="button" @click="handleSearch">查询</button>
      <button class="tech-btn tech-btn--ghost" type="button" @click="handleReset">重置</button>
    </div>

    <div class="tech-card">
      <div class="tech-card__header">
        <div class="tech-card__title">{{ tab === 'tasks' ? '数据智能巡查任务' : '发现问题记录' }}</div>
      </div>
      <div class="tech-card__body">
        <BasicTable class="tech-basic-table" @register="registerTable">
          <template #action>
            <div v-if="tab === 'tasks'" class="tech-actions">
              <button class="tech-icon-btn" type="button" @click="handleAction('toggle')">
                <Icon icon="mdi:play" />
              </button>
              <button class="tech-icon-btn" type="button" @click="handleAction('run')">
                <Icon icon="mdi:refresh" />
              </button>
              <button class="tech-icon-btn" type="button" @click="handleAction('report')">
                <Icon icon="mdi:file-document-outline" />
              </button>
            </div>
            <button v-else type="button" class="tech-link-btn" @click="handleAction('handle')">处理</button>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, h, ref, watch } from 'vue';
  import { BasicTable, useTable, type BasicColumn } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';

  type TabKey = 'tasks' | 'issues';

  const { createMessage } = useMessage();

  const tabs = [
    { key: 'tasks' as const, label: '巡查任务管理' },
    { key: 'issues' as const, label: '问题记录' },
  ];

  const tab = ref<TabKey>('tasks');

  const filterValues = ref<{ type: string; status: string }>({
    type: '',
    status: '',
  });

  const patrolTasks = [
    { seq: 1, taskName: '地质灾害监测点数据完整性巡查', type: 'completeness', frequency: '每小时', lastRun: '2026-03-26 14:00:00', nextRun: '2026-03-26 15:00:00', status: 'running', issues: 2 },
    { seq: 2, taskName: '水文站数据异常值检测', type: 'anomaly', frequency: '每30分钟', lastRun: '2026-03-26 13:30:00', nextRun: '2026-03-26 14:00:00', status: 'running', issues: 0 },
    { seq: 3, taskName: '矿山传感器设备离线检测', type: 'offline', frequency: '每10分钟', lastRun: '2026-03-26 13:50:00', nextRun: '2026-03-26 14:00:00', status: 'running', issues: 5 },
    { seq: 4, taskName: '森林防火数据一致性校验', type: 'consistency', frequency: '每天06:00', lastRun: '2026-03-26 06:00:00', nextRun: '2026-03-27 06:00:00', status: 'paused', issues: 0 },
    { seq: 5, taskName: '危化品传感器数据质量巡查', type: 'quality', frequency: '每2小时', lastRun: '2026-03-26 12:00:00', nextRun: '2026-03-26 14:00:00', status: 'running', issues: 1 },
  ];

  const issueRecords = [
    { seq: 1, task: '地质灾害监测点数据完整性巡查', device: 'JC-GZ-0023', issue: '数据缺失超过30分钟', time: '2026-03-26 13:22:00', severity: 'medium', handled: '否' },
    { seq: 2, task: '地质灾害监测点数据完整性巡查', device: 'JC-GZ-0047', issue: '连续3次数据为空', time: '2026-03-26 13:45:00', severity: 'high', handled: '否' },
    { seq: 3, task: '矿山传感器设备离线检测', device: 'MT-SN-0102', issue: '设备离线超过1小时', time: '2026-03-26 12:50:00', severity: 'high', handled: '是' },
    { seq: 4, task: '矿山传感器设备离线检测', device: 'MT-SN-0234', issue: '设备通信中断', time: '2026-03-26 13:10:00', severity: 'medium', handled: '否' },
    { seq: 5, task: '危化品传感器数据质量巡查', device: 'CH-SN-0056', issue: '数据波动异常超出3σ', time: '2026-03-26 14:05:00', severity: 'low', handled: '否' },
  ];

  const taskColumns: BasicColumn[] = [
    { title: '序号', dataIndex: 'seq', width: 60 },
    { title: '任务名称', dataIndex: 'taskName', width: 240 },
    {
      title: '巡查类型',
      dataIndex: 'type',
      width: 100,
      customRender: ({ text }) => {
        const map: Record<string, string> = {
          completeness: '完整性',
          anomaly: '异常检测',
          offline: '离线检测',
          consistency: '一致性',
          quality: '质量校验',
        };
        return h('span', { style: { color: 'var(--tech-cyan)' } }, map[String(text)] || String(text ?? ''));
      },
    },
    { title: '巡查频率', dataIndex: 'frequency', width: 100 },
    { title: '上次执行', dataIndex: 'lastRun', width: 160 },
    { title: '下次执行', dataIndex: 'nextRun', width: 160 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      customRender: ({ text }) =>
        h('span', { style: { color: text === 'running' ? 'var(--tech-success)' : 'var(--tech-text-dim)' } }, text === 'running' ? '运行中' : '已暂停'),
    },
    {
      title: '发现问题',
      dataIndex: 'issues',
      width: 100,
      customRender: ({ text }) => {
        const n = Number(text ?? 0);
        return h('span', { style: { color: n > 0 ? 'var(--tech-danger)' : 'var(--tech-success)' } }, n > 0 ? `${n}个问题` : '正常');
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      slots: { customRender: 'action' },
    },
  ];

  const issueColumns: BasicColumn[] = [
    { title: '序号', dataIndex: 'seq', width: 60 },
    { title: '所属任务', dataIndex: 'task', width: 200 },
    { title: '设备编号', dataIndex: 'device', width: 120 },
    { title: '问题描述', dataIndex: 'issue', width: 220 },
    { title: '发现时间', dataIndex: 'time', width: 160 },
    {
      title: '严重程度',
      dataIndex: 'severity',
      width: 90,
      customRender: ({ text }) => {
        const map: Record<string, { label: string; color: string }> = {
          high: { label: '严重', color: 'var(--tech-danger)' },
          medium: { label: '一般', color: 'var(--tech-warning)' },
          low: { label: '轻微', color: 'var(--tech-success)' },
        };
        const s = map[String(text)] || map.low;
        return h('span', { style: { color: s.color } }, s.label);
      },
    },
    { title: '是否处理', dataIndex: 'handled', width: 80 },
    { title: '操作', dataIndex: 'action', width: 100, slots: { customRender: 'action' } },
  ];

  const statsData = computed(() => [
    { label: '巡查任务总数', value: '5', color: 'var(--tech-cyan)' },
    { label: '运行中任务', value: '4', color: 'var(--tech-success)' },
    { label: '今日发现问题', value: '8', color: 'var(--tech-danger)' },
    { label: '已处理问题', value: '3', color: 'var(--tech-warning)' },
  ]);

  const [registerTable, { setProps }] = useTable({
    showIndexColumn: false,
    bordered: false,
    canResize: false,
    showTableSetting: false,
    useSearchForm: false,
    pagination: { pageSize: 10 },
    columns: taskColumns,
    dataSource: patrolTasks,
  });

  watch(
    tab,
    (t) => {
      setProps({
        columns: t === 'tasks' ? taskColumns : issueColumns,
        dataSource: t === 'tasks' ? patrolTasks : issueRecords,
      });
    },
    { immediate: true },
  );

  function handleSearch() {
    createMessage.info('查询');
  }

  function handleReset() {
    filterValues.value = { type: '', status: '' };
  }

  function handleAction(type: string) {
    createMessage.info(type);
  }

</script>

<style lang="less" scoped>
  @import '/@/assets/less/techTheme.less';

  .tech-page {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .tech-actions {
    display: flex;
    gap: 8px;
  }

  .tech-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--tech-cyan);
  }

  .tech-link-btn {
    border: none;
    background: transparent;
    color: var(--tech-cyan);
    cursor: pointer;
    font-size: 12px;
  }

  :deep(.tech-basic-table .ant-table) {
    background: transparent;
    color: var(--tech-text);
  }

  :deep(.tech-basic-table .ant-table-thead > tr > th) {
    background: rgba(0, 80, 160, 0.3);
    color: var(--tech-cyan);
    border-bottom: 1px solid var(--tech-border);
  }

  :deep(.tech-basic-table .ant-table-tbody > tr > td) {
    background: transparent;
    border-bottom: 1px solid rgba(0, 100, 200, 0.12);
    color: var(--tech-text);
  }

  :deep(.tech-basic-table .ant-table-tbody > tr:hover > td) {
    background: var(--tech-row-hover);
  }

  :deep(.tech-basic-table .ant-table-body::-webkit-scrollbar) {
    width: 4px;
    height: 4px;
  }
  :deep(.tech-basic-table .ant-table-body::-webkit-scrollbar-thumb) {
    background: var(--tech-border);
    border-radius: 2px;
  }
  :deep(.tech-basic-table .ant-table-body::-webkit-scrollbar-thumb:hover) {
    background: var(--tech-cyan-dim);
  }

  :deep(.tech-basic-table .ant-pagination) {
    color: var(--tech-text-dim);
  }

  :deep(.tech-basic-table .ant-pagination-item) {
    background: var(--tech-input-bg);
    border-color: var(--tech-border);
  }

  :deep(.tech-basic-table .ant-pagination-item a) {
    color: var(--tech-text-dim);
  }

  :deep(.tech-basic-table .ant-pagination-item-active) {
    background: var(--tech-active);
    border-color: var(--tech-active);
  }

  :deep(.tech-basic-table .ant-pagination-item-active a) {
    color: var(--tech-text);
  }

  :deep(.tech-basic-table .ant-pagination-prev button),
  :deep(.tech-basic-table .ant-pagination-next button) {
    color: var(--tech-text-dim);
  }
</style>
