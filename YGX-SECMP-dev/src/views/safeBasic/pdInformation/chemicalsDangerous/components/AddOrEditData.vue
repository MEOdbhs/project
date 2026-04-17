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
    <div class="h-full" v-loading="state.loading">
      <h3 class="modal-content-title">基础信息</h3>
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
          <a-col :span="8">
            <a-form-item label="危化品名称" name="dangerName" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.dangerName" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="别名" name="otherName" :rules="[{ required: false, message: '请输入' }]">
              <a-input v-model:value="state.formState.otherName" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="英文名" name="englishName" :rules="[{ required: false, message: '请输入' }]">
              <a-input v-model:value="state.formState.englishName" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="CAS号" name="casCard" :rules="[{ required: false, message: '请输入' }]">
              <a-input v-model:value="state.formState.casCard" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="化学品类型" name="chemicalsType" :rules="[{ required: true, message: '请选择' }]">
              <JDictSelectTag v-model:value="state.formState.chemicalsType" placeholder="请选择" dictCode="chemicals_type" :showChooseOption="false" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="物质形态" name="substanceType" :rules="[{ required: true, message: '请选择' }]">
              <JDictSelectTag v-model:value="state.formState.substanceType" placeholder="请选择" dictCode="material_form" :showChooseOption="false" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="计量单位" name="unit" :rules="[{ required: true, message: '请选择' }]">
              <a-select v-model:value="state.formState.unit"  style="width: 100%" placeholder="请选择" allowClear>
                <a-select-option value="吨">吨</a-select-option>
                <a-select-option value="千克">千克</a-select-option>
                <a-select-option value="升">升</a-select-option>
                <a-select-option value="立方米">立方米</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否重点监管危化品" name="isImportant" :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group v-model:value="state.formState.isImportant">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否特别管控危化品" name="isEspecially" :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group v-model:value="state.formState.isEspecially">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否剧毒化学品" name="isToxic" :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group v-model:value="state.formState.isToxic">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否易制爆" name="isExplosion" :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group v-model:value="state.formState.isExplosion">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否易制毒" name="isDrug" :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group v-model:value="state.formState.isDrug">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="最大储量" name="maxReserves" :rules="[{ required: true, message: '请输入有效值' }]">
              <a-input v-model:value="state.formState.maxReserves" placeholder="请输入" allowClear :addon-after="state.formState.unit" @input="handleNumberInput('maxReserves', $event)" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="当前储量" name="nowReserves" :rules="[{ required: true, message: '请输入有效值' }]">
              <a-input v-model:value="state.formState.nowReserves" placeholder="请输入" allowClear :addon-after="state.formState.unit" @input="handleNumberInput('nowReserves', $event)" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="储存方式" name="reservesType" :rules="[{ required: false, message: '请选择' }]">
              <JDictSelectTag v-model:value="state.formState.reservesType" placeholder="请选择" dictCode="storage_method" :showChooseOption="false" />
            </a-form-item>
          </a-col>
        </a-row>
        <h3 class="modal-content-title">详细信息</h3>
        <a-row>
          <a-col :span="24">
            <a-form-item label="主要用途" name="purpose" :rules="[{ required: false, message: '请输入' }]">
              <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.purpose" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" name="remark" :rules="[{ required: false, message: '请输入' }]">
              <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.remark" placeholder="请输入" allowClear />
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
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
  import { saveOrUpdate, getViewById } from '../line.api';
  import { message } from 'ant-design-vue';
  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const labelCol = { style: { width: '170px' } };
  const wrapperCol = { style: { width: 'calc(100% - 170px)' } };
  const state = reactive({
    loading: false,
    formState: {
      id: '',
      dangerName: '',
      otherName: '',
      englishName: '',
      casCard: '',
      chemicalsType: '',
      substanceType: '',
      unit: '吨',
      isImportant: 0,
      isEspecially: 0,
      isToxic: 0,
      isExplosion: 0,
      isDrug: 0,
      maxReserves: '',
      nowReserves: '',
      reservesType: '',
      purpose: '',
      remark: '',
    },
  });

  // 当前的弹窗数据
  let type = ref('');
  let row = ref({});
  let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
    return `${str}危险化学品`;
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
    Object.assign(state.formState, res);
    state.loading = false;
  };
  const handleOk = () => {
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
    formRef.value.clearValidate();
    state.formState = {
      id: '',
      dangerName: '',
      otherName: '',
      englishName: '',
      casCard: '',
      chemicalsType: '',
      substanceType: '',
      unit: '吨',
      isImportant: 0,
      isEspecially: 0,
      isToxic: 0,
      isExplosion: 0,
      isDrug: 0,
      maxReserves: '',
      nowReserves: '',
      reservesType: '',
      purpose: '',
      remark: '',
    };
    state.loading = false;
  };
  const handleCancel = () => {
    resetForm();
  };
  // 处理数字输入，只允许数字和小数点
  const handleNumberInput = (field, event) => {
    // 兼容事件对象和直接传值两种情况
    const value = event?.target?.value ?? event ?? '';
    // 只保留数字和小数点
    const numericValue = String(value).replace(/[^\d.]/g, '');
    // 确保只有一个小数点
    const parts = numericValue.split('.');
    const finalValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    state.formState[field] = finalValue;
  };
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
