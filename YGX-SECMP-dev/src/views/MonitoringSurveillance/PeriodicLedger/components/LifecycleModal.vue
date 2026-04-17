<template>
  <BasicModal @register="registerModal" :title="title" width="560px" v-bind="$attrs" @ok="handleSubmit">
    <div class="content">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import type { FormSchema } from '/@/components/Table';

  const emit = defineEmits(['register', 'success']);

  const showFooter = ref(true);
  const isUpdate = ref(true);

  const formSchema: FormSchema[] = [
    { field: 'devNo', label: '设备编号', component: 'Input', required: true },
    { field: 'devName', label: '设备名称', component: 'Input', required: true },
    {
      field: 'stage',
      label: '生命周期阶段',
      component: 'Select',
      required: true,
      componentProps: {
        options: [
          { label: '入库', value: '入库' },
          { label: '运行', value: '运行' },
          { label: '维修', value: '维修' },
          { label: '报废', value: '报废' },
        ],
      },
    },
    { field: 'installDate', label: '安装日期', component: 'Input' },
    { field: 'warrantyEnd', label: '保修截止', component: 'Input' },
    { field: 'age', label: '已用年限', component: 'Input' },
    { field: 'health', label: '健康度(%)', component: 'Input' },
    { field: 'maintenance', label: '累计维护次数', component: 'Input' },
    { field: 'nextMaintenance', label: '下次维护', component: 'Input' },
    { field: 'seq', label: '', component: 'Input', show: false },
  ];

  const [registerForm, { resetFields, setFieldsValue, validate, setProps }] = useForm({
    labelWidth: 110,
    wrapperCol: null,
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await resetFields();
    showFooter.value = data?.showFooter !== false;
    isUpdate.value = !!data?.isUpdate;
    setModalProps({
      confirmLoading: false,
      showCancelBtn: unref(showFooter),
      showOkBtn: unref(showFooter),
    });
    setProps({ disabled: !unref(showFooter) });
    if (data?.record) {
      await setFieldsValue({ ...data.record });
    }
  });

  const title = computed(() => (unref(showFooter) ? '生命周期变更' : '生命周期详情'));

  async function handleSubmit() {
    if (!unref(showFooter)) {
      closeModal();
      return;
    }
    try {
      setModalProps({ confirmLoading: true });
      const values = await validate();
      closeModal();
      emit('success', { isUpdate: isUpdate.value, values });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped>
  .content {
    padding: 12px 8px 0;
  }
</style>
