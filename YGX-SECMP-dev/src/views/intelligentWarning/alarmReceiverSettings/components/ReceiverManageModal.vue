<template>
  <BasicModal :title="'管理接收人'" :width="1000" :destroyOnClose="true" @register="registerModal" @ok="handleOk"
    :showOkBtn="false" :cancelText="'关闭'">
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button type="primary" v-auth="'system:configuration:add'" preIcon="ant-design:plus-outlined"
          @click="handleAdd">
          新增
        </a-button>
      </template>
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
import { message } from 'ant-design-vue';
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
      {
        label: '删除',
        auth: 'system:configuration:delete',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
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
    message.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 新增
const handleAdd = () => {
  openModal(true, { type: 'add', row: null });
};

// 编辑
const handleEdit = (record) => {
  openModal(true, {
    type: 'edit',
    row: record,
    // receiveId: selectedConfigId.value,
  });
};

// 删除
const handleDelete = async (record) => {
  try {
    await deleteItem({ id: record.id }, () => { });
    message.success('删除成功');
    loadData();
  } catch (error) {
    message.error('删除失败');
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