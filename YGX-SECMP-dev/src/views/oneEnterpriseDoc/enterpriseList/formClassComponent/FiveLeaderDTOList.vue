<template>
  <div class="tab-form-wrap">
    <div class="list-tab-header">
      <span class="list-tab-title">"五职"矿长信息</span>
      <a-button v-if="!disabled" type="primary" size="small" @click="handleAdd">
        <template #icon><PlusOutlined /></template>新增
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="listData"
      :pagination="false"
      row-key="id"
      size="small"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'isSafetyEngineer'">
          {{ record.isSafetyEngineer ? '是' : '否' }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record, index)">编辑</a-button>
            <a-button v-if="!disabled" type="link" size="small" @click="handleSaveRow(record)">保存</a-button>
            <a-button v-if="!disabled" type="link" danger size="small" @click="handleDelete(index)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="editIndex === -1 ? '新增矿长信息' : '编辑矿长信息'"
      width="860px"
      :confirm-loading="submitting"
      @ok="handleSubmit"
      @cancel="modalVisible = false"
    >
      <a-form ref="modalFormRef" :model="editRow" layout="vertical" class="row-edit-form">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="姓名" name="name" :rules="req('请输入姓名')">
              <a-input v-model:value="editRow.name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="出生年月" name="birthDate" :rules="req('请选择出生年月')">
              <a-date-picker v-model:value="editRow.birthDate" picker="month" value-format="YYYY-MM" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="性别" name="sex" :rules="req('请选择性别')">
              <a-select v-model:value="editRow.sex" placeholder="请选择">
                <a-select-option value="男">男</a-select-option>
                <a-select-option value="女">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话" name="tel" :rules="req('请输入联系电话')">
              <a-input v-model:value="editRow.tel" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="学历" name="degree" :rules="req('请输入学历')">
              <a-input v-model:value="editRow.degree" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="毕业院校" name="college" :rules="req('请输入毕业院校')">
              <a-input v-model:value="editRow.college" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="专业" name="major" :rules="req('请输入专业')">
              <a-input v-model:value="editRow.major" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否取得注册安全工程师" name="isSafetyEngineer" :rules="req('请选择')">
              <a-select v-model:value="editRow.isSafetyEngineer" placeholder="请选择">
                <a-select-option :value="true">是</a-select-option>
                <a-select-option :value="false">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="职称" name="positionTitle" :rules="req('请输入职称')">
              <a-input v-model:value="editRow.positionTitle" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全资格证号" name="safeNum" :rules="req('请输入安全资格证号')">
              <a-input v-model:value="editRow.safeNum" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="职务" name="position" :rules="req('请选择职务')">
              <JDictSelectTag v-model:value="editRow.position" dictCode="position" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <!-- 仅地下矿山显示 -->
          <a-col v-if="isDx" :span="12">
            <a-form-item label="兼任职务" name="balancePosition">
              <JDictSelectTag v-model:value="editRow.balancePosition" dictCode="balancePosition" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="分管工作" name="chargeWork" :rules="req('请选择分管工作')">
              <JDictSelectTag v-model:value="editRow.chargeWork" dictCode="chargeWork" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <!-- 仅地下矿山显示 -->
          <a-col v-if="isDx" :span="12">
            <a-form-item label="兼管工作" name="balanceWork">
              <JDictSelectTag v-model:value="editRow.balanceWork" dictCode="five_leader_balance_work" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿山一线从业经历年限" name="workYears" :rules="req('请输入从业年限')">
              <a-input-number v-model:value="editRow.workYears" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Modal } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue'

interface Props {
  detail?: Record<string, any> | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })
const emit = defineEmits<{ saveRecord: [record: Record<string, any>] }>()

const listData = ref<Record<string, any>[]>([])
const modalVisible = ref(false)
const submitting = ref(false)
const editIndex = ref(-1)
const editRow = ref<Record<string, any>>({})
const modalFormRef = ref()

const mineType = computed(() => {
  const raw = props.detail?.mineType ?? props.detail?.companyType
  return raw == null ? '' : String(raw)
})

// MineType: 00地下矿山
const isDx = computed(() => mineType.value === '00')

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 90 },
  { title: '性别', dataIndex: 'sex', key: 'sex', width: 60 },
  { title: '职务', dataIndex: 'position', key: 'position', width: 120 },
  { title: '分管工作', dataIndex: 'chargeWork', key: 'chargeWork', width: 120 },
  { title: '联系电话', dataIndex: 'tel', key: 'tel', width: 130 },
  { title: '学历', dataIndex: 'degree', key: 'degree', width: 80 },
  { title: '是否注安师', key: 'isSafetyEngineer', width: 90 },
  { title: '从业年限', dataIndex: 'workYears', key: 'workYears', width: 80 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' as const },
]

function req(message: string) {
  return [{ required: true, message }]
}

watch(
  () => props.detail,
  (val) => {
    listData.value = val?.fiveLeaderDTOList ? [...val.fiveLeaderDTOList] : []
  },
  { immediate: true, deep: true }
)

function handleAdd() {
  editIndex.value = -1
  editRow.value = {}
  modalVisible.value = true
}

function handleEdit(record: Record<string, any>, index: number) {
  editIndex.value = index
  editRow.value = { ...record }
  modalVisible.value = true
}

function handleDelete(index: number) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条记录吗？',
    onOk() {
      listData.value.splice(index, 1)
    },
  })
}

async function handleSubmit() {
  await modalFormRef.value?.validate()
  submitting.value = true
  try {
    if (editIndex.value === -1) {
      listData.value.push({ ...editRow.value, id: Date.now() })
    } else {
      listData.value[editIndex.value] = { ...editRow.value }
    }
    modalVisible.value = false
  } finally {
    submitting.value = false
  }
}

function handleSaveRow(record: Record<string, any>) {
  emit('saveRecord', { ...record })
}

async function validate(): Promise<Record<string, any>> {
  const first = listData.value[0]
  return first ? { ...first } : {}
}

defineExpose({ validate })
</script>

<style lang="less" scoped>
@import './formClassComponent.less';
</style>
