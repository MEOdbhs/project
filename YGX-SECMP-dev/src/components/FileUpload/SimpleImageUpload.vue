<template>
    <div class="simple-image-upload">
        <!-- 图片网格区域 -->
        <ImagePreview v-if="imageFiles.length > 0" :image-list="imagePreviewList">
            <div class="image-grid">
                <div class="image-grid-item" v-for="item in imageFiles" :key="item.id">
                    <div class="grid-item-content">
                        <!-- 图片预览 -->
                        <div class="image-preview">
                            <img :src="getFilePreviewUrl(item)" :alt="item.fileName" @click="handleImageClick(item)" />
                        </div>

                        <!-- Hover操作图标 -->
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
                            <!-- 只读模式下隐藏删除按钮 -->
                            <a-tooltip v-if="!readonly" title="删除">
                                <div class="action-icon-btn delete-btn" @click.stop="handleRemoveByItem(item)">
                                    <DeleteOutlined />
                                </div>
                            </a-tooltip>
                        </div>
                    </div>
                    <div class="file-name" :title="item.fileName">
                        {{ item.fileName }}
                    </div>
                </div>

                <!-- 上传按钮（只读模式下隐藏，达到限制数量后也隐藏） -->
                <a-upload v-if="!readonly && !isReachedLimit" v-model:file-list="fileListDisplay"
                    :before-upload="handleBeforeUpload" :customRequest="handleUpload" :remove="handleRemove"
                    :multiple="!single && !limit" :show-upload-list="false" accept="image/*" class="empty-upload">
                    <div class="upload-grid-item">
                        <PlusOutlined class="upload-icon" />
                        <div class="upload-text">上传图片</div>
                    </div>
                </a-upload>
            </div>
        </ImagePreview>

        <!-- 无图片时显示上传按钮 -->
        <a-upload v-else-if="!readonly" v-model:file-list="fileListDisplay" :before-upload="handleBeforeUpload"
            :customRequest="handleUpload" :remove="handleRemove" :multiple="!single" :show-upload-list="false"
            accept="image/*" class="empty-upload">
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

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'
import {
    PlusOutlined,
    ZoomInOutlined,
    CloudDownloadOutlined,
    DeleteOutlined,
    InboxOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { defHttp } from '/@/utils/http/axios'
import { ImagePreview, createImgPreview } from '/@/components/Preview'
import { downloadFiles, getFileListByBizId, deleteFileById } from '/@/api/common/api'

const props = defineProps({
    value: {
        type: Array,
        default: () => [],
    },
    single: {
        type: Boolean,
        default: false,
    },
    bizId: {
        type: String,
        default: '',
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    limit: {
        type: Number,
        default: 0, // 0 表示不限制
    },
    apiFlieList: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['update:value', 'change'])

// 文件列表数据（只包含图片）
const imageFiles = ref([])

// 用于 a-upload 显示的文件列表
const fileListDisplay = computed(() => {
    return imageFiles.value.map((item) => ({
        uid: item.id,
        name: item.fileName,
        status: 'done',
        url: '',
        response: item,
    }))
})

// 图片预览列表（用于 ImagePreview 组件）
const imagePreviewList = computed(() => {
    return imageFiles.value.map(file => ({
        src: getFilePreviewUrl(file),
        alt: file.fileName,
    })).filter(item => item.src) // 过滤掉没有加载完成的图片
})

// 是否达到上传数量限制
const isReachedLimit = computed(() => {
    if (props.limit <= 0) {
        return false // 0 表示不限制
    }
    return imageFiles.value.length >= props.limit
})

// 存储文件的 blob URL 缓存
const filePreviewUrls = ref(new Map())

// 获取文件预览URL（同步返回，异步加载）
const getFilePreviewUrl = (file) => {
    if (!file || !file.id) {
        return ''
    }

    // 如果已经有缓存，直接返回
    if (filePreviewUrls.value.has(file.id)) {
        return filePreviewUrls.value.get(file.id)
    }

    // 异步加载文件
    // loadFilePreview(file) 避免反复调用

    // 先返回空字符串，等加载完成后会自动更新
    return ''
}

// 异步加载文件预览
const loadFilePreview = async (file) => {
    if (!file.fileAddr || filePreviewUrls.value.has(file.id)) {
        return
    }

    try {
        // 使用下载接口获取文件流
        const response = await defHttp.getAxios().get('/gateway/system/common/file/downloadFile', {
            params: { filePath: file.fileAddr },
            responseType: 'blob',
        })

        // 将 blob 转换为 URL
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]))

        // 缓存 blob URL
        filePreviewUrls.value.set(file.id, blobUrl)
    } catch (error) {
        console.error('获取文件预览URL失败:', error, file)
    }
}

// 监听文件列表变化，预加载预览URL
watch(
    () => imageFiles.value,
    (newFiles) => {
        newFiles.forEach(file => {
            loadFilePreview(file)
        })
    },
    { deep: true, immediate: true }
)

// 清理 blob URL（组件卸载时）
const cleanupBlobUrls = () => {
    filePreviewUrls.value.forEach((url) => {
        window.URL.revokeObjectURL(url)
    })
    filePreviewUrls.value.clear()
}

// 组件卸载时清理
onUnmounted(() => {
    cleanupBlobUrls()
})

// 上传文件到服务器（保持与原组件相同的接口）
const uploadFileAndSaveRec = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    // 固定为图片类型 fileType = '1'
    formData.append('fileType', '1')

    const axiosInstance = defHttp.getAxios()
    return axiosInstance.post('/gateway/main-app/CsFiles/uploadFileAndSaveRec', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(res => {
        return res.data?.result || res.data
    })
}

// 监听 bizId 和 value，自动加载文件列表
watch(
    [() => props.bizId, () => props.value],
    async ([newBizId, newValue], [oldBizId, oldValue]) => {
        // console.log('SimpleImageUpload watch:', { bizId: newBizId, value: newValue })

        // 编辑模式：有 bizId 时，查询该业务下的所有文件
        if (newBizId) {
            // 如果 bizId 没有变化，且 value 也没有变化，则不需要重新查询
            if (newBizId === oldBizId && JSON.stringify(newValue) === JSON.stringify(oldValue)) {
                return
            }

            try {
                if (props.apiFlieList && props.apiFlieList.length > 0) {
                    var fileList = props.apiFlieList
                } else {
                    var fileList = await getFileListByBizId(newBizId)
                }

                // 只保留图片类型的文件（fileType === '1' 或 1）
                const imageList = fileList.filter(file => file.fileType === '1' || file.fileType === 1)

                // 保留当前列表中已经存在但接口没返回的文件（刚上传但未绑定的）
                const apiIds = imageList.map(item => item.id)
                const newUploadedFiles = imageFiles.value.filter(item => !apiIds.includes(item.id))

                // 如果有传入 value（ID数组），则过滤；否则显示所有
                if (newValue && Array.isArray(newValue) && newValue.length > 0) {
                    const filteredFiles = imageList.filter(item => newValue.includes(item.id))
                    // 合并接口返回的文件和新上传的文件
                    imageFiles.value = [...filteredFiles, ...newUploadedFiles]
                } else {
                    // 显示该业务下的所有图片 + 新上传的图片
                    imageFiles.value = [...imageList, ...newUploadedFiles]
                }

                // 确保回传 fileIds 到表单模型（编辑模式下，即使不修改图片也要回传）
                const fileIds = imageFiles.value.map(item => item.id)
                // 只有 fileIds 与当前 value 不同时才 emit，避免无限循环
                const currentValue = Array.isArray(props.value) ? props.value : []
                const isValueChanged = JSON.stringify(fileIds.sort()) !== JSON.stringify(currentValue.sort())
                if (isValueChanged) {
                    emit('update:value', fileIds)
                    emit('change', fileIds)
                }
            } catch (error) {
                console.error('查询文件列表失败:', error)
                // 查询失败时保留当前已上传的文件
                if (!imageFiles.value || imageFiles.value.length === 0) {
                    imageFiles.value = []
                }
            }

        } else {
            // 新增模式：没有 bizId
            // 如果 value 为空，清空列表；否则保持现有列表（上传后的文件）
            if (!newValue || newValue.length === 0) {
                imageFiles.value = []
            }
            // 如果有 value 但没有 bizId，说明是新增模式刚上传的文件，保持 imageFiles 不变
        }
    },
    
    { immediate: true, deep: true }
)

// 上传前校验
const handleBeforeUpload = (file) => {
    // 检查文件类型
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
        message.error('只能上传图片文件!')
        return false
    }

    // 如果是单文件模式且已有文件，则不允许上传
    if (props.single && imageFiles.value.length > 0) {
        message.error('仅支持上传单个图片，请先删除已有图片')
        return false
    }

    // 检查数量限制
    if (props.limit > 0 && imageFiles.value.length >= props.limit) {
        message.error(`最多只能上传 ${props.limit} 张图片!`)
        return false
    }

    // 检查文件大小（限制为10MB）
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
        message.error('图片大小不能超过 10MB!')
        return false
    }

    return true
}

// 自定义上传
const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options

    try {
        // 调用上传接口
        const result = await uploadFileAndSaveRec(file)

        // 检查返回的数据中是否包含id
        if (!result || !result.id) {
            message.error('上传失败：返回数据格式错误')
            onError(new Error('上传失败'))
            return
        }

        // 添加到文件列表数据
        imageFiles.value.push(result)

        // 只向外部传递ID数组
        const fileIds = imageFiles.value.map(item => item.id)
        emit('update:value', fileIds)
        emit('change', fileIds)

        message.success('上传成功')
        onSuccess(result, file)
    } catch (error) {
        console.error('上传失败:', error)
        message.error('上传失败，请稍后重试')
        onError(error)
    }
}

// 删除文件
const handleRemove = async (file) => {
    try {
        const fileId = file.response?.id || file.uid

        if (fileId) {
            await deleteFileById(fileId)

            imageFiles.value = imageFiles.value.filter((item) => item.id !== fileId)

            // 只向外部传递ID数组
            const fileIds = imageFiles.value.map(item => item.id)
            emit('update:value', fileIds)
            emit('change', fileIds)

            message.success('删除成功')
        }
        return true
    } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败，请稍后重试')
        return false
    }
}

// 通过文件项删除
const handleRemoveByItem = (item) => {
    Modal.confirm({
        title: '确认删除',
        content: `确定要删除图片 "${item.fileName}" 吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
           if(props.apiFlieList && props.apiFlieList.length > 0){
            imageFiles.value = imageFiles.value.filter(img => img.id !== item.id)
           }else{
            try {
                await deleteFileById(item.id)
                imageFiles.value = imageFiles.value.filter((file) => file.id !== item.id)

                // 只向外部传递ID数组
                const fileIds = imageFiles.value.map(file => file.id)
                emit('update:value', fileIds)
                emit('change', fileIds)

                message.success('删除成功')
            } catch (error) {
                console.error('删除失败:', error)
                message.error('删除失败，请稍后重试')
            }
           }
        },
    })
}

// 处理图片点击（使用 ImagePreview 组件预览）
const handleImageClick = (item) => {
    if (!item.fileAddr) {
        message.error('文件路径不存在，无法预览')
        return
    }

    // 获取当前图片在图片列表中的索引
    const index = imageFiles.value.findIndex(img => img.id === item.id)

    // 构建图片列表
    const imgList = imageFiles.value.map(file => getFilePreviewUrl(file)).filter(url => url)

    if (imgList.length === 0) {
        message.warning('图片还在加载中，请稍后再试')
        return
    }

    // 使用 createImgPreview 函数预览图片
    createImgPreview({
        imageList: imgList,
        index: index >= 0 ? index : 0,
    })
}

// 通过文件项下载
const handleDownloadByItem = (item) => {
    if (!item.fileAddr) {
        message.error('文件路径不存在')
        return
    }

    if (!item.fileName) {
        message.error('文件名不存在')
        return
    }

    downloadFiles(item.fileAddr, item.fileName)
}
defineExpose({
    imageFiles
})
</script>

<style lang="less" scoped>
.simple-image-upload {
    width: 100%;

    // 图片网格视图
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
                    opacity: 1 !important;
                    background: rgba(0, 0, 0, 0.6) !important;
                }
            }

            .grid-item-content {
                position: relative;
                width: 100%;
                height: 140px;
                background: #f5f5f5;
                overflow: hidden;

                // 图片预览
                .image-preview {
                    width: 100%;
                    height: 100%;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        cursor: pointer;
                    }
                }

                // Hover遮罩层
                .image-actions-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.3);
                    display: flex !important;
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
                        z-index: 11;
                        background: #1890ff;
                        color: #fff;
                        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.5);

                        &:hover {
                            background: #40a9ff;
                            transform: scale(1.2);
                            box-shadow: 0 4px 16px rgba(24, 144, 255, 0.8);
                        }

                        &:active {
                            transform: scale(0.9);
                        }
                    }
                }
            }
        }

        // 上传按钮样式（在网格中）
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
                background: #0B1C36;
                transform: translateY(-2px);

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
                transition: all 0.3s;
            }
        }
    }

    // 空状态上传按钮
    .empty-upload {
        .upload-empty-btn {
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
                // background: #f0f7ff;

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
                transition: all 0.3s;
            }
        }
    }

    // 空状态
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

    .file-name {
        padding: 8px 10px;
        font-size: 13px;
        color: #fff;
        background: #0B1C36;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        line-height: 1.4;
        border-top: 1px solid rgba(253, 253, 253, 0.12);
    }
}
</style>
