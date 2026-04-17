<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">

      <!-- ===== 地下矿山 ===== -->
      <template v-if="isDx">
        <a-divider orientation="left">井下系统图纸</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="矿区地形地质图、水文地质图（含平面和剖面）" name="dxKqdxdzswdzt">
              <PdfUploadSimple v-model:value="formModel.dxKqdxdzswdzt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开拓系统图" name="dxKtxtt">
              <PdfUploadSimple v-model:value="formModel.dxKtxtt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="中段平面图" name="dxZdpmt">
              <PdfUploadSimple v-model:value="formModel.dxZdpmt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="通风系统图" name="dxTfxtt">
              <PdfUploadSimple v-model:value="formModel.dxTfxtt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="井上、井下对照图" name="dxJsjxdzt">
              <PdfUploadSimple v-model:value="formModel.dxJsjxdzt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="压风、供水、排水系统图" name="dxYfgspsxtt">
              <PdfUploadSimple v-model:value="formModel.dxYfgspsxtt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="通信系统图" name="dxTxxtt">
              <PdfUploadSimple v-model:value="formModel.dxTxxtt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="供配电系统图" name="dxGpdxtt">
              <PdfUploadSimple v-model:value="formModel.dxGpdxtt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="井下避灾路线图" name="dxJxbzlxt">
              <PdfUploadSimple v-model:value="formModel.dxJxbzlxt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="与相邻矿山空间位置关系图" name="dxYxlkskjwzgxt">
              <PdfUploadSimple v-model:value="formModel.dxYxlkskjwzgxt" :disabled="disabled" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- ===== 露天矿山 ===== -->
      <template v-else-if="isLt">
        <a-divider orientation="left">露天采场图纸</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="地形地质图" name="ltDxdzt">
              <PdfUploadSimple v-model:value="formModel.ltDxdzt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采剥工程年末图" name="ltCbgcnmt">
              <PdfUploadSimple v-model:value="formModel.ltCbgcnmt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采场边坡工程平面及剖面图" name="ltCcbpgcpmjpmt">
              <PdfUploadSimple v-model:value="formModel.ltCcbpgcpmjpmt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采场最终境界图" name="ltCczzjjt">
              <PdfUploadSimple v-model:value="formModel.ltCczzjjt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排土场年末图" name="ltPtcnmt">
              <PdfUploadSimple v-model:value="formModel.ltPtcnmt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排土场工程平面及剖面图" name="ltPtcgcpmjpmt">
              <PdfUploadSimple v-model:value="formModel.ltPtcgcpmjpmt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="供配电系统图" name="ltGpdxtt">
              <PdfUploadSimple v-model:value="formModel.ltGpdxtt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="井下采空区与露天矿平面对照图" name="ltJxckqyltkpmdzt">
              <PdfUploadSimple v-model:value="formModel.ltJxckqyltkpmdzt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="防排水系统图" name="ltFpsxtt">
              <PdfUploadSimple v-model:value="formModel.ltFpsxtt" :disabled="disabled" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- ===== 尾矿库 ===== -->
      <template v-else-if="isWk">
        <a-divider orientation="left">尾矿库资料</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="尾矿库现状地形图" name="wkXzdxt">
              <PdfUploadSimple v-model:value="formModel.wkXzdxt" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="上、下游有关资料" name="wkSxyygzl">
              <PdfUploadSimple v-model:value="formModel.wkSxyygzl" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="水文气象资料" name="wkSwqxzl">
              <PdfUploadSimple v-model:value="formModel.wkSwqxzl" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="尾矿库岩土工程勘察报告" name="wkYtgckcbg">
              <PdfUploadSimple v-model:value="formModel.wkYtgckcbg" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="尾矿库安全设施施工资料和验收资料" name="wkAqsssgzlhyszl">
              <PdfUploadSimple v-model:value="formModel.wkAqsssgzlhyszl" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="尾矿库运行管理资料" name="wkYxglzl">
              <PdfUploadSimple v-model:value="formModel.wkYxglzl" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="年度防洪排水系统质量检测报告" name="wkNdphxtzljcbg">
              <PdfUploadSimple v-model:value="formModel.wkNdphxtzljcbg" :disabled="disabled" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

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
    formModel.value = val?.dataNowDTO ? { ...val.dataNowDTO } : {}
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
