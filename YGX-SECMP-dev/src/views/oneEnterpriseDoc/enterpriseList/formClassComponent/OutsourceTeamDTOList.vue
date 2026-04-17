<template>
  <div class="tab-form-wrap block-list-wrap">

    <div v-for="(item, index) in listData" :key="item._id" class="record-block">
      <div class="block-header">
        <span class="block-title">外包工程队{{ indexLabel(index) }}</span>
        <a-space v-if="!disabled">
          <a-button type="primary" size="small" @click="handleSaveRow(index)">保存</a-button>
          <a-button danger size="small" @click="handleDelete(index)">删除</a-button>
        </a-space>
      </div>

      <div class="block-body">
        <a-row :gutter="24">
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label required-label">外包队伍名称</div>
              <a-input v-model:value="item.teamName" :disabled="disabled" placeholder="请输入外包队伍名称" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">外包队伍人员数量（人）</div>
              <a-input-number v-model:value="item.teamCount" :disabled="disabled" :precision="0" :step="1" :min="0" placeholder="请输入" style="width:100%" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">外包队伍专业技术人员数量</div>
              <a-input-number v-model:value="item.professionalTechniciansCount" :disabled="disabled" :precision="0" :step="1" :min="0" placeholder="请输入" style="width:100%" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="field-wrap">
              <div class="field-label">{{ isWk ? '施工资质等级' : '矿山工程施工资质' }}</div>
              <JDictSelectTag v-model:value="item.ksgcsgzz" :disabled="disabled" dictCode="ksgcsgzz" placeholder="请选择" />
            </div>
          </a-col>

          <!-- 地下/露天矿山额外字段 -->
          <template v-if="!isWk">
            <a-col :span="12">
              <div class="field-wrap">
                <div class="field-label">采掘施工许可证</div>
                <PdfUploadSimple v-model:value="item.constructionLicence" :disabled="disabled" />
              </div>
            </a-col>
            <a-col :span="12">
              <div class="field-wrap">
                <div class="field-label">是否承接爆破作业</div>
                <a-radio-group v-model:value="item.ifUndertakeBlast" :disabled="disabled">
                  <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
                </a-radio-group>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="field-wrap">
                <div class="field-label">爆破作业单位</div>
                <a-input v-model:value="item.blastName" :disabled="disabled" placeholder="请输入爆破作业单位" />
              </div>
            </a-col>
            <a-col :span="12">
              <div class="field-wrap">
                <div class="field-label">爆破作业安全许可证</div>
                <PdfUploadSimple v-model:value="item.blastSafeLicence" :disabled="disabled" />
              </div>
            </a-col>
            <a-col :span="12">
              <div class="field-wrap">
                <div class="field-label">爆破作业单位主要负责人</div>
                <a-input v-model:value="item.blastDirectorName" :disabled="disabled" placeholder="请输入" />
              </div>
            </a-col>
            <a-col :span="12">
              <div class="field-wrap">
                <div class="field-label">爆破作业单位安全技术负责人</div>
                <a-input v-model:value="item.bpzydwaqjsfzr" :disabled="disabled" placeholder="请输入" />
              </div>
            </a-col>
            <a-col :span="12">
              <div class="field-wrap">
                <div class="field-label">爆破作业单位安全员</div>
                <a-input v-model:value="item.bpzyaqy" :disabled="disabled" placeholder="请输入" />
              </div>
            </a-col>
            <a-col :span="12">
              <div class="field-wrap">
                <div class="field-label">爆破作业单位爆破员</div>
                <a-input v-model:value="item.bpzydwbpy" :disabled="disabled" placeholder="请输入" />
              </div>
            </a-col>
          </template>
        </a-row>
      </div>
    </div>

    <div v-if="!disabled" class="add-btn-wrap">
      <a-button type="dashed" block @click="handleAdd">
        <PlusOutlined /> 外包工程队信息
      </a-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue'
import PdfUploadSimple from '/@/components/FileUpload/PdfUploadSimple.vue'
import { deleteMineDetail } from '../enterprise.api'
interface Props {
  detail?: Record<string, any> | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })
const emit = defineEmits<{ saveRecord: [record?: Record<string, any>] }>()

const listData = ref<Record<string, any>[]>([])

const mineTypeCode = computed(() => String(props.detail?.mineType ?? ''))
// MineType: 03尾矿库
const isWk = computed(() => mineTypeCode.value === '03')

const chineseNums = ['一','二','三','四','五','六','七','八','九','十']
function indexLabel(index: number) {
  return chineseNums[index] ?? String(index + 1)
}

watch(
  () => props.detail,
  (val) => {
    const raw = val?.outsourceTeamDTOList
    listData.value = raw
      ? raw.map((item: any, i: number) => ({ ...item, _id: item.id ?? `_${i}_${Date.now()}` }))
      : []
  },
  { immediate: true, deep: true }
)

function getRecordPayload(item: Record<string, any>) {
  const { _id, ...rest } = item
  return rest
}

function validateRow(item: Record<string, any>): boolean {
  const name = item.teamName
  if (name == null || String(name).trim() === '') {
    message.warning('请填写外包队伍名称')
    return false
  }
  return true
}

function handleSaveRow(index: number) {
  const item = listData.value[index]
  if (!item) return
  if (!validateRow(item)) return
  emit('saveRecord', getRecordPayload(item))
}

function handleAdd() {
  listData.value.push({ _id: `_new_${Date.now()}` })
}

function handleDelete(index: number) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条外包工程队信息吗？',
    async onOk() { 
      const item = listData.value[index]
      if (!item) return
      try {
        await deleteMineDetail({ deleteId: item.id, mineDetailProperty: 'outsourceTeamDTOList' })
        message.success('删除成功')
        emit('saveRecord')
      } catch (e) {
        console.error(e)
        message.error('删除失败，请稍后重试')
        throw e
      }
    },
  })
}

async function validate(): Promise<Record<string, any>> {
  const first = listData.value[0]
  if (!first) return {}
  if (!validateRow(first)) throw new Error('validate failed')
  return getRecordPayload(first)
}

defineExpose({ validate })
</script>

<style lang="less" scoped>
@import './formClassComponent.less';
@import './blockList.less';
</style>
