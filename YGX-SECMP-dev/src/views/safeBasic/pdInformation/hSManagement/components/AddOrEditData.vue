<template>
  <BasicModal :title="title" :width="'60vw'" :height="550" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" okText="确定" cancelText="取消" @register="registerModal"
    @ok="handleOk" @cancel="handleCancel">
    <div class="h-full" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item label="危险源名称" name="hazardName" :rules="[{ required: true, message: '请输入危险源名称' }]">
              <a-input v-model:value="state.formState.hazardName" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="危险源编码" name="hazardCode" :rules="[{ required: true, message: '请输入危险源编码' }]">
              <a-input v-model:value="state.formState.hazardCode" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="危险源类型" name="hazardType" :rules="[{ required: true, message: '请选择危险源类型' }]">
              <JDictSelectTag v-model:value="state.formState.hazardType" placeholder="请选择" dictCode="hs_category" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="危险源等级" name="hazardLevel" :rules="[{ required: true, message: '请选择危险源等级' }]">
              <JDictSelectTag v-model:value="state.formState.hazardLevel" placeholder="请选择" dictCode="hs_level" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="危险源投用日期" name="hazardUseTime" :rules="[{ required: true, message: '请选择投用日期' }]">
              <a-date-picker v-model:value="state.formState.hazardUseTime" placeholder="请选择" style="width: 100%" 
                valueFormat="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否涉及重点监管危险化工工艺" name="isManage" :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group v-model:value="state.formState.isManage">
                <a-radio :value="0">否</a-radio>
                <a-radio :value="1">是</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="涉及的危险化工工艺名称" name="dangerChemical" :rules="[{ required: true, message: '请选择' }]">
              <a-select v-model:value="state.formState.dangerChemical" placeholder="请选择(可多选)" mode="multiple" 
                allowClear :loading="state.dangerWorkmanshipLoading">
                <a-select-option v-for="item in state.dangerWorkmanshipList" :key="item.id" :value="item.id">
                  {{ getDictTextByCode(item.dangerWorkmanship, 'dangerous_chemical_process') }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否涉及毒性气体、液化气体、液体毒气" name="isDrug" 
              :label-col="{ style: { width: '280px' } }" :wrapper-col="{ style: { width: 'calc(100% - 240px)' } }"
              :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group v-model:value="state.formState.isDrug">
                <a-radio value="0">否</a-radio>
                <a-radio value="1">是</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="周边防护目标最近距离" name="protectionDistance" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.protectionDistance" placeholder="请输入" allowClear>
                <template #addonAfter>米</template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="外界500米人数估算" name="outsidePeople" :rules="[{ required: true, message: '请输入' }]">
              <a-input-number v-model:value="state.formState.outsidePeople" placeholder="请输入" :min="0"
                style="width: 100%">
                <template #addonAfter>人</template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="年生产能力" name="yearProduction" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.yearProduction" placeholder="请输入" allowClear>
                <template #addonAfter>吨/立方米</template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="经度" name="latitude" :rules="[{ required: true, message: '请输入经度' }]">
              <a-input-number v-model:value="state.formState.latitude" placeholder="请输入" 
                style="width: 100%" :precision="6" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="纬度" name="longitude" :rules="[{ required: true, message: '请输入纬度' }]">
              <a-input-number v-model:value="state.formState.longitude" placeholder="请输入"
                style="width: 100%" :precision="6" />
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
    </div>
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { saveOrUpdate, getViewById, getDangerWorkmanshipList } from '../line.api';
import { message } from 'ant-design-vue';
import FileUploadRecord from '/@/components/FileUpload/FileUploadRecord.vue';
import { getDictTextByCode } from '/@/utils/dict';

const emit = defineEmits(['success', 'register']);
const formRef = ref();
const labelCol = { style: { width: '150px' } };
const wrapperCol = { style: { width: 'calc(100% - 150px)' } };

const state = reactive({
  loading: false,
  dangerWorkmanshipLoading: false,
  dangerWorkmanshipList: [],
  formState: {
    id: '',
    hazardName: '',
    hazardCode: '',
    hazardType: '',
    hazardLevel: '',
    hazardUseTime: '',
    isManage: 0,
    dangerChemical: [],
    isDrug: '0',
    protectionDistance: '',
    outsidePeople: undefined,
    yearProduction: '',
    latitude: undefined,
    longitude: undefined,
    fileIds: [],
  },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const typeMap = {
    add: '新增',
    edit: '编辑',
    view: '查看',
  };
  const str = typeMap[type.value] || '查看';
  return `${str}危险源`;
});
let readonly = computed(() => {
  return type.value === 'view';
});

// 注册弹窗
const [registerModal, { closeModal }] = useModalInner(async (data) => {
  row.value = data.row;
  type.value = data.type;
  resetForm();
  // 除了新增模式，其他模式都需要加载数据
  if (type.value !== 'add') {
    getData();
  }
});

// 获取危险工艺列表
const getDangerWorkmanshipData = async () => {
  state.dangerWorkmanshipLoading = true;
  try {
    const res = await getDangerWorkmanshipList();
    state.dangerWorkmanshipList = res || [];
  } catch (error) {
    console.error('获取危险工艺列表失败:', error);
  } finally {
    state.dangerWorkmanshipLoading = false;
  }
};

const getData = async () => {
  state.loading = true;
  const res = await getViewById({ id: row.value.id });
  // 处理多选字段
  if (res.dangerChemical && typeof res.dangerChemical === 'string') {
    res.dangerChemical = res.dangerChemical.split(',');
  }
  Object.assign(state.formState, res);
  state.loading = false;
};

const handleOk = () => {
  formRef.value.validate().then(() => {
    state.loading = true;
    let params = { ...state.formState };
    if (type.value === 'add') {
      delete params.id;
    }
    // 处理多选字段，将数组转为逗号拼接的字符串
    if (Array.isArray(params.dangerChemical)) {
      params.dangerChemical = params.dangerChemical.join(',');
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
  formRef.value?.clearValidate();
  state.formState = {
    id: '',
    hazardName: '',
    hazardCode: '',
    hazardType: '',
    hazardLevel: '',
    hazardUseTime: '',
    isManage: 0,
    dangerChemical: [],
    isDrug: '0',
    protectionDistance: '',
    outsidePeople: undefined,
    yearProduction: '',
    latitude: undefined,
    longitude: undefined,
    fileIds: [],
  };
  state.loading = false;
};

const handleCancel = () => {
  resetForm();
};

// 组件挂载时加载危险工艺列表
onMounted(() => {
  getDangerWorkmanshipData();
});
</script>
<style lang="less" scoped></style>
