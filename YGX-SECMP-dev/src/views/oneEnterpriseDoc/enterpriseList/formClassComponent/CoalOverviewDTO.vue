<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">
      <a-divider orientation="left">矿井基本信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="煤矿类型" name="collieryType" :rules="req('请输入煤矿类型')">
            <a-input v-model:value="formModel.collieryType" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="所有制形式" name="formsOfOwnership" :rules="req('请输入所有制形式')">
            <a-input v-model:value="formModel.formsOfOwnership" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="安全生产标准化管理体系等级" name="safetyStandardization" :rules="req('请输入安全生产标准化管理体系等级')">
            <a-input v-model:value="formModel.safetyStandardization" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="安全高效矿井等级" name="safeEfficientLevel" :rules="req('请输入安全高效矿井等级')">
            <a-input v-model:value="formModel.safeEfficientLevel" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="矿井状态" name="collieryStatus" :rules="req('请输入矿井状态')">
            <a-input v-model:value="formModel.collieryStatus" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="井田面积" name="mineArea" :rules="req('请输入井田面积')">
            <a-input-number v-model:value="formModel.mineArea" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上级企业名称" name="superiorName" :rules="req('请输入上级企业名称')">
            <a-input v-model:value="formModel.superiorName" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="日常监管主体" name="rcjgzt" :rules="req('请选择日常监管主体')">
            <a-select
              v-model:value="formModel.rcjgzt"
              :disabled="disabled"
              :options="superviseOptions"
              :field-names="{ label: 'name', value: 'code' }"
              placeholder="请选择"
              allow-clear
              style="width:100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-divider orientation="left">建设与投产</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="安全设施设计审批时间" name="safetyApprovalTime" :rules="req('请选择安全设施设计审批时间')">
            <a-date-picker v-model:value="formModel.safetyApprovalTime" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="建设工期" name="constructionPeriod" :rules="req('请输入建设工期')">
            <a-input v-model:value="formModel.constructionPeriod" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="投产时间" name="productionTime" :rules="req('请选择投产时间')">
            <a-date-picker v-model:value="formModel.productionTime" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-divider orientation="left">位置与联系</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="行政区" name="areaName" :rules="req('请输入行政区')">
            <a-input v-model:value="formModel.areaName" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="工业广场坐标Lng" name="industrialIng" :rules="req('请输入工业广场坐标Lng')">
            <a-input v-model:value="formModel.industrialIng" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="工业广场坐标Lat" name="industrialLat" :rules="req('请输入工业广场坐标Lat')">
            <a-input v-model:value="formModel.industrialLat" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="工商营业执照证照编号" name="unifiedSocialCreditCode" :rules="req('请输入工商营业执照证照编号')">
            <a-input v-model:value="formModel.unifiedSocialCreditCode" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="邮政编码" name="postalCode" :rules="req('请输入邮政编码')">
            <a-input v-model:value="formModel.postalCode" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="电子邮箱" name="email" :rules="[...req('请输入电子邮箱'), { type: 'email', message: '请输入有效的电子邮箱' }]">
            <a-input v-model:value="formModel.email" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="历史沿革" name="historyInfo">
            <a-textarea v-model:value="formModel.historyInfo" :disabled="disabled" :auto-size="{ minRows: 4, maxRows: 8 }" placeholder="请输入历史沿革" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getSuperviseList } from '../enterprise.api'

interface Props {
  detail?: Record<string, any> | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const formRef = ref()
const formModel = ref<Record<string, any>>({})
const superviseOptions = ref<any[]>([])

function req(message: string) {
  return [{ required: true, message }]
}

watch(
  () => props.detail?.baseInfoDTO?.areaId,
  async (areaId) => {
    if (!areaId) return
    try {
      const res = await getSuperviseList(areaId)
      superviseOptions.value = Array.isArray(res) ? res : (res?.result ?? res?.records ?? [])
    } catch {}
  },
  { immediate: true }
)

watch(
  () => props.detail,
  (val) => {
    formModel.value = val?.coalOverviewDTO ? { ...val.coalOverviewDTO } : {}
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
