<template>
  <div class="tab-form-wrap">
    <a-form
      ref="formRef"
      :model="formModel"
      layout="vertical"
    >
      <a-divider orientation="left">上级企业信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="上级企业名称" name="name">
            <a-input v-model:value="formModel.name" :disabled="props.disabled" placeholder="暂无数据" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="工商营业执照证照编号" name="meTyshxydm">
            <a-input v-model:value="formModel.meTyshxydm" :disabled="props.disabled" placeholder="暂无数据" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="法人代表姓名" name="legalName">
            <a-input v-model:value="formModel.legalName" :disabled="props.disabled" placeholder="暂无数据" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="法人代表移动电话" name="legalPhone">
            <a-input v-model:value="formModel.legalPhone" :disabled="props.disabled" placeholder="暂无数据" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上级企业区域" name="areaId">
            <a-tree-select
              v-model:value="formModel.areaId"
              :disabled="props.disabled"
              :tree-data="areaTreeData"
              :field-names="{ label: 'label', value: 'areaId', children: 'children' }"
              :tree-default-expand-all="true"
              placeholder="请选择所属区域"
              allow-clear
              style="width:100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上级企业地址" name="address">
            <a-input v-model:value="formModel.address" :disabled="props.disabled" placeholder="暂无数据" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="经营范围" name="businessNature">
            <a-textarea
              v-model:value="formModel.businessNature"
              :disabled="props.disabled"
              :auto-size="{ minRows: 3, maxRows: 6 }"
              placeholder="暂无数据"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getAreaTree } from '../enterprise.api'

interface Props {
  detail?: Record<string, any> | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const formRef = ref()
const formModel = ref<Record<string, any>>({})
const areaTreeData = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await getAreaTree()
    areaTreeData.value = res?.children ?? res ?? []
  } catch {}
})

watch(
  () => props.detail,
  (val) => {
    // parentCompanyDTO 是 detail 的子对象
    formModel.value = val?.parentCompanyDTO ? { ...val.parentCompanyDTO } : {}
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
