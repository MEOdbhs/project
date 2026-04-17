<template>
  <BasicModal :title="title" :width="'80vw'" :height="600" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <!-- 第一行：企业名称、企业编码、统一社会信用代码 -->
        <a-row>
          <a-col :span="8">
            <a-form-item label="企业名称" name="entName" :rules="[{ required: true, message: '请输入企业名称' }]">
              <a-input v-model:value="state.formState.entName" placeholder="请输入企业名称" allowClear :maxlength="200" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="企业编码" name="entCode" :rules="[{ required: true, message: '请输入企业编码' }]">
              <a-input v-model:value="state.formState.entCode" placeholder="请输入企业编码" allowClear :maxlength="50" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="统一社会信用代码" name="creditCode" :rules="[{ required: true, message: '请输入统一社会信用代码' }]">
              <a-input v-model:value="state.formState.creditCode" placeholder="请输入统一社会信用代码" allowClear
                :maxlength="50" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第二行：行政区划、工商注册地址、邮政编码 -->
        <a-row>
          <a-col :span="8">
            <a-form-item label="行政区划" name="regionCode" :rules="[{ required: true, message: '请输入行政区划' }]">
              <a-input v-model:value="state.formState.regionCode" placeholder="请输入行政区划" allowClear :maxlength="20" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="工商注册地址" name="regAddr" :rules="[{ required: true, message: '请输入工商注册地址' }]">
              <a-input v-model:value="state.formState.regAddr" placeholder="请输入工商注册地址" allowClear :maxlength="500" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="邮政编码" name="zipCode" :rules="[{ required: true, message: '请输入邮政编码' }]">
              <a-input v-model:value="state.formState.zipCode" placeholder="请输入邮政编码" allowClear :maxlength="10" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第三行：成立日期、企业规模、经济类型 -->
        <a-row>
          <a-col :span="8">
            <a-form-item label="成立日期" name="establishDate" :rules="[{ required: true, message: '请选择成立日期' }]">
              <a-date-picker v-model:value="state.formState.establishDate" valueFormat="YYYY-MM-DD"
                placeholder="请选择成立日期" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="企业规模" name="entScale" :rules="[{ required: true, message: '请输入企业规模' }]">
              <a-input v-model:value="state.formState.entScale" placeholder="请输入企业规模" allowClear :maxlength="20" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="经济类型" name="ecoType" :rules="[{ required: true, message: '请输入经济类型' }]">
              <a-input v-model:value="state.formState.ecoType" placeholder="请输入经济类型" allowClear :maxlength="50" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第四行：所属行业、营业期限、企业状态 -->
        <a-row>
          <a-col :span="8">
            <a-form-item label="所属行业" name="industry" :rules="[{ required: true, message: '请输入所属行业' }]">
              <a-input v-model:value="state.formState.industry" placeholder="请输入所属行业" allowClear :maxlength="100" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="营业期限" name="businessTerm" :rules="[{ required: true, message: '请输入营业期限' }]">
              <a-input v-model:value="state.formState.businessTerm" placeholder="请输入营业期限" allowClear :maxlength="100" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="企业状态" name="entStatus" :rules="[{ required: true, message: '请输入企业状态' }]">
              <a-input v-model:value="state.formState.entStatus" placeholder="请输入企业状态" allowClear :maxlength="20" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第五行：企业类型、法定代表人、法定代表人电话 -->
        <a-row>
          <a-col :span="8">
            <a-form-item label="企业类型" name="entType" :rules="[{ required: true, message: '请输入企业类型' }]">
              <a-input v-model:value="state.formState.entType" placeholder="请输入企业类型" allowClear :maxlength="50" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="法定代表人" name="legalPerson" :rules="[{ required: true, message: '请输入法定代表人' }]">
              <a-input v-model:value="state.formState.legalPerson" placeholder="请输入法定代表人" allowClear :maxlength="50" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="法定代表人电话" name="legalPersonPhone" :rules="[{ required: true, message: '请输入法定代表人电话' }]">
              <a-input v-model:value="state.formState.legalPersonPhone" placeholder="请输入法定代表人电话" allowClear
                :maxlength="20" />
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

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '140px' } };
const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    entName: '',
    entCode: '',
    creditCode: '',
    regionCode: '',
    regAddr: '',
    zipCode: '',
    establishDate: null,
    entScale: '',
    ecoType: '',
    industry: '',
    businessTerm: '',
    entStatus: '',
    entType: '',
    legalPerson: '',
    legalPersonPhone: '',
  },
});

let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}企业信息`;
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
    // 编辑或查看时，将行数据赋值给表单
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
    entName: '',
    entCode: '',
    creditCode: '',
    regionCode: '',
    regAddr: '',
    zipCode: '',
    establishDate: null,
    entScale: '',
    ecoType: '',
    industry: '',
    businessTerm: '',
    entStatus: '',
    entType: '',
    legalPerson: '',
    legalPersonPhone: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>