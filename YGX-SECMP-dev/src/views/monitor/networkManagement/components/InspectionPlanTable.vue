<template>
  <BasicTable :ellipsis="true" @register="registerTable" :searchInfo="searchInfo" :columns="inspectionPlanColumns"
    :expand-column-width="16">
    <template #tableTitle>
      <a-button v-auth="'monitor:networkManagement:add'" @click="handleAdd" class="mr-2" type="primary">新增</a-button>
    </template>
    <template #status="{ record, status }">
        <a-tag color="success" v-if="record.status === 0">启用</a-tag>
        <a-tag color="default" v-if="record.status === 1">停用</a-tag>
        <a-tag color="error" v-if="record.status === 2">已过期</a-tag>
      </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <AddOrEditInspectionPlan @register="registerModal" @success="handleSuccess" />
</template>

<script name="inspection-plan-table" setup lang="ts">
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { getInspectionPlanSaveOrUpdate, getInspectionPlanListPage,getInspectionPlanDeleteById,getInspectionPlanUpdateStatus } from '../network.api';
import { inspectionPlanColumns, searchFormSchema } from '../network.data';
import { useListPage } from '/@/hooks/system/useListPage';
import AddOrEditInspectionPlan from './AddOrEditInspectionPlan.vue';
import { useModal } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import { useUserStore } from '/@/store/modules/user'
const userStore = useUserStore()

interface Props {
  searchInfo: any;
}

const props = withDefaults(defineProps<Props>(), {
  searchInfo: () => ({})
});

const emit = defineEmits(['reload']);
const [registerModal, { openModal }] = useModal();

const searchSchema = searchFormSchema;

// 列表页面公共参数、方法
const { tableContext } = useListPage({
  designScope: 'inspection-plan',
  tableProps: {
    api: getInspectionPlanListPage,
    expandRowByClick: true,
    showActionColumn: true,
    actionColumn: {
      width: 0,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    rowSelection: {
      columnWidth: 20,
    },
    beforeFetch: (params) => {
      params.orgCode = userStore.currentEnterpriseCode
      return params
    },
    formConfig: {
      schemas: searchSchema,
      fieldMapToTime: [['fieldTime', ['createTime_begin', 'createTime_end'], 'YYYY-MM-DD']],
    },
  },
});

const [registerTable, { reload }] = tableContext;

/**
 * 新增
 */
function handleAdd() {
  openModal(true, { type: 'add', row: {} });
}

/**
 * 查看
 */
function handleView(record) {
  openModal(true, { type: 'view', row: record });
}

/**
* 编辑
*/
function handleEdit(record) {
  openModal(true, { type: 'edit', row: record });
}

/**
 * 保存成功回调
 */
function handleSuccess() {
  message.success('操作成功');
  emit('reload');
  setTimeout(() => reload(), 500);
}

/**
 * 删除
 */
const handleDelete = async (record) => {
  console.log('删除', record);
  try {
    await getInspectionPlanDeleteById({ id: record.id });
    message.success('删除成功');
    reload();
  } catch (error) {
    message.error('删除失败');
  }
}
/**
 * 启用
 */
const handleEnable = async (record) => {
  console.log('启用', record);
  try {
    await getInspectionPlanUpdateStatus({ id: record.id, status: record.status === 1 ? 0 : 1 });
    message.success('操作成功');
    reload();
  } catch (error) {
    message.error('操作失败');
  }
}

/**
* 操作栏
*/
function getTableAction(record) {
  return [
    ...(record.status === 1 || record.status === 0 ? [{
      label: record.status === 1 ? '启用' : '停用',
      auth: 'monitor:networkManagement:start',
      popConfirm: {
        title: '是否确认：' + (record.status === 1 ? '启用' : '停用'),
        confirm: handleEnable.bind(null, record),
      },
      
    }] : []),
    {
      label: '查看',
      auth: 'monitor:networkManagement:view',
      onClick: handleView.bind(null, record),
    },
    {
      label: '编辑',
      auth: 'monitor:networkManagement:edit',
      onClick: handleEdit.bind(null, record),
    },
    ...(record.status !== 0 ? [{
      label: '删除',
      auth: 'monitor:networkManagement:del',
      popConfirm: {
        title: '是否确认删除',
        confirm: handleDelete.bind(null, record),
      },
    }] : []),
  ];
}



// 暴露reload方法供父组件调用
defineExpose({
  reload
});
</script>
