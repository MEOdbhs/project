<template>
  <div class="tab-form-wrap">
    <a-form
      ref="formRef"
      :model="formModel"
      layout="vertical"
    >
      <a-divider orientation="left">安全生产许可证登记信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="许可证号" name="aqxkzLicenceNumber">
            <a-input v-model:value="formModel.aqxkzLicenceNumber" :disabled="disabled" placeholder="请输入安全生产许可证号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="发证机关" name="aqxkzIssuanceOrg">
            <a-input v-model:value="formModel.aqxkzIssuanceOrg" :disabled="disabled" placeholder="请输入发证机关名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="有效期限始" name="aqxkzStartDate">
            <a-date-picker v-model:value="formModel.aqxkzStartDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" placeholder="请选择有效期开始日期" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="有效期限至" name="aqxkzExpiresDate">
            <a-date-picker v-model:value="formModel.aqxkzExpiresDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" placeholder="请选择有效期截止日期" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="首次取证日期" name="aqxkzFirstCertificatesDate">
            <a-date-picker v-model:value="formModel.aqxkzFirstCertificatesDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" placeholder="请选择首次取证日期" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="许可范围" name="aqxkzBusinessNature">
            <a-input v-model:value="formModel.aqxkzBusinessNature" :disabled="disabled" placeholder="请输入许可范围" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="安全生产许可证附件" name="aqxkzFile">
            <PdfUploadSimple v-model:value="formModel.aqxkzFile" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row v-if="licenceStatus" :gutter="24">
        <a-col :span="24">
          <a-alert :message="licenceStatus.message" :type="licenceStatus.type" show-icon style="margin-bottom:16px" />
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import PdfUploadSimple from '/@/components/FileUpload/PdfUploadSimple.vue'

interface Props {
  detail: Record<string, any>
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const formRef = ref()
const formModel = ref<Record<string, any>>({})

watch(
  () => props.detail?.safeLicenceDTO,
  (val) => { if (val) formModel.value = { ...val } },
  { immediate: true, deep: true }
)

const licenceStatus = computed(() => {
  const expires = formModel.value.aqxkzExpiresDate
  if (!expires) return null
  const diff = dayjs(expires).diff(dayjs(), 'day')
  if (diff < 0) return { type: 'error', message: `安全生产许可证已过期（${expires}）` }
  if (diff <= 90) return { type: 'warning', message: `安全生产许可证将于 ${expires} 到期，还剩 ${diff} 天` }
  return { type: 'success', message: `安全生产许可证有效期至 ${expires}，还剩 ${diff} 天` }
})

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
