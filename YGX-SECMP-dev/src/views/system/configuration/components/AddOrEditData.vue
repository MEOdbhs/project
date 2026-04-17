<template>
    <BasicModal :title="title" :width="'60vw'" :height="500" :can-fullscreen="false" :keyboard="false"
        :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
        :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
        @cancel="handleCancel">
        <div class="h-full m-t-10" v-loading="state.loading">
            <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol"
                :disabled="readonly" autocomplete="off" ref="formRef">
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="参数名" name="paramName" :rules="[{ required: true, message: '请输入参数名' }]">
                            <a-input v-model:value="state.formState.paramName" placeholder="请输入参数名" allowClear />
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item label="参数值" name="paramValue" :rules="[{ required: true, message: '请输入参数值' }]">
                            <a-input v-model:value="state.formState.paramValue" placeholder="请输入参数值" allowClear />
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item label="参数类型" name="paramTypeId" :rules="[{ required: true, message: '请选择参数类型' }]">
                            <JDictSelectTag v-model:value="state.formState.paramTypeId" placeholder="请选择" dictCode="sys_param_type" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                            label="参数编码"
                            name="paramCode"
                            :rules="[
                                { required: true, message: '请输入参数编码' },
                                {
                                    pattern: /^[^\u4e00-\u9fa5]+$/,
                                    message: '参数编码不能包含中文字符',
                                },
                            ]"
                        >
                            <a-input v-model:value="state.formState.paramCode" placeholder="请输入参数编码" allowClear />
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item label="备注" name="remark">
                            <a-textarea v-model:value="state.formState.remark" placeholder="请输入备注" rows="4"
                                allowClear />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </BasicModal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import { saveOrUpdate } from '../line.api';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '120px' } };
const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

// 参数类型选项
const parameterTypeOptions = [
    { label: '字符串', value: 'string' },
    { label: '数字', value: 'number' },
    { label: '布尔值', value: 'boolean' },
    { label: '日期', value: 'date' },
    { label: 'JSON', value: 'json' },
];

const state = reactive({
    loading: false,
    formState: {
        id: '',
        paramName: '',
        paramValue: '',
        paramTypeId: '',
        paramCode: '',
        remark: '',
    },
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
    return `${str}系统配置`;
});
let readonly = computed(() => {
    return type.value == 'view';
});

// 注册弹窗
const [registerModal, { closeModal }] = useModalInner(async (data) => {
    row.value = data.row;
    type.value = data.type;
    resetForm();
    if (type.value == 'view' || type.value == 'edit') {
        getData();
    }
});

const getData = async () => {
    state.loading = true;
    try {
        // 编辑或查看时，加载数据
        const res = { ...row.value };
        Object.assign(state.formState, res);
    } catch (error) {
        message.error('获取数据失败');
    } finally {
        state.loading = false;
    }
};

const handleOk = () => {
    formRef.value.validate().then(async () => {
        state.loading = true;
        try {
            let params = { ...state.formState,paramTypeName:state.formState.paramTypeId };
            if (type.value === 'add') {
                delete params.id;
            }

            // 调用保存接口
            await saveOrUpdate(params);
            emit('success');
            message.success('保存成功');
            closeModal();
            resetForm();
        } catch (error) {
            message.error(error.message || '保存失败');
        } finally {
            state.loading = false;
        }
    }).catch(() => {
        message.error('请检查表单填写');
    });
};

// 初始化表单值
const resetForm = () => {
    state.formState = {
        id: '',
        paramName: '',
        paramValue: '',
        paramTypeId: '',
        paramCode: '',
        remark: '',
    };
    state.loading = false;
    formRef.value?.resetFields();
};

const handleCancel = () => {
    resetForm();
};
</script>

<style lang="less" scoped></style>
