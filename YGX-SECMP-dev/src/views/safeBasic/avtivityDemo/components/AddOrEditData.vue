<template>
  <BasicModal :title="title" :width="'60vw'" :height="550" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" okText="确定" cancelText="取消" @register="registerModal"
    @ok="handleOk" @cancel="handleCancel">
    <template #centerFooter>
      <a-button v-if="type === 'submit'" type="primary" @click="handleSubmitWorkflow" :loading="state.submitting">
        提交流程
      </a-button>
      <a-button v-if="type === 'audit'" type="primary" @click="handleAuditWorkflow(1)" :loading="state.auditing">
        审核通过
      </a-button>
      <a-button v-if="type === 'audit'" danger @click="handleAuditWorkflow(2)" :loading="state.rejecting">
        审核驳回
      </a-button>
    </template>
    <div class="h-full" v-loading="state.loading">
      <h3 class="modal-content-title">基础信息</h3>
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item label="人员" name="staffId" :rules="[{ required: true, message: '请选择' }]">
              <a-input-group compact>
                <a-input v-model:value="state.formState.staffName" placeholder="请选择人员" disabled
                  style="width: calc(100% - 70px)" />
                <a-button type="primary" @click="openSelectUserModal">选择</a-button>
              </a-input-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="奖惩依据" name="type" :rules="[{ required: true, message: '请选择' }]">
              <JDictSelectTag v-model:value="state.formState.type" placeholder="请选择" dictCode="staff_rp_by"
                :showChooseOption="false" @change="handleRewardPunishConfigChange" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="奖惩类型" name="rewardPunishConfigId" :rules="[{ required: true, message: '请选择' }]">
              <a-select v-model:value="state.formState.rewardPunishConfigId" placeholder="请选择" allowClear
                @change="handleTypeChange">
                <a-select-option v-for="item in configList" :key="item.id" :value="item.id">
                  {{ item.rewardPunishName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="奖惩金额" name="amount" :rules="[{ required: false }]">
              <a-input-number v-model:value="state.formState.amount" placeholder="请输入" :min="0" :precision="2"
                style="width: 100%" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="绩效分" name="performanceScore" :rules="[{ required: false }]">
              <a-input-number v-model:value="state.formState.performanceScore" placeholder="请输入" :min="0" :precision="2"
                style="width: 100%" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="奖惩等级" name="grade" :rules="[{ required: false, message: '请输入' }]">
              <a-input v-model:value="state.formState.grade" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="详情" name="memo" :rules="[{ required: false, message: '请输入' }]">
              <a-input v-model:value="state.formState.memo" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="通报内容" name="content" :rules="[{ required: false, message: '请输入' }]">
              <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.content" placeholder="请输入"
                allowClear />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item label="附件" name="fileIds" :rules="[{ required: false }]">
              <FileUploadRecord v-model:value="state.formState.fileIds" :bizId="state.formState.id"
                :readonly="readonly" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <template v-if="type === 'audit'">

        <a-form :model="auditForm" name="auditForm" :label-col="labelCol" :wrapper-col="wrapperCol" autocomplete="off"
          ref="auditFormRef">
          <a-row>
            <a-col :span="24">
              <a-form-item label="审核意见" name="comment">
                <a-textarea :rows="4" :maxlength="1000" v-model:value="auditForm.comment" placeholder="请输入"
                  allowClear />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <TimeFlow :dialog="{ id: state.formState.id }" />

      </template>





    </div>
  </BasicModal>
  <!-- <DeptStaffSelect @register="registerModal1" @select="selectOk" @selectRows="selectRowsOk" :staffApi="staffListPage"
    rowSelectionType="radio" /> -->
</template>

<script setup>
import TimeFlow from '/@/components/TimeLine/timeFlow.vue';
import { ref, reactive, computed } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { saveOrUpdate, getViewById, getConfigList, staffListPage } from '../line.api';
import { message } from 'ant-design-vue';
// import DeptStaffSelect from '/@/components/DeptStaffSelect/index.vue';
import { useModal } from '/@/components/Modal';
import FileUploadRecord from '/@/components/FileUpload/FileUploadRecord.vue';
import { useRouter } from 'vue-router';
import { startWorkflow, auditWorkflow } from '/@/utils/activity';


const emit = defineEmits(['success', 'register']);
const formRef = ref();
const router = useRouter();
const labelCol = { style: { width: '150px' } };
const wrapperCol = { style: { width: 'calc(100% - 150px)' } };
const auditForm = reactive({
  comment: '',
})
const state = reactive({
  loading: false,
  submitting: false,
  auditing: false,
  rejecting: false,
  formState: {
    id: '',
    //
    deptId: '',
    deptName: '',
    staffId: '',
    staffName: '',
    rewardPunishConfigId: '',
    rewardPunishConfigName: '',
    rewardPunishName: '',
    type: '',
    typeName: '',
    amount: undefined,
    performanceScore: undefined,
    grade: '',
    memo: '',
    content: '',
    fileIds: [],
  },
});
let comment = ref('');
// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const typeMap = {
    add: '新增',
    edit: '编辑',
    submit: '提交',
    audit: '审核',
    view: '查看',
  };
  const str = typeMap[type.value] || '查看';
  return `${str}奖惩`;
});
let readonly = computed(() => {
  // 提交模式和审核模式都是只读的
  return type.value === 'view' || type.value === 'submit' || type.value === 'audit';
});
let configList = ref([]);
const [registerModal1, { openModal: openModal1 }] = useModal();

// 注册弹窗
const [registerModal, { closeModal }] = useModalInner(async (data) => {
  //打印当前路由信息
  console.log('当前路由信息:', router.currentRoute.value);

  row.value = data.row;
  type.value = data.type;
  resetForm();
  // 除了新增模式，其他模式都需要加载数据
  if (type.value !== 'add') {
    getData();
  }
  // 获取奖惩配置列表
  loadConfigList();
});

// 获取奖惩配置列表
const loadConfigList = async () => {
  try {
    const res = await getConfigList();
    configList.value = res || [];
  } catch (error) {
    console.error('获取奖惩配置列表失败:', error);
  }
};

// 奖惩依据改变事件
const handleRewardPunishConfigChange = (value, option) => {
  state.formState.rewardPunishConfigName = option?.label || '';
};

// 奖惩类型改变事件
const handleTypeChange = (value) => {
  if (!value) {
    // 清空相关字段
    state.formState.rewardPunishConfigId = '';
    state.formState.rewardPunishName = '';
    state.formState.typeName = '';
    state.formState.amount = undefined;
    state.formState.performanceScore = undefined;
    state.formState.memo = '';
    return;
  }

  // 根据选择的配置ID查找配置信息
  const config = configList.value.find((item) => item.id === value);
  if (config) {
    // 带出配置中的信息
    state.formState.rewardPunishConfigId = config.id; // 保存配置ID
    state.formState.rewardPunishName = config.rewardPunishName || ''; // 保存配置名称
    state.formState.typeName = config.rewardPunishName || '';
    state.formState.amount = config.amount;
    state.formState.performanceScore = config.performanceScore;

    // 获取奖惩类型文本（从配置的type字段）
    const typeText = config.type === '1' ? '奖励' : config.type === '2' ? '惩罚' : '';

    // 拼接详情：奖惩名称+奖惩类型+奖惩金额+绩效分
    const memoArr = [];
    if (config.rewardPunishName) {
      memoArr.push(config.rewardPunishName);
    }
    if (typeText) {
      memoArr.push(typeText);
    }
    if (config.amount !== undefined && config.amount !== null) {
      memoArr.push(`金额:${config.amount}元`);
    }
    if (config.performanceScore !== undefined && config.performanceScore !== null) {
      memoArr.push(`绩效分:${config.performanceScore}分`);
    }
    state.formState.memo = memoArr.join(' ');
  }
};

// 打开人员选择弹窗
const openSelectUserModal = () => {
  openModal1(true, {
    //otherParams: record,
  });
};

// 人员选择回调
const selectOk = (val, deptId, orgCode, otherParams) => {
  // val是选中的人员id数组
  if (val && val.length > 0) {
    state.formState.staffId = val[0];
    state.formState.deptId = deptId;
  }
};

// 人员选择行回调
const selectRowsOk = (rows, deptId, orgCode, otherParams) => {
  // rows是选中的人员完整信息数组
  if (rows && rows.length > 0) {
    state.formState.staffId = rows[0].id;
    state.formState.staffName = rows[0].staffName;
    state.formState.deptId = deptId;
    state.formState.deptName = rows[0].deptName;
  }
};

const getData = async () => {
  state.loading = true;
  const res = await getViewById({ id: row.value.id });
  Object.assign(state.formState, res);
  state.loading = false;
};

const handleOk = () => {
   if(type.value!='edit'&&type.value!='add')
  {
    emit('success');
    closeModal();
    resetForm();
    return;
  }
  formRef.value.validate().then(() => {
    state.loading = true;
    let params = state.formState;
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
  formRef.value?.clearValidate();
  state.formState = {
    id: '',
    //
    deptId: '',
    deptName: '',
    staffId: '',
    staffName: '',
    rewardPunishConfigId: '',
    rewardPunishConfigName: '',
    rewardPunishName: '',
    type: '',
    typeName: '',
    amount: undefined,
    performanceScore: undefined,
    grade: '',
    memo: '',
    content: '',
    fileIds: [],
  };
  state.loading = false;
};

const handleCancel = () => {
  resetForm();
};

// 提交流程（提交模式）
const handleSubmitWorkflow = async () => {
  try {
    state.submitting = true;

    // 1. 先发起流程
    // TODO: 需要配置流程编码和业务表名，这里需要根据实际情况修改
    const workflowKey = 'cs_reward_punish'; // 流程编码，需要根据实际配置修改
    const businessTableName = 'cs_reward_punish'; // 业务表名，需要根据实际表名修改
    const businessId = state.formState.id; // 业务ID

    await startWorkflow(workflowKey, businessTableName, businessId);

    // 2. 调用业务保存接口（提交模式不需要验证表单，因为是只读的）
    await saveOrUpdate({ ...state.formState, examStatus: 2 });

    emit('success');
    message.success('提交成功');
    closeModal();
    resetForm();
  } catch (error) {
    console.error('提交失败:', error);
    // message会在startWorkflow或saveOrUpdate中处理，这里不再重复提示
  } finally {
    state.submitting = false;
  }
};

// 审核
const handleAuditWorkflow = async (auditType) => {
  try {
    state.auditing = true;
    const workflowKey = 'cs_reward_punish'; // 流程编码，需要根据实际配置修改
    const businessTableName = 'cs_reward_punish'; // 业务表名，需要根据实际表名修改
    const businessId = state.formState.id; // 业务ID
    const comment = auditForm.comment; // 审核意见
    // TODO: 调用审核通过接口
    let result = await auditWorkflow(workflowKey, businessTableName, businessId, auditType, comment);
 

    // 2. 调用业务保存接口（提交模式不需要验证表单，因为是只读的）
    await saveOrUpdate({ ...state.formState, examStatus: result?.status||'' });
    emit('success');
    message.success('审核通过');
    closeModal();
    resetForm();
  } catch (error) {
    console.error('审核失败:', error);
    message.error('审核失败，请稍后重试');
  } finally {
    state.auditing = false;
  }
};

</script>
<style lang="less" scoped></style>
