<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">
      <a-divider orientation="left">工厂目录</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="工厂名称"
            name="factoryName"
            :rules="[{ required: true, message: '请输入工厂名称' }]"
          >
            <a-input v-model:value="formModel.factoryName" :disabled="disabled" placeholder="请输入工厂名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="工厂地址"
            name="factoryAddr"
            :rules="[{ required: true, message: '请输入工厂地址' }]"
          >
            <a-input v-model:value="formModel.factoryAddr" :disabled="disabled" placeholder="请输入工厂地址" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="重点风险类型" name="keyRiskType" :rules="[{ required: true, message: '请输入重点风险类型' }]">
            <a-input v-model:value="formModel.keyRiskType" :disabled="disabled" placeholder="请输入重点风险类型" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="统一社会信用代码"
            name="creditCode"
            :rules="[
              { required: true, message: '请输入统一社会信用代码' },
              { pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, message: '请输入有效的统一社会信用代码' }
            ]"
          >
            <a-input v-model:value="formModel.creditCode" :disabled="disabled" placeholder="请输入统一社会信用代码" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  detail: Record<string, any>
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const formRef = ref()
const formModel = ref<Record<string, any>>({})

watch(
  () => props.detail,
  (val) => {
    formModel.value = val?.safeLicenceDTO ? { ...val.safeLicenceDTO } : {}
  },
  { immediate: true, deep: true }
)

/** 校验表单并返回当前表单数据，由 EnterpriseDetail 统一调用接口 */
async function validate(): Promise<Record<string, any>> {
  await formRef.value?.validate()
  return { ...formModel.value }
}

defineExpose({ validate })
</script>

<style lang="less" scoped>
@import './formClassComponent.less';
</style>