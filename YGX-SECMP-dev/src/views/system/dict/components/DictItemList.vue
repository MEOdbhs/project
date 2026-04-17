<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="字典列表" width="800px">
    <BasicTable @register="registerTable" :rowClassName="getRowClassName">
      <template #tableTitle>
        <a-button type="primary" @click="handleCreate"> 新增</a-button>
        <a-button type="primary" @click="handleBatchImport" style="margin-left: 8px"> 批量录入</a-button>
      </template>
      <template v-slot:bodyCell="{column, record, index}">
        <template v-if="column.dataIndex ==='action'">
          <TableAction :actions="getTableAction(record)" />
        </template>
      </template>
     
    </BasicTable>
  </BasicDrawer>
  <DictItemModal @register="registerModal" @success="reload" :dictId="dictId" />
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/src/components/Drawer';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { useModal } from '/src/components/Modal';
  import { useDesign } from '/@/hooks/web/useDesign';
  import DictItemModal from './DictItemModal.vue';
  import { dictItemColumns, dictItemSearchFormSchema } from '../dict.data';
  import { itemList, deleteItem, saveOrUpdateDictItem } from '../dict.api';
  import { ColEx } from '/@/components/Form/src/types';
  import { message } from 'ant-design-vue';

  const { prefixCls } = useDesign('row-invalid');
  const dictId = ref('');
  //字典配置model
  const [registerModal, { openModal }] = useModal();
  const [registerDrawer] = useDrawerInner(async (data) => {
    dictId.value = data.id;
    setProps({ searchInfo: { dictId: unref(dictId) } });
    reload();
  });
  // 自适应列配置
  const adaptiveColProps: Partial<ColEx> = {
    xs: 24, // <576px
    sm: 24, // ≥576px
    md: 24, // ≥768px
    lg: 12, // ≥992px
    xl: 12, // ≥1200px
    xxl: 8, // ≥1600px
  };
  const [registerTable, { reload, setProps }] = useTable({
    //需要配置rowKey，否则会有警告
    rowKey:'dictId',
    api: itemList,
    columns: dictItemColumns,
    formConfig: {
      baseColProps: adaptiveColProps,
      labelAlign: 'right',
      labelCol: {
        offset: 1,
        xs: 24,
        sm: 24,
        md: 24,
        lg: 9,
        xl: 7,
        xxl: 4,
      },
      wrapperCol: {},
      schemas: dictItemSearchFormSchema,
      autoSubmitOnEnter: true,
      actionColOptions: {
        span: 8
      }
    },
    striped: true,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    immediate: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      //slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  /**
   * 新增
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  /**
   * 编辑
   */
  function handleEdit(record) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record) {
    await deleteItem({ id: record.id }, reload);
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }

  /**
   * 批量录入
   */
  async function handleBatchImport() {
    const batchData = [
      { itemText: '综合应急预案', itemValue: 'ZHYJYAY', code: 'ZHYJYA' },
      { itemText: '专项应急预案', itemValue: 'ZXYJYAY', code: 'ZXYJYA' },
      { itemText: '现场处置预案', itemValue: 'XCCZYA', code: 'XCCZYA' },
    ];

    try {
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < batchData.length; i++) {
        const item = batchData[i];
        try {
          await saveOrUpdateDictItem({
            itemText: item.itemText,
            itemValue: item.itemValue,
            sortOrder: i + 1,
            status: 1,
            dictId: unref(dictId)
          }, false);
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`录入失败: ${item.itemText}`, error);
        }
      }
      
      message.success(`批量录入完成! 成功: ${successCount}条, 失败: ${failCount}条`);
      reload();
    } catch (error) {
      message.error('批量录入失败,请稍后再试');
    }
  }

  function getRowClassName(record) {
    return record.status == 0 ? prefixCls : '';
  }
</script>
<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-row-invalid';

  :deep(.@{prefix-cls}) {
    background: #f4f4f4;
    color: #bababa;
  }
</style>
