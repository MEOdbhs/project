<template>
  <!--公共业务附件组件，只支持图片和文档，如有需要音视频文件，后续再扩展 -->
  <BasicModal
    :title="title"
    :width="'50vw'"
    :height="400"
    :can-fullscreen="true"
    :keyboard="false"
    v-bind="$attrs"
    :maskClosable="false"
    :show-ok-btn="!props.readOnly"
    okText="确定"
    cancelText="取消"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full" v-loading="state.loading">
      <div class="w-full" v-if="props.fileTypeBtnList && props.fileTypeBtnList.length > 0">
        <a-radio-group v-model:value="state.fileTypeBtn" button-style="solid" @change="handleChange">
          <a-radio-button :value="0" v-if="props.fileTypeBtnList.includes(0)">全部</a-radio-button>
          <a-radio-button :value="1" v-if="props.fileTypeBtnList.includes(1)">图片</a-radio-button>
          <a-radio-button :value="4" v-if="props.fileTypeBtnList.includes(4)">文档</a-radio-button>
        </a-radio-group>
      </div>
      <div class="files mt-10px">
        <div class="file-box" v-for="(i, index) in currentFileList" :key="index">
          <img :src="i.filePath" alt="" v-if="i.fileType === 'img'" />
          <img src="/@/assets/business/img/word.png" alt="" v-else-if="i.fileType === 'word'" />
          <img src="/@/assets/business/img/excel.png" alt="" v-else-if="i.fileType === 'excel'" />
          <img src="/@/assets/business/img/pdf.png" v-else-if="i.fileType === 'pdf'" />
          <a-tooltip placement="bottom">
            <template #title>
              <span>{{ i.fileName }}</span>
            </template>
            <div class="mask-box">
              <ZoomInOutlined :style="{ fontSize: '18px', color: '#fff' }" @click="previewFile(i)" />
              <VerticalAlignBottomOutlined :style="{ fontSize: '18px', color: '#fff' }" v-if="!props.readOnly" @click="downloadFile(i)" />
              <DeleteOutlined :style="{ fontSize: '18px', color: '#fff' }" v-if="!props.readOnly" @click="deleteFile(i)" />
            </div>
          </a-tooltip>
        </div>
        <a-upload action="" v-if="!props.readOnly" :accept="accept" :multiple="props.multiple" :showUploadList="false" :before-upload="beforeUpload">
          <div class="file-box add-icon"><PlusOutlined :style="{ fontSize: '36px' }" /></div>
        </a-upload>
      </div>
    </div>
  </BasicModal>
  <PreviewModal @register="registerPreviewModal" />
</template>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import PreviewModal from './PreviewModal.vue';
  // import { uploadJcwFileAndSaveRec, uploadJcwFileAndSaveRecBatch, jcwFilesList, deleteJcwFiles } from '/@/api/common/jcwBase';
  // import { uploadBdFileAndSaveRec, uploadBdFileAndSaveRecBatch, bdFilesList, deleteBdFiles } from '/@/api/common/bdBase';
  import { downloadByOnlineUrl } from '/@/utils/file/download';
  import { message } from 'ant-design-vue';
  import { ZoomInOutlined, VerticalAlignBottomOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { getFileType, getFileTypeNum } from './index';
  const emit = defineEmits(['success', 'register']);
  const props = defineProps({
    useTo: {
      type: String,
      default: 'jcw', // ‘jcw’ 或 ‘bd’ ，后端是两个不同的文件系统，接触网传专业jcw,变电专业传bd，默认接触网
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    //单文件大小限制，单位M,默认200，-1不限制
    maxSize: {
      type: Number,
      default: 200,
    },
    fileTypeBtnList: {
      type: Array,
      default: () => [0, 1, 4],
    },
  });
  const currentFileList = computed(() => {
    if (state.fileTypeBtn === 0) {
      return state.fileList;
    } else if (state.fileTypeBtn === 1) {
      return state.fileList.filter((i) => i.fileType === 'img');
    } else if (state.fileTypeBtn === 4) {
      return state.fileList.filter((i) => i.fileType !== 'img');
    }
    return [];
  });
  const accept = computed(() => {
    const acceptImg = '.png,.jpeg,.jpg';
    const acceptDoc = '.pdf,.doc,.docx,.xls,.xlsx';
    if (state.fileTypeBtn === 0) {
      return `${acceptImg},${acceptDoc}`;
    } else if (state.fileTypeBtn === 1) {
      return acceptImg;
    } else if (state.fileTypeBtn === 4) {
      return acceptDoc;
    }
    return `${acceptImg},${acceptDoc}`;
  });
  const state = reactive({
    loading: false,
    fileTypeBtn: 0, //0全部； 附件类型 1- 图片 2- 视频 3-音频 4-普通文件(目前只有1、4)
    fileList: [],
    delFileIdList: [], //
  });

  // 当前的弹窗数据
  let row = ref({});
  let title = ref('附件');
  // 注册弹窗
  const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    row.value = data.row;
    title.value = data?.title || '附件';
    state.fileTypeBtn = data.fileTypeBtn || 0;
    resetForm();
    // getData();
  });
  // const getData = async () => {
  //   state.loading = true;
  //   const getApi = props.useTo === 'jcw' ? jcwFilesList : bdFilesList;
  //   const res = await getApi({ bizId: row.value.id });
  //   if (res && res.length > 0) {
  //     res.forEach((i) => {
  //       i.fileType = getFileType(i.fileName); //转成真实的fileType
  //       i.isUpload = true;
  //       i.file = null;
  //     });
  //     state.fileList = res;
  //   }
  //   state.loading = false;
  // };
  // 保存
  const handleOk = async () => {
    // state.loading = true;
    // // 先判断是否有需要删除的文件
    // if (state.delFileIdList && state.delFileIdList.length > 0) {
    //   // 删除服务器上的文件
    //   for (let i = 0; i < state.delFileIdList.length; i++) {
    //     const id = state.delFileIdList[i];
    //     const delApi = props.useTo === 'jcw' ? deleteJcwFiles : deleteBdFiles;
    //     await delApi(id);
    //   }
    // }
    // const unUploadList = state.fileList.filter((i) => !i.isUpload);
    // if (!unUploadList || unUploadList.length === 0) {
    //   // 不存在需要上传的文件，直接给假提示
    //   message.success('保存成功');
    //   state.loading = false;
    //   return;
    // }
    // //--批量上传接口start--//
    // const formData = new FormData();
    // unUploadList.map((i, index) => {
    //   formData.append('file' + index, i.file);
    // });
    // formData.append('bizId', row.value.id);
    // const uploadApi = props.useTo === 'jcw' ? uploadJcwFileAndSaveRecBatch : uploadBdFileAndSaveRecBatch;
    // uploadApi(formData)
    //   .then(() => {
    //     emit('success');
    //     closeModal();
    //     message.success('保存成功');
    //   })
    //   .catch((e) => {
    //     message.error('保存失败');
    //     console.log('上传失败', e);
    //   })
    //   .finally(() => {
    //     state.loading = false;
    //   });
    //--批量上传接口end--//
    return;
    //--单文件上传接口start--//
    Promise.all(
      unUploadList.map((i) => {
        return new Promise((resolve, reject) => {
          const uploadApi = props.useTo === 'jcw' ? uploadJcwFileAndSaveRec : uploadBdFileAndSaveRec;
          uploadApi({
            file: i.file,
            filename: i.fileName,
            data: {
              bizId: row.value.id,
              fileType: getFileTypeNum(i.fileType),
              fileName: i.fileName,
            },
          })
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject({
                fileName: i.fileName,
              });
            });
        });
      })
    )
      .then(() => {
        emit('success');
        closeModal();
        message.success('保存成功');
      })
      .catch((e) => {
        message.error('保存失败');
        console.log('上传失败', e);
      })
      .finally(() => {
        state.loading = false;
      });
    //--单文件上传接口end--//
  };
  const resetForm = () => {
    state.fileList = [];
    state.delFileIdList = [];
  };
  const handleCancel = () => {
    resetForm();
  };
  // 实现文件预览功能
  const previewFile = (i) => {
    if (!i.isUpload) {
      message.info('请先点击确认按钮进行保存');
      return;
    }
    if (!i.filePath) {
      message.info('缺少文件地址,无法预览');
      return;
    }
    if (!i.fileAddr) {
      message.info('缺少文件地址,无法预览');
      return;
    }

    openPreviewModal(true, {
      filePath: i.fileAddr,
      fileName: i.fileName,
      title: i.fileName,
    });
  };
  const downloadFile = (i) => {
    if (i.isUpload) {
      if (!i.filePath) {
        message.info('缺少文件地址,无法下载');
        return;
      }
      if (!i.fileAddr) {
        message.info('缺少文件地址,无法下载');
        return;
      }
      // 下载文件
      downloadByOnlineUrl(i.filePath, i.fileName);
    } else {
      //
      message.info('当前文件未上传，请先点击确认按钮进行上传');
    }
  };
  const deleteFile = (i) => {
    if (i.isUpload) {
      // 加入待删除列表
      state.delFileIdList.push(i.id);
      state.fileList = state.fileList.filter((item) => item.id !== i.id);
    } else {
      // 直接移除本地文件
      state.fileList = state.fileList.filter((item) => item.id !== i.id);
    }
  };
  // 处理文件上传前的逻辑，获取URL并添加到列表
  const beforeUpload = async (file) => {
    const { name, size } = file;

    // 创建临时URL用于预览
    const fileUrl = URL.createObjectURL(file);
    // 简化fileType
    const fileType = getFileType(name);
    if (fileType === 'other') {
      message.error(`${name}暂不支持上传`);
      return false;
    }
    if (size / 1024 / 1024 > props.maxSize) {
      message.error(`${name}文件过大，无法上传`);
      return false;
    }
    // 添加到文件列表
    state.fileList = [
      ...state.fileList,
      {
        id: Date.now().toString(),
        bizId: row.value.id,
        filePath: fileUrl,
        fileType: fileType,
        fileExtname: '.' + name.substring(name.lastIndexOf('.') + 1),
        fileName: name,
        isUpload: false,
        file: file,
      },
    ];

    // 阻止自动上传
    return false;
  };
</script>
<style lang="less" scoped>
  .files {
    width: 100%;
    height: calc(100% - 44px);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    overflow: auto;
    align-content: flex-start;
  }

  .file-box {
    width: 128px;
    height: 128px;
    background: #e5e5e5;
    margin-right: 12px;
    margin-bottom: 18px;
    position: relative;
    border-radius: 4px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .mask-box {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      border-radius: 4px;
      .anticon {
        cursor: pointer;
      }
    }
    &:hover {
      .mask-box {
        opacity: 1;
      }
    }
  }

  .add-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
