<template>
  <BasicModal :title="title" :width="'60vw'" :height="600" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full m-t-10" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <!-- 第一行：急救人员总数 + 医护人员资质 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="急救人员总数" name="staffTotal" :rules="[{ required: true, message: '请输入急救人员总数' }]">
              <a-input-number v-model:value="state.formState.staffTotal" :min="0" style="width: 100%" placeholder="请输入总数" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="医护人员资质" name="medQuaId" :rules="[{ required: true, message: '请选择医护人员资质' }]">
              <JDictSelectTag v-model:value="state.formState.medQuaId" placeholder="请选择" dictCode="med_qua_type" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第二行：救护车配置数量 + 救护车配置型号 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="救护车配置数量" name="ambNum" :rules="[{ required: true, message: '请输入救护车配置数量' }]">
              <a-input-number v-model:value="state.formState.ambNum" :min="0" style="width: 100%" placeholder="请输入数量" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="救护车配置型号" name="ambModel" :rules="[{ required: true, message: '请输入救护车配置型号' }]">
              <a-input v-model:value="state.formState.ambModel" placeholder="请输入型号" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第三行：急救设备清单 + 可开展救治类型 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="急救设备清单" name="equipTypeId" :rules="[{ required: true, message: '请选择急救设备清单' }]">
              <JDictSelectTag v-model:value="state.formState.equipTypeId" placeholder="请选择" dictCode="equip_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="可开展救治类型" name="treatTypeId" :rules="[{ required: true, message: '请选择可开展救治类型' }]">
              <JDictSelectTag v-model:value="state.formState.treatTypeId" placeholder="请选择" dictCode="treat_type" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第四行：平均急救响应时间 + 与定点医院联动机制 -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="平均急救响应时间" name="avgRespTime" :rules="[{ required: true, message: '请输入平均急救响应时间' }]">
              <a-input-number v-model:value="state.formState.avgRespTime" :min="0" :precision="1" style="width: 100%" placeholder="请输入时间" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="与定点医院联动机制" name="hospLinkage" :rules="[{ required: true, message: '请输入与定点医院联动机制' }]">
              <a-input v-model:value="state.formState.hospLinkage" placeholder="请输入联动机制"  allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第五行：急救物资补充渠道（占整行） -->
        <a-row>
          <a-col :span="24">
            <a-form-item label="急救物资补充渠道" name="matSupply" :rules="[{ required: true, message: '请输入急救物资补充渠道' }]">
              <a-textarea v-model:value="state.formState.matSupply" placeholder="请输入补充渠道" :rows="3" allowClear />
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
import { saveOrUpdate } from '../line.api'; // 注意：此处需改为实际的医疗急救专项API
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '150px' } }; // 适应较长标签
const wrapperCol = { style: { width: 'calc(100% - 150px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    teamId: '', // 隐藏字段，可由父组件传入
    staffTotal: undefined,
    medQuaId: '',
    ambNum: undefined,
    ambModel: '',
    equipTypeId: '',
    treatTypeId: '',
    avgRespTime: undefined,
    hospLinkage: '',
    matSupply: '',
  },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}医疗急救专项信息`;
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
  try {
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
        // 如果有 teamId 需要从父级传入，可在此赋值，如 params.teamId = props.teamId;
      }

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

const resetForm = () => {
  state.formState = {
    id: '',
    teamId: '',
    staffTotal: undefined,
    medQuaId: '',
    ambNum: undefined,
    ambModel: '',
    equipTypeId: '',
    treatTypeId: '',
    avgRespTime: undefined,
    hospLinkage: '',
    matSupply: '',
  };
  state.loading = false;
  formRef.value?.resetFields();
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped></style>