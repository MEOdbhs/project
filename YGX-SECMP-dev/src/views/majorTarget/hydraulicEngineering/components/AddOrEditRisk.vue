<template>
  <BasicModal :title="title" :width="'70vw'" :height="600" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" :maskClosable="false" v-bind="$attrs" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full overflow-y-auto m-t-10" v-loading="state.loading">
      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol"
        :disabled="readonly" autocomplete="off">
        <div class="section-title">风险信息</div>
        <a-row :gutter="24">
          <!-- 发生时间 -->
          <a-col :span="12">
            <a-form-item label="发生时间" name="occurTime" :rules="[{ required: true, message: '请选择发生时间' }]">
              <a-date-picker v-model:value="state.formState.occurTime" valueFormat="YYYY-MM-DD" 
                placeholder="请选择" style="width: 100%" />
            </a-form-item>
          </a-col>

          <!-- 影响等级 -->
          <a-col :span="12">
            <a-form-item label="影响等级" name="impactLevelId" :rules="[{ required: true, message: '请选择影响等级' }]">
              <JDictSelectTag v-model:value="state.formState.impactLevelId" placeholder="请选择"
                dictCode="disaster_impact_level" />
            </a-form-item>
          </a-col>

          <!-- 受灾范围 -->
          <a-col :span="12">
            <a-form-item label="受灾范围" name="affectRange" :rules="[{ required: true, message: '请输入受灾范围' }]">
              <a-input v-model:value="state.formState.affectRange" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>

          <!-- 经济损失（元） -->
          <a-col :span="12">
            <a-form-item label="经济损失(元)" name="econLoss" :rules="[{ required: true, message: '请输入经济损失' }]">
              <a-input-number v-model:value="state.formState.econLoss" :min="0" :precision="2" style="width: 100%"
                placeholder="请输入" />
            </a-form-item>
          </a-col>

          <!-- 人员伤亡情况 -->
          <a-col :span="12">
            <a-form-item label="人员伤亡情况" name="casualty" :rules="[{ required: true, message: '请输入人员伤亡情况' }]">
              <a-input v-model:value="state.formState.casualty" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>

          <!-- 事故原因 -->
          <a-col :span="24">
            <a-form-item label="事故原因" name="cause" :rules="[{ required: true, message: '请输入事故原因' }]">
              <a-textarea v-model:value="state.formState.cause" placeholder="请输入" :rows="3" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <div class="section-title">整改信息</div>
        <a-row :gutter="24">
        <!-- 隐患类型 -->
        <a-col :span="12">
          <a-form-item label="隐患类型" name="hazardType" :rules="[{ required: true, message: '请输入隐患类型' }]">
            <a-input v-model:value="state.formState.hazardType" placeholder="请输入" allowClear />
          </a-form-item>
        </a-col>

        <!-- 整改完成时间 -->
        <a-col :span="12">
          <a-form-item label="整改完成时间" name="finishTime" :rules="[{ required: true, message: '请选择整改完成时间' }]">
            <a-date-picker v-model:value="state.formState.finishTime" valueFormat="YYYY-MM-DD"
              placeholder="请选择" style="width: 100%" />
          </a-form-item>
        </a-col>

        <!-- 整改措施 -->
        <a-col :span="12">
          <a-form-item label="整改措施" name="rectify" :rules="[{ required: true, message: '请输入整改措施' }]">
            <a-textarea v-model:value="state.formState.rectify" placeholder="请输入" :rows="2" allowClear />
          </a-form-item>
        </a-col>

        <!-- 验收结果 -->
        <a-col :span="12">
          <a-form-item label="验收结果" name="acceptResult" :rules="[{ required: true, message: '请输入验收结果' }]">
            <a-input v-model:value="state.formState.acceptResult" placeholder="请输入" allowClear />
          </a-form-item>
        </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { saveOrUpdateRisk, getRiskViewById } from '../line.api';

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '140px' } };
const wrapperCol = { style: { width: 'calc(100% - 140px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    occurTime: '',
    impactLevelId: '',
    affectRange: '',
    econLoss: undefined,
    casualty: '',
    cause: '',
    hazardType: '',
    finishTime: '',
    rectify: '',
    acceptResult: '',
  },
});

let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}风险隐患信息`;
});
let readonly = computed(() => type.value == 'view');

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  row.value = data.row;
  type.value = data.type;
  resetForm();
  if (type.value == 'view' || type.value == 'edit') {
    await getData();
  }
});

const getData = async () => {
  state.loading = true;
  try {
    const result = await getRiskViewById({ id: row.value.id });
    Object.assign(state.formState, result);
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
      if (type.value === 'add') delete params.id;
      await saveOrUpdateRisk(params);
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
    occurTime: '',
    impactLevelId: '',
    affectRange: '',
    econLoss: undefined,
    casualty: '',
    cause: '',
    hazardType: '',
    finishTime: '',
    rectify: '',
    acceptResult: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped>
.section-title {
  margin: 16px 0 12px;
  padding-left: 10px;
  border-left: 2px solid #1677ff;
  font-weight: 600;
  font-size: 16px;
}
</style>