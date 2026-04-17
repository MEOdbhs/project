<template>
  <BasicModal
    :title="'新增企业'"
    :width="900"
    :destroy-on-close="true"
    :mask-closable="false"
    v-bind="$attrs"
    ok-text="确定"
    cancel-text="取消"
    @register="registerModal"
    @ok="handleOk"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
import { BasicModal, useModalInner } from '/@/components/Modal'
import { BasicForm, useForm } from '/@/components/Form/index'
import { message } from 'ant-design-vue'
import { addEnterprise } from '../enterprise.api';
import type { FormSchema } from '/@/components/Table'

const emit = defineEmits(['register', 'success'])

const addFormSchema: FormSchema[] = [
  {
    field: 'parentEntName',
    label: '母公司名称',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入母公司名称', maxlength: 200 },
  },
  {
    field: 'parentCreditCode',
    label: '母公司统一社会信用代码',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入母公司统一社会信用代码', maxlength: 50 },
  },
  {
    field: 'industryType',
    label: '行业类型',
    component: 'Input', // 若为字典请替换为 JDictSelectTag 并设置 dictCode
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入行业类型', maxlength: 100 },
  },
  {
    field: 'safetySuperviseDept',
    label: '属地安全监管部门',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入属地安全监管部门', maxlength: 200 },
  },
  {
    field: 'actualController',
    label: '实际控制人姓名',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入实际控制人姓名', maxlength: 50 },
  },
  {
    field: 'actualControllerPhone',
    label: '实际控制人电话',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入实际控制人电话', maxlength: 20 },
  },
  {
    field: 'isAboveScale',
    label: '是否规模以上',
    component: 'RadioGroup',
    required: true,
    colProps: { span: 12 },
    componentProps: {
      options: [
        { label: '是', value: 'Y' },
        { label: '否', value: 'N' },
      ],
    },
  },
  {
    field: 'isInChemicalPark',
    label: '是否在化工园区',
    component: 'RadioGroup',
    required: true,
    colProps: { span: 12 },
    componentProps: {
      options: [
        { label: '是', value: 'Y' },
        { label: '否', value: 'N' },
      ],
    },
  },
  {
    field: 'isKeySafetyEnt',
    label: '安全生产监管重点企业',
    component: 'RadioGroup',
    required: true,
    colProps: { span: 12 },
    componentProps: {
      options: [
        { label: '是', value: 'Y' },
        { label: '否', value: 'N' },
      ],
    },
  },
  {
    field: 'prodStatus',
    label: '企业生产状态',
    component: 'Input', // 若为字典请替换为 JDictSelectTag 并设置 dictCode
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入企业生产状态', maxlength: 50 },
  },
  {
    field: 'businessScale',
    label: '生产经营单位规模',
    component: 'Input', // 若为字典请替换为 JDictSelectTag
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入生产经营单位规模', maxlength: 50 },
  },
  {
    field: 'totalStaff',
    label: '总人数',
    component: 'InputNumber',
    required: true,
    colProps: { span: 12 },
    componentProps: {
      placeholder: '请输入总人数',
      min: 0,
      style: { width: '100%' },
    },
  },
  {
    field: 'mainBusiness',
    label: '主营业务',
    component: 'InputTextArea',
    required: true,
    colProps: { span: 24 },
    componentProps: {
      placeholder: '请输入主营业务',
      maxlength: 500,
      rows: 3,
    },
  },
]

const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
  await resetFields()
})

const [registerForm, { resetFields, validate }] = useForm({
  schemas: addFormSchema,
  showActionButtonGroup: false,
  rowProps: { gutter: 16 },
  labelCol: { style: { width: '180px' } },
  wrapperCol: { style: { width: 'calc(100% - 100px)' } },
})

async function handleOk() {
  try {
    setModalProps({ confirmLoading: true })
    const values = await validate()
    // 实际调用 await addEnterprise(values)
    await addEnterprise(values)
    message.success('新增成功')
    closeModal()
    emit('success')
  } catch {
    // 验证失败
  } finally {
    setModalProps({ confirmLoading: false })
  }
}
</script>