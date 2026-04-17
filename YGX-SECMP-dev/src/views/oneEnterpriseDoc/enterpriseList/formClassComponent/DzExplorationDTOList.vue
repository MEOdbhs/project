<template>
  <div class="tab-form-wrap block-list-wrap">

    <div v-for="(item, index) in listData" :key="item._id" class="record-block">
      <div class="block-header">
        <span class="block-title">地质勘探单位{{ indexLabel(index) }}</span>
        <a-space v-if="!disabled">
          <a-button type="primary" size="small" @click="handleSaveRow(index)">保存</a-button>
          <a-button danger size="small" @click="handleDelete(index)">删除</a-button>
        </a-space>
      </div>

      <div class="block-body">
        <a-row :gutter="24">
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">市</div>
              <a-input v-model:value="item.cityName" :disabled="disabled" placeholder="请输入市" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">单位名称</div>
              <a-input v-model:value="item.companyName" :disabled="disabled" placeholder="请输入单位名称" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">办公地址</div>
              <a-input v-model:value="item.address" :disabled="disabled" placeholder="请输入办公地址" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">主要负责人姓名</div>
              <a-input v-model:value="item.userName" :disabled="disabled" placeholder="请输入主要负责人姓名" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">主要负责人电话</div>
              <a-input v-model:value="item.phone" :disabled="disabled" placeholder="请输入主要负责人电话" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">工商营业执照证号(事业单位法人证)</div>
              <a-input v-model:value="item.businessLicenseNumber" :disabled="disabled" placeholder="请输入证号" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">安全生产许可证号</div>
              <a-input v-model:value="item.safeLicenceNumber" :disabled="disabled" placeholder="请输入安全生产许可证号" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">安全生产许可证有效期限始</div>
              <a-date-picker v-model:value="item.safeStartDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">安全生产许可证有效期限至</div>
              <a-date-picker v-model:value="item.safeExpiresDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">上级单位</div>
              <a-input v-model:value="item.parentCompany" :disabled="disabled" placeholder="请输入上级单位" />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <div v-if="!disabled" class="add-btn-wrap">
      <a-button type="dashed" block @click="handleAdd">
        <PlusOutlined /> 地质勘探单位信息
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
    const raw = val?.dzExplorationDTOList
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
  { key: 'cityName', label: '市' },
  { key: 'companyName', label: '单位名称' },
  { key: 'address', label: '办公地址' },
  { key: 'userName', label: '主要负责人姓名' },
  { key: 'phone', label: '主要负责人电话' },
  { key: 'businessLicenseNumber', label: '工商营业执照证号(事业单位法人证)' },
  { key: 'safeLicenceNumber', label: '安全生产许可证号' },
  { key: 'safeStartDate', label: '安全生产许可证有效期限始' },
  { key: 'safeExpiresDate', label: '安全生产许可证有效期限至' },
]

function isEmptyVal(val: unknown): boolean {
  if (val == null || val === '') return true
  if (typeof val === 'string') return val.trim() === ''
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

function handleAdd() {
  listData.value.push({ _id: `_new_${Date.now()}` })
}

function handleDelete(index: number) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条地质勘探单位信息吗？',
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
