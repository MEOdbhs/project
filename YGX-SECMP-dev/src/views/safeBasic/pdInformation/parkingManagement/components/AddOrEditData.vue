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
    <div class="h-full m-t-10" v-loading="state.loading">
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
            <a-form-item label="装置名称" name="deviceName" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.deviceName" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开/停车类型" name="type" :rules="[{ required: true, message: '请输入' }]">
              <JDictSelectTag v-model:value="state.formState.type" dictCode="safeBasic-park-enum" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开/停车原因" name="reason" :rules="[{ required: false, message: '请输入' }]">
              <a-input v-model:value="state.formState.reason" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="计划开始时间" name="startTime" :rules="[{ required: true, message: '请选择' }]">
              <a-date-picker
                v-model:value="state.formState.startTime"
                show-time
                format="YYYY-MM-DD HH:mm"
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
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择"
                style="width: 100%"
                :disabled="readonly"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="领导小组" name="leaderTeam" :rules="[{ required: false, message: '请选择' }]">
              <a-select 
                v-model:value="state.formState.leaderTeam"
                placeholder="请选择"
                mode="multiple"
                allowClear
                showSearch
                :filter-option="filterOption"
                :options="userList"
                :field-names="{ label: 'realname', value: 'id' }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="操作人员" name="operatorTeam" :rules="[{ required: false, message: '请选择' }]">
              <a-select 
                v-model:value="state.formState.operatorTeam"
                placeholder="请选择"
                mode="multiple"
                allowClear
                showSearch
                :filter-option="filterOption"
                :options="userList"
                :field-names="{ label: 'realname', value: 'id' }"
              />
            </a-form-item>
          </a-col>
          
        </a-row>

      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
  import { saveOrUpdate, getViewById, listPageUserByOrgCode } from '../line.api';
  import { message } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import dayjs from 'dayjs';
  
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
      deviceName: '',
      type: '',
      reason: '',
      startTime: null,
      endTime: null,
      leaderTeam: [],
      operatorTeam: [],
    },
  });

  // 当前的弹窗数据
  let type = ref('');
  let row = ref({});
  let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
    return `${str}开/停车管理`;
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
    // 处理人员字段：字符串转数组
    if (res.leaderTeam && typeof res.leaderTeam === 'string') {
      res.leaderTeam = res.leaderTeam.split(',');
    } else {
      res.leaderTeam = [];
    }
    if (res.operatorTeam && typeof res.operatorTeam === 'string') {
      res.operatorTeam = res.operatorTeam.split(',');
    } else {
      res.operatorTeam = [];
    }
    
    Object.assign(state.formState, res);
    console.log(state.formState,'state.formState');
    
    state.loading = false;
  };

  const handleOk = () => {
    formRef.value.validate().then(() => {
      state.loading = true;
      let params = { ...state.formState };
      params.orgCode = userStore.currentEnterpriseCode;
      // 转换 dayjs 对象为字符串格式
      if (params.startTime) {
        params.startTime = params.startTime.format('YYYY-MM-DD HH:mm');
      }
      if (params.endTime) {
        params.endTime = params.endTime.format('YYYY-MM-DD HH:mm');
      }
      // 将数组转换为逗号分隔的字符串
      if (Array.isArray(params.leaderTeam) && params.leaderTeam.length > 0) {
        params.leaderTeam = params.leaderTeam.join(',');
      } else {
        delete params.leaderTeam;
      }
      if (Array.isArray(params.operatorTeam) && params.operatorTeam.length > 0) {
        params.operatorTeam = params.operatorTeam.join(',');
      } else {
        delete params.operatorTeam;
      }
      if (type.value === 'add') {
        delete params.id;
      }
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
    // formRef.value.clearValidate();
    state.formState = {
      id: '',
      deviceName: '',
      type: '',
      reason: '',
      startTime: null,
      endTime: null,
      leaderTeam: [],
      operatorTeam: [],
    };
    state.loading = false;
  };
  const handleCancel = () => {
    resetForm();
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
