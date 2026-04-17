<template>
    <div class="tab-form-wrap">
      <a-form ref="formRef" :model="formModel" layout="vertical">
        <a-divider orientation="left">工厂基本信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="工厂信息"
              name="factoryInfo"
              :rules="[{ required: true, message: '请输入工厂信息' }]"
            >
              <a-input v-model:value="formModel.factoryInfo" :disabled="disabled" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="主要设备工艺"
              name="mainEquipProcess"
              :rules="[{ required: true, message: '请输入主要设备工艺' }]"
            >
              <a-input v-model:value="formModel.mainEquipProcess" :disabled="disabled" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="车间信息"
              name="workshopInfo"
              :rules="[{ required: true, message: '请输入车间信息' }]"
            >
              <a-input v-model:value="formModel.workshopInfo" :disabled="disabled" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="特种作业人员信息"
              name="specialOpStaffInfo"
              :rules="[{ required: true, message: '请输入特种作业人员信息' }]"
            >
              <a-input v-model:value="formModel.specialOpStaffInfo" :disabled="disabled" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="应急和安全防护设备"
              name="emergencySafetyEquip"
              :rules="[{ required: true, message: '请输入应急和安全防护设备' }]"
            >
              <a-input v-model:value="formModel.emergencySafetyEquip" :disabled="disabled" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="产品产能"
              name="productCapacity"
              :rules="[{ required: true, message: '请输入产品产能' }]"
            >
              <a-input v-model:value="formModel.productCapacity" :disabled="disabled" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全生产合格证人员信息" name="safetyCertStaffInfo" :rules="[{ required: true, message: '请输入安全生产合格证人员信息' }]">
              <a-input v-model:value="formModel.safetyCertStaffInfo" :disabled="disabled" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="高风险场所信息" name="highRiskPlaceInfo" :rules="[{ required: true, message: '请输入高风险场所信息' }]">
              <a-input v-model:value="formModel.highRiskPlaceInfo" :disabled="disabled" placeholder="请输入" />
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
      formModel.value = val?.factoryInformationDTO ? { ...val.factoryInformationDTO } : {}
    },
    { immediate: true, deep: true }
  )
  
  /** 校验表单并返回数据，由父组件统一调用 */
  async function validate(): Promise<Record<string, any>> {
    await formRef.value?.validate()
    return { ...formModel.value }
  }
  
  defineExpose({ validate })
  </script>
  
  <style lang="less" scoped>
  @import './formClassComponent.less';
  </style>