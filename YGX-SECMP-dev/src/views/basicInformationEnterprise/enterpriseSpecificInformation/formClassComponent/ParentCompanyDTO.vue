<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">
      <a-divider orientation="left">粉尘涉爆专项信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="粉尘种类" name="dustType" :rules="[{ required: true, message: '请输入粉尘种类' }]">
            <a-input v-model:value="formModel.dustType" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="主要涉尘工艺" name="mainDustProcess" :rules="[{ required: true, message: '请输入主要涉尘工艺' }]">
            <a-input v-model:value="formModel.mainDustProcess" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="控爆措施" name="explosionControlMeasures" :rules="[{ required: true, message: '请输入控爆措施' }]">
            <a-input v-model:value="formModel.explosionControlMeasures" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="主要产尘设备名称" name="mainDustEquipName" :rules="[{ required: true, message: '请输入主要产尘设备名称' }]">
            <a-input v-model:value="formModel.mainDustEquipName" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="单班涉粉区域总人数" name="singleShiftDustStaff" :rules="[{ required: true, message: '请输入单班涉粉区域总人数' }]">
            <a-input v-model:value="formModel.singleShiftDustStaff" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="除尘器数量" name="dustCollectorNum" :rules="[{ required: true, message: '请输入除尘器数量' }]">
            <a-input v-model:value="formModel.dustCollectorNum" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="除尘器类型字典" name="dustCollectorTypeId" :rules="[{ required: true, message: '请选择除尘器' }]">
            <!-- <a-input v-model:value="formModel.dustCollectorTypeId" :disabled="disabled" placeholder="请输入" /> -->
            <JDictSelectTag v-model:value="formModel.dustCollectorTypeId" placeholder="请选择"
              dictCode="dust_collector_type" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="统一社会信用代码" name="creditCode" :rules="[{ required: true, message: '请输入统一社会信用代码' }]">
            <a-input v-model:value="formModel.creditCode" :disabled="disabled" placeholder="请输入" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
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
    // console.log('props.detail?.parentCompanyDTO', val?.parentCompanyDTO)
    formModel.value = val?.parentCompanyDTO ? { ...val.parentCompanyDTO } : {}
    console.log(formModel.value);
  },
  { immediate: true, deep: true }
)

// forbidEdit: true — 整个 tab 只读，validate 直接返回当前数据，无需校验
async function validate(): Promise<Record<string, any>> {
  return { ...formModel.value }
}

defineExpose({ validate })
</script>

<style lang="less" scoped>
@import './formClassComponent.less';
</style>
