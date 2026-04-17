<template>
    <BasicModal :title="title" :width="'50vw'" :height="500" :can-fullscreen="false" :keyboard="false"
        :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
        :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
        @cancel="handleCancel">
        <div class="h-full pl-10px pr-10px" v-loading="state.loading">
            <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol"
                :disabled="readonly" autocomplete="off" ref="formRef">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="预案名称" name="name" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="预案类别" name="type" :rules="[{ required: true, message: '请输入' }]">
                            <JDictSelectTag v-model:value="state.formState.type" placeholder="请选择" dictCode="plan_type"
                                :showChooseOption="false" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="预案内容" name="content" :rules="[{ required: true, message: '请输入' }]">
                            <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.content"
                                placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="附件" name="content">
                            <FileUploadRecord v-model:value="state.formState.fileIds" :bizId="state.formState.id" :readonly="readonly" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </BasicModal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue'
import FileUploadRecord from '/@/components/FileUpload/FileUploadRecord.vue'
import { saveOrUpdatePlan, getViewByIdPlan } from '../plan.api'
import { message } from 'ant-design-vue'
const emit = defineEmits(['success', 'register'])
const formRef = ref()
const labelCol = { style: { width: '170px' } }
const wrapperCol = { style: { width: 'calc(100% - 170px)' } }
const state = reactive({
    loading: false,
    formState: {
        id: '',
        name: '',
        type: '',
        content: '',
        fileIds: [],
    },
})

// 当前的弹窗数据
let type = ref('')
let row = ref({})
let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看'
    return `${str}应急预案`
})
let readonly = computed(() => {
    return type.value == 'view'
})
// 注册弹窗
const [registerModal, { closeModal }] = useModalInner(async (data) => {
    row.value = data.row
    type.value = data.type
    resetForm()
    if (type.value == 'view' || type.value == 'edit') {
        getData()
    }
})

const getData = async () => {
    state.loading = true
    const res = await getViewByIdPlan({ id: row.value.id }); console.log(res)
    Object.assign(state.formState, res)
    state.loading = false
}
const handleOk = () => {
    formRef.value.validate().then(() => {
        state.loading = true
        let params = state.formState
        if (type.value === 'add') {
            delete params.id
        }
        saveOrUpdatePlan(params)
            .then(() => {
                emit('success')
                message.success('保存成功')
                closeModal()
                resetForm()
            })
            .catch(() => {
                message.error('保存失败,请稍后再试')
            })
            .finally(() => {
                state.loading = false
            })
    })
}
// 初始化表单值
const resetForm = () => {
    // form的resetFields在部分情况下，部分表单值和校验结果无法清除重置、故用以下方式
    formRef.value.clearValidate()
    state.formState = {
        id: '',
        name: '',
        type: '',
        content: '',
        fileIds: [],
    }
    state.loading = false
}
const handleCancel = () => {
    resetForm()
}
</script>
<style lang="less" scoped>
.modal-content-title {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0 10px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
}
</style>