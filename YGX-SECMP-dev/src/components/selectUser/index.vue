<template>
  <BasicModal
    :title="'选择'"
    :width="'60vw'"
    :height="540"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    v-bind="$attrs"
    :maskClosable="false"
    :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'"
    :showOkBtn="!readonly"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="select_user">
      <div class="left_tree">
        <a-tree defaultExpandAll v-model:selectedKeys="selectedKeys" :tree-data="leftTreeData" :rowKey="'id'" @select="handleTreeSelect">
          <template #title="data">
            <div>{{ data.departName }}</div>
          </template>
        </a-tree>
      </div>
      <div class="right_table">
        <BasicTable ref="basicTableRef" @register="registerTable" :rowSelection="rowSelection" />
      </div>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { nextTick, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { queryTreeList } from '/@/views/system/depart/depart.api';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { userInfoColumns } from './index.data';
  import { departUserList } from '/@/views/system/departUser/depart.user.api';
  import { message } from 'ant-design-vue';
  const basicTableRef = ref();
  const props = defineProps({
    roleId: {
      type: String,
      default: null,
    },
  });
  const emit = defineEmits(['select', 'register']);
  const readonly = ref(false);
  const leftTreeData = ref([]);
  const selectedKeys = ref([]);
  const deptId = ref('');
  const type = ref('');
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    type.value = data.type;
    if (data.data && data.data.length > 0) {
      nextTick(() => {
        basicTableRef.value.setSelectedRowKeys(data.data);
      });
    }
    reload();
  });
  const { tableContext } = useListPage({
    designScope: 'login-log',
    tableProps: {
      api: departUserList,
      columns: userInfoColumns,
      bordered: true, //默认是true，可不设置
      showActionColumn: false,
      rowSelection: { type: 'checkbox' },
      beforeFetch(params) {
        params.depId = deptId.value;
        params.roleId = props.roleId;
      },
    },
  });
  const [registerTable, { reload }, { rowSelection, selectedRowKeys, selectedRows }] = tableContext;
  queryTreeList().then((res) => {
    leftTreeData.value = res;
  });
  const handleTreeSelect = (selectedKeys: any, { node }) => {
    deptId.value = selectedKeys && selectedKeys.length > 0 ? node.id : '';
    reload();
  };
  const handleOk = async () => {
    if (selectedRowKeys.value.length == 0) {
      message.warning('请选择数据');
      return;
    }
    if (type.value === 'single' && selectedRowKeys.value.length > 1) {
      message.warning('只能选择一条数据');
      return;
    }
    // 新增传递当前选择的行数据
    emit('select', selectedRowKeys.value, selectedRows.value);
    handleCancel();
  };
  const handleCancel = () => {
    selectedRowKeys.value = [];
    selectedKeys.value = [];
    deptId.value = '';
    setModalProps({ confirmLoading: false });
    closeModal();
  };
</script>
<style lang="less" scoped>
  .select_user {
    display: flex;
    height: 100%;
    overflow: hidden;

    .left_tree {
      width: 220px;
      min-width: 220px;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 10px;
      border-right: 1px solid #f0f0f0;

      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background: #d9d9d9;
        border-radius: 4px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }

    .right_table {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background: #d9d9d9;
        border-radius: 4px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }
  }
</style>
