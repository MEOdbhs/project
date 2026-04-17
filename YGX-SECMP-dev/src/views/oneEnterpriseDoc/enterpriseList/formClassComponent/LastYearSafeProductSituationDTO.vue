<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">
      <a-divider orientation="left">上年度安全生产情况</a-divider>
      <a-row :gutter="24">
        <!-- 三种矿山类型共用字段 -->
        <a-col :span="12">
          <a-form-item label="生产（建设）天数（天）" name="productDays">
            <a-input-number v-model:value="formModel.productDays" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="停产（停工）天数（天）" name="stopDays">
            <a-input-number v-model:value="formModel.stopDays" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="停产停工原因" name="stopReason">
            <a-input v-model:value="formModel.stopReason" :disabled="disabled" />
          </a-form-item>
        </a-col>

        <!-- 地下矿山 & 露天矿山：上年度产量 -->
        <a-col v-if="isDx || isLt" :span="12">
          <a-form-item label="上年度产量（万吨）" name="lastYearYield">
            <a-input-number v-model:value="formModel.lastYearYield" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
          </a-form-item>
        </a-col>

        <!-- 尾矿库：子坝上升高度 + 增加容量 -->
        <template v-if="isWk">
          <a-col :span="12">
            <a-form-item label="上年度子坝上升高度（m）" name="wkSndzbssgd">
              <a-input-number v-model:value="formModel.wkSndzbssgd" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="上年度增加容量（万立方米）" name="wkSndzjrl">
              <a-input-number v-model:value="formModel.wkSndzjrl" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
        </template>
      </a-row>

      <a-divider orientation="left">事故情况</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="事故起数" name="accidentCount">
            <a-input-number v-model:value="formModel.accidentCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="死亡人数" name="deathCount">
            <a-input-number v-model:value="formModel.deathCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="重伤人数" name="severeWoundCount">
            <a-input-number v-model:value="formModel.severeWoundCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="轻伤人数" name="minorWoundCount">
            <a-input-number v-model:value="formModel.minorWoundCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  detail?: Record<string, any> | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const formRef = ref()
const formModel = ref<Record<string, any>>({})

const mineType = computed(() => {
  const raw = props.detail?.mineType ?? props.detail?.companyType
  return raw == null ? '' : String(raw)
})

// MineType: 00地下矿山 01露天矿山(含排土场) 03尾矿库
const isDx = computed(() => mineType.value === '00')
const isLt = computed(() => mineType.value === '01')
const isWk = computed(() => mineType.value === '03')

watch(
  () => props.detail,
  (val) => {
    formModel.value = val?.lastYearSafeProductSituationDTO ? { ...val.lastYearSafeProductSituationDTO } : {}
  },
  { immediate: true, deep: true }
)

async function validate(): Promise<Record<string, any>> {
  await formRef.value?.validate()
  return { ...formModel.value }
}

defineExpose({ validate })
</script>

<style lang="less" scoped>
@import './formClassComponent.less';
</style>
