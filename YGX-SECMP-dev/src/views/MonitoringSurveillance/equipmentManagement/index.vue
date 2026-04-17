<template>
  <!-- 设备管理 -->
  <div class="tech-page">
    <div class="tech-stats">
      <div v-for="s in statsData" :key="s.label" class="tech-stat">
        <div class="tech-stat__value" :style="{ color: s.color }">{{ s.value }}</div>
        <div class="tech-stat__label">{{ s.label }}</div>
      </div>
    </div>

    <div class="tech-filter">
      <div class="tech-filter__item">
        <span class="tech-filter__label">所属类别：</span>
        <div class="tech-filter__select">
          <select v-model="filterValues.category" class="tech-select">
            <option value="">请选择所属类别</option>
            <option value="geology">地质灾害</option>
            <option value="hydro">水文</option>
            <option value="forest">森林防火</option>
            <option value="mine">矿山</option>
            <option value="chemical">危化品</option>
            <option value="industry">工贸</option>
          </select>
        </div>
      </div>
      <div class="tech-filter__item">
        <span class="tech-filter__label">设备状态：</span>
        <div class="tech-filter__select">
          <select v-model="filterValues.status" class="tech-select">
            <option value="">请选择设备状态</option>
            <option value="online">在线</option>
            <option value="offline">离线</option>
            <option value="warning">告警</option>
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
        <div class="tech-card__title">监测监控设备列表</div>
        <button class="add-btn" type="button" @click="handleCreate">
          <Icon icon="mdi:plus" />
          新增设备
        </button>
      </div>
      <div class="tech-card__body">
        <BasicTable class="tech-basic-table" @register="registerTable">
          <template #action="{ record }">
            <div class="tech-actions">
              <button class="tech-icon-btn" type="button" @click="handleRealtime(record)">
                <Icon icon="mdi:chart-line" />
              </button>
              <button class="tech-icon-btn" type="button" @click="handleEdit(record)">
                <Icon icon="mdi:pencil-outline" />
              </button>
              <button class="tech-icon-btn tech-icon-btn--danger" type="button" @click="handleDelete(record)">
                <Icon icon="mdi:trash-can-outline" />
              </button>
            </div>
          </template>
        </BasicTable>
      </div>
    </div>

    <DeviceModal @register="registerDeviceModal" @success="handleModalSuccess" />
  </div>
</template>

<script setup lang="ts">
  import { computed, h, reactive, ref } from 'vue';
  import { BasicTable, useTable, type BasicColumn } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import DeviceModal from './components/DeviceModal.vue';

  const { createMessage, createConfirm } = useMessage();
  const [registerDeviceModal, { openModal: openDeviceModal }] = useModal();

  const filterValues = reactive<{ category: string; status: string; devNo: string }>({
    category: '',
    status: '',
    devNo: '',
  });

  const rawDevices = ref<Recordable[]>([
    { seq: 1, devNo: 'JC-GZ-0001', devName: '太极山位移传感器01', devType: '位移传感器', category: '地质灾害', location: '太极山北坡', manufacturer: '海拓仪器', installDate: '2023-05-12', status: 'online', signalStrength: 92 },
    { seq: 2, devNo: 'JC-GZ-0002', devName: '南山滑坡体雨量计', devType: '雨量计', category: '地质灾害', location: '南山滑坡体', manufacturer: '福克斯', installDate: '2023-06-20', status: 'online', signalStrength: 87 },
    { seq: 3, devNo: 'WW-SZ-0001', devName: '刘家峡水位计01', devType: '水位计', category: '水文', location: '刘家峡水库', manufacturer: '华仪仪器', installDate: '2022-11-05', status: 'online', signalStrength: 95 },
    { seq: 4, devNo: 'SL-WD-0001', devName: '西河林区温度传感器', devType: '温湿度传感器', category: '森林防火', location: '西河林区', manufacturer: '海拓仪器', installDate: '2023-08-15', status: 'offline', signalStrength: 0 },
    { seq: 5, devNo: 'KS-WS-0001', devName: '盐锅峡矿区瓦斯探头01', devType: '瓦斯传感器', category: '矿山', location: '02巷道进风口', manufacturer: '安科瑞', installDate: '2023-03-22', status: 'online', signalStrength: 78 },
    { seq: 6, devNo: 'HX-QT-0001', devName: '永靖化工氨气检测仪', devType: '有毒气体传感器', category: '危化品', location: '仓储区域', manufacturer: '科思仪器', installDate: '2023-09-01', status: 'warning', signalStrength: 55 },
    { seq: 7, devNo: 'GD-FB-0001', devName: '工业园区粉尘检测仪', devType: '粉尘传感器', category: '工贸', location: '生产车间A', manufacturer: '环科仪器', installDate: '2024-01-10', status: 'online', signalStrength: 90 },
  ]);

  const statsData = computed(() => {
    const list = rawDevices.value;
    return [
      { label: '设备总数', value: list.length, color: 'var(--tech-cyan)' },
      { label: '在线设备', value: list.filter((d) => d.status === 'online').length, color: 'var(--tech-success)' },
      { label: '离线设备', value: list.filter((d) => d.status === 'offline').length, color: 'var(--tech-danger)' },
      { label: '告警设备', value: list.filter((d) => d.status === 'warning').length, color: 'var(--tech-warning)' },
    ];
  });

  const columns: BasicColumn[] = [
    { title: '序号', dataIndex: 'seq', width: 60 },
    { title: '设备编号', dataIndex: 'devNo', width: 120 },
    { title: '设备名称', dataIndex: 'devName', width: 200 },
    { title: '设备类型', dataIndex: 'devType', width: 120 },
    { title: '所属类别', dataIndex: 'category', width: 100 },
    { title: '安装位置', dataIndex: 'location', width: 140 },
    { title: '厂商', dataIndex: 'manufacturer', width: 110 },
    { title: '安装日期', dataIndex: 'installDate', width: 110 },
    {
      title: '设备状态',
      dataIndex: 'status',
      width: 100,
      customRender: ({ text }) => {
        const map: Record<string, { label: string; color: string }> = {
          online: { label: '在线', color: 'var(--tech-success)' },
          offline: { label: '离线', color: 'var(--tech-danger)' },
          warning: { label: '告警', color: 'var(--tech-warning)' },
        };
        const s = map[String(text)] || map.online;
        return h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
          h('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: s.color, display: 'inline-block' } }),
          h('span', { style: { color: s.color } }, s.label),
        ]);
      },
    },
    {
      title: '信号强度',
      dataIndex: 'signalStrength',
      width: 130,
      customRender: ({ text }) => {
        const n = Number(text ?? 0);
        const color = n >= 80 ? 'var(--tech-success)' : n >= 50 ? 'var(--tech-warning)' : 'var(--tech-danger)';
        return h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
          h('div', { style: { flex: 1, height: '6px', borderRadius: '999px', overflow: 'hidden', background: 'var(--tech-input-bg)' } }, [
            h('div', { style: { width: `${n}%`, height: '100%', borderRadius: '999px', background: color } }),
          ]),
          h('span', { style: { width: '36px', fontSize: '12px', color: 'var(--tech-text-dim)' } }, `${n}%`),
        ]);
      },
    },
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
    dataSource: rawDevices.value,
  });

  function handleSearch() {
    createMessage.info('查询');
  }

  function handleReset() {
    filterValues.category = '';
    filterValues.status = '';
    filterValues.devNo = '';
  }

  function handleCreate() {
    openDeviceModal(true, { isUpdate: false, showFooter: true, record: {} });
  }

  function handleEdit(record: Recordable) {
    openDeviceModal(true, { isUpdate: true, showFooter: true, record });
  }

  function handleRealtime(record: Recordable) {
    createMessage.info(record.devNo);
  }

  function handleDelete(record: Recordable) {
    createConfirm({
      iconType: 'warning',
      title: '确认删除',
      content: `确认删除设备 ${record.devNo} 吗？`,
      onOk: () => {
        const list = getDataSource();
        const idx = list.findIndex((i) => i.devNo === record.devNo);
        if (idx > -1) list.splice(idx, 1);
        rawDevices.value = [...list];
        setTableData([...list]);
      },
    });
  }

  function handleModalSuccess({ isUpdate, values }: { isUpdate: boolean; values: Recordable }) {
    const list = getDataSource();
    if (isUpdate) {
      const idx = list.findIndex((i) => i.devNo === values.devNo);
      if (idx > -1) list[idx] = { ...list[idx], ...values };
    } else {
      list.push({ ...values, seq: list.length + 1 });
    }
    rawDevices.value = [...list];
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

  .add-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 4px;
    background: var(--tech-active);
    color: var(--tech-text);
    border: 1px solid var(--tech-active);
    cursor: pointer;
  }

  .tech-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
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

  .tech-icon-btn--danger {
    color: var(--tech-danger);
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
