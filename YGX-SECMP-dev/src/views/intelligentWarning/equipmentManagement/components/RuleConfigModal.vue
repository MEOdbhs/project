<template>
  <BasicModal :title="'运维预警配置'" :width="1000" :destroyOnClose="true" @register="registerModal" @ok="handleOk"
    :showOkBtn="false" :cancelText="'关闭'">
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>

    <AddOrEditData @register="registerModal" @success="reload" />

  </BasicModal>
</template>

<script lang="ts" setup>
import { BasicTable, TableAction } from '/@/components/Table';
import AddOrEditData from './AddOrEditDatas.vue';
import { ref, reactive, onMounted } from 'vue';
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';
import { getConfigList, deleteItem } from '../line.api';
import { column, searchFormSchemas } from '../line.data';
const [registerModal, { openModal }] = useModal();


const configOptions = ref([]);
const tableData = ref([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50'],
});
const { tableContext } = useListPage({
  designScope: 'chemicals-dangerous-template',
  tableProps: {
    title: '配置管理',
    api: getConfigList,
    columns: column,
    showIndexColumn: true,
    formConfig: {
      labelWidth: 80,
      rowProps: { gutter: 24 },
      schemas: searchFormSchemas,
    },
    actionColumn: {
      width: 200,
      fixed: 'right',
    },
  },
});
const [registerTable, { reload }] = tableContext;

function getTableAction(record) {
    return [
      {
        label: '编辑',
        auth: 'system:configuration:edit',
        onClick: handleEdit.bind(null, record),
      },
    ];
  }


// 加载接收人列表
const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    };
    const res = await getConfigList(params);
    tableData.value = res.records || [];
    pagination.total = res.total || 0;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};



// 编辑
const handleEdit = (record) => {
  console.log('编辑', record);
  openModal(true, {
    type: 'edit',
    row: record,
  });
};

// 删除
const handleDelete = async (record) => {
  try {
    await deleteItem({ id: record.id }, () => { });
    loadData();
  } catch (error) {
  }
};

// 关闭主弹窗
const handleOk = () => {
  openModal();
};
</script>

<style lang="less" scoped>
.receiver-manage {
  .filter-bar {
    margin-bottom: 16px;
  }
}
</style>