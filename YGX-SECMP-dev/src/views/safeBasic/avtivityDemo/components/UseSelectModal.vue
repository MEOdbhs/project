<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="人员选择"
    width="1000px"
    @ok="handleSubmit"
    destroyOnClose
    @open-change="handleOpenChange"
  >
    <BasicTable @register="registerTable" :rowSelection="rowSelection" />
  </BasicModal>
</template>
<script setup>
  import { ref, unref, toRaw } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { staffListPage } from '../line.api';
  import { message } from 'ant-design-vue';
  const staffColumns = [
    {
      title: '人员姓名',
      dataIndex: 'staffName',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      width: 150,
    },
    {
      title: '岗位',
      dataIndex: 'position',
    },
  ];
  const searchStaffFormSchema = [
    {
      field: 'staffName',
      label: '人员姓名',
      component: 'Input',
      colProps: { span: 12 },
      labelWidth: 74,
    },
  ];
  // 声明Emits
  const emit = defineEmits(['select', 'register', 'selectRows']);
  const props = defineProps({
    rowSelectionType: {
      type: String,
      default: 'radio', // 单选：radio，多选：checkbox
    },
    orgCode: {
      type: String,
      default: '',
    },
  });
  const checkedKeys = ref([]);
  const checkedRows = ref([]);
  const otherParams = ref(null);
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    otherParams.value = data.otherParams;
  });

  //注册table数据
  const [registerTable, { reload }] = useTable({
    api: staffListPage,
    rowKey: 'id',
    columns: staffColumns,
    formConfig: {
      labelWidth: 60,
      schemas: searchStaffFormSchema,
      baseRowStyle: { maxHeight: '20px' },
      autoSubmitOnEnter: true,
    },
    striped: true,
    useSearchForm: true,
    showTableSetting: false,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    beforeFetch: (params) => {
      params.column = 'createTime';
      params.order = 'desc';
      params.orgCode = props.orgCode;
      return params;
    },
  });
  /**
   * 选择列配置
   */
  const rowSelection = {
    type: props.rowSelectionType || 'radio',
    columnWidth: 50,
    selectedRowKeys: checkedKeys,
    onChange: onSelectChange,
  };
  /**
   * 选择事件
   */
  function onSelectChange(selectedRowKeys, selectedRows) {
    checkedKeys.value = selectedRowKeys;
    checkedRows.value = selectedRows;
  }

  const handleOpenChange = (visible) => {
    // -update-begin--author:liaozhiyang---date:20240702---for：【TV360X-1679】系统角色-角色用户再次打开弹窗重置之前选中的状态
    if (visible) {
      checkedKeys.value = [];
      checkedRows.value = [];
    }
    // -update-end--author:liaozhiyang---date:20240702---for：【TV360X-1679】系统角色-角色用户再次打开弹窗重置之前选中的状态
  };

  //提交事件
  function handleSubmit() {
    if (checkedKeys.value.length === 0) {
      message.info('请选择人员');
      return;
    }
    //关闭弹窗
    closeModal();
    //刷新列表
    emit('select', toRaw(unref(checkedKeys)), otherParams.value);
    emit('selectRows', toRaw(unref(checkedRows)), otherParams.value);
  }
</script>
<style lang="less" scoped>
  :deep(.ant-form) {
    height: 6rem;
  }
</style>