<template>
  <a-table :columns="columns" :data-source="dataSource" :pagination="false" :rowKey="(record) => record.id" size="small">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'nowStock'">
        <a-input-number
          v-model:value="record.nowStock"
          :min="0"
          :precision="0"
          :disabled="readonly"
          style="width: 100%"
          placeholder="请输入实际库存"
          @change="calcDifference(record)"
        />
      </template>
      <template v-if="column.dataIndex === 'difference'">
        {{ record.difference }}
      </template>
      <template v-if="column.dataIndex === 'remark'">
        <a-input v-model:value="record.remark" :disabled="readonly" allowClear placeholder="请输入备注" />
      </template>
    </template>
  </a-table>
  <div class="goods-pagination">
    <a-pagination
      v-if="pagination.total > 0"
      :current="pagination.current"
      :pageSize="pagination.pageSize"
      :total="pagination.total"
      :show-size-changer="true"
      :show-quick-jumper="true"
      :show-total="(total) => `共 ${total} 条`"
      @change="handlePageChange"
      @showSizeChange="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
  import { Pagination as APagination } from 'ant-design-vue';

  defineProps({
    columns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default: () => ({
        current: 1,
        pageSize: 10,
        total: 0,
      }),
    },
  });

  const emit = defineEmits(['page-change', 'size-change']);

  // 分页变化统一向父组件抛出事件，由父组件决定如何发请求
  const handlePageChange = (page: number, pageSize: number) => {
    emit('page-change', page, pageSize);
  };

  // 每页条数变化同样只转发，避免在子组件里引入业务状态
  const handleSizeChange = (current: number, pageSize: number) => {
    emit('size-change', current, pageSize);
  };

  // 计算差异
  const calcDifference = (record: any) => {
    const nowStock = Number(record.nowStock || 0);
    const sysStock = Number(record.sysStock || 0);
    record.difference = nowStock - sysStock;
  };
</script>

<style scoped>
  .goods-pagination {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
</style>
