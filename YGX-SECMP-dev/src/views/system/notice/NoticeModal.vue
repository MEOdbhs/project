<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" @ok="handleSubmit" width="900px" destroyOnClose>
    <BasicForm @register="registerForm">
      <template #fileUpload>
        <!-- <a-upload
          v-model:file-list="fileList"
          :action="uploadUrl"
          :headers="uploadHeaders"
          list-type="picture-card"
          :beforeUpload="beforeUpload"
          @change="handleChange"
          @preview="handlePreview"
          :maxCount="2"
        >
            <plus-outlined />
        </a-upload> -->
      </template>
      <template #userIds="{ model, field }">
        <JSelectUser 
          v-model:value="model[field]" 
          :rowKey="'id'"
          placeholder="请选择用户"
        />
      </template>
    </BasicForm>
  </BasicModal>

  <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './notice.data';
  import { saveOrUpdate } from './notice.api';
  import { UploadOutlined,PlusOutlined  } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';
  import { useUserStore } from '/@/store/modules/user';
  import JSelectUser from '/@/components/Form/src/jeecg/components/JSelectUser.vue';

  // 声明Emits
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const fileList = ref<any[]>([]);
  const userStore = useUserStore();
  function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

  // 附件预览
  const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const handleCancel = () => {
  previewVisible.value = false;
};
  const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
  
  // 获取上传地址
  const glob = useGlobSetting();
  const uploadUrl = ref<string>(`${glob.uploadUrl}/sys/common/upload`);
  
  // 设置上传请求头
  const uploadHeaders = {
    'X-Access-Token': getToken(),
  };

  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    schemas: formSchema,
    showActionButtonGroup: false,
  });
  
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    fileList.value = [];
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      if (data.record.userIds) {
        data.record.userIds = data.record.userIds.substring(0, data.record.userIds.length - 1);
      }
      // 处理已上传的附件
      if (data.record.fileJson) {
        try {
          const files = JSON.parse(data.record.fileJson);
          fileList.value = files.map((file, index) => ({
            uid: `${index}`,
            name: file.name || file.fileName,
            status: 'done',
            url: file.url || file.path,
            response: {
              success: true,
              message: file.path || file.url,
            },
          }));
        } catch (e) {
          console.error('解析附件失败', e);
        }
      }
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    }
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  
  // 上传前校验
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件大小不能超过 10MB!');
    }
    return isLt10M;
  };
  
  // 文件上传状态变化
  const handleChange = (info: UploadChangeParam) => {
    let newFileList = [...info.fileList];
    
    // 限制文件数量
    newFileList = newFileList.slice(-2);
    
    // 读取上传结果
    newFileList = newFileList.map((file) => {
      if (file.response) {
        if (file.response.success) {
          file.url = file.response.message;
        }
      }
      return file;
    });
    
    fileList.value = newFileList;
    
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };
  
  //表单提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      
      // 处理附件数据
      // if (fileList.value && fileList.value.length > 0) {
      //   const files = fileList.value
      //     .filter((file) => file.status === 'done')
      //     .map((file) => ({
      //       name: file.name,
      //       path: file.url || file.response?.message,
      //     }));
      //   values.fileJson = JSON.stringify(files);
      // } else {
      //   values.fileJson = '';
      // }
      
      //提交表单
      //update-begin-author:liusq---date:20230404--for: [issue#429]新增通知公告提交指定用户参数有undefined ---
      if(values.msgType==='ALL'){
        values.userIds = '';
      }else{
        values.userIds += ',';
      }
      //update-end-author:liusq---date:20230404--for: [issue#429]新增通知公告提交指定用户参数有undefined ---
      if (isUpdate.value) {
        values.sendStatus = '0';
      }
      await saveOrUpdate({ ...values, orgCode: userStore.userInfo?.orgCode }, isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
