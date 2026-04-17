<template>
  <div>
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #datePicker>
        <a-date-picker style="width: 100%" v-model:value="searchFormModel.titile" placeholder="请选择排查日期" format="YYYY-MM-DD" />
      </template>
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button v-auth="'special-add'" type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增 </a-button>
        <a-button v-auth="'special-export'" type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出 </a-button>
        <!--        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">-->
        <!--          导入-->
        <!--        </j-upload-button>-->
        <a-dropdown v-if="selectedRowKeys.length > 0" v-auth="'special-delete'">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined"></Icon>
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button>
            批量操作
            <Icon icon="mdi:chevron-down"></Icon>
          </a-button>
        </a-dropdown>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>

    <!-- 表单区域 -->
    <addModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="ahh-sysTableWhiteList" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import addModal from './addModal.vue';
  import { columns, searchFormSchema } from './specialAssignment.data';
  import { deleteOne, getExportUrl, getImportUrl, list } from './specialAssignment.api';
  import { nextTick } from 'vue';
  import { useTableHeight } from '/@/hooks/system/useTableHeight';

  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '特殊作业',
      api: list,
      columns,
      canResize: false,
      showIndexColumn: true,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToTime: [['startTimeRange', ['startTime', 'endTime'], 'YYYY-MM-DD']],
      },
      actionColumn: {
        width: 150,
      },

      afterFetch: () => {
        //接口返回数据后
        nextTick(() => {
          setHeight();
        });
      },
    },
    exportConfig: {
      name: '特殊作业',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
    },
  });

  const [registerTable, { reload, getDataSource }, { selectedRowKeys, rowSelection }] = tableContext;
  const { setHeight } = useTableHeight(getDataSource);

  /**
   * 新增事件
   */
  function handleAdd() {
    openModal(true, { type: 'add', row: null });
  }

  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openModal(true, { type: 'edit', row: record });
  }

  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openModal(true, { type: 'view', row: record });
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, reload);
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    console.log(selectedRowKeys.value);
    if (selectedRowKeys.value && selectedRowKeys.value.length) {
      selectedRowKeys.value.forEach(async (item) => {
        await deleteOne({ id: item }, null);
      });
      reload();
      selectedRowKeys.value = [];
    }
  }

  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '查看',
        onClick: handleDetail.bind(null, record),
        auth: 'special-view',
      },
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'special-edit',
      },

      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
        auth: 'special-delete',
      },
    ];
  }
</script>
<style lang="less" scoped>
  ::v-deep .ant-tabs-nav {
    padding: 0 12px;
  }
</style>
