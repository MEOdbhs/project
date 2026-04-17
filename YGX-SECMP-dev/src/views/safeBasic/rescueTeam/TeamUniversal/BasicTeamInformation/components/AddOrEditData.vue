<template>
  <BasicModal :title="title" :width="'60vw'" :height="500" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item label="队伍名称" name="teamName" :rules="[{ required: true, message: '请输入队伍名称' }]">
              <a-input v-model:value="state.formState.teamName" placeholder="请输入队伍名称" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="统一社会信用代码" name="creditCode" :rules="[{ required: true, message: '请输入统一社会信用代码' }]">
              <a-input v-model:value="state.formState.creditCode" placeholder="请输入统一社会信用代码" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="行政区划" name="adminRegion" :rules="[{ required: true, message: '请输入行政区划' }]">
              <a-input v-model:value="state.formState.adminRegion" placeholder="请输入行政区划" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="驻地详细地址" name="residAddress" :rules="[{ required: true, message: '请输入驻地详细地址' }]">
              <a-input v-model:value="state.formState.residAddress" placeholder="请输入驻地详细地址" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="成立日期" name="foundDate" :rules="[{ required: true, message: '请选择成立日期' }]">
              <a-date-picker v-model:value="state.formState.foundDate" valueFormat="YYYY-MM-DD" placeholder="请选择成立日期"
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="队伍类型" name="teamTypeId" :rules="[{ required: true, message: '请选择队伍类型' }]">
              <JDictSelectTag v-model:value="state.formState.teamTypeId" placeholder="请选择" dictCode="team_type" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="隶属单位" name="affilUnitId" :rules="[{ required: true, message: '请选择隶属单位' }]">
              <JDictSelectTag v-model:value="state.formState.affilUnitId" placeholder="请选择"
                dictCode="affil_unit_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="队伍等级" name="teamGradeId" :rules="[{ required: true, message: '请选择队伍等级' }]">
              <JDictSelectTag v-model:value="state.formState.teamGradeId" placeholder="请选择"
                dictCode="team_grade_type" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="编制人数" name="authorizedNum" :rules="[{ required: true, message: '请输入编制人数' }]">
              <a-input-number v-model:value="state.formState.authorizedNum" :min="0" style="width: 100%"
                placeholder="请输入编制人数" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="实有人数" name="actualNum" :rules="[{ required: true, message: '请输入实有人数' }]">
              <a-input-number v-model:value="state.formState.actualNum" :min="0" style="width: 100%"
                placeholder="请输入实有人数" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="专职人员数" name="fullTimeNum" :rules="[{ required: true, message: '请输入专职人员数' }]">
              <a-input-number v-model:value="state.formState.fullTimeNum" :min="0" style="width: 100%"
                placeholder="请输入专职人员数" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="兼职人员数" name="partTimeNum" :rules="[{ required: true, message: '请输入兼职人员数' }]">
              <a-input-number v-model:value="state.formState.partTimeNum" :min="0" style="width: 100%"
                placeholder="请输入兼职人员数" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="志愿人员数" name="volunteerNum" :rules="[{ required: true, message: '请输入志愿人员数' }]">
              <a-input-number v-model:value="state.formState.volunteerNum" :min="0" style="width: 100%"
                placeholder="请输入志愿人员数" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联络人姓名" name="contactName" :rules="[{ required: true, message: '请输入联络人姓名' }]">
              <a-input v-model:value="state.formState.contactName" placeholder="请输入联络人姓名" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="联络人电话" name="contactPhone" :rules="[{ required: true, message: '请输入联络人电话' }]">
              <a-input v-model:value="state.formState.contactPhone" style="width: 100%" placeholder="请输入联络人电话" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="应急响应时间承诺" name="responseTime" :rules="[{ required: true, message: '请输入应急响应时间承诺' }]">
              <a-input-number v-model:value="state.formState.responseTime" :min="0" style="width: 100%"
                placeholder="请输入应急响应时间承诺" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="救援覆盖范围" name="coverageAreaId" :rules="[{ required: true, message: '请输入救援覆盖范围' }]">
              <JDictSelectTag v-model:value="state.formState.coverageAreaId" placeholder="请选择"
                dictCode="coverage_area_type" />
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
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { getDictItems } from "@/api/common/api";
const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '140px' } };
const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    teamName: '',
    creditCode: '',
    adminRegion: '',
    residAddress: '',
    foundDate: null,
    teamTypeId: '',
    affilUnitId: '',
    teamGradeId: '',
    authorizedNum: undefined,
    actualNum: undefined,
    fullTimeNum: undefined,
    partTimeNum: undefined,
    volunteerNum: undefined,
    contactName: '',
    contactPhone: undefined,
    responseTime: undefined,
    coverageAreaId: '',
  },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}队伍信息`;
});
let readonly = computed(() => {
  return type.value == 'view';
});
let teamArry = ref([]);
let affilArry = ref([]);
let teamTypeArry = ref([]);
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
  try {
    // 编辑或查看时，加载数据
    const res = { ...row.value };
    Object.assign(state.formState, res);
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
        delete params.id;
      }

      // 调用保存接口
      await saveOrUpdate(params);
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

// 初始化表单值
const resetForm = () => {
  state.formState = {
    id: '',
    teamName: '',
    creditCode: '',
    adminRegion: '',
    residAddress: '',
    foundDate: null,
    teamTypeId: '',
    affilUnitId: '',
    teamGradeId: '',
    authorizedNum: undefined,
    actualNum: undefined,
    fullTimeNum: undefined,
    partTimeNum: undefined,
    volunteerNum: undefined,
    contactName: '',
    contactPhone: undefined,
    responseTime: undefined,
    coverageAreaId: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>