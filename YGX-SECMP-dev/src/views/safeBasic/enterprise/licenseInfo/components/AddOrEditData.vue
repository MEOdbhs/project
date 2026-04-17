<template>
    <BasicModal :title="title" :width="'60vw'" :height="450" :destroyOnClose="true" :can-fullscreen="false" :maskClosable="false"
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
import { saveOrUpdate,getViewById } from '../license.api'
import { basicFormSchema } from '../license.data'
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
        await setFieldsValue(Object.assign(state.formData, res, { operateType: type.value }))
    }
    title.value = data.type === 'add' ? `新增证照信息` : data.type === 'edit' ? '编辑证照信息' : `查看详情`
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
        console.log('formData', formData)
        // 处理 fileIds：如果是数组，直接使用；如果是字符串，转换为数组；如果为空，使用空数组
        if (Array.isArray(formData.fileIds)) {
            // 已经是数组，直接使用
        } else if (typeof formData.fileIds === 'string' && formData.fileIds) {
            // 字符串格式，转换为数组
            formData.fileIds = formData.fileIds.split(',').filter(id => id)
        } else {
            // 空值，设置为空数组
            formData.fileIds = []
        }
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