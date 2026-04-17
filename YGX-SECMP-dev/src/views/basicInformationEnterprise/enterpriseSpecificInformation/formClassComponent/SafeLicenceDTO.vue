<template>
  <div class="tab-form-wrap">
    <a-form
      ref="formRef"
      :model="formModel"
      layout="vertical"
    >
      <a-divider orientation="left">工厂目录</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="工厂名称" name="factoryName">
            <a-input v-model:value="formModel.factoryName" :disabled="disabled" placeholder="请输入工厂名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="工厂地址" name="factoryAddr">
            <a-input v-model:value="formModel.factoryAddr" :disabled="disabled" placeholder="请输入工厂地址" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="重点风险类型" name="keyRiskType">
            <a-input v-model:value="formModel.keyRiskType" :disabled="disabled" placeholder="请输入重点风险类型" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="统一社会信用代码" name="creditCode">
            <a-input v-model:value="formModel.creditCode" :disabled="disabled" placeholder="请输入统一社会信用代码" />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- <a-row v-if="licenceStatus" :gutter="24">
        <a-col :span="24">
          <a-alert :message="licenceStatus.message" :type="licenceStatus.type" show-icon style="margin-bottom:16px" />
        </a-col>
      </a-row> -->
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import dayjs from 'dayjs'

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
    console.log('props.detail?.safeLicenceDTO', val?.safeLicenceDTO)
    formModel.value = val?.safeLicenceDTO ? { ...val.safeLicenceDTO } : {}
    console.log(formModel.value);
    
  },
  { immediate: true, deep: true }
)

// const licenceStatus = computed(() => {
//   const expires = formModel.value.aqxkzExpiresDate
//   if (!expires) return null
//   const diff = dayjs(expires).diff(dayjs(), 'day')
//   if (diff < 0) return { type: 'error', message: `安全生产许可证已过期（${expires}）` }
//   if (diff <= 90) return { type: 'warning', message: `安全生产许可证将于 ${expires} 到期，还剩 ${diff} 天` }
//   return { type: 'success', message: `安全生产许可证有效期至 ${expires}，还剩 ${diff} 天` }
// })

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
