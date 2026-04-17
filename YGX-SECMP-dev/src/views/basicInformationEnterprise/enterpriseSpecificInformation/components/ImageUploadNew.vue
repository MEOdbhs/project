<template>
    <div class="image-upload-new">
      <!-- 图片网格区域 -->
      <ImagePreview v-if="innerFileList.length > 0" :image-list="previewList">
        <div class="image-grid">
          <div class="image-grid-item" v-for="item in innerFileList" :key="item.id">
            <div class="grid-item-content">
              <div class="image-preview">
                <img :src="getFilePreviewUrl(item)" :alt="item.fileName" @click="handleImageClick(item)" />
              </div>
              <div class="image-actions-overlay">
                <a-tooltip title="预览">
                  <div class="action-icon-btn preview-btn" @click.stop="handleImageClick(item)">
                    <ZoomInOutlined />
                  </div>
                </a-tooltip>
                <a-tooltip title="下载">
                  <div class="action-icon-btn download-btn" @click.stop="handleDownloadByItem(item)">
                    <CloudDownloadOutlined />
                  </div>
                </a-tooltip>
                <a-tooltip v-if="!readonly" title="删除">
                  <div class="action-icon-btn delete-btn" @click.stop="handleRemoveByItem(item)">
                    <DeleteOutlined />
                  </div>
                </a-tooltip>
              </div>
            </div>
            <div class="file-name" :title="item.fileName">{{ item.fileName }}</div>
          </div>
  
          <!-- 上传按钮 -->
          <a-upload
            v-if="!readonly && !isReachedLimit"
            v-model:file-list="uploadFileList"
            :before-upload="handleBeforeUpload"
            :customRequest="handleUpload"
            :multiple="!single"
            :show-upload-list="false"
            accept="image/*"
            class="empty-upload"
          >
            <div class="upload-grid-item">
              <PlusOutlined class="upload-icon" />
              <div class="upload-text">上传图片</div>
            </div>
          </a-upload>
        </div>
      </ImagePreview>
  
      <!-- 无图片时显示上传按钮 -->
      <a-upload
        v-else-if="!readonly"
        v-model:file-list="uploadFileList"
        :before-upload="handleBeforeUpload"
        :customRequest="handleUpload"
        :multiple="!single"
        :show-upload-list="false"
        accept="image/*"
        class="empty-upload"
      >
        <div class="upload-empty-btn">
          <PlusOutlined class="upload-icon" />
          <div class="upload-text">上传图片</div>
        </div>
      </a-upload>
  
      <!-- 只读模式下无图片的空状态 -->
      <div class="empty-state" v-else>
        <InboxOutlined class="empty-icon" />
        <div class="empty-text">暂无图片</div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed, onUnmounted } from 'vue'
  import {
    PlusOutlined,
    ZoomInOutlined,
    CloudDownloadOutlined,
    DeleteOutlined,
    InboxOutlined,
  } from '@ant-design/icons-vue'
  import { message, Modal } from 'ant-design-vue'
  import { defHttp } from '/@/utils/http/axios'
  import { ImagePreview, createImgPreview } from '/@/components/Preview'
  import { downloadFiles } from '/@/api/common/api'
  
  // 定义文件对象类型（可根据实际调整）
  export interface FileItem {
    id: string               // 文件ID
    fileName: string         // 文件名
    fileType: number | string // 文件类型（1=图片）
    fileSize: number         // 文件大小（字节）
    fileExtname: string      // 扩展名，如 .png
    fileAddr: string         // 存储地址
    filePath: string         // 完整访问URL
    bizId?: string           // 业务ID（新增时可为空）
    // 可扩展其他字段
  }
  
  const props = defineProps({
    // 文件列表（v-model）
    fileList: {
      type: Array as () => FileItem[],
      default: () => [],
    },
    // 是否单张
    single: {
      type: Boolean,
      default: false,
    },
    // 只读模式（不可上传/删除）
    readonly: {
      type: Boolean,
      default: false,
    },
    // 数量限制（0表示不限制）
    limit: {
      type: Number,
      default: 0,
    },
    // 业务ID（新增时可能没有，但编辑时传入用于回显？实际上我们通过 fileList 直接传入，不需要 bizId 自动加载）
    bizId: {
      type: String,
      default: '',
    },
  })
  
  const emit = defineEmits(['update:fileList'])
  
  // 内部文件列表，直接绑定 props.fileList
  const innerFileList = computed({
    get: () => props.fileList,
    set: (val) => emit('update:fileList', val),
  })
  
  // 用于 a-upload 的临时文件列表（仅用于占位，实际不用）
  const uploadFileList = ref([])
  
  // 图片预览列表（用于 ImagePreview 组件）
  const previewList = computed(() => {
    return innerFileList.value
      .map((file) => ({
        src: getFilePreviewUrl(file),
        alt: file.fileName,
      }))
      .filter((item) => item.src)
  })
  
  // 是否达到上传数量限制
  const isReachedLimit = computed(() => {
    if (props.limit <= 0) return false
    return innerFileList.value.length >= props.limit
  })
  
  // 存储文件的 blob URL 缓存
  const filePreviewUrls = ref(new Map<string, string>())
  
  // 获取文件预览URL
  const getFilePreviewUrl = (file: FileItem): string => {
    if (!file?.id) return ''
    if (filePreviewUrls.value.has(file.id)) {
      return filePreviewUrls.value.get(file.id)!
    }
    // 异步加载
    loadFilePreview(file)
    return ''
  }
  
  // 异步加载文件预览
  const loadFilePreview = async (file: FileItem) => {
    if (!file.fileAddr || filePreviewUrls.value.has(file.id)) return
    try {
      const response = await defHttp.getAxios().get('/gateway/system/common/file/downloadFile', {
        params: { filePath: file.fileAddr },
        responseType: 'blob',
      })
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
      filePreviewUrls.value.set(file.id, blobUrl)
    } catch (error) {
      console.error('获取文件预览URL失败:', error)
    }
  }
  
  // 清理 blob URL
  onUnmounted(() => {
    filePreviewUrls.value.forEach((url) => window.URL.revokeObjectURL(url))
    filePreviewUrls.value.clear()
  })
  
  // 上传文件到服务器（返回完整的文件对象）
  const uploadFileAndSaveRec = async (file: File): Promise<FileItem> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', '1') // 图片类型
  
    const axiosInstance = defHttp.getAxios()
    const res = await axiosInstance.post('/gateway/main-app/CsFiles/uploadFileAndSaveRec', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data?.result || res.data
  }
  
  // 上传前校验
  const handleBeforeUpload = (file: File) => {
    // 检查类型
    if (!file.type.startsWith('image/')) {
      message.error('只能上传图片文件!')
      return false
    }
    // 单张限制
    if (props.single && innerFileList.value.length >= 1) {
      message.error('仅支持上传单个图片，请先删除已有图片')
      return false
    }
    // 数量限制
    if (props.limit > 0 && innerFileList.value.length >= props.limit) {
      message.error(`最多只能上传 ${props.limit} 张图片!`)
      return false
    }
    // 大小限制 10MB
    if (file.size / 1024 / 1024 > 10) {
      message.error('图片大小不能超过 10MB!')
      return false
    }
    return true
  }
  
  // 自定义上传
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options
    try {
      const result = await uploadFileAndSaveRec(file)
      if (!result || !result.id) {
        message.error('上传失败：返回数据格式错误')
        onError(new Error('上传失败'))
        return
      }
      // 将新文件添加到列表
      innerFileList.value = [...innerFileList.value, result]
      message.success('上传成功')
      onSuccess(result, file)
    } catch (error) {
      console.error('上传失败:', error)
      message.error('上传失败，请稍后重试')
      onError(error)
    }
  }
  
  // 删除文件
  const handleRemoveByItem = (item: FileItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除图片 "${item.fileName}" 吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 调用删除接口（如果需要后端删除）
          // 注意：如果只是前端删除，不需要调用接口；但通常需要同步后端
          // 这里假设需要调用删除接口
          await defHttp.delete({ url: `/gateway/main-app/CsFiles/delete/${item.id}` })
          innerFileList.value = innerFileList.value.filter((f) => f.id !== item.id)
          message.success('删除成功')
        } catch (error) {
          console.error('删除失败:', error)
          message.error('删除失败，请稍后重试')
        }
      },
    })
  }
  
  // 图片点击预览
  const handleImageClick = (item: FileItem) => {
    const index = innerFileList.value.findIndex((img) => img.id === item.id)
    const imgList = innerFileList.value.map((file) => getFilePreviewUrl(file)).filter((url) => url)
    if (imgList.length === 0) {
      message.warning('图片还在加载中，请稍后再试')
      return
    }
    createImgPreview({
      imageList: imgList,
      index: index >= 0 ? index : 0,
    })
  }
  
  // 下载文件
  const handleDownloadByItem = (item: FileItem) => {
    if (!item.fileAddr || !item.fileName) {
      message.error('文件信息不完整')
      return
    }
    downloadFiles(item.fileAddr, item.fileName)
  }
  </script>
  
  <style lang="less" scoped>
  .image-upload-new {
    width: 100%;
  
    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;
  
      .image-grid-item {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        transition: all 0.3s;
        cursor: pointer;
        border: 1px solid rgba(253, 253, 253, 0.12);
  
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-color: rgba(253, 253, 253, 0.25);
  
          .image-actions-overlay {
            opacity: 1;
            background: rgba(0, 0, 0, 0.6);
          }
        }
  
        .grid-item-content {
          position: relative;
          width: 100%;
          height: 140px;
          background: #f5f5f5;
          overflow: hidden;
  
          .image-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            cursor: pointer;
          }
  
          .image-actions-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            opacity: 0;
            transition: all 0.3s;
            z-index: 10;
            pointer-events: auto;
  
            .action-icon-btn {
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 22px;
              border-radius: 50%;
              cursor: pointer;
              transition: all 0.25s;
              background: #1890ff;
              color: #fff;
              box-shadow: 0 2px 8px rgba(24, 144, 255, 0.5);
  
              &:hover {
                background: #40a9ff;
                transform: scale(1.2);
                box-shadow: 0 4px 16px rgba(24, 144, 255, 0.8);
              }
            }
          }
        }
  
        .file-name {
          padding: 8px 10px;
          font-size: 13px;
          color: #fff;
          background: #0B1C36;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
          border-top: 1px solid rgba(253, 253, 253, 0.12);
        }
      }
  
      .upload-grid-item {
        width: 140px;
        height: 140px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px dashed rgba(253, 253, 253, 0.12);
        border-radius: 4px;
        background: #0B1C36;
        cursor: pointer;
        transition: all 0.3s;
  
        &:hover {
          border-color: #1890ff;
          .upload-icon {
            color: #1890ff;
            transform: scale(1.1);
          }
          .upload-text {
            color: #1890ff;
          }
        }
  
        .upload-icon {
          font-size: 32px;
          color: #fff;
          transition: all 0.3s;
        }
        .upload-text {
          margin-top: 8px;
          font-size: 14px;
          color: #fff;
        }
      }
    }
  
    .empty-upload .upload-empty-btn {
      width: 140px;
      height: 140px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px dashed rgba(253, 253, 253, 0.12);
      border-radius: 4px;
      background: #0B1C36;
      cursor: pointer;
      transition: all 0.3s;
  
      &:hover {
        border-color: #1890ff;
        .upload-icon {
          color: #1890ff;
          transform: scale(1.2);
        }
        .upload-text {
          color: #1890ff;
        }
      }
  
      .upload-icon {
        font-size: 48px;
        color: #fff;
        transition: all 0.3s;
      }
      .upload-text {
        margin-top: 12px;
        font-size: 14px;
        color: #fff;
      }
    }
  
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      background: #0B1C36;
      border: 1px dashed rgba(253, 253, 253, 0.12);
      border-radius: 8px;
      .empty-icon {
        font-size: 48px;
        color: #e5e7eb;
        margin-bottom: 12px;
      }
      .empty-text {
        font-size: 14px;
        color: #999;
      }
    }
  }
  </style>