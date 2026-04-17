<template>
    <BasicModal :title="title" :width="'60vw'" :height="250" :destroyOnClose="true" :can-fullscreen="false" :maskClosable="false"
        :keyboard="false" v-bind="$attrs" okText="确定" cancelText="关闭" @register="registerModal"
        :showOkBtn="type !== 'view'">
        <div class="pl-10px pr-10px h-full" v-loading="state.loading">
           <a-descriptions bordered :column="2" size="middle">
                <a-descriptions-item label="账号">{{ state.formData.username }}</a-descriptions-item>
                <a-descriptions-item label="姓名">{{ state.formData.realname }}</a-descriptions-item>
                <a-descriptions-item label="联系方式">{{ state.formData.phone }}</a-descriptions-item>
                <a-descriptions-item label="角色">{{ state.formData.roleNames }}</a-descriptions-item>
                <a-descriptions-item label="部门">{{ state.formData.orgCodeTxt }}</a-descriptions-item>
                <a-descriptions-item label="邮箱">{{ state.formData.email }}</a-descriptions-item>
                <a-descriptions-item label="备注">{{ state.formData.remark }}</a-descriptions-item>
           </a-descriptions>
        </div>
    </BasicModal>
</template>

<script setup>
import { ref, reactive, unref, nextTick, onMounted } from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
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
    state.loading = true
    type.value = data.type
    isUpdate.value = !!data?.isUpdate
    state.formData = data.row
    title.value =  `查看详情`
    state.loading = false
})

onMounted(() => {

})
</script>
<style lang="less" scoped>

</style>