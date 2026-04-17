<template>
  <BasicTable :ellipsis="true" @register="registerTable" :searchInfo="searchInfo" :columns="columns"
    :expand-column-width="16">
  </BasicTable>
</template>

<script name="device-monitoring-table" setup lang="ts">
import { BasicTable, useTable } from '/@/components/Table';
import { getLogList } from '../network.api';
import { operationReportColumn, searchFormSchema } from '../network.data';
import { useListPage } from '/@/hooks/system/useListPage';

interface Props {
  searchInfo: any;
}

const props = withDefaults(defineProps<Props>(), {
  searchInfo: () => ({})
});

const columns = operationReportColumn;
const searchSchema = searchFormSchema;

// 列表页面公共参数、方法
const { tableContext } = useListPage({
  designScope: 'device-monitoring',
  tableProps: {
    api: getLogList,
    expandRowByClick: true,
    showActionColumn: false,
    rowSelection: {
      columnWidth: 20,
    },
    formConfig: {
      schemas: searchSchema,
      fieldMapToTime: [['fieldTime', ['createTime_begin', 'createTime_end'], 'YYYY-MM-DD']],
    },
  },
});

const [registerTable, { reload }] = tableContext;

// 暴露reload方法供父组件调用
defineExpose({
  reload
});
</script>
