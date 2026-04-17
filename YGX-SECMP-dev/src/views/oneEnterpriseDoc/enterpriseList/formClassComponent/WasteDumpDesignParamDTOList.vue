<template>
  <div class="tab-form-wrap block-list-wrap">

    <div v-for="(item, index) in listData" :key="item._id" class="record-block">
      <div class="block-header">
        <span class="block-title">排土场{{ indexLabel(index) }}</span>
        <a-space v-if="!disabled">
          <a-button type="primary" size="small" @click="handleSaveRow(index)">保存</a-button>
          <a-button danger size="small" @click="handleDelete(index)">删除</a-button>
        </a-space>
      </div>

      <div class="block-body">
        <a-row :gutter="24">
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">排土场名称</div>
              <a-input v-model:value="item.name" :disabled="disabled" placeholder="请输入排土场名称" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">排土场等级</div>
              <JDictSelectTag v-model:value="item.level" :disabled="disabled" dictCode="waste_dump_level" placeholder="请选择" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">排土场详细地址</div>
              <a-input v-model:value="item.address" :disabled="disabled" placeholder="请输入排土场详细地址" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">排土方式</div>
              <a-input v-model:value="item.dumpMode" :disabled="disabled" placeholder="请输入排土方式" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">拦渣坝方式</div>
              <a-input v-model:value="item.debrisDamMode" :disabled="disabled" placeholder="请输入拦渣坝方式" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">终了堆置高度（米）</div>
              <a-input-number v-model:value="item.confrontationHeight" :disabled="disabled" :precision="4" :step="0.0001" placeholder="请输入" style="width:100%" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">设计容积（万立方米）</div>
              <a-input-number v-model:value="item.volume" :disabled="disabled" :precision="4" :step="0.0001" placeholder="请输入" style="width:100%" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">终了台段数量（个）</div>
              <a-input-number v-model:value="item.quarryBenchCount" :disabled="disabled" :precision="0" :step="1" :min="0" placeholder="请输入" style="width:100%" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">终了边坡角（度）</div>
              <a-input-number v-model:value="item.slopeAngle" :disabled="disabled" :precision="4" :step="0.0001" placeholder="请输入" style="width:100%" />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <div v-if="!disabled" class="add-btn-wrap">
      <a-button type="dashed" block @click="handleAdd">
        <PlusOutlined /> 排土场参数
      </a-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue'

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
    const raw = val?.wasteDumpDesignParamDTOList
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

const REQUIRED_FIELDS: { key: string; label: string }[] = [
  { key: 'name', label: '排土场名称' },
  { key: 'level', label: '排土场等级' },
  { key: 'volume', label: '设计容积（万立方米）' },
  { key: 'quarryBenchCount', label: '终了台段数量（个）' },
]

function isEmptyVal(val: unknown): boolean {
  if (val == null || val === '') return true
  if (typeof val === 'string') return val.trim() === ''
  if (typeof val === 'number') return Number.isNaN(val)
  if (typeof val === 'object' && val !== null && typeof (val as { isValid?: () => boolean }).isValid === 'function') {
    return !(val as { isValid: () => boolean }).isValid()
  }
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

function handleDelete(index: number) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个排土场记录吗？',
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
