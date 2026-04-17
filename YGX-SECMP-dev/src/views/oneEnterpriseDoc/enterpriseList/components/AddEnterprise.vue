<template>
  <BasicModal
    :title="'新增企业'"
    :width="980"
    :destroy-on-close="true"
    :mask-closable="false"
    v-bind="$attrs"
    ok-text="确定"
    cancel-text="取消"
    @register="registerModal"
    @ok="handleOk"
  >
    <div class="add-enterprise-form">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { BasicModal, useModalInner } from '/@/components/Modal'
import { BasicForm, useForm } from '/@/components/Form/index'
import { message } from 'ant-design-vue'
import { getDictTextByCode } from '/@/utils/dict'
import { addEnterprise, getAreaTree } from '../enterprise.api'
import { buildAddCompanyInfoBody } from '../enterprise.transform'
import type { FormSchema } from '/@/components/Table'
import { queryMyDepartTreeList } from '@/views/system/departUser/depart.user.api'

const emit = defineEmits(['register', 'success'])

function mapDeptTree(nodes: any[] = []) {
  return nodes.map((item) => ({
    label: item.deptName ?? item.title ?? item.name,
    value: item.id ?? item.key ?? item.value,
    children: item.children ? mapDeptTree(item.children) : undefined,
  }))
}

function loadDeptTree() {
  return queryMyDepartTreeList().then((res) => {
    const list = Array.isArray(res?.result) ? res.result : []
    return mapDeptTree(list)
  })
}

const addFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '企业名称',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入企业名称' },
  },
  {
    field: 'code',
    label: '企业编码',
    component: 'Input',
    required: false,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入企业编码' },
  },
  {
    field: 'areaId',
    label: '所属区域',
    component: 'ApiTreeSelect',
    required: true,
    colProps: { span: 12 },
    componentProps: {
      api: getAreaTree,
      resultField: 'children',
      fieldNames: { label: 'label', value: 'areaId', children: 'children' },
      treeDefaultExpandAll: true,
      placeholder: '请选择所属区域',
      allowClear: true,
      onChange: handleAreaChange,
    },
  },
  {
    field: 'deptId',
    label: '所属部门',
    component: 'ApiTreeSelect',
    required: true,
    colProps: { span: 12 },
    componentProps: {
      api: loadDeptTree,
      treeDefaultExpandAll: true,
      placeholder: '请选择所属部门',
      allowClear: true,
    },
  },
  {
    field: 'speciality',
    label: '专业',
    component: 'JDictSelectTag',
    required: true,
    colProps: { span: 12 },
    componentProps: {
      dictCode: 'mine_speciality',
      placeholder: '请选择专业',
      allowClear: true,
    },
  },
  {
    field: 'productionStatus',
    label: '生产状态',
    component: 'JDictSelectTag',
    required: true,
    colProps: { span: 12 },
    componentProps: {
      dictCode: 'mine_product_status',
      placeholder: '请选择生产状态',
      allowClear: true,
    },
  },
  {
    field: 'sortNo',
    label: '排序号',
    component: 'InputNumber',
    required: true,
    colProps: { span: 12 },
    componentProps: { placeholder: '请输入排序号', min: 1, precision: 0, style: { width: '100%' } },
  },
  {
    field: 'areaName',
    label: '所属区域名称',
    component: 'Input',
    show: false,
  },
]

const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
  await resetFields()
})

const [registerForm, { resetFields, validate, setFieldsValue }] = useForm({
  schemas: addFormSchema,
  showActionButtonGroup: false,
  rowProps: { gutter: 16 },
  labelWidth: 100,
})

function handleAreaChange(value: string, label: string | string[]) {
  const areaName = Array.isArray(label) ? label[label.length - 1] : label
  setFieldsValue({ areaId: value, areaName: areaName || '' })
}

async function handleOk() {
  try {
    setModalProps({ confirmLoading: true })
    const values = await validate()
    const body = buildAddCompanyInfoBody({ values, getDictText: getDictTextByCode })
    await addEnterprise(body)
    message.success('新增成功')
    closeModal()
    emit('success')
  } catch {
    // validate fail
  } finally {
    setModalProps({ confirmLoading: false })
  }
}
</script>

<style scoped lang="less">
  /* gutter 负 margin 会让 Row 比容器略宽，弹窗内滚动区会出现横向滚动条 */
  .add-enterprise-form {
    width: 100%;
    max-width: 100%;
    :deep(.ant-row) {
      margin-left: 0 !important;
      margin-right: 0 !important;
      margin-inline: 0 !important;
    }
  }
</style>
