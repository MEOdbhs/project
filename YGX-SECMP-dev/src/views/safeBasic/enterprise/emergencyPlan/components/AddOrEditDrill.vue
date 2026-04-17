<template>
    <BasicModal :title="title" :width="'50vw'" :height="580" :can-fullscreen="false" :keyboard="false"
        :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
        :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
        @cancel="handleCancel">
        <div class="h-full pl-10px pr-10px" v-loading="state.loading">
            <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol"
                :disabled="readonly" autocomplete="off" ref="formRef">
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="演练时间" name="drillTime" :rules="[{ required: true, message: '请选择' }]">
                            <a-range-picker v-model:value="state.formState.drillTime" show-time
                                format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" style="width: 100%;" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="演练形式" name="drillType" :rules="[{ required: true, message: '请输入' }]">
                            <JDictSelectTag v-model:value="state.formState.drillType" placeholder="请选择"
                                dictCode="drill_format" :showChooseOption="false" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="演练名称" name="name" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="演练预案" name="planId" :rules="[{ required: true, message: '请输入' }]">
                            <ApiSelect v-model:value="state.formState.planId" placeholder="请选择" v-bind="planProps" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="预案类别" name="type" :rules="[{ required: false, message: '请输入' }]">
                            <JDictSelectTag v-model:value="state.formState.type" placeholder="请选择" dictCode="plan_type"
                                :showChooseOption="false" :disabled="true" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="演练人员" name="drillPersonNum" :rules="[{ required: true, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.drillPersonNum" placeholder="请输入" :min="0"
                                style="width: 100%" addon-after="人" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="备注" name="remark" :rules="[{ required: false, message: '请输入' }]">
                            <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.remark"
                                placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="附件" name="remark">
                            <FileUploadRecord v-model:value="state.formState.fileIds" :bizId="state.formState.id"
                                :readonly="readonly" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </BasicModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue'
import { saveOrUpdateDrill, getViewByIdrill, listPlan, getViewByIdPlan } from '../plan.api'
import { message } from 'ant-design-vue'
import FileUploadRecord from '/@/components/FileUpload/FileUploadRecord.vue'
import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue'
import dayjs from 'dayjs'
import { useUserStore } from '/@/store/modules/user'
const userStore = useUserStore()
const emit = defineEmits(['success', 'register'])
const formRef = ref()
const labelCol = { style: { width: '170px' } }
const wrapperCol = { style: { width: 'calc(100% - 170px)' } }
const state = reactive({
    loading: false,
    formState: {
        id: '',
        name: '',
        drillTime: [],
        drillType: '',
        remark: '',
    },
})
const orgCode = computed(() => {
    return userStore.currentEnterpriseCode
})
const planProps = computed(() => ({
    api: listPlan,
    labelField: 'name',
    valueField: 'id',
    params: {
        orgCode: orgCode.value
    }
}))

// 监听演练预案变化，自动获取预案类别
watch(
    () => state.formState.planId,
    async (newPlanId) => {
        if (newPlanId) {
            try {
                const planDetail = await getViewByIdPlan({ id: newPlanId })
                if (planDetail && planDetail.type) {
                    state.formState.type = planDetail.type
                }
            } catch (error) {
                console.error('获取预案详情失败:', error)
            }
        } else {
            // 如果清空了预案选择，也清空预案类别
            state.formState.type = ''
        }
    }
)

// 当前的弹窗数据
let type = ref('')
let row = ref({})
let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看'
    return `${str}应急演练`
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
    const res = await getViewByIdrill({ id: row.value.id })
    Object.assign(state.formState, res)
    state.formState.drillTime = [dayjs(res.drillDateStart), dayjs(res.drillDateEnd)]
    state.loading = false
}
const handleOk = () => {
    formRef.value.validate().then(() => {
        state.loading = true
        let params = Object.assign({},state.formState)
        if (type.value === 'add') {
            delete params.id
        }
        let [drillDateStart, drillDateEnd] = params.drillTime
        params.drillDateStart = drillDateStart
        params.drillDateEnd = drillDateEnd
        delete params.drillTime
        saveOrUpdateDrill(params)
            .then(() => {
                emit('success')
                message.success('保存成功')
                closeModal()
                resetForm()
            })
            .catch(() => {
                // message.error('保存失败,请稍后再试')
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
        drillType: '',
        remark: '',
        fileIds: [],
        planId: '',
        type: '',
        drillPersonNum: '',
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