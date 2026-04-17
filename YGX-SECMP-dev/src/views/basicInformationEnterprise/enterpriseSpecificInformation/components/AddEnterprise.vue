<template>
  <BasicModal :title="'新增'" :width="1200" :destroy-on-close="true" :mask-closable="false" v-bind="$attrs" ok-text="确定"
    cancel-text="取消" @register="registerModal" @ok="handleOk">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
import { BasicModal, useModalInner } from '/@/components/Modal'
import { BasicForm, useForm } from '/@/components/Form/index'
import { message } from 'ant-design-vue'
import SimpleImageUpload from '/@/components/FileUpload/SimpleImageUpload.vue'
import { addEnterprise } from '../enterprise.api';
import type { FormSchema } from '/@/components/Table'
import { ref, h } from 'vue'

const uploadRef = ref()
const emit = defineEmits(['register', 'success'])

const addFormSchema: FormSchema[] = [
  {
    field: 'smeltingStaffTotal',
    label: '金属冶炼单元从业人员总数',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入金属冶炼单元从业人员总数' },
  },
  {
    field: 'gasPipeLength',
    label: '企业内部煤气输配管道长度(米)',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入企业内部煤气输配管道长度' },
  },
  {
    field: 'crudeSteelDesignCap',
    label: '粗钢设计产能(万吨/年)',
    component: 'Input', // 若为字典请替换为 JDictSelectTag 并设置 dictCode
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入粗钢设计产能' },
  },
  {
    field: 'processFlow',
    label: '工艺流程',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入工艺流程' },
  },
  {
    field: 'creditCode',
    label: '统一社会信用代码',
    component: 'Input', // 若为字典请替换为 JDictSelectTag 并设置 dictCode
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入统一社会信用代码', maxlength: 50 },
  },
  {
    field: 'fileSubIds',
    label: '承诺书',
    component: 'Input', // 占位，实际不生效
    required: false,
    colProps: { span: 24 },
    render: ({ model, field }) => {
      return h(SimpleImageUpload, {
        value: model[field],
        'onUpdate:value': (val) => { model[field] = val },
        ref: uploadRef,
        // 其他原有 props 可以继续传递，例如：
        // bizId: model.id,
        // readonly: model.operateType === 'view',
      })
    }
  },
]

const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
  await resetFields()
})

const [registerForm, { resetFields, validate }] = useForm({
  schemas: addFormSchema,
  showActionButtonGroup: false,
  rowProps: { gutter: 16 },
  labelCol: { style: { width: '220px' } },
  wrapperCol: { style: { width: 'calc(100% - 100px)' } },
})

async function handleOk() {
  try {
    setModalProps({ confirmLoading: true })
    const values = await validate()

    // 获取上传组件的完整文件列表
    if (uploadRef.value) {
      // uploadRef.value.imageFiles 就是内部存储的文件对象数组
      const fileList = uploadRef.value.imageFiles.map(file => ({
        // 可根据后端要求调整字段映射，以下为示例
        // bizId: file.bizId || '',          // 如果已有 bizId 则传递
        fileName: file.fileName,
        fileType: file.fileType,
        fileSize: file.fileSize,
        fileExtname: file.fileExtname,
        fileAddr: file.fileAddr,
        filePath: file.filePath,
      }))
      values.fileList = fileList
    }

    // 调用接口
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