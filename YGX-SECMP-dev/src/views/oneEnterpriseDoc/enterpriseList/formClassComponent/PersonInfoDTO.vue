<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">
      <a-divider orientation="left">人员信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="矿井最大班下井人数" name="maxEnteringMine" :rules="req('请输入矿井最大班下井人数')">
            <a-input-number v-model:value="formModel.maxEnteringMine" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="业主或法定代表人姓名" name="legalRepresentativeName" :rules="req('请输入业主或法定代表人姓名')">
            <a-input v-model:value="formModel.legalRepresentativeName" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="业主或法定代表人手机号码" name="legalRepresentativePhone" :rules="req('请输入手机号码')">
            <a-input v-model:value="formModel.legalRepresentativePhone" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="业主或法定代表人身份证号" name="legalRepresentativeCard" :rules="req('请输入身份证号')">
            <a-input v-model:value="formModel.legalRepresentativeCard" :disabled="disabled" />
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

function req(message: string) {
  return [{ required: true, message }]
}

watch(
  () => props.detail,
  (val) => {
    formModel.value = val?.personInfoDTO ? { ...val.personInfoDTO } : {}
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
