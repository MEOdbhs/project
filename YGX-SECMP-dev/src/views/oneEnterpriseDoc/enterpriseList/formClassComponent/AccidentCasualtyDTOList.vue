<template>
  <div class="tab-form-wrap block-list-wrap accident-wrap">

    <!-- 顶部累计统计 -->
    <div class="stat-bar">
      <span class="stat-item">
        累计死亡人数：<span class="stat-num death">{{ totalDeathCount }}</span>
      </span>
      <span class="stat-item">
        累计受伤人数：<span class="stat-num injury">{{ totalInjuryCount }}</span>
      </span>
    </div>

    <div v-for="(item, index) in listData" :key="item._id" class="record-block">
      <div class="block-header">
        <span class="block-title">生产安全事故伤亡情况{{ indexLabel(index) }}</span>
        <a-space v-if="!disabled">
          <a-button type="primary" size="small" @click="handleSaveRow(index)">保存</a-button>
          <a-button danger size="small" @click="handleDelete(index)">删除</a-button>
        </a-space>
      </div>

      <div class="block-body">
        <a-row :gutter="24">
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">死亡人数</div>
              <a-input-number v-model:value="item.deathCount" :disabled="disabled" :precision="0" :step="1" :min="0" placeholder="请输入死亡人数" style="width:100%" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">重伤人数</div>
              <a-input-number v-model:value="item.severeWoundCount" :disabled="disabled" :precision="0" :step="1" :min="0" placeholder="请输入重伤人数" style="width:100%" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">轻伤人数</div>
              <a-input-number v-model:value="item.minorWoundCount" :disabled="disabled" :precision="0" :step="1" :min="0" placeholder="请输入轻伤人数" style="width:100%" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">事故情况描述</div>
              <a-textarea v-model:value="item.casualtiesDescribe" :disabled="disabled" :auto-size="{ minRows: 3, maxRows: 6 }" placeholder="请输入事故情况描述" />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <div v-if="!disabled" class="add-btn-wrap">
      <a-button type="dashed" block @click="handleAdd">
        <PlusOutlined /> 生产安全事故伤亡情况
      </a-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { deleteMineDetail } from '../enterprise.api'

const ACCIDENT_CASUALTY_PROPERTY = 'accidentCasualtyDTOList'

interface Props {
  detail?: Record<string, any> | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })
const emit = defineEmits<{
  saveRecord: [record: Record<string, any>]
  deleted: []
}>()

const listData = ref<Record<string, any>[]>([])

const totalDeathCount = computed(() =>
  listData.value.reduce((sum, r) => sum + (Number(r.deathCount) || 0), 0)
)
const totalInjuryCount = computed(() =>
  listData.value.reduce((sum, r) =>
    sum + (Number(r.severeWoundCount) || 0) + (Number(r.minorWoundCount) || 0), 0)
)

const chineseNums = ['一','二','三','四','五','六','七','八','九','十']
function indexLabel(index: number) {
  return chineseNums[index] ?? String(index + 1)
}

watch(
  () => props.detail,
  (val) => {
    const raw = val?.accidentCasualtyDTOList
    listData.value = raw
      ? raw.map((item: any, i: number) => ({ ...item, _id: item.id ?? `_${i}_${Date.now()}` }))
      : []
  },
  { immediate: true, deep: true }
)

function handleAdd() {
  listData.value.push({ _id: `_new_${Date.now()}` })
}

function getRecordPayload(item: Record<string, any>) {
  const { _id, ...rest } = item
  return rest
}

function handleSaveRow(index: number) {
  const item = listData.value[index]
  if (item) emit('saveRecord', getRecordPayload(item))
}

function handleDelete(index: number) {
  const item = listData.value[index]
  console.log(item.id)
  if (!item) return
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条事故伤亡情况记录吗？',
    async onOk() {
      const rowId = item.id
      
      try {
        await deleteMineDetail({ deleteId: rowId, mineDetailProperty: ACCIDENT_CASUALTY_PROPERTY })
        message.success('删除成功')
        emit('saveRecord')
      } catch (e) {
        console.error(e)
        message.error('删除失败，请稍后重试')
        throw e
      }
    },
  })
}

async function validate(): Promise<Record<string, any>> {
  const first = listData.value[0]
  return first ? getRecordPayload(first) : {}
}

defineExpose({ validate })
</script>

<style lang="less" scoped>
@import './formClassComponent.less';
@import './blockList.less';

.accident-wrap {
  .stat-bar {
    display: flex;
    gap: 48px;
    margin-bottom: 20px;
    padding: 12px 20px;
    background: #002d57;
    border: 1px solid #0d3a5e;
    border-radius: 6px;

    .stat-item {
      color: #8fbcdb;
      font-size: 14px;
    }

    .stat-num {
      font-size: 20px;
      font-weight: 700;
      margin-left: 6px;

      &.death  { color: #ff4d4f; }
      &.injury { color: #fa8c16; }
    }
  }
}
</style>
