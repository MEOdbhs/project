<template>
  <BasicModal
    :title="'选择物资'"
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
    <BasicTable ref="basicTableRef" @register="registerTable" :rowSelection="rowSelection" />
  </BasicModal>
</template>
<script setup lang="ts">
  import { nextTick, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { emergencyMaterialCategoryList } from '../rescueWarehousing.api';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { materialColumns,searchMaterialFormSchema } from '../rescueWarehousing.data';
  import { message } from 'ant-design-vue';
  const basicTableRef = ref();
  const emit = defineEmits(['select', 'register']);
  const readonly = ref(false);
  const selectedKeys = ref([]);
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
      api: emergencyMaterialCategoryList,
      immediate:false,
      columns: materialColumns,
      bordered: true, //默认是true，可不设置
      showActionColumn: false,
      rowSelection: { type: 'checkbox' },
      showTableSetting:false,
      rowKey: 'id',
       formConfig: {
            labelWidth: 80,
            rowProps: { gutter: 24 },
            schemas: searchMaterialFormSchema,
            autoAdvancedCol:4,
        },
    },
  });
  const [registerTable, { reload }, { rowSelection, selectedRowKeys, selectedRows }] = tableContext;
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
    setModalProps({ confirmLoading: false });
    closeModal();
  };
</script>
<style lang="less" scoped>

</style>
