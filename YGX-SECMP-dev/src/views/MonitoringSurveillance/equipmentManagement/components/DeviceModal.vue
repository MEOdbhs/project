<template>
  <BasicModal @register="registerModal" :title="title" width="520px" v-bind="$attrs" @ok="handleSubmit">
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
  const isUpdate = ref(false);

  const formSchema: FormSchema[] = [
    { field: 'devNo', label: '设备编号', component: 'Input', required: true },
    { field: 'devName', label: '设备名称', component: 'Input', required: true },
    { field: 'devType', label: '设备类型', component: 'Input', required: true },
    {
      field: 'category',
      label: '所属类别',
      component: 'Select',
      required: true,
      componentProps: {
        options: [
          { label: '地质灾害', value: '地质灾害' },
          { label: '水文', value: '水文' },
          { label: '森林防火', value: '森林防火' },
          { label: '矿山', value: '矿山' },
          { label: '危化品', value: '危化品' },
          { label: '工贸', value: '工贸' },
        ],
      },
    },
    { field: 'location', label: '安装位置', component: 'Input' },
    { field: 'manufacturer', label: '厂商', component: 'Input' },
    { field: 'installDate', label: '安装日期', component: 'Input' },
    {
      field: 'status',
      label: '设备状态',
      component: 'Select',
      required: true,
      componentProps: {
        options: [
          { label: '在线', value: 'online' },
          { label: '离线', value: 'offline' },
          { label: '告警', value: 'warning' },
        ],
      },
    },
    { field: 'signalStrength', label: '信号强度(%)', component: 'Input' },
    { field: 'seq', label: '', component: 'Input', show: false },
  ];

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 110,
    wrapperCol: null,
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await resetFields();
    setModalProps({
      confirmLoading: false,
      showCancelBtn: data?.showFooter !== false,
      showOkBtn: data?.showFooter !== false,
    });
    isUpdate.value = !!data?.isUpdate;
    if (data?.record) {
      await setFieldsValue({ ...data.record });
    }
  });

  const title = computed(() => (unref(isUpdate) ? '编辑设备' : '新增设备'));

  async function handleSubmit() {
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
