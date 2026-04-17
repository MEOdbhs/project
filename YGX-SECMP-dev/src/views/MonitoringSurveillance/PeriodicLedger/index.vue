<template>
  <!-- 设备生周期台账管理 -->
  <div class="tech-page">
    <div class="tech-stats">
      <div v-for="s in stageStats" :key="s.stage" class="tech-stat">
        <div class="tech-stat__value" :style="{ color: s.color }">{{ s.count }}</div>
        <div class="tech-stat__label">{{ s.stage }}阶段</div>
      </div>
    </div>

    <div class="tech-filter">
      <div class="tech-filter__item">
        <span class="tech-filter__label">生命周期阶段：</span>
        <div class="tech-filter__select">
          <select v-model="filterValues.stage" class="tech-select">
            <option value="">请选择生命周期阶段</option>
            <option value="入库">入库</option>
            <option value="运行">运行</option>
            <option value="维修">维修</option>
            <option value="报废">报废</option>
          </select>
        </div>
      </div>
      <div class="tech-filter__item">
        <span class="tech-filter__label">设备编号：</span>
        <input v-model="filterValues.devNo" class="tech-input" placeholder="请输入设备编号" />
      </div>
      <button class="tech-btn tech-btn--primary" type="button" @click="handleSearch">查询</button>
      <button class="tech-btn tech-btn--ghost" type="button" @click="handleReset">重置</button>
    </div>

    <div class="tech-card">
      <div class="tech-card__header">
        <div class="tech-card__title">设备生命周期管理</div>
      </div>
      <div class="tech-card__body">
        <BasicTable class="tech-basic-table" @register="registerTable">
          <template #action="{ record }">
            <div class="tech-actions">
              <button class="tech-link-btn" type="button" @click="handleView(record)">查看</button>
              <button class="tech-link-btn" type="button" @click="handleChange(record)">变更</button>
            </div>
          </template>
        </BasicTable>
      </div>
    </div>

    <LifecycleModal @register="registerLifecycleModal" @success="handleModalSuccess" />
  </div>
</template>

<script setup lang="ts">
  import { computed, h, reactive, ref } from 'vue';
  import { BasicTable, useTable, type BasicColumn } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import LifecycleModal from './components/LifecycleModal.vue';

  const { createMessage } = useMessage();
  const [registerLifecycleModal, { openModal: openLifecycleModal }] = useModal();

  const filterValues = reactive<{ stage: string; devNo: string }>({
    stage: '',
    devNo: '',
  });

  const lifecycleData = ref<Recordable[]>([
    { seq: 1, devNo: 'JC-GZ-0001', devName: '太极山位移传感器01', stage: '运行', installDate: '2023-05-12', warrantyEnd: '2025-05-12', lifeYear: 5, age: '2.8年', health: 85, maintenance: 8, nextMaintenance: '2026-04-12' },
    { seq: 2, devNo: 'JC-GZ-0002', devName: '南山雨量计', stage: '运行', installDate: '2023-06-20', warrantyEnd: '2025-06-20', lifeYear: 5, age: '2.7年', health: 78, maintenance: 6, nextMaintenance: '2026-04-20' },
    { seq: 3, devNo: 'WW-SZ-0001', devName: '刘家峡水位计01', stage: '运行', installDate: '2022-11-05', warrantyEnd: '2024-11-05', lifeYear: 6, age: '3.4年', health: 72, maintenance: 12, nextMaintenance: '2026-04-05' },
    { seq: 4, devNo: 'SL-WD-0001', devName: '西河林区温度传感器', stage: '维修', installDate: '2023-08-15', warrantyEnd: '2025-08-15', lifeYear: 5, age: '2.6年', health: 35, maintenance: 4, nextMaintenance: '—' },
    { seq: 5, devNo: 'KS-WS-0001', devName: '盐锅峡矿区瓦斯探头01', stage: '运行', installDate: '2023-03-22', warrantyEnd: '2025-03-22', lifeYear: 4, age: '3.0年', health: 60, maintenance: 9, nextMaintenance: '2026-04-22' },
    { seq: 6, devNo: 'OLD-GZ-0001', devName: '废弃位移传感器(旧)', stage: '报废', installDate: '2019-01-01', warrantyEnd: '2021-01-01', lifeYear: 5, age: '7.2年', health: 0, maintenance: 22, nextMaintenance: '—' },
  ]);

  const stageColorMap: Record<string, string> = {
    运行: 'var(--tech-success)',
    维修: 'var(--tech-warning)',
    报废: 'var(--tech-danger)',
    入库: 'var(--tech-cyan)',
  };

  const stageIconMap: Record<string, string> = {
    运行: 'mdi:package-variant',
    维修: 'mdi:wrench',
    报废: 'mdi:trash-can-outline',
    入库: 'mdi:reload',
  };

  const stageStats = computed(() => {
    const stages = ['运行', '维修', '报废', '入库'];
    return stages.map((stage) => ({
      stage,
      count: lifecycleData.value.filter((d) => d.stage === stage).length,
      color: stageColorMap[stage],
    }));
  });

  const columns: BasicColumn[] = [
    { title: '序号', dataIndex: 'seq', width: 60 },
    { title: '设备编号', dataIndex: 'devNo', width: 120 },
    { title: '设备名称', dataIndex: 'devName', width: 200 },
    {
      title: '生命周期阶段',
      dataIndex: 'stage',
      width: 120,
      customRender: ({ text }) => {
        const stage = String(text ?? '');
        const color = stageColorMap[stage] || 'var(--tech-text)';
        const icon = stageIconMap[stage];
        return h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
          h(Icon, { icon, style: { color } }),
          h('span', { style: { color } }, stage),
        ]);
      },
    },
    { title: '安装日期', dataIndex: 'installDate', width: 110 },
    { title: '保修截止', dataIndex: 'warrantyEnd', width: 110 },
    { title: '已用年限', dataIndex: 'age', width: 90 },
    {
      title: '健康度',
      dataIndex: 'health',
      width: 140,
      customRender: ({ text }) => {
        const n = Number(text ?? 0);
        const color = n >= 70 ? 'var(--tech-success)' : n >= 40 ? 'var(--tech-warning)' : 'var(--tech-danger)';
        return h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
          h('div', { style: { flex: 1, height: '6px', borderRadius: '999px', overflow: 'hidden', background: 'var(--tech-input-bg)' } }, [
            h('div', { style: { width: `${n}%`, height: '100%', borderRadius: '999px', background: color } }),
          ]),
          h('span', { style: { fontSize: '12px', color, width: '44px' } }, `${n}%`),
        ]);
      },
    },
    { title: '累计维护次数', dataIndex: 'maintenance', width: 110 },
    { title: '下次维护', dataIndex: 'nextMaintenance', width: 110 },
    { title: '操作', dataIndex: 'action', width: 120, slots: { customRender: 'action' }, fixed: 'right' },
  ];

  const [registerTable, { setTableData, getDataSource }] = useTable({
    showIndexColumn: false,
    bordered: false,
    canResize: false,
    showTableSetting: false,
    useSearchForm: false,
    pagination: { pageSize: 10 },
    columns,
    dataSource: lifecycleData.value,
  });

  function handleSearch() {
    createMessage.info('查询');
  }

  function handleReset() {
    filterValues.stage = '';
    filterValues.devNo = '';
  }

  function handleView(record: Recordable) {
    openLifecycleModal(true, { isUpdate: true, showFooter: false, record });
  }

  function handleChange(record: Recordable) {
    openLifecycleModal(true, { isUpdate: true, showFooter: true, record });
  }

  function handleModalSuccess({ values }: { values: Recordable }) {
    const list = getDataSource();
    const idx = list.findIndex((i) => i.devNo === values.devNo);
    if (idx > -1) list[idx] = { ...list[idx], ...values };
    lifecycleData.value = [...list];
    setTableData([...list]);
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
    gap: 12px;
    justify-content: center;
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
</style>
