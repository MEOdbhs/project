<template>
    <div class="file-upload-container">
        <!-- 上传按钮区域 -->
        <div class="upload-btn-wrapper">
            <a-upload 
                v-model:file-list="fileListDisplay" 
                :before-upload="handleBeforeUpload" 
                :customRequest="handleUpload"
                :remove="handleRemove" 
                :multiple="!single"
                :show-upload-list="false"
            >
                <a-button type="primary" class="upload-btn">
                    <UploadOutlined />
                    <span>上传附件</span>
                </a-button>
            </a-upload>
            <span class="upload-tip" v-if="!single">支持多文件上传</span>
            <span class="upload-tip" v-else>仅支持上传单个文件</span>
        </div>

        <!-- 文件列表区域 -->
        <div class="file-list" v-if="fileListData.length > 0">
            <div 
                class="file-item" 
                v-for="item in fileListData" 
                :key="item.id"
            >
                <div class="file-info">
                    <div class="file-icon">
                        <FileOutlined />
                    </div>
                    <div class="file-name" :title="item.fileName">
                        {{ item.fileName }}
                    </div>
                </div>
                <div class="file-actions">
                    <a-tooltip title="预览">
                        <a-button 
                            type="text" 
                            class="action-btn preview-btn"
                            @click="handlePreviewByItem(item)"
                        >
                            <EyeOutlined />
                        </a-button>
                    </a-tooltip>
                    <a-tooltip title="下载">
                        <a-button 
                            type="text" 
                            class="action-btn download-btn"
                            @click="handleDownloadByItem(item)"
                        >
                            <DownloadOutlined />
                        </a-button>
                    </a-tooltip>
                    <a-tooltip title="删除">
                        <a-button 
                            type="text" 
                            class="action-btn delete-btn"
                            @click="handleRemoveByItem(item)"
                        >
                            <DeleteOutlined />
                        </a-button>
                    </a-tooltip>
                </div>
            </div>
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-else>
            <InboxOutlined class="empty-icon" />
            <div class="empty-text">暂无附件</div>
        </div>
    </div>
    <PreviewModal @register="registerPreviewModal" />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { 
    UploadOutlined, 
    FileOutlined, 
    EyeOutlined, 
    DownloadOutlined, 
    DeleteOutlined,
    InboxOutlined 
} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { uploadFiles, deleteFiles, downloadFiles } from '/@/api/common/api';
import { useModal } from '/@/components/Modal';
import PreviewModal from '/@/components/FileModal/PreviewModal.vue';

const props = defineProps({
    value: {
        type: Array,
        default: () => [],
    },
    single: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:value', 'change']);

// 注册预览弹窗
const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();

// 文件列表数据
const fileListData = ref([]);

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

// 监听外部传入的值变化
watch(
    () => props.value,
    (newVal) => {
        if (newVal && Array.isArray(newVal)) {
            fileListData.value = [...newVal];
        } else {
            fileListData.value = [];
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
        // 直接传递文件对象
        const result = await uploadFiles(file);

        // 根据返回数据结构处理
        let fileInfo;
        if (result.fileAddr) {
            fileInfo = result;
        } else {
            message.error('上传失败：返回数据格式错误');
            onError(new Error('上传失败'));
            return;
        }

        fileListData.value.push(fileInfo);

        emit('update:value', fileListData.value);
        emit('change', fileListData.value);

        message.success('上传成功');
        onSuccess(fileInfo, file);
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
            await deleteFiles(file.fileAddr);

            fileListData.value = fileListData.value.filter((item) => item.id !== fileId);

            emit('update:value', fileListData.value);
            emit('change', fileListData.value);

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
                console.log(item.fileAddr);
                
                await deleteFiles(item.fileAddr);
                fileListData.value = fileListData.value.filter((file) => file.id !== item.id);
                emit('update:value', fileListData.value);
                emit('change', fileListData.value);
                message.success('删除成功');
            } catch (error) {
                console.error('删除失败:', error);
                message.error('删除失败，请稍后重试');
            }
        },
    });
};

// 预览文件
const handlePreview = (file) => {
    // 从 response 或原始数据中获取文件信息
    const fileInfo = file.response || file;
    const fileAddr = fileInfo.fileAddr;
    const fileName = fileInfo.fileName;
    
    if (!fileAddr) {
        message.error('文件路径不存在，无法预览');
        return;
    }
    
    if (!fileName) {
        message.error('文件名不存在，无法预览');
        return;
    }
    
    // 打开预览弹窗
    openPreviewModal(true, {
        filePath: fileAddr,
        fileName: fileName,
        title: fileName,
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
    
    openPreviewModal(true, {
        filePath: item.fileAddr,
        fileName: item.fileName,
        title: item.fileName,
    });
};

// 下载文件
const handleDownload = (file) => {
    // 从 response 或原始数据中获取文件信息
    const fileInfo = file.response || file;
    const filePath = fileInfo.fileAddr;
    const fileName = fileInfo.fileName;
    
    if (!filePath) {
        message.error('文件路径不存在');
        return;
    }
    
    if (!fileName) {
        message.error('文件名不存在');
        return;
    }
    
    // 调用下载接口
    downloadFiles(filePath, fileName);
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
    
    .upload-btn-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        
        .upload-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            height: 36px;
            padding: 0 20px;
            font-size: 14px;
            border-radius: 4px;
            transition: all 0.3s;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
            }
        }
        
        .upload-tip {
            font-size: 12px;
            color: #999;
        }
    }
    
    .file-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        
        .file-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 6px;
            transition: all 0.3s;
            
            &:hover {
                background: #f0f5ff;
                border-color: #d6e4ff;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                
                .file-actions {
                    opacity: 1;
                }
            }
            
            .file-info {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
                min-width: 0;
                
                .file-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 6px;
                    color: #fff;
                    font-size: 18px;
                    flex-shrink: 0;
                }
                
                .file-name {
                    flex: 1;
                    font-size: 14px;
                    color: #333;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-weight: 500;
                }
            }
            
            .file-actions {
                display: flex;
                align-items: center;
                gap: 4px;
                opacity: 0.7;
                transition: opacity 0.3s;
                
                .action-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    font-size: 16px;
                    border-radius: 4px;
                    transition: all 0.3s;
                    
                    &.preview-btn {
                        color: #1890ff;
                        
                        &:hover {
                            background: #e6f7ff;
                            color: #096dd9;
                        }
                    }
                    
                    &.download-btn {
                        color: #52c41a;
                        
                        &:hover {
                            background: #f6ffed;
                            color: #389e0d;
                        }
                    }
                    
                    &.delete-btn {
                        color: #ff4d4f;
                        
                        &:hover {
                            background: #fff1f0;
                            color: #cf1322;
                        }
                    }
                }
            }
        }
    }
    
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        background: #fafafa;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        
        .empty-icon {
            font-size: 48px;
            color: #d9d9d9;
            margin-bottom: 12px;
        }
        
        .empty-text {
            font-size: 14px;
            color: #999;
        }
    }
}
</style>
