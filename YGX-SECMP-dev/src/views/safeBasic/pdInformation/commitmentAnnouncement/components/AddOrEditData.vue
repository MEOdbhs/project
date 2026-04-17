<template>
  <BasicModal
    :title="title"
    :width="'70vw'"
    :height="600"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    v-bind="$attrs"
    :maskClosable="false"
    :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'"
    :showOkBtn="!readonly"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full  m-t-10" v-loading="state.loading">
      <a-form
        :model="state.formState"
        name="basic"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :disabled="readonly"
        autocomplete="off"
        ref="formRef"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item label="公告名称" name="noticeName" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.noticeName" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="负责人" name="responsiblePerson" :rules="[{ required: true, message: '请选择负责人' }]">
              <a-select 
                v-model:value="state.formState.responsiblePerson"
                placeholder="请选择"
                allowClear
                showSearch
                :filter-option="filterOption"
                :options="userList"
                :field-names="{ label: 'realname', value: 'id' }"
                :disabled="readonly"
                @change="handleDirectorChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="负责人电话"
              name="personPhone"
              :rules="[
                { required: true, message: '请输入' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
              ]"
            >
              <a-input v-model:value="state.formState.personPhone" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="计划开始时间" name="startTime" :rules="[{ required: true, message: '请选择' }]">
              <a-date-picker
                v-model:value="state.formState.startTime"
                show-time
                format="YYYY-MM-DD"
                placeholder="请选择"
                style="width: 100%"
                :disabled="readonly"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="预计结束时间" name="endTime" :rules="[{ required: true, message: '请选择' }]">
              <a-date-picker
                v-model:value="state.formState.endTime"
                show-time
                format="YYYY-MM-DD"
                placeholder="请选择"
                style="width: 100%"
                :disabled="readonly"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="公告内容" name="noticeContent" :rules="[{ required: true, message: '请输入' }]">
              <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.noticeContent" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" name="fileIds">
              <FileUploadRecord v-model:value="state.formState.fileIds" :bizId="state.formState.id"
                :readonly="readonly" />
            </a-form-item>
          </a-col>
          
        </a-row>

      </a-form>
    </div>

    <template #footer>
      <div style="text-align: right; padding: 16px;">
         <a-button type="primary" @click="handleOk(1)" v-if="!readonly">
          发布
        </a-button>
         <a-button type="primary" @click="handleOk(0)" v-if="!readonly">
          保持草稿
        </a-button>
        <a-button @click="handleCancel" style="margin-right: 8px;">
          {{ readonly ? '关闭' : '取消' }}
        </a-button>
       
      </div>
    </template>
  </BasicModal>
</template>

<script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
  import FileUploadRecord from '/@/components/FileUpload/FileUploadRecord.vue';
  import { DatePicker } from 'ant-design-vue';
  const { RangePicker } = DatePicker;
  import { saveOrUpdate, getViewById, listPageUserByOrgCode } from '../line.api';
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const labelCol = { style: { width: '170px' } };
  const wrapperCol = { style: { width: 'calc(100% - 170px)' } };
  const userList = ref([]);
  
  const state = reactive({
    loading: false,
    formState: {
      id: '',
      noticeName: '',
      responsiblePerson: '',
      personPhone: '',
      startTime: null,
      endTime: null,
      noticeContent: '',
      attachment: '',
      fileIds:[]
    },
  });

  // 处理负责人选择变化
  const handleDirectorChange = (value) => {
    if (!value) {
      state.formState.personPhone = '';
      return;
    }
    
    // 从用户列表中查找选中的用户
    const selectedUser = userList.value.find(user => user.id === value);
    if (selectedUser && selectedUser.phone) {
      state.formState.personPhone = selectedUser.phone;
    } else {
      state.formState.personPhone = '';
    }
  };

  // 当前的弹窗数据
  let type = ref('');
  let row = ref({});
  let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
    return `${str}安全生产承诺公告`;
  });
  let readonly = computed(() => {
    return type.value == 'view';
  });
  // 注册弹窗
  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    row.value = data.row;
    type.value = data.type;
    resetForm();
    if (type.value == 'view' || type.value == 'edit') {
      getData();
    }
  });

  const getData = async () => {
    state.loading = true;
    const res = await getViewById({ id: row.value.id });
    // 转换日期字符串为 dayjs 对象
    if (res.startTime) {
      res.startTime = dayjs(res.startTime);
    }
    if (res.endTime) {
      res.endTime = dayjs(res.endTime);
    }
    // 负责人字段改为单选，保持字符串格式
    if (res.responsiblePerson && typeof res.responsiblePerson === 'string') {
      // 如果后端返回的是逗号分隔的字符串，取第一个
      res.responsiblePerson = res.responsiblePerson.split(',')[0];
    }
    Object.assign(state.formState, res);
    state.loading = false;
  };
  const handleOk = (status) => {
    formRef.value.validate().then(() => {
      state.loading = true;
      let params = {...state.formState};
      params.releaseType = status;
      params.orgCode = userStore.currentEnterpriseCode;
      // 转换 dayjs 对象为字符串格式
      if (params.startTime) {
        params.startTime = params.startTime.format('YYYY-MM-DD');
      }
      if (params.endTime) {
        params.endTime = params.endTime.format('YYYY-MM-DD');
      }
      // 负责人已经是字符串格式，无需转换
      // if (type.value === 'add') {
      //   delete params.id;
      // }
      saveOrUpdate(params)
        .then(() => {
          emit('success');
          message.success('保存成功');
          closeModal();
          resetForm();
        })
        .catch(() => {
          message.error('保存失败,请稍后再试');
        })
        .finally(() => {
          state.loading = false;
        });
    });
  };
  // 初始化表单值
  const resetForm = () => {
    // form的resetFields在部分情况下，部分表单值和校验结果无法清除重置、故用以下方式
    formRef.value?.clearValidate();
    state.formState = {
      id: '',
      noticeName: '',
      responsiblePerson: '',
      personPhone: '',
      startTime: null,
      endTime: null,
      noticeContent: '',
      attachment: '',
      fileIds:[]
    };
    state.loading = false;
  };
  const handleCancel = () => {
    resetForm();
    closeModal();
  };

  // 加载用户列表
  const loadUserList = async () => {
    try {
      const res = await listPageUserByOrgCode({ orgCode: userStore.currentEnterpriseCode });
      userList.value = res || [];
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }
  };

  // 搜索过滤
  const filterOption = (input, option) => {
    return option.realname.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  onMounted(() => {
    loadUserList();
  });
</script>
<style lang="less" scoped>
.modal-content-title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}
</style>
