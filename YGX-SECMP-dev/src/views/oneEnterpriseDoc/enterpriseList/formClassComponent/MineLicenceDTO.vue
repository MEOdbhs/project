<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">
      <a-divider orientation="left">采矿许可证登记信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="采矿许可证号" name="ckxkzLicenceNumber">
            <a-input v-model:value="formModel.ckxkzLicenceNumber" :disabled="disabled" placeholder="请输入采矿许可证号" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <!-- 地下矿山：主要矿种；露天矿山：开采矿种 -->
          <a-form-item name="ckxkzMineralsCode" :rules="req(`请输入${mineralsLabel}`)">
            <template #label>
              {{ mineralsLabel }}
              <a-tooltip title="按采矿许可证登记开采矿种如实填写。">
                <QuestionCircleOutlined class="label-tip-icon" />
              </a-tooltip>
            </template>
            <a-input v-model:value="formModel.ckxkzMineralsCode" :disabled="disabled" :placeholder="`请输入${mineralsLabel}`" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="采矿许可证发证机关" name="ckxkzIssuanceOrg">
            <a-input v-model:value="formModel.ckxkzIssuanceOrg" :disabled="disabled" placeholder="请输入发证机关" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="采矿许可证有效期限始" name="ckxkzStartDate">
            <a-date-picker v-model:value="formModel.ckxkzStartDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" placeholder="请选择开始日期" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="采矿许可证有效期限至" name="ckxkzExpiresDate">
            <a-date-picker v-model:value="formModel.ckxkzExpiresDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" placeholder="请选择截止日期" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="开采方式" name="ckxkzMiningMethod">
            <JDictSelectTag v-model:value="formModel.ckxkzMiningMethod" :disabled="disabled" dictCode="mine_exploit_way" placeholder="请选择开采方式" allow-clear />
          </a-form-item>
        </a-col>
        <!-- 开采深度：由 [上限] 至 [下限] 米标高 横排 -->
        <a-col :span="24">
          <a-form-item
            label="开采深度（单位：米）"
            class="depth-range-item"
            :rules="isLt ? req('请输入开采深度') : []"
          >
            <div class="depth-range-wrap">
              <span class="depth-prefix">由</span>
              <a-form-item name="ckxkzMiningDepthUpper" class="depth-inner-item" :rules="isLt ? req('请输入上限') : []">
                <a-input-number
                  v-model:value="formModel.ckxkzMiningDepthUpper"
                  :disabled="disabled"
                  :precision="4"
                  :step="0.0001"
                  placeholder="请输入开采深度（单位：米）"
                  style="width:100%"
                />
              </a-form-item>
              <span class="depth-separator">至</span>
              <a-form-item name="ckxkzMiningDepthLower" class="depth-inner-item">
                <a-input-number
                  v-model:value="formModel.ckxkzMiningDepthLower"
                  :disabled="disabled"
                  :precision="4"
                  :step="0.0001"
                  placeholder="请输入开采深度（单位：米）"
                  style="width:100%"
                />
              </a-form-item>
              <span class="depth-suffix">米标高</span>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="productionScaleLabel" name="ckxkzProductionScale">
            <a-input-number v-model:value="formModel.ckxkzProductionScale" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" placeholder="请输入生产规模" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="矿区面积（km²）" name="ckxkzArea">
            <a-input-number v-model:value="formModel.ckxkzArea" :disabled="disabled" :precision="4" :step="0.1" style="width:100%" placeholder="请输入矿区面积" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="圈定拐点数量（个）" name="ckxkzQdgdsl">
            <a-input-number v-model:value="formModel.ckxkzQdgdsl" :disabled="disabled" :precision="0" :min="0" :step="1" style="width:100%" placeholder="请输入拐点数量" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="采矿许可证附件" name="ckxkzFile">
            <PdfUploadSimple
              v-model:value="formModel.ckxkzFile"
              :biz-id="detailBizId"
              :disabled="disabled"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 有效期状态提示 -->
      <a-row v-if="licenceStatus" :gutter="24">
        <a-col :span="24">
          <a-alert :message="licenceStatus.message" :type="licenceStatus.type" show-icon style="margin-bottom:16px" />
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue'
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

const detailBizId = computed(() => props.detail?.id ?? props.detail?.mineId ?? '')

// 01=露天矿山(含排土场)  00=金属非金属地下矿山
const isLt = computed(() => mineType.value === '01')

// 字段 label 随矿山类型变化
const mineralsLabel = computed(() => isLt.value ? '开采矿种' : '主要矿种')
const productionScaleLabel = computed(() => isLt.value ? '生产规模（万吨/年）' : '设计生产规模（万吨/年）')

const licenceStatus = computed(() => {
  const expires = formModel.value.ckxkzExpiresDate
  if (!expires) return null
  const diff = dayjs(expires).diff(dayjs(), 'day')
  if (diff < 0) return { type: 'error' as const, message: `采矿许可证已过期（${expires}）` }
  if (diff <= 90) return { type: 'warning' as const, message: `采矿许可证将于 ${expires} 到期，还剩 ${diff} 天` }
  return { type: 'success' as const, message: `采矿许可证有效期至 ${expires}，还剩 ${diff} 天` }
})

function req(message: string) {
  return [{ required: true, message }]
}

watch(
  () => props.detail,
  (val) => {
    formModel.value = val?.mineLicenceDTO ? { ...val.mineLicenceDTO } : {}
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

// 开采深度 由…至…米标高 横排布局
.depth-range-wrap {
  display: flex;
  align-items: center;
  gap: 8px;

  .depth-prefix,
  .depth-separator,
  .depth-suffix {
    flex-shrink: 0;
    color: #8fbcdb;
    font-size: 13px;
    white-space: nowrap;
  }

  .depth-inner-item {
    flex: 1;
    margin-bottom: 0;

    :deep(.ant-form-item-explain) {
      position: absolute;
      font-size: 11px;
    }
  }
}

.depth-range-item {
  :deep(.ant-form-item-control-input) {
    min-height: unset;
  }
}
</style>
