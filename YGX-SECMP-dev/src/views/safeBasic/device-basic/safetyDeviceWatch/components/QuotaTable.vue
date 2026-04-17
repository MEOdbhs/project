<template>
  <div class="quota-table">
    <a-button type="primary" @click="handleAdd" :disabled="disabled" class="mb-2">新增</a-button>
    <a-table 
      :dataSource="dataSource" 
      :columns="columns" 
      :pagination="false"
      :scroll="{ x: 1200, y: 600 }"
      rowKey="key"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'quotaType'">
          <JDictSelectTag 
            v-model:value="record.quotaType" 
            placeholder="请选择" 
            dictCode="safe_device_quota_type" 
            :showChooseOption="false"
            :disabled="disabled"
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          />
        </template>
        <template v-else-if="column.dataIndex === 'quotaName'">
          <a-input v-model:value="record.quotaName" placeholder="请输入" :disabled="disabled" />
        </template>
        <template v-else-if="column.dataIndex === 'quotaCode'">
          <a-input v-model:value="record.quotaCode" placeholder="请输入" :disabled="disabled" />
        </template>
        <template v-else-if="column.dataIndex === 'unit'">
          <!-- <a-select v-model:value="record.unit" placeholder="请选择" :disabled="disabled" allowClear>
            <a-select-option value="%">%</a-select-option>
            <a-select-option value="Kpa">Kpa</a-select-option>
            <a-select-option value="ppm">ppm</a-select-option>
          </a-select> -->
          <JDictSelectTag 
            v-model:value="record.unit" 
            placeholder="请选择" 
            dictCode="safe_device_quota_unit" 
            :showChooseOption="false"
            :disabled="disabled"
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          />
        </template>
        <template v-else-if="column.dataIndex === 'meterUpperLimit'">
          <a-input-number v-model:value="record.meterUpperLimit" placeholder="请输入" :disabled="disabled" style="width: 100%" />
        </template>
        <template v-else-if="column.dataIndex === 'meterLowerLimit'">
          <a-input-number v-model:value="record.meterLowerLimit" placeholder="请输入" :disabled="disabled" style="width: 100%" />
        </template>
        <template v-else-if="column.dataIndex === 'redThreshold'">
          <a-input-number v-model:value="record.redThreshold" placeholder="请输入" :disabled="disabled" :precision="2" :step="0.01" style="width: 100%" />
        </template>
        <template v-else-if="column.dataIndex === 'orangeThreshold'">
          <a-input-number v-model:value="record.orangeThreshold" placeholder="请输入" :disabled="disabled" :precision="2" :step="0.01" style="width: 100%" />
        </template>
        <template v-else-if="column.dataIndex === 'yellowThreshold'">
          <a-input-number v-model:value="record.yellowThreshold" placeholder="请输入" :disabled="disabled" :precision="2" :step="0.01" style="width: 100%" />
        </template>
        <template v-else-if="column.dataIndex === 'blueThreshold'">
          <a-input-number v-model:value="record.blueThreshold" placeholder="请输入" :disabled="disabled" :precision="2" :step="0.01" style="width: 100%" />
        </template>
        <template v-else-if="column.dataIndex === 'secondThresholdUpper'">
          <a-input-number v-model:value="record.secondThresholdUpper" placeholder="请输入" :disabled="disabled" style="width: 100%" />
        </template>
        <template v-else-if="column.dataIndex === 'secondThresholdLower'">
          <a-input-number v-model:value="record.secondThresholdLower" placeholder="请输入" :disabled="disabled" style="width: 100%" />
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a-popconfirm
            title="确定要删除这条指标吗？"
            @confirm="handleDelete(record, index)"
            :disabled="disabled"
          >
            <a-button type="link" danger :disabled="disabled">删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
  import { deleteQuota } from '../line.api';

  const props = defineProps({
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['update:value', 'deleteSuccess']);

  const dataSource = ref([]);

  // 表格列定义
  const columns = [
    {
      title: '指标类型',
      dataIndex: 'quotaType',
      width: 150,
    },
    {
      title: '指标名称',
      dataIndex: 'quotaName',
      width: 150,
    },
    {
      title: '指标编码',
      dataIndex: 'quotaCode',
      width: 150,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 120,
    },
    {
      title: '仪表量程上限',
      dataIndex: 'meterUpperLimit',
      width: 120,
    },
    {
      title: '仪表量程下限',
      dataIndex: 'meterLowerLimit',
      width: 120,
    },
    {
      title: '红色预警',
      dataIndex: 'redThreshold',
      width: 120,
    },
    {
      title: '橙色预警',
      dataIndex: 'orangeThreshold',
      width: 120,
    },
    {
      title: '黄色预警',
      dataIndex: 'yellowThreshold',
      width: 120,
    },
    {
      title: '蓝色预警',
      dataIndex: 'blueThreshold',
      width: 120,
    },
    // {
    //   title: '二级阈值上限',
    //   dataIndex: 'secondThresholdUpper',
    //   width: 120,
    // },
    // {
    //   title: '二级阈值下限',
    //   dataIndex: 'secondThresholdLower',
    //   width: 120,
    // },
    {
      title: '操作',
      dataIndex: 'action',
      width: 80,
      fixed: 'right',
    },
  ];

  // 标记是否是内部更新,避免循环触发
  let isInternalUpdate = false;

  // 监听外部传入的值变化
  watch(() => props.value, (newVal) => {
    if (isInternalUpdate) {
      isInternalUpdate = false;
      return;
    }
    if (newVal && newVal.length > 0) {
      dataSource.value = newVal.map((item, index) => ({
        ...item,
        key: item.key || item.id || `quota_${Date.now()}_${index}`,
      }));
    } else {
      dataSource.value = [];
    }
  }, { immediate: true, deep: true });

  // 监听数据源变化，同步到外部
  watch(dataSource, (newVal) => {
    isInternalUpdate = true;
    emit('update:value', newVal);
  }, { deep: true });

  /**
   * 新增行
   */
  const handleAdd = () => {
    const newRow = {
      key: `quota_${Date.now()}_${dataSource.value.length}`,
      quotaType: '',
      quotaName: '',
      quotaCode: '',
      unit: '',
      meterUpperLimit: null,
      meterLowerLimit: null,
      redThreshold: null,
      orangeThreshold: null,
      yellowThreshold: null,
      blueThreshold: null,
      secondThresholdUpper: null,
      secondThresholdLower: null,
    };
    dataSource.value.push(newRow);
  };

  /**
   * 删除行
   */
  const handleDelete = async (record, index) => {
    // 如果有id，说明是已保存的数据，需要调用接口删除
    if (record.id) {
      try {
        await deleteQuota(record.id);
        message.success('删除成功');
        dataSource.value.splice(index, 1);
        emit('deleteSuccess');
      } catch (error) {
        message.error('删除失败');
        console.error('删除指标失败:', error);
      }
    } else {
      // 新增但未保存的数据，直接从数组中移除
      dataSource.value.splice(index, 1);
    }
  };
</script>

<style lang="less" scoped>
.quota-table {
  margin-bottom: 2rem;
  
  :deep(.ant-table) {
    .ant-table-cell {
      padding: 8px;
    }
    
    // 确保表格内容不会隐藏下拉框
    .ant-table-body {
      overflow: visible !important;
    }
    
    .ant-table-content {
      overflow-x: auto;
      overflow-y: visible;
    }
  }
  
  // 确保下拉框能够正常显示
  :deep(.ant-select-dropdown) {
    z-index: 1050;
  }
}
</style>

