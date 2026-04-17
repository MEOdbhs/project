<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">
      <!-- ===== 公共只读头部：矿山编码 / 名称 / 行政区域 / 矿山类型 ===== -->
      <a-divider orientation="left">钢铁专项信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="金属冶炼单元从业人员总数" name="smeltingStaffTotal" :rules="[{ required: true, message: '请输入金属冶炼单元从业人员总数' }]">
            <a-input v-model:value="formModel.smeltingStaffTotal" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="企业内部煤气输配管道长度(米)" name="gasPipeLength" :rules="[{ required: true, message: '请输入企业内部煤气输配管道长度' }]">
            <a-input v-model:value="formModel.gasPipeLength" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="粗钢设计产能(万吨/年)" name="crudeSteelDesignCap" :rules="[{ required: true, message: '请输入粗钢设计产能' }]">
            <a-input v-model:value="formModel.crudeSteelDesignCap" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="工艺流程" name="processFlow"  :rules="[{ required: true, message: '请输入工艺流程' }]">
            <a-input v-model:value="formModel.processFlow" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="统一社会信用代码" name="creditCode"  :rules="[{ required: true, message: '请输入统一社会信用代码' }]">
            <a-input v-model:value="formModel.creditCode" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="承诺书" name="fileSubIds" :rules="[{ required: true }]">
            <SimpleImageUpload ref="uploadRef" :bizId="formModel.id" :apiFlieList="formModel.fileList" :readonly="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { getDictTextByCode } from '/@/utils/dict'
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue'
import SimpleImageUpload from '/@/components/FileUpload/SimpleImageUpload.vue'

interface Props {
  detail: Record<string, any>
  disabled?: boolean
}
const uploadRef = ref() 
const props = withDefaults(defineProps<Props>(), { disabled: false })
const formRef = ref()
const formModel = ref<Record<string, any>>({ fileIds: [], })

const mineTypeCode = computed(() => {
  const raw = formModel.value.mineType ?? formModel.value.companyType
  return raw == null ? '' : String(raw)
})

// 类型判断 — 对应新系统 MineType 字典：1=露天煤矿 2=露天矿山 3=井工煤矿 4=地下矿山 5=尾矿库
const isDx = computed(() => mineTypeCode.value === '4')
const isLt = computed(() => mineTypeCode.value === '2')
const isWk = computed(() => mineTypeCode.value === '5')
const isCoal = computed(() => mineTypeCode.value === '1' || mineTypeCode.value === '3')

// 只读头部标签随类型变化
const nameLabel = computed(() => isWk.value ? '尾矿库名称' : isCoal.value ? '煤矿名称' : '矿山名称')

/** 辅助：生成必填规则 */
function req(message: string) {
  return [{ required: true, message }]
}

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
  const result = { ...formModel.value }

  // 从上传组件获取完整的文件对象列表
  if (uploadRef.value) {
    const rawFiles = uploadRef.value.imageFiles || []
    // 转换为后端要求的格式
    const fileList = rawFiles.map(file => ({
      bizId: file.bizId || result.id,   // 如果已有 bizId 则保留，否则用当前业务ID（新增时可能为空）
      fileName: file.fileName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      fileExtname: file.fileExtname,
      fileAddr: file.fileAddr,
      filePath: file.filePath,
    }))
    result.fileList = fileList
  }

  return result
}
defineExpose({ validate })
</script>

<style lang="less" scoped>
@import './formClassComponent.less';
</style>
