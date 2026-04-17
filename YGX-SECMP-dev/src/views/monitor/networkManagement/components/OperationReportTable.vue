<template>
  <BasicTable :ellipsis="true" @register="registerTable" :searchInfo="searchInfo" :columns="operationReportColumn"
    :expand-column-width="16">
  </BasicTable>
</template>

<script name="operation-report-table" setup lang="ts">
import { BasicTable, useTable } from '/@/components/Table';
import { getListDeviceReport } from '../network.api';
import { operationReportColumn, operationFormSchema } from '../network.data';
import { useListPage } from '/@/hooks/system/useListPage';
import { useUserStore } from '/@/store/modules/user'
const userStore = useUserStore()

interface Props {
  searchInfo: any;
}

const props = withDefaults(defineProps<Props>(), {
  searchInfo: () => ({})
});

const searchSchema = operationFormSchema;

// 列表页面公共参数、方法
const { tableContext } = useListPage({
  designScope: 'operation-report',
  tableProps: {
    api: getListDeviceReport,
    expandRowByClick: true,
    showActionColumn: false,
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

// 暴露reload方法供父组件调用
defineExpose({
  reload
});
</script>
