<template>
  <BasicModal :title="title" :width="'70vw'" :height="600" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full overflow-y-auto m-t-10" v-loading="state.loading">

      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol"
        :disabled="readonly">
        <a-descriptions :column="2" bordered size="small" title="基础信息">
          <a-descriptions-item label="类别">{{ state.formState.monitorCategoryName }}</a-descriptions-item>
          <a-descriptions-item label="设备类型">{{ state.formState.monitorTypeName }}</a-descriptions-item>
          <a-descriptions-item label="设备名称">{{ state.formState.monitorName }}</a-descriptions-item>
          <a-descriptions-item label="设备编号">{{ state.formState.monitorCode }}</a-descriptions-item>
          <a-descriptions-item label="计划开始时间">{{ state.formState.startPlan }}</a-descriptions-item>
          <a-descriptions-item label="有效期至">{{ state.formState.endPlan }}</a-descriptions-item>
          <a-descriptions-item label="校准时间">{{ state.formState.calibrationDate }}</a-descriptions-item>
          <a-descriptions-item label="状态">{{ state.formState.state == 'N' ? '无效' : state.formState.state == 'Y' ? '有效' :
            '-'
            }}</a-descriptions-item>
          <a-descriptions-item label="任务人员">{{ state.formState.monitorCode }}</a-descriptions-item>
        </a-descriptions>
        <!-- 校准计划 -->
        <div class="section-title">校准记录</div>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="校准描述" name="remarks">
              <a-textarea v-model:value="state.formState.remarks" placeholder="请输入" :rows="3" allowClear />
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
import { saveOrUpdate, getViewById, getPeopleList } from '../line.api';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { getDictTextByCode } from '/@/utils/dict';
const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '120px' } };
const wrapperCol = { style: { width: 'calc(100% - 130px)' } };

const state = reactive({
  peopleList: [],
  loading: false,
  dangerWorkmanshipLoading: false,
  formState: {
    calibrationDate: '',
    calibrationPlanId: "",
    createBy: '',
    createDt: "",
    deleted: "",
    endPlan: "",
    equipmentId: "",
    id: "",
    monitorCategoryId: "",
    monitorCategoryName: "",
    monitorCode: "",
    monitorName: "",
    monitorTypeName: "",
    remarks: "",
    startPlan: "",
    state: "",
    tenantId: "",
    updateBy: "",
    updateDt: "",
    userId: "",
    userName: "",
    version: "",
  },
});
let type = ref(''); // 'add', 'edit', 'view'
let row = ref({});
let title = computed(() => {
  const str = type.value === 'add' ? '新增' : type.value === 'edit' ? '编辑' : '查看';
  return `${str}设备校准计划`;
});
let readonly = computed(() => type.value === 'view');

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  type.value = data.type;
  row.value = data.row || {};
  resetForm();
  getDangerWorkmanshipData()
  if (type.value === 'view' || type.value === 'edit') {
    await getData();
  }
});
// 获取renyuan
const getDangerWorkmanshipData = async () => {
  state.dangerWorkmanshipLoading = true;
  try {
    const res = await getPeopleList({ 'pageSize': 999, });
    console.log(res, 'resresresresres')
    state.peopleList = res.records || [];
  } catch (error) {
    console.error('获取危险工艺列表失败:', error);
  } finally {
    state.dangerWorkmanshipLoading = false;
  }
};
const getData = async () => {
  state.loading = true;
  try {
    const result = await getViewById({ id: row.value.id });
    if (result) {
      // 处理 taskPersonnels：后端可能返回字符串 "1,2,3" 或数组
      if (result.taskPersonnels) {
        if (typeof result.taskPersonnels === 'string') {
          result.taskPersonnels = result.taskPersonnels.split(',').filter(Boolean).map(id => String(id));
        } else if (Array.isArray(result.taskPersonnels)) {
          result.taskPersonnels = result.taskPersonnels.map(id => String(id));
        }
      } else {
        result.taskPersonnels = [];
      }

      Object.assign(state.formState, result);
      // 如果 isLongTerm 为空，默认 N
      if (state.formState.isLongTerm === undefined || state.formState.isLongTerm === null) {
        state.formState.isLongTerm = 'N';
      }
    }
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    state.loading = false;
  }
};

const resetForm = () => {
  formRef.value?.clearValidate();
  state.formState = {
    calibrationDate: '',
    calibrationPlanId: "",
    createBy: '',
    createDt: "",
    deleted: "",
    endPlan: "",
    equipmentId: "",
    id: "",
    monitorCategoryId: "",
    monitorCategoryName: "",
    monitorCode: "",
    monitorName: "",
    monitorTypeName: "",
    remarks: "",
    startPlan: "",
    state: "",
    tenantId: "",
    updateBy: "",
    updateDt: "",
    userId: "",
    userName: "",
    version: "",
  };
};

const handleOk = () => {
  formRef.value.validate().then(async () => {
    state.loading = true;
    try {
      // 复制一份表单数据，避免直接修改原对象
      const submitData = {
        id: state.formState.id,
        calibrationPlanId: state.formState.calibrationPlanId,
        equipmentId: state.formState.equipmentId,
        userId: state.formState.userId,
        userName: state.formState.userName,
        state: state.formState.state,
        calibrationDate: state.formState.calibrationDate,
        remarks: state.formState.remarks,
      };
      await saveOrUpdate(submitData);
      emit('success');
      message.success('保存成功');
      closeModal();
    } catch (error) {
      message.error(error.message || '保存失败');
    } finally {
      state.loading = false;
    }
  }).catch(() => {
    message.error('请检查表单填写');
  });
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

.m-t-10 {
  margin-top: 10px;
}
</style>