<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">
      <a-divider orientation="left">企业注册信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="单位名称"
            name="entName"
            :rules="[{ required: true, message: '请输入单位名称' }]"
          >
            <a-input v-model:value="formModel.entName" :disabled="disabled" placeholder="请输入" />
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
            <a-input v-model:value="formModel.creditCode" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="行政区划"
            name="regionCode"
            :rules="[{ required: true, message: '请输入行政区划' }]"
          >
            <a-input v-model:value="formModel.regionCode" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="生产经营地址"
            name="businessAddr"
            :rules="[{ required: true, message: '请输入生产经营地址' }]"
          >
            <a-input v-model:value="formModel.businessAddr" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="经营范围"
            name="businessScope"
            :rules="[{ required: true, message: '请输入经营范围' }]"
          >
            <a-input v-model:value="formModel.businessScope" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="成立日期"
            name="establishDate"
            :rules="[{ required: true, message: '请选择成立日期' }]"
          >
            <a-date-picker
              v-model:value="formModel.establishDate"
              valueFormat="YYYY-MM-DD"
              format="YYYY-MM-DD"
              style="width:100%"
              :disabled="disabled"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="行政隶属关系" name="adminAffiliation"  :rules="[{ required: true, message: '请选择行政隶属关系' }]">
            <a-input v-model:value="formModel.adminAffiliation" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="法人职务" name="legalTitle" :rules="[{ required: true, message: '请选择法人职务' }]">
            <a-input v-model:value="formModel.legalTitle" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="法定代表人姓名"
            name="legalPerson"
            :rules="[{ required: true, message: '请输入法定代表人姓名' }]"
          >
            <a-input v-model:value="formModel.legalPerson" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="主要负责人姓名"
            name="mainPrincipal"
            :rules="[{ required: true, message: '请输入主要负责人姓名' }]"
          >
            <a-input v-model:value="formModel.mainPrincipal" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="安全负责人姓名"
            name="safetyPrincipal"
            :rules="[{ required: true, message: '请输入安全负责人姓名' }]"
          >
            <a-input v-model:value="formModel.safetyPrincipal" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="联系电话"
            name="contactPhone"
            :rules="[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]"
          >
            <a-input v-model:value="formModel.contactPhone" :disabled="disabled" placeholder="请输入" />
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
    formModel.value = val?.parentCompanyDTO ? { ...val.parentCompanyDTO } : {}
  },
  { immediate: true, deep: true }
)

// 校验表单并返回数据（由父组件统一调用）
async function validate(): Promise<Record<string, any>> {
  await formRef.value?.validate()
  return { ...formModel.value }
}

defineExpose({ validate })
</script>

<style lang="less" scoped>
@import './formClassComponent.less';
</style>