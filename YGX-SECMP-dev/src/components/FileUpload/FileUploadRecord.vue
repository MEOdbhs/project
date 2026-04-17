<template>
    <div class="file-upload-container">
        <!-- 文件类型标签页 -->
        <div class="file-tabs">
            <div 
                class="tab-item" 
                :class="{ active: activeTab === 'all' }"
                @click="activeTab = 'all'"
            >
                全部 ({{ fileListData.length }})
            </div>
            <div 
                class="tab-item" 
                :class="{ active: activeTab === 'image' }"
                @click="activeTab = 'image'"
            >
                图片 ({{ imageFiles.length }})
            </div>
            <div 
                class="tab-item" 
                :class="{ active: activeTab === 'document' }"
                @click="activeTab = 'document'"
            >
                文档 ({{ documentFiles.length }})
            </div>
            
            <!-- 上传按钮（只读模式下隐藏） -->
            <a-upload 
                v-if="!readonly"
                v-model:file-list="fileListDisplay" 
                :before-upload="handleBeforeUpload" 
                :customRequest="handleUpload"
                :remove="handleRemove" 
                :multiple="!single"
                :show-upload-list="false"
                class="upload-wrapper"
            >
                <div class="upload-btn-icon">
                    <PlusOutlined />
                </div>
            </a-upload>
        </div>

        <!-- 文件网格区域 -->
        <ImagePreview v-if="filteredFiles.length > 0 && imageFiles.length > 0" :image-list="imagePreviewList">
            <div class="file-grid">
                <div 
                    class="file-grid-item" 
                    v-for="item in filteredFiles" 
                    :key="item.id"
                >
                    <div class="grid-item-content">
                        <!-- 图片预览 -->
                        <div v-if="item.fileType === '1' || item.fileType === 1" class="file-preview-image">
                            <img
                                v-if="fileUrlMap[item.id]"
                                :src="fileUrlMap[item.id]"
                                :alt="item.fileName"
                                style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;"
                                @click="handleImageClick(item)"
                            />
                            <div v-else class="file-loading">加载中...</div>
                        </div>
                        <!-- 文档图标 -->
                        <div v-else class="file-preview-icon" :class="getFileIconClass(item)">
                            <component :is="getFileIcon(item)" />
                        </div>
                        
                        <!-- Hover操作图标 -->
                        <div class="file-actions-overlay">
                            <a-tooltip title="预览">
                                <div 
                                    class="action-icon-btn preview-btn"
                                    @click.stop="handlePreviewByItem(item)"
                                >
                                    <ZoomInOutlined />
                                </div>
                            </a-tooltip>
                            <a-tooltip title="下载">
                                <div 
                                    class="action-icon-btn download-btn"
                                    @click.stop="handleDownloadByItem(item)"
                                >
                                    <CloudDownloadOutlined />
                                </div>
                            </a-tooltip>
                            <!-- 只读模式下隐藏删除按钮 -->
                            <a-tooltip v-if="!readonly" title="删除">
                                <div 
                                    class="action-icon-btn delete-btn"
                                    @click.stop="handleRemoveByItem(item)"
                                >
                                    <DeleteOutlined />
                                </div>
                            </a-tooltip>
                        </div>
                    </div>
                    <!-- 文件名称 -->
                    <div class="file-name" :title="item.fileName">
                        {{ item.fileName }}
                    </div>
                </div>
            </div>
        </ImagePreview>
        
        <!-- 无图片时的文件网格 -->
        <div class="file-grid" v-else-if="filteredFiles.length > 0">
            <div 
                class="file-grid-item" 
                v-for="item in filteredFiles" 
                :key="item.id"
            >
                <div class="grid-item-content">
                    <!-- 文档图标 -->
                    <div class="file-preview-icon" :class="getFileIconClass(item)">
                        <component :is="getFileIcon(item)" />
                    </div>
                    
                    <!-- Hover操作图标 -->
                    <div class="file-actions-overlay">
                        <a-tooltip title="预览">
                            <div 
                                class="action-icon-btn preview-btn"
                                @click.stop="handlePreviewByItem(item)"
                            >
                                <ZoomInOutlined />
                            </div>
                        </a-tooltip>
                        <a-tooltip title="下载">
                            <div 
                                class="action-icon-btn download-btn"
                                @click.stop="handleDownloadByItem(item)"
                            >
                                <CloudDownloadOutlined />
                            </div>
                        </a-tooltip>
                        <!-- 只读模式下隐藏删除按钮 -->
                        <a-tooltip v-if="!readonly" title="删除">
                            <div 
                                class="action-icon-btn delete-btn"
                                @click.stop="handleRemoveByItem(item)"
                            >
                                <DeleteOutlined />
                            </div>
                        </a-tooltip>
                    </div>
                </div>
                <!-- 文件名称 -->
                <div class="file-name" :title="item.fileName">
                    {{ item.fileName }}
                </div>
            </div>
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-else-if="fileListData.length === 0">
            <InboxOutlined class="empty-icon" />
            <div class="empty-text">暂无附件</div>
        </div>

        <!-- 过滤后为空 -->
        <div class="empty-state" v-else>
            <InboxOutlined class="empty-icon" />
            <div class="empty-text">该分类下暂无文件</div>
        </div>
    </div>
    
    <PreviewModal @register="registerPreviewModal" />
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue';
import { 
    PlusOutlined,
    FileOutlined,
    FileImageOutlined,
    FileTextOutlined,
    FileExcelOutlined,
    FileWordOutlined,
    FilePdfOutlined,
    FileZipOutlined,
    VideoCameraOutlined,
    SoundOutlined,
    ZoomInOutlined,
    CloudDownloadOutlined,
    DeleteOutlined,
    InboxOutlined 
} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { defHttp } from '/@/utils/http/axios';
import { useModal } from '/@/components/Modal';
import PreviewModal from '/@/components/FileModal/PreviewModal.vue';
import { ImagePreview, createImgPreview } from '/@/components/Preview';
import { downloadFiles, getFileListByBizId, deleteFileById } from '/@/api/common/api';

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
});

const emit = defineEmits(['update:value', 'change']);

// 注册预览弹窗
const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();

// 文件列表数据
const fileListData = ref([]);

// 当前激活的标签页
const activeTab = ref('all');

// 用于 a-upload 显示的文件列表
const fileListDisplay = computed(() => {
    return fileListData.value.map((item) => ({
        uid: item.id,
        name: item.fileName,
        status: 'done',
        url: '',
        response: item,
    }));
});

// 图片文件列表
const imageFiles = computed(() => {
    return fileListData.value.filter(file => {
        // 兼容字符串和数字类型
        return file.fileType === '1' || file.fileType === 1;
    });
});

// 文档文件列表（包括视频、音频、普通文件，不包括空值）
const documentFiles = computed(() => {
    return fileListData.value.filter(file => {
        if (!file.fileType) return false;
        // 兼容字符串和数字类型
        const type = String(file.fileType);
        return ['2', '3', '4'].includes(type);
    });
});

// 过滤后的文件列表
const filteredFiles = computed(() => {
    if (activeTab.value === 'image') {
        return imageFiles.value;
    } else if (activeTab.value === 'document') {
        return documentFiles.value;
    }
    return fileListData.value;
});

// 图片预览列表（用于 ImagePreview 组件）- 优化性能，只在 URL 变化时重新计算
const imagePreviewList = computed(() => {
    // 直接从缓存中获取已加载的 URL，避免调用 getFilePreviewUrl
    return imageFiles.value
        .map(file => {
            const url = filePreviewUrls.value.get(file.id);
            return url ? { src: url, alt: file.fileName } : null;
        })
        .filter(item => item !== null);
});

// 为每个文件创建 URL 映射（优化模板中的访问性能）
const fileUrlMap = computed(() => {
    const map = {};
    fileListData.value.forEach(file => {
        // 首次访问时触发加载
        if (!filePreviewUrls.value.has(file.id) && !loadingFileIds.has(file.id) && (file.fileType === '1' || file.fileType === 1)) {
            loadFilePreview(file);
        }
        // 从缓存中获取 URL
        map[file.id] = filePreviewUrls.value.get(file.id) || '';
    });
    return map;
});

// 获取文件类型名称
const getFileTypeName = (fileType) => {
    const typeMap = {
        '1': '图片',
        '2': '视频',
        '3': '音频',
        '4': '文档',
    };
    return typeMap[fileType] || '文件';
};

// 获取文件图标
const getFileIcon = (file) => {
    const fileName = file.fileName || '';
    const ext = fileName.split('.').pop()?.toLowerCase();
    const fileType = String(file.fileType); // 转换为字符串统一比较
    
    // 根据文件类型返回图标
    if (fileType === '1') {
        return FileImageOutlined;
    } else if (fileType === '2') {
        return VideoCameraOutlined;
    } else if (fileType === '3') {
        return SoundOutlined;
    }
    
    // 根据扩展名返回特定图标
    if (['xlsx', 'xls'].includes(ext)) {
        return FileExcelOutlined;
    } else if (['doc', 'docx'].includes(ext)) {
        return FileWordOutlined;
    } else if (ext === 'pdf') {
        return FilePdfOutlined;
    } else if (['zip', 'rar', '7z'].includes(ext)) {
        return FileZipOutlined;
    } else if (['txt', 'md'].includes(ext)) {
        return FileTextOutlined;
    }
    
    return FileOutlined;
};

// 获取文件图标类名
const getFileIconClass = (file) => {
    // 如果 fileType 为空或未定义，返回默认样式
    if (!file.fileType) {
        return 'icon-default';
    }
    
    const fileType = String(file.fileType); // 转换为字符串统一比较
    const typeMap = {
        '1': 'icon-image',
        '2': 'icon-video',
        '3': 'icon-audio',
        '4': 'icon-document',
    };
    return typeMap[fileType] || 'icon-default';
};

// 存储文件的 blob URL 缓存（使用 shallowRef 避免深度响应式）
const filePreviewUrls = ref(new Map());

// 存储正在加载的文件ID集合，防止重复加载
const loadingFileIds = new Set();

// 缓存 getFilePreviewUrl 的结果，避免重复计算
const previewUrlCache = new Map();

// 获取文件预览URL（同步返回，异步加载）
const getFilePreviewUrl = (file) => {
    if (!file || !file.id) {
        return '';
    }
    
    // 如果已经有缓存，直接返回
    if (filePreviewUrls.value.has(file.id)) {
        return filePreviewUrls.value.get(file.id);
    }
    
    // 如果正在加载中，返回空字符串，避免重复触发加载
    if (!loadingFileIds.has(file.id)) {
        // 异步加载文件
        loadFilePreview(file);
    }
    
    // 先返回空字符串，等加载完成后会自动更新
    return '';
};

// 异步加载文件预览
const loadFilePreview = async (file) => {
    if (!file.fileAddr || filePreviewUrls.value.has(file.id) || loadingFileIds.has(file.id)) {
        return;
    }
    
    // 标记为正在加载
    loadingFileIds.add(file.id);
    
    try {
        // 使用下载接口获取文件流
        const response = await defHttp.getAxios().get('/gateway/system/common/file/downloadFile', {
            params: { filePath: file.fileAddr },
            responseType: 'blob',
        });
        
        // 将 blob 转换为 URL
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        
        // 创建新的 Map 触发响应式更新（但只更新一次）
        const newMap = new Map(filePreviewUrls.value);
        newMap.set(file.id, blobUrl);
        filePreviewUrls.value = newMap;
    } catch (error) {
        console.error('获取文件预览URL失败:', error, file);
    } finally {
        // 无论成功或失败，都移除加载标记
        loadingFileIds.delete(file.id);
    }
};



// 清理 blob URL（组件卸载时）
const cleanupBlobUrls = () => {
    filePreviewUrls.value.forEach((url) => {
        window.URL.revokeObjectURL(url);
    });
    filePreviewUrls.value = new Map();
    loadingFileIds.clear();
};

// 组件卸载时清理
onUnmounted(() => {
    cleanupBlobUrls();
});

// 根据文件名判断文件类型
const getFileTypeByName = (fileName) => {
    if (!fileName) return '4'; // 默认为普通文件
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    // 图片格式
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'];
    if (imageExts.includes(ext)) {
        return '1'; // 图片
    }
    
    // 视频格式
    const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
    if (videoExts.includes(ext)) {
        return '2'; // 视频
    }
    
    // 音频格式
    const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'];
    if (audioExts.includes(ext)) {
        return '3'; // 音频
    }
    
    // 其他文件
    return '4'; // 普通文件（文档、压缩包等）
};

// 上传文件到服务器（新接口）
const uploadFileAndSaveRec = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // 根据文件名判断文件类型
    const fileType = getFileTypeByName(file.name);
    formData.append('fileType', fileType);
    
    const axiosInstance = defHttp.getAxios();
    return axiosInstance.post('/gateway/main-app/CsFiles/uploadFileAndSaveRec', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(res => {
        return res.data?.result || res.data;
    });
};

// 监听 bizId 和 value，自动加载文件列表
watch(
    [() => props.bizId, () => props.value],
    async ([newBizId, newValue], [oldBizId, oldValue]) => {
        console.log('FileUploadRecord watch:', { bizId: newBizId, value: newValue, oldValue });
        
        // 编辑模式：有 bizId 时，查询该业务下的所有文件
        if (newBizId) {
            try {
                const fileList = await getFileListByBizId(newBizId);
                console.log('查询到的文件列表:', fileList);
                
                // 保留当前列表中已经存在但接口没返回的文件（刚上传但未绑定的）
                const existingIds = fileListData.value.map(item => item.id);
                const apiIds = fileList.map(item => item.id);
                const newUploadedFiles = fileListData.value.filter(item => !apiIds.includes(item.id));
                
                // 如果有传入 value（ID数组），则过滤；否则显示所有
                if (newValue && Array.isArray(newValue) && newValue.length > 0) {
                    const filteredFiles = fileList.filter(item => newValue.includes(item.id));
                    // 合并接口返回的文件和新上传的文件
                    fileListData.value = [...filteredFiles, ...newUploadedFiles];
                } else {
                    // 显示该业务下的所有文件 + 新上传的文件
                    fileListData.value = [...fileList, ...newUploadedFiles];
                }
            } catch (error) {
                console.error('查询文件列表失败:', error);
                // 查询失败时保留当前已上传的文件
                if (!fileListData.value || fileListData.value.length === 0) {
                    fileListData.value = [];
                }
            }
        } else {
            // 新增模式：没有 bizId
            // 如果 value 为空，清空列表；否则保持现有列表（上传后的文件）
            if (!newValue || newValue.length === 0) {
                fileListData.value = [];
            }
            // 如果有 value 但没有 bizId，说明是新增模式刚上传的文件，保持 fileListData 不变
        }
    },
    { immediate: true, deep: true }
);

// 上传前校验
const handleBeforeUpload = (file) => {
    // 如果是单文件模式且已有文件，则不允许上传
    if (props.single && fileListData.value.length > 0) {
        message.error('仅支持上传单个文件，请先删除已有文件');
        return false;
    }
    return true;
};

// 自定义上传
const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;

    try {
        // 调用新的上传接口
        const result = await uploadFileAndSaveRec(file);

        // 检查返回的数据中是否包含id和fileType
        if (!result || !result.id) {
            message.error('上传失败：返回数据格式错误');
            onError(new Error('上传失败'));
            return;
        }

        // 添加到文件列表数据
        fileListData.value.push(result);

        // 只向外部传递ID数组
        const fileIds = fileListData.value.map(item => item.id);
        emit('update:value', fileIds);
        emit('change', fileIds);

        message.success('上传成功');
        onSuccess(result, file);
    } catch (error) {
        console.error('上传失败:', error);
        message.error('上传失败，请稍后重试');
        onError(error);
    }
};

// 删除文件
const handleRemove = async (file) => {
    try {
        const fileId = file.response?.id || file.uid;

        if (fileId) {
            await deleteFileById(fileId);

            fileListData.value = fileListData.value.filter((item) => item.id !== fileId);

            // 只向外部传递ID数组
            const fileIds = fileListData.value.map(item => item.id);
            emit('update:value', fileIds);
            emit('change', fileIds);

            message.success('删除成功');
        }
        return true;
    } catch (error) {
        console.error('删除失败:', error);
        message.error('删除失败，请稍后重试');
        return false;
    }
};

// 通过文件项删除
const handleRemoveByItem = (item) => {
    Modal.confirm({
        title: '确认删除',
        content: `确定要删除文件 "${item.fileName}" 吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
            try {
                await deleteFileById(item.id);
                fileListData.value = fileListData.value.filter((file) => file.id !== item.id);
                
                // 只向外部传递ID数组
                const fileIds = fileListData.value.map(file => file.id);
                emit('update:value', fileIds);
                emit('change', fileIds);
                
                message.success('删除成功');
            } catch (error) {
                console.error('删除失败:', error);
                message.error('删除失败，请稍后重试');
            }
        },
    });
};

// 处理图片点击（使用 ImagePreview 组件预览）
const handleImageClick = (item) => {
    if (!item.fileAddr) {
        message.error('文件路径不存在，无法预览');
        return;
    }
    
    // 获取当前图片在图片列表中的索引
    const index = imageFiles.value.findIndex(img => img.id === item.id);
    
    // 构建图片列表
    const imgList = imageFiles.value.map(file => getFilePreviewUrl(file)).filter(url => url);
    
    if (imgList.length === 0) {
        message.warning('图片还在加载中，请稍后再试');
        return;
    }
    
    // 使用 createImgPreview 函数预览图片
    createImgPreview({
        imageList: imgList,
        index: index >= 0 ? index : 0,
    });
};

// 通过文件项预览
const handlePreviewByItem = (item) => {
    if (!item.fileAddr) {
        message.error('文件路径不存在，无法预览');
        return;
    }
    
    if (!item.fileName) {
        message.error('文件名不存在，无法预览');
        return;
    }
    
    // 图片类型使用 createImgPreview 预览
    if (item.fileType === '1' || item.fileType === 1) {
        handleImageClick(item);
    } else {
        // 其他类型使用 PreviewModal
        openPreviewModal(true, {
            filePath: item.fileAddr,
            fileName: item.fileName,
            title: item.fileName,
        });
    }
};

// 通过文件项下载
const handleDownloadByItem = (item) => {
    if (!item.fileAddr) {
        message.error('文件路径不存在');
        return;
    }
    
    if (!item.fileName) {
        message.error('文件名不存在');
        return;
    }
    
    downloadFiles(item.fileAddr, item.fileName);
};
</script>

<style lang="less" scoped>
.file-upload-container {
    width: 100%;
    
    // 文件类型标签页
    .file-tabs {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        border-bottom: 1px solid rgba(253, 253, 253, 0.12);
        
        .tab-item {
            padding: 8px 16px;
            font-size: 14px;
            color: #fff;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.3s;
            
            &:hover {
                color: #1890ff;
            }
            
            &.active {
                color: #1890ff;
                border-bottom-color: #1890ff;
                font-weight: 500;
            }
        }
        
        // 上传按钮
        .upload-wrapper {
            margin-left: auto;
            margin-bottom: -1px;
            
            .upload-btn-icon {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #1890ff;
                color: #fff;
                border-radius: 4px;
                cursor: pointer;
                font-size: 18px;
                transition: all 0.3s;
                
                &:hover {
                    background: #40a9ff;
                    transform: scale(1.05);
                }
                
                &:active {
                    transform: scale(0.95);
                }
            }
        }
    }
    
    // 文件网格视图
    .file-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
        
        .file-grid-item {
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            cursor: pointer;
            border: 1px solid rgba(253, 253, 253, 0.12);
            will-change: transform;
            
            &:hover {
                transform: translateY(-2px);
                border-color: rgba(253, 253, 253, 0.25);
                
                .file-actions-overlay {
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
                .file-preview-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #1f1f1f;
                    
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    
                    .file-loading {
                        color: #999;
                        font-size: 14px;
                    }
                    
                    :deep(.ant-image) {
                        width: 100%;
                        height: 100%;
                        
                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                }
                
                // 文档图标
                .file-preview-icon {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 56px;
                    color: #fff;
                    
                    &.icon-image {
                        background: #667eea;
                    }
                    
                    &.icon-video {
                        background: #f093fb;
                    }
                    
                    &.icon-audio {
                        background: #4facfe;
                    }
                    
                    &.icon-document {
                        background: #52c41a;
                    }
                    
                    &.icon-default {
                        background: #8c8c8c;
                    }
                }
                
                // Hover遮罩层
                .file-actions-overlay {
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
                    opacity: 1;
                    transition: opacity 0.2s, background 0.2s;
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
                        z-index: 11;
                        background: #1890ff;
                        color: #fff;
                        
                        &:hover {
                            background: #40a9ff;
                        }
                        
                        &:active {
                            transform: scale(0.95);
                        }
                    }
                }
            }
            
            // 文件名称
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
    }
    
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        background: #0B1C36;
        border: 1px dashed #163260 ;
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
