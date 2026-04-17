<template>
  <BasicModal
    :title="title"
    :width="'50vw'"
    :height="250"
    :can-fullscreen="false"
    :maskClosable="false"
    :keyboard="false"
    v-bind="$attrs"
    @register="registerModal"
    cancelText="关闭"
    okText="确定"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div class="pl-10px pr-10px h-full" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" autocomplete="off" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item label="模型标识" name="key" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.key" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="模型名称" name="name" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="分类" name="category">
              <a-input v-model:value="state.formState.category" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="描述" name="description">
              <a-textarea v-model:value="state.formState.description" placeholder="请输入" allowClear :rows="4" :maxlength="1000" />
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
  import { saveOrUpdate } from '../flowDesign.api';
  import { message } from 'ant-design-vue';
  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const labelCol = { style: { width: '150px' } };
  const wrapperCol = { style: { width: 'calc(100% - 150px)' } };
  const state = reactive({
    loading: false,
    formState: {
      id: '',
      //
      key: '', //模型标识
      name: '', //模型名称
      category: '', //分类
      description: '', //描述
    },
  });

  // 当前的弹窗数据
  const id = ref('');
  const type = ref('add');
  const title = computed(() => {
    const str = type.value === 'add' ? '新增' : type.value === 'edit' ? '编辑' : '查看';
    return str + '模型';
  });
  // 注册弹窗
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    id.value = data.type === 'add' ? '' : data.row.id;
    type.value = data.type;
    resetForm();
    if (data.type !== 'add') {
      getView();
    }
  });

  const resetForm = () => {
    state.formState = {
      id: '',
      //
      key: '', //模型标识
      name: '', //模型名称
      category: '', //分类
      description: '', //描述
    };
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
  const getView = () => {
    // 暂无对应接口，此为编辑、查看的预留功能
    // state.loading = true;
    // getViewById({ id: id.value })
    //   .then((res) => {
    //     Object.assign(state.formState, res);
    //   })
    //   .finally(() => {
    //     state.loading = false;
    //   });
  };
  const handleCancel = () => {
    resetForm();
  };
</script>
<style></style>
