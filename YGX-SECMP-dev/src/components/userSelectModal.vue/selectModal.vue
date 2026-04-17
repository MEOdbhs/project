<template>
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      title="用户选择列表"
      width="1000px"
      @ok="handleSubmit"
      destroyOnClose
      @open-change="handleOpenChange"
    >
      <BasicTable @register="registerTable" :rowSelection="rowSelection" />
    </BasicModal>
  </template>
  <script lang="ts" setup>
    import { ref, unref, toRaw, computed } from 'vue';
    import type { TableRowSelection } from '@/components/Table';
    import { BasicModal, useModalInner } from '@/components/Modal';
    import { BasicTable, useTable } from '@/components/Table';
    import { userColumns, searchUserFormSchema } from './role.data';
    import { list } from './user.api';
    // 声明Emits
    const emit = defineEmits(['select', 'register', 'selectRows']);
    const props = defineProps({
      rowSelectionType: {
        type: String,
        default: 'checkbox', // 单选：radio，多选：checkbox
      },
    });
    const checkedKeys = ref<Array<string | number>>([]);
    const checkedRows = ref<any[]>([]);
    const otherParams = ref<any>(null);

    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data: any) => {
      // 接收外部传入的参数（包含当前已选数据）
      otherParams.value = data?.otherParams ?? null;
      if (data?.selectedKeys) {
        checkedKeys.value = data.selectedKeys as Array<string | number>;
      }
      if (data?.selectedRows) {
        checkedRows.value = data.selectedRows as any[];
      }
    });
    //注册table数据
    const [registerTable] = useTable({
      api: list,
      rowKey: 'realname',
      columns: userColumns,
      formConfig: {
        labelWidth: 60,
        schemas: searchUserFormSchema,
        baseRowStyle: { maxHeight: '20px' },
        autoSubmitOnEnter: true,
      },
      striped: true,
      useSearchForm: true,
      showTableSetting: false,
      bordered: true,
      showIndexColumn: false,
      canResize: false,
    });
    /**
     * 选择列配置
     * 根据外部传入的 rowSelectionType 支持单选 / 多选
     */
    const rowSelection = computed<TableRowSelection>(() => ({
      type: (props.rowSelectionType as 'radio' | 'checkbox') || 'checkbox',
      columnWidth: 50,
      selectedRowKeys: unref(checkedKeys),
      onChange: onSelectChange,
    }));
    /**
     * 选择事件
     */
    function onSelectChange(selectedRowKeys: (string | number)[], selectedRows: any[]) {
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
      setModalProps({ confirmLoading: true });
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('select', toRaw(unref(checkedKeys)), otherParams.value);
      emit('selectRows', toRaw(unref(checkedRows)), otherParams.value);
      setModalProps({ confirmLoading: false });
    }
  </script>
  