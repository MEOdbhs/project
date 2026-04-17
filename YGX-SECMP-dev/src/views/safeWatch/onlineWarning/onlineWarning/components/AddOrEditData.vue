<template>
  <BasicModal
    :title="title"
    :width="'65vw'"
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
    <div class="h-full" v-loading="state.loading">
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
          <a-col :span="12">
            <a-form-item label="监测对象" name="checkTarget">
              <a-input v-model:value="state.formState.checkTarget" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="重大危险源" name="seriousOriginal">
              <a-input v-model:value="state.formState.seriousOriginal" disabled allowClear />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="设备名称" name="deviceName">
              <a-input v-model:value="state.formState.deviceName" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="指标类型" name="quotaType">
              <a-input v-model:value="state.formState.quotaType" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="指标名称" name="quotaName">
              <a-input v-model:value="state.formState.quotaName" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="预警类型" name="warningType">
              <!-- <a-input v-model:value="state.formState.warningType" disabled allowClear /> -->
              <a-select v-model:value="state.formState.warningType" disabled :options="warningTypeList" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="预警值" name="warningValue">
              <a-input v-model:value="state.formState.warningValue" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="红色预警阈值" name="redThreshold">
              <a-input v-model:value="state.formState.redThreshold" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="橙色预警阈值" name="orangeThreshold">
              <a-input v-model:value="state.formState.orangeThreshold" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="黄色预警阈值" name="yellowThreshold">
              <a-input v-model:value="state.formState.yellowThreshold" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="蓝色预警阈值" name="blueThreshold">
              <a-input v-model:value="state.formState.blueThreshold" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="仪表量程上限" name="meterUpperLimit">
              <a-input v-model:value="state.formState.meterUpperLimit" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="仪表量程下限" name="meterLowerLimit">
              <a-input v-model:value="state.formState.meterLowerLimit" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="消警状态" name="cancellationType">
              <!-- <a-input v-model:value="state.formState.cancellationType" disabled allowClear /> -->
              <a-select disabled placeholder="请选择" v-model:value="state.formState.cancellationType" :options="cancellationTypeList" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="报警时间" name="alarmTime">
              <a-input v-model:value="state.formState.alarmTime" disabled allowClear />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="消警时间" name="cancellationTime">
              <a-input v-model:value="state.formState.cancellationTime" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="数据来源" name="dataSource">
              <a-input v-model:value="state.formState.dataSource" disabled allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24"> <div class="feedbackText">处置反馈 </div></a-col>
          <a-col :span="12">
            <a-form-item label="预警核实" name="warningVerify" :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group v-model:value="state.formState.warningVerify">
                <a-radio :value="'1'">存在报警</a-radio>
                <a-radio :value="'0'">误报警</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="处置情况说明" name="disposalContent">
              <a-textarea
                :auto-size="{ minRows: 2, maxRows: 4 }"
                maxlength="200"
                v-model:value="state.formState.disposalContent"
                placeholder="请输入"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="反馈人" name="feedbackPerson">
              <a-select placeholder="请选择" v-model:value="state.formState.feedbackPerson" :options="userListData" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="反馈时间" name="feedbackDate">
              <a-date-picker
                v-model:value="state.formState.feedbackDate"
                placeholder="请选择"
                style="width: 100%"
                valueFormat="YYYY-MM-DD HH:mm"
                format="YYYY-MM-DD HH:mm"
                :disabled-date="disabledDate"
                :show-time="{ format: 'HH:mm' }"
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
  import { userList, getViewById, saveOrUpdate } from '../line.api';
  import { message } from 'ant-design-vue';

  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();

  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const labelCol = { style: { width: '180px' } };
  const wrapperCol = { style: { width: 'calc(100% - 150px)' } };
  const cancellationTypeList = [
    {
      label: '已消警',
      value: '1',
    },
    {
      label: '未消警',
      value: '0',
    },
  ];
  const warningTypeList = [
    {
      label: '红色',
      value: '1',
    },
    {
      label: '橙色',
      value: '2',
    },
    {
      label: '黄色',
      value: '3',
    },
    {
      label: '蓝色',
      value: '4',
    },
  ];
  // 定义响应式状态
  const state = reactive({
    loading: false,
    formState: {
      id: '',
      manualDate: '',
      disposalPerson: '',
      manualPerson: '',
      planManual: '',
      alreadyManual: '',
      pendingManual: '',
      hiddenDanger: '',
      lastDay: '',
      disposalResult: '1',
      disposalRemark: '',
      disposalTime: '',
      manualResult: '',
      manualRemark: '',
      manualTime: '',
    },
  });

  /**
   * 日期不能早于排查日期
   * @date 2025-11-10
   * @param {any} current
   * @returns {any}
   */
  const disabledDate = (current) => {
    if (state.formState.manualDate) {
      const manualDate = new Date(state.formState.manualDate);
      manualDate.setHours(0, 0, 0, 0);
      return current && current < manualDate;
    }
    return false;
  };
  // 人员列表
  const userListData = ref([]);
  // 当前的弹窗数据
  let type = ref('');
  let title = computed(() => {
    const typeMap = {
      edit: '编辑',
      view: '查看',
    };
    const str = typeMap[type.value] || '查看';
    return `${str}`;
  });
  let readonly = computed(() => {
    return type.value === 'view';
  });
  const row = ref({});
  // 注册弹窗
  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    type.value = data.type;
    resetForm();
    if (data.record) {
      row.value = data.record;
    }
    getData();
  });

  const getData = async () => {
    const res = await getViewById({ id: row.value.id });
    Object.assign(state.formState, res);
    state.loading = false;
  };

  // 处理提交
  const handleOk = () => {
    if (readonly.value) {
      closeModal();
      resetForm();
      return;
    }
    formRef.value
      .validate()
      .then(async () => {
        state.loading = true;
        let params = { ...state.formState };
        if (params.quotaId) params.monitorTarget = params.quotaId;
        const res = await saveOrUpdate(params, type.value);
        if (res) {
          emit('success');
          message.success('保存成功');
          closeModal();
          resetForm();
          state.loading = false;
        } else {
          message.error('保存失败,请稍后再试');
        }
        state.loading = false;
      })
      .catch(() => {
        state.loading = false;
      });
  };

  // 初始化表单值
  const resetForm = () => {
    formRef.value?.clearValidate();
    Object.assign(state.formState, {
      id: '',
      manualDate: '',
      disposalPerson: '',
      manualPerson: '',
      planManual: '',
      alreadyManual: '',
      pendingManual: '',
      hiddenDanger: '',
      lastDay: '',
      disposalResult: '',
      disposalRemark: '',
      disposalTime: '',
      manualResult: '',
      manualRemark: '',
      manualTime: '',
    });
    state.loading = false;
  };

  const handleCancel = () => {
    resetForm();
  };
  onMounted(async () => {
    const res = await userList({ orgCode: userStore.currentEnterpriseCode, pageSize: 1000 });
    if (res && res.length) {
      userListData.value = res.map((item) => ({
        label: item.realname,
        value: item.id,
        phone: item.phone,
      }));
    }
  });
</script>
<style lang="less" scoped>
  .feedbackText {
    font-weight: 600;
    position: relative;
    padding-left: 10%;
    margin: 0px 0 14px;
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      width: 80%;
      height: 1px;
      background-color: #ccc;
      transform: translateY(-50%);
    }
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 8%;
      height: 1px;
      background-color: #ccc;
      transform: translateY(-50%);
    }
  }
  :deep(.ant-form) {
    margin-right: 100px;
  }
</style>
