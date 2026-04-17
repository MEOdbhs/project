<template>
    <BasicModal :title="title" :width="'60vw'" :height="500" :destroyOnClose="true" :can-fullscreen="false" :maskClosable="false"
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
import { save, edit } from '../user.api'
import { formSchema } from '../user.data'
import { message } from 'ant-design-vue'
import { useUserStore } from '/@/store/modules/user'
const userStore = useUserStore()
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
    state.formData = Object.assign({},data.row)
    await setFieldsValue(state.formData)
    title.value = data.type === 'add' ? `新增用户信息` : data.type === 'edit' ? '编辑用户信息' : `查看详情`
    state.loading = false
})
//注册表单
const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    schemas: formSchema,
    showActionButtonGroup: false,
})

async function handleOk() {
    try {
        setModalProps({ confirmLoading: true })
        let values = await validate()
        // //提交表单
        let formData = Object.assign({}, state.formData, values)
        if(type.value === 'add'){
            await save(formData)
        }else{
            await edit(formData)
        }
        if(type.value === 'add'){
            message.success('新增人员成功，默认密码为：enterprise@2025，请联系管理员分配角色登录系统')
        }
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