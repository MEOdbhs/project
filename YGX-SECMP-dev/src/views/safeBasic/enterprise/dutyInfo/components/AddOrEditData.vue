<template>
    <BasicModal :title="title" :width="'60vw'" :height="260" :destroyOnClose="true" :can-fullscreen="false" :maskClosable="false"
        :keyboard="false" v-bind="$attrs" okText="确定" cancelText="关闭" @register="registerModal" @ok="handleOk"
        :showOkBtn="type !== 'view'">
        <div class="pl-10px pr-10px h-full" v-loading="state.loading">
            <BasicForm :labelCol="labelCol" :wrapperCol="wrapperCol" @register="registerForm" :disabled="type === 'view'" :needHideBorder="false">
               
            </BasicForm>
        </div>
    </BasicModal>
</template>

<script setup>
import { ref, reactive, unref, nextTick, onMounted } from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
import { BasicForm, useForm } from '/@/components/Form/index'
import { saveOrUpdate,getViewById } from '../duty.api'
import { basicFormSchema } from '../duty.data'
import { message } from 'ant-design-vue'
const emit = defineEmits(['success', 'register'])
const isUpdate = ref(true)
const labelCol = { style: { width: '150px' } }
const wrapperCol = { style: { width: 'calc(100% - 150px)' } }
const state = reactive({
    loading: false,
    formData: {}
})
// 当前的弹窗数据
const title = ref('')
const type = ref('add')
const row = ref({})
// 注册弹窗
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await resetFields()
    state.loading = true
    type.value = data.type
    isUpdate.value = !!data?.isUpdate
    state.formData = data.row
    if (unref(isUpdate)) {
        //表单赋值
        const res = await getViewById({ id: data.row.id })
        await setFieldsValue(Object.assign(state.formData, res, { operateType: type.value,dutyDateStartRange: [res.dutyDateStart, res.dutyDateEnd] }))
    }
    title.value = data.type === 'add' ? `新增值班值守信息` : data.type === 'edit' ? '编辑值班值守信息' : `查看详情`
    state.loading = false
})
//注册表单
const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    schemas: basicFormSchema,
    showActionButtonGroup: false,
})

async function handleOk() {
    try {
        setModalProps({ confirmLoading: true })
        let values = await validate()
        //提交表单
        let formData = Object.assign({}, state.formData, values)
        await saveOrUpdate(formData, isUpdate.value)
        message.success('保存成功')
        //关闭弹窗
        closeModal()
        //刷新列表
        emit('success')
    } finally {
        setModalProps({ confirmLoading: false })
    }
}
onMounted(() => {

})
</script>
<style lang="less" scoped>

</style>