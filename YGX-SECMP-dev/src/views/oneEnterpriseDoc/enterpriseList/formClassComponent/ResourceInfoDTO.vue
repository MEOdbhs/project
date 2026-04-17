<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">
      <a-divider orientation="left">资源储量信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="保有储量" name="availableReserves">
            <a-input-number v-model:value="formModel.availableReserves" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="可采储量" name="recoverableReserves">
            <a-input-number v-model:value="formModel.recoverableReserves" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="开拓煤量" name="developmentCoalQuantity">
            <a-input-number v-model:value="formModel.developmentCoalQuantity" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="准备煤量" name="coalPreparation">
            <a-input-number v-model:value="formModel.coalPreparation" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="回采煤量" name="coalRecovery">
            <a-input-number v-model:value="formModel.coalRecovery" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="安全煤量" name="safeCoalQuantity">
            <a-input-number v-model:value="formModel.safeCoalQuantity" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  detail?: Record<string, any> | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const formRef = ref()
const formModel = ref<Record<string, any>>({})

watch(
  () => props.detail,
  (val) => {
    formModel.value = val?.resourceInfoDTO ? { ...val.resourceInfoDTO } : {}
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
