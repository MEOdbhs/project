<template>
  <BasicModal
    :title="title"
    :width="800"
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
    <div v-loading="state.loading" class="modal-content-wrapper">
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
            <a-form-item label="危险化工工艺名称" name="dangerWorkmanship" :rules="[{ required: true, message: '请选择' }]">
              <JDictSelectTag v-model:value="state.formState.dangerWorkmanship" placeholder="请选择" dictCode="dangerous_chemical_process" :showChooseOption="false" :getPopupContainer="getContainer" @change="handleDangerWorkmanshipChange" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="涉及的典型工艺装置名称" name="typicalWorkmanship" :rules="[{ required: true, message: '请选择' }]">
              <a-select 
                v-model:value="state.formState.typicalWorkmanship" 
                placeholder="请先选择危险化工工艺名称" 
                allowClear
                :loading="state.typicalLoading"
                :disabled="!state.formState.dangerWorkmanship"
                :getPopupContainer="getContainer"
              >
                <a-select-option v-for="item in state.typicalOptions" :key="item.dictValue" :value="item.dictValue">
                  {{ item.dictText }}
                </a-select-option>
              </a-select>
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
  import { saveOrUpdate, getViewById, getTypicalByDanger } from '../line.api';
  import { message } from 'ant-design-vue';
  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const labelCol = { style: { width: '200px' } };
  const wrapperCol = { style: { width: 'calc(100% - 200px)' } };
  const state = reactive({
    loading: false,
    typicalLoading: false,
    typicalOptions: [],
    formState: {
      id: '',
      dangerWorkmanship: '',
      typicalWorkmanship: '',
    },
  });

  // 当前的弹窗数据
  let type = ref('');
  let row = ref({});
  let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
    return `${str}危险化工工艺`;
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
    // 如果有危险化工工艺，加载对应的典型工艺装置选项
    if (res.dangerWorkmanship) {
      await loadTypicalOptions(res.dangerWorkmanship);
    }
    state.loading = false;
  };

  /**
   * 加载典型工艺装置选项
   */
  const loadTypicalOptions = async (itemValue) => {
    if (!itemValue) {
      state.typicalOptions = [];
      return;
    }
    state.typicalLoading = true;
    try {
      const res = await getTypicalByDanger({ itemValue });
      state.typicalOptions = res || [];
    } catch (error) {
      console.error('加载典型工艺装置选项失败:', error);
      state.typicalOptions = [];
    } finally {
      state.typicalLoading = false;
    }
  };

  /**
   * 危险化工工艺变化事件
   */
  const handleDangerWorkmanshipChange = (value) => {
    // 清空典型工艺装置
    state.formState.typicalWorkmanship = '';
    // 加载新的选项
    loadTypicalOptions(value);
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
      dangerWorkmanship: '',
      typicalWorkmanship: '',
    };
    state.typicalOptions = [];
    state.loading = false;
  };
  const handleCancel = () => {
    resetForm();
  };
  
  // 获取弹窗容器，让下拉菜单挂载到弹窗内部
  const getContainer = () => {
    return document.body;
  };
</script>
<style lang="less" scoped>
  .modal-content-wrapper {
    min-height: 400px;
    padding-bottom: 20px;
  }
  
  // 确保下拉选项有足够的显示空间
  :deep(.ant-form) {
    min-height: 300px;
  }
</style>
