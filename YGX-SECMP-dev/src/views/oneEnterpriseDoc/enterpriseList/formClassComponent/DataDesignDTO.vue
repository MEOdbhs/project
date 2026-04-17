<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">
      <a-divider orientation="left">资料图纸上传</a-divider>
      <a-row :gutter="24">

        <!-- 地下 & 露天共用字段 -->
        <template v-if="isDx || isLt">
          <a-col :span="12">
            <a-form-item label="安全设施设计及批准文件" name="aqsssjjpzwj">
              <PdfUploadSimple v-model:value="formModel.aqsssjjpzwj" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设计图" name="sjt">
              <PdfUploadSimple v-model:value="formModel.sjt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="地质报告和生产过程收集的水文地质资料等" name="dzbghscgcsjdswdzzl">
              <PdfUploadSimple v-model:value="formModel.dzbghscgcsjdswdzzl" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="管理人员资质材料" name="glryzzcl">
              <PdfUploadSimple v-model:value="formModel.glryzzcl" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="组织结构图" name="zzjgt">
              <PdfUploadSimple v-model:value="formModel.zzjgt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全生产各种制度" name="aqscgzzd">
              <PdfUploadSimple v-model:value="formModel.aqscgzzd" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采矿证副本" name="ckzfb">
              <PdfUploadSimple v-model:value="formModel.ckzfb" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="专业人员毕业证书、职称证书" name="zyrybyzszczs">
              <PdfUploadSimple v-model:value="formModel.zyrybyzszczs" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="特种作业人员资质证" name="tzzyryzzz">
              <PdfUploadSimple v-model:value="formModel.tzzyryzzz" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="上次现状评价报告" name="scxzpjbg">
              <PdfUploadSimple v-model:value="formModel.scxzpjbg" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全技术体检报告" name="aqjstjbg">
              <PdfUploadSimple v-model:value="formModel.aqjstjbg" :disabled="disabled" />
            </a-form-item>
          </a-col>
        </template>

        <!-- 尾矿库独立字段（少设计图/地质报告/采矿证，多尾矿库典型参数示意图） -->
        <template v-else-if="isWk">
          <a-col :span="12">
            <a-form-item label="安全设施设计及批准文件" name="aqsssjjpzwj">
              <PdfUploadSimple v-model:value="formModel.aqsssjjpzwj" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="尾矿库典型参数示意图" name="wkDxcssyt">
              <PdfUploadSimple v-model:value="formModel.wkDxcssyt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="管理人员资质材料" name="glryzzcl">
              <PdfUploadSimple v-model:value="formModel.glryzzcl" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="组织结构图" name="zzjgt">
              <PdfUploadSimple v-model:value="formModel.zzjgt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全生产各种制度" name="aqscgzzd">
              <PdfUploadSimple v-model:value="formModel.aqscgzzd" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="专业人员毕业证书、职称证书" name="zyrybyzszczs">
              <PdfUploadSimple v-model:value="formModel.zyrybyzszczs" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="特种作业人员资质证" name="tzzyryzzz">
              <PdfUploadSimple v-model:value="formModel.tzzyryzzz" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="上次现状评价报告" name="scxzpjbg">
              <PdfUploadSimple v-model:value="formModel.scxzpjbg" :disabled="disabled"  />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全技术体检报告" name="aqjstjbg">
              <PdfUploadSimple v-model:value="formModel.aqjstjbg" :disabled="disabled" />
            </a-form-item>
          </a-col>
        </template>

      </a-row>
    </a-form>
  </div>
</template>

    

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PdfUploadSimple from '/@/components/FileUpload/PdfUploadSimple.vue'

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
    formModel.value = val?.dataDesignDTO ? { ...val.dataDesignDTO } : {}
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
