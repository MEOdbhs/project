<template>
  <div class="tab-form-wrap block-list-wrap">

    <div v-for="(item, index) in listData" :key="item._id" class="record-block">
      <div class="block-header">
        <span class="block-title">风险管控{{ indexLabel(index) }}</span>
        <a-space v-if="!disabled">
          <a-button type="primary" size="small" @click="handleSaveRow(index)">保存</a-button>
          <a-button danger size="small" @click="handleDelete(index)">删除</a-button>
        </a-space>
      </div>

      <div class="block-body">
        <a-row :gutter="24">
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">主要风险名称</div>
              <a-input v-model:value="item.name" :disabled="disabled" placeholder="请输入主要风险名称" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">责任人</div>
              <a-input v-model:value="item.directorName" :disabled="disabled" placeholder="请输入责任人" />
            </div>
          </a-col>
          <a-col :span="24">
            <div class="field-wrap">
              <div class="field-label required-label">管控措施</div>
              <a-textarea v-model:value="item.controlMethod" :disabled="disabled" :auto-size="{ minRows: 3, maxRows: 6 }" placeholder="请输入管控措施" />
            </div>
          </a-col>
          <a-col :span="24">
            <div class="field-wrap">
              <div class="field-label required-label">保障制度制定情况</div>
              <a-textarea v-model:value="item.bzzdzdqk" :disabled="disabled" :auto-size="{ minRows: 3, maxRows: 6 }" placeholder="请输入保障制度制定情况" />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <div v-if="!disabled" class="add-btn-wrap">
      <a-button type="dashed" block @click="handleAdd">
        <PlusOutlined /> 风险管控
      </a-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

interface Props {
  detail?: Record<string, any> | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })
const emit = defineEmits<{ saveRecord: [record: Record<string, any>] }>()

const listData = ref<Record<string, any>[]>([])

const chineseNums = ['一','二','三','四','五','六','七','八','九','十']
function indexLabel(index: number) {
  return chineseNums[index] ?? String(index + 1)
}

watch(
  () => props.detail,
  (val) => {
    const raw = val?.riskControlDTOList
    listData.value = raw
      ? raw.map((item: any, i: number) => ({ ...item, _id: item.id ?? `_${i}_${Date.now()}` }))
      : []
  },
  { immediate: true, deep: true }
)

function getRecordPayload(item: Record<string, any>) {
  const { _id, ...rest } = item
  return rest
}

const REQUIRED_FIELDS: { key: string; label: string }[] = [
  { key: 'name', label: '主要风险名称' },
  { key: 'directorName', label: '责任人' },
  { key: 'controlMethod', label: '管控措施' },
  { key: 'bzzdzdqk', label: '保障制度制定情况' },
]

function isEmptyVal(val: unknown): boolean {
  if (val == null || val === '') return true
  if (typeof val === 'string') return val.trim() === ''
  return false
}

function validateRow(item: Record<string, any>): boolean {
  for (const { key, label } of REQUIRED_FIELDS) {
    if (isEmptyVal(item[key])) {
      message.warning(`请填写${label}`)
      return false
    }
  }
  return true
}

function handleSaveRow(index: number) {
  const item = listData.value[index]
  if (!item) return
  if (!validateRow(item)) return
  emit('saveRecord', getRecordPayload(item))
}

function handleAdd() {
  listData.value.push({ _id: `_new_${Date.now()}` })
}

function handleDelete(index: number) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条风险管控记录吗？',
    onOk() { listData.value.splice(index, 1) },
  })
}

async function validate(): Promise<Record<string, any>> {
  const first = listData.value[0]
  if (!first) return {}
  if (!validateRow(first)) throw new Error('validate failed')
  return getRecordPayload(first)
}

defineExpose({ validate })
</script>

<style lang="less" scoped>
@import './formClassComponent.less';
@import './blockList.less';
</style>
