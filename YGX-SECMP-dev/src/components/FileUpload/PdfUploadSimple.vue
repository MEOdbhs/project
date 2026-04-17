<template>
  <div class="pdf-upload-simple">
    <!-- 有文件时：显示文件名，点击下载 -->
    <div v-if="fileInfo" class="file-display">
      <FilePdfOutlined class="file-icon" />
      <span class="file-name" :title="fileInfo.fileName" @click="handleDownload">
        {{ fileInfo.fileName }}
      </span>
      <a-tooltip v-if="!disabled" title="删除">
        <DeleteOutlined class="delete-icon" @click="handleRemove" />
      </a-tooltip>
    </div>

    <!-- 无文件时：显示上传按钮 -->
    <a-upload
      v-else-if="!disabled"
      :before-upload="handleBeforeUpload"
      :custom-request="handleUpload"
      :show-upload-list="false"
      accept=".pdf"
    >
      <a-button :loading="uploading" type="primary" ghost size="small">
        <template #icon><UploadOutlined /></template>
        点击上传（PDF格式）
      </a-button>
    </a-upload>

    <!-- 无文件 + 只读 -->
    <span v-else class="empty-text">暂无附件</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { FilePdfOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { defHttp } from '/@/utils/http/axios'
import { getFileListByBizId, deleteFileById } from '/@/api/common/api'

interface FileRecord {
  id: string
  fileName: string
  fileAddr: string
  filePath?: string
  fileType?: string
}

interface Props {
  /** 外部绑定：
   *  - 新：JSON.stringify 之后的数组字符串，如 '[{...}]'
   *  - 旧：逗号分隔的文件 ID 字符串，如 'id1' 或 'id1,id2'，兼容 string[]
   */
  value?: string | string[]
  /** 业务 ID，有值时优先用 getFileListByBizId 查询列表并回显（与 FileUploadRecord 一致） */
  bizId?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })
const emit = defineEmits<{
  'update:value': [val: string]
  'change': [val: string]
}>()

function parseIds(val: string | string[] | undefined): string[] {
  if (val == null) return []
  if (Array.isArray(val)) return val.map((id) => String(id)).filter(Boolean)
  if (val === '') return []
  return val.split(',').map((s) => s.trim()).filter(Boolean)
}

function parseJsonValueToRecord(val: string | string[] | undefined): FileRecord | null {
  if (val == null) return null
  if (Array.isArray(val)) return null
  const trimmed = val.trim()
  if (!trimmed) return null
  if (!(trimmed.startsWith('[') || trimmed.startsWith('{'))) return null
  try {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) {
      return parsed[0] ?? null
    }
    return parsed as FileRecord
  } catch {
    return null
  }
}

const uploading = ref(false)
const fileInfo = ref<FileRecord | null>(null)

const PDF_FILE_TYPE = '4'

// 上传到服务器（与 FileUploadRecord 一致，仅用 api 的 3 个方法，上传在组件内实现）
async function uploadFileAndSaveRec(file: File): Promise<FileRecord> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileType', PDF_FILE_TYPE)
  const res = await defHttp.getAxios().post(
    '/gateway/main-app/CsFiles/uploadFileAndSaveRec',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return res.data?.result ?? res.data
}

// 上传前校验：只允许 PDF
function handleBeforeUpload(file: File) {
  const isPdf = file.name.toLowerCase().endsWith('.pdf')
  if (!isPdf) {
    message.error('仅支持上传 PDF 格式文件')
    return false
  }
  return true
}

// 自定义上传
async function handleUpload(options: any) {
  const { file, onSuccess, onError } = options
  uploading.value = true
  try {
    const result = await uploadFileAndSaveRec(file)
    if (!result?.id) {
      message.error('上传失败：数据错误，请联系管理员')
      onError(new Error('上传失败'))
      return
    }
    fileInfo.value = result
    const payload = JSON.stringify([result])
    emit('update:value', payload)
    emit('change', payload)
    message.success('上传成功')
    onSuccess(result, file)
  } catch (err) {
    message.error('上传失败，请稍后重试')
    onError(err)
  } finally {
    uploading.value = false
  }
}

// 删除
function handleRemove() {
  if (!fileInfo.value) return
  const target = fileInfo.value
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除文件 "${target.fileName}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteFileById(target.id)
        fileInfo.value = null
        const emptyPayload = JSON.stringify([])
        emit('update:value', emptyPayload)
        emit('change', emptyPayload)
        message.success('删除成功')
      } catch {
        message.error('删除失败，请稍后重试')
      }
    },
  })
}

// 下载
function handleDownload() {
  if (!fileInfo.value) {
    message.error('文件信息不存在')
    return
  }
  const filePath = fileInfo.value.filePath
  if (!filePath) {
    message.error('文件下载地址不存在')
    return
  }
  window.open(filePath, '_blank')
}

// 回显：
// 1）优先从 JSON 字符串解析（新模式，直接存储文件记录数组）
// 2）否则回退到通过 bizId + id 列表查询（兼容旧模式）
watch(
  [() => props.bizId, () => props.value],
  async ([bizId, val]) => {
    const recordFromJson = parseJsonValueToRecord(val)
    if (recordFromJson) {
      fileInfo.value = recordFromJson
      return
    }
    if (!bizId) {
      fileInfo.value = null
      return
    }
    try {
      const list = await getFileListByBizId(bizId)
      const fileList = Array.isArray(list) ? list : (list as any)?.result ?? []
      const ids = parseIds(val)
      const item = ids.length > 0
        ? fileList.find((f: FileRecord) => f.id === ids[0])
        : fileList[0] ?? null
      fileInfo.value = item ?? null
    } catch {
      fileInfo.value = null
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="less" scoped>
.pdf-upload-simple {
  display: flex;
  align-items: center;
  min-height: 32px;

  .file-display {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px;
    background: #001e38;
    border: 1px solid #1d4068;
    border-radius: 4px;
    max-width: 100%;

    .file-icon {
      color: #e74c3c;
      font-size: 16px;
      flex-shrink: 0;
    }

    .file-name {
      color: #40a9ff;
      font-size: 13px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;

      &:hover {
        text-decoration: underline;
      }
    }

    .delete-icon {
      color: #ff4d4f;
      font-size: 14px;
      cursor: pointer;
      flex-shrink: 0;
      transition: color 0.2s;

      &:hover {
        color: #ff7875;
      }
    }
  }

  .empty-text {
    color: #3a6080;
    font-size: 13px;
  }
}
</style>
