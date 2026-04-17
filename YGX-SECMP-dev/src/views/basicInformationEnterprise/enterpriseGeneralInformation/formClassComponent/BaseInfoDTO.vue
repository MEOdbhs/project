<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">
      <a-divider orientation="left">工贸信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="母公司名称"
            name="parentEntName"
            :rules="[{ required: true, message: '请输入母公司名称' }]"
          >
            <a-input v-model:value="formModel.parentEntName" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="母公司统一社会信用代码"
            name="parentCreditCode"
            :rules="[
              { required: true, message: '请输入母公司统一社会信用代码' },
              { pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, message: '请输入有效的统一社会信用代码' }
            ]"
          >
            <a-input v-model:value="formModel.parentCreditCode" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="行业类型"
            name="industryType"
            :rules="[{ required: true, message: '请选择行业类型' }]"
          >
            <JDictSelectTag
              v-model:value="formModel.industryType"
              placeholder="请选择"
              dictCode="industry_type"
              :disabled="disabled"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="属地安全监管部门"
            name="safetySuperviseDept"
            :rules="[{ required: true, message: '请输入属地安全监管部门' }]"
          >
            <a-input v-model:value="formModel.safetySuperviseDept" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="实际控制人姓名"
            name="actualController"
            :rules="[{ required: true, message: '请输入实际控制人姓名' }]"
          >
            <a-input v-model:value="formModel.actualController" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="实际控制人电话"
            name="actualControllerPhone"
            :rules="[
              { required: true, message: '请输入实际控制人电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]"
          >
            <a-input v-model:value="formModel.actualControllerPhone" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否规模以上" name="isAboveScale" :rules="[{ required: true, message: '请选择是否规模以上' }]">
            <a-select v-model:value="formModel.isAboveScale" :disabled="disabled">
              <a-select-option value="Y">是</a-select-option>
              <a-select-option value="N">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否在化工园区" name="isInChemicalPark"  :rules="[{ required: true, message: '请选择是否在化工园区' }]">
            <a-select v-model:value="formModel.isInChemicalPark" :disabled="disabled">
              <a-select-option value="Y">是</a-select-option>
              <a-select-option value="N">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="安全生产监管重点企业" name="isKeySafetyEnt" :rules="[{ required: true, message: '请选择是否安全生产监管重点企业' }]">
            <a-select v-model:value="formModel.isKeySafetyEnt" :disabled="disabled">
              <a-select-option value="Y">是</a-select-option>
              <a-select-option value="N">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="企业生产状态"
            name="prodStatus"
            :rules="[{ required: true, message: '请选择企业生产状态' }]"
          >
            <JDictSelectTag
              v-model:value="formModel.prodStatus"
              placeholder="请选择"
              dictCode="prod_status"
              :disabled="disabled"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="生产经营单位规模"
            name="businessScale"
            :rules="[{ required: true, message: '请选择生产经营单位规模' }]"
          >
            <JDictSelectTag
              v-model:value="formModel.businessScale"
              placeholder="请选择"
              dictCode="business_scale"
              :disabled="disabled"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="总人数"
            name="totalStaff"
            :rules="[
              { required: true, message: '请输入总人数' },
              { type: 'number', min: 0, message: '总人数不能小于0', transform: (value) => Number(value) }
            ]"
          >
            <a-input-number
              v-model:value="formModel.totalStaff"
              :min="0"
              :precision="0"
              style="width: 100%"
              :disabled="disabled"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="主营业务"
            name="mainBusiness"
            :rules="[{ required: true, message: '请输入主营业务' }]"
          >
            <a-textarea
              v-model:value="formModel.mainBusiness"
              :rows="2"
              :disabled="disabled"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue'
import { getDictTextByCode } from '/@/utils/dict'

interface Props {
  detail: Record<string, any>
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })
const formRef = ref()
const formModel = ref<Record<string, any>>({})

const mineTypeCode = computed(() => {
  const raw = formModel.value.mineType ?? formModel.value.companyType
  return raw == null ? '' : String(raw)
})

// 类型判断 — 对应新系统 MineType 字典：1=露天煤矿 2=露天矿山 3=井工煤矿 4=地下矿山 5=尾矿库
const isDx = computed(() => mineTypeCode.value === '4')
const isLt = computed(() => mineTypeCode.value === '2')
const isWk = computed(() => mineTypeCode.value === '5')
const isCoal = computed(() => mineTypeCode.value === '1' || mineTypeCode.value === '3')

// 只读头部标签随类型变化（保留，但未在模板中使用）
const nameLabel = computed(() => isWk.value ? '尾矿库名称' : isCoal.value ? '煤矿名称' : '矿山名称')

watch(
  () => props.detail,
  (val) => {
    if (!val) return
    const next = { ...val }
    const rawType = next.mineType ?? next.companyType
    const code = rawType == null ? '' : String(rawType)
    if (!next.mineTypeText) next.mineTypeText = getDictTextByCode(code, 'MineType') || ''
    formModel.value = next
  },
  { immediate: true, deep: true }
)

/** 校验表单并返回数据，由 EnterpriseDetail 统一调用 */
async function validate(): Promise<Record<string, any>> {
  await formRef.value?.validate()
  return { ...formModel.value }
}

defineExpose({ validate })
</script>

<style lang="less" scoped>
@import './formClassComponent.less';
</style>