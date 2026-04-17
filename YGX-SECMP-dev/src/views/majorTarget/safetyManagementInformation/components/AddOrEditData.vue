<template>
  <BasicModal :title="title" :width="'80vw'" :height="600" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <!-- 隐藏字段：重大危险源企业ID（如果需要） -->
        <input type="hidden" v-model="state.formState.entId" />

        <!-- 第一行：企业负责人、企业负责人电话、安全责任人 -->
        <a-row>
          <a-col :span="8">
            <a-form-item label="企业负责人" name="entPrincipal" :rules="[{ required: true, message: '请输入企业负责人' }]">
              <a-input v-model:value="state.formState.entPrincipal" placeholder="请输入企业负责人" allowClear :maxlength="50" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="企业负责人电话" name="entPrincipalPhone" :rules="[{ required: true, message: '请输入企业负责人电话' }]">
              <a-input v-model:value="state.formState.entPrincipalPhone" placeholder="请输入企业负责人电话" allowClear :maxlength="20" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="安全责任人" name="safetyPrincipal" :rules="[{ required: true, message: '请输入安全责任人' }]">
              <a-input v-model:value="state.formState.safetyPrincipal" placeholder="请输入安全责任人" allowClear :maxlength="50" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第二行：安全责任人电话、安全值班电话、安全生产标准化等级 -->
        <a-row>
          <a-col :span="8">
            <a-form-item label="安全责任人电话" name="safetyPrincipalPhone" :rules="[{ required: true, message: '请输入安全责任人电话' }]">
              <a-input v-model:value="state.formState.safetyPrincipalPhone" placeholder="请输入安全责任人电话" allowClear :maxlength="20" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="安全值班电话" name="safetyDutyPhone" :rules="[{ required: true, message: '请输入安全值班电话' }]">
              <a-input v-model:value="state.formState.safetyDutyPhone" placeholder="请输入安全值班电话" allowClear :maxlength="20" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="安全生产标准化等级" name="safetyStdLevel" :rules="[{ required: true, message: '请输入安全生产标准化等级' }]">
              <a-input v-model:value="state.formState.safetyStdLevel" placeholder="请输入安全生产标准化等级" allowClear :maxlength="20" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第三行：从业人员总数、注册安全工程师人数、专职安全生产管理人 -->
        <a-row>
          <a-col :span="8">
            <a-form-item label="从业人员" name="workEmp" :rules="[{ required: true, message: '请输入从业人员' }]">
              <a-input v-model:value="state.formState.workEmp"   placeholder="请输入从业人员" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="注册安全工程师" name="safetyEngineer" :rules="[{ required: true, message: '请输入注册安全工程师' }]">
              <a-input v-model:value="state.formState.safetyEngineer"   placeholder="请输入注册安全工程师" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="专职安全生产管理人" name="fulltimeSafetyAdmin" :rules="[{ required: true, message: '请输入专职安全生产管理人' }]">
              <a-input v-model:value="state.formState.fulltimeSafetyAdmin"   placeholder="请输入专职安全生产管理人" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第四行：兼职安全生产管理人、两重大一重点作业人、应急救援队伍专职人 -->
        <a-row>
          <a-col :span="8">
            <a-form-item label="兼职安全生产管理人" name="parttimeSafetyAdmin" :rules="[{ required: true, message: '请输入兼职安全生产管理人' }]">
              <a-input v-model:value="state.formState.parttimeSafetyAdmin"   placeholder="请输入兼职安全生产管理人" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="两重大一重点作业人" name="hazardOperationEmp" :rules="[{ required: true, message: '请输入两重大一重点作业人' }]">
              <a-input v-model:value="state.formState.hazardOperationEmp"   placeholder="请输入两重大一重点作业人" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="应急救援队伍专职人" name="rescueTeamEmp" :rules="[{ required: true, message: '请输入应急救援队伍专职人' }]">
              <a-input v-model:value="state.formState.rescueTeamEmp"   placeholder="请输入应急救援队伍专职人" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第五行：剧毒化学品作业人、危险化学品作业人、特殊作业人 -->
        <a-row>
          <a-col :span="8">
            <a-form-item label="剧毒化学品作业人" name="toxicChemEmp" :rules="[{ required: true, message: '请输入剧毒化学品作业人' }]">
              <a-input v-model:value="state.formState.toxicChemEmp"   placeholder="请输入剧毒化学品作业人" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="危险化学品作业人" name="hazardChemEmp" :rules="[{ required: true, message: '请输入危险化学品作业人' }]">
              <a-input v-model:value="state.formState.hazardChemEmp"   placeholder="请输入危险化学品作业人" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="特殊作业人" name="specialOperationEmp" :rules="[{ required: true, message: '请输入特殊作业人' }]">
              <a-input v-model:value="state.formState.specialOperationEmp"   placeholder="请输入特殊作业人" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import { saveOrUpdate } from '../line.api'; 

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '180px' } }; // 适当调整标签宽度
const wrapperCol = { style: { width: 'calc(100% - 140px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    entId: '', // 若需要关联企业，可保留
    entPrincipal: '',
    entPrincipalPhone: '',
    safetyPrincipal: '',
    safetyPrincipalPhone: '',
    safetyDutyPhone: '',
    safetyStdLevel: '',
    workEmp: '',
    safetyEngineer: '',
    fulltimeSafetyAdmin: '',
    parttimeSafetyAdmin: '',
    hazardOperationEmp: '',
    rescueTeamEmp: '',
    toxicChemEmp: '',
    hazardChemEmp: '',
    specialOperationEmp: '',
  },
});

let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}重大危险源信息`;
});
let readonly = computed(() => type.value == 'view');

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
  try {
    Object.assign(state.formState, { ...row.value });
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    state.loading = false;
  }
};

const handleOk = () => {
  formRef.value.validate().then(async () => {
    state.loading = true;
    try {
      let params = { ...state.formState };
      if (type.value === 'add') {
        delete params.id; // 新增时移除id字段
      }
      await saveOrUpdate(params); // 调用保存接口
      emit('success');
      message.success('保存成功');
      closeModal();
      resetForm();
    } catch (error) {
      message.error(error.message || '保存失败');
    } finally {
      state.loading = false;
    }
  }).catch(() => {
    message.error('请检查表单填写');
  });
};

const resetForm = () => {
  state.formState = {
    id: '',
    entId: '',
    entPrincipal: '',
    entPrincipalPhone: '',
    safetyPrincipal: '',
    safetyPrincipalPhone: '',
    safetyDutyPhone: '',
    safetyStdLevel: '',
    workEmp: '',
    safetyEngineer: '',
    fulltimeSafetyAdmin: '',
    parttimeSafetyAdmin: '',
    hazardOperationEmp: '',
    rescueTeamEmp: '',
    toxicChemEmp: '',
    hazardChemEmp: '',
    specialOperationEmp: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>