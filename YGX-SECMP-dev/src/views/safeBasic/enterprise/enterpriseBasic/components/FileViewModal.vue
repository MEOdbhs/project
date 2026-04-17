<template>
    <BasicModal
        v-bind="$attrs"
        title="附件信息"
        :width="1000"
        @register="register"
        @ok="handleOk"
        :showOkBtn="false"
        :showCancelBtn="true"
        cancelText="关闭"
    >
         
            :bizId="bizId" 
            :readonly="true"
        />
    </BasicModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
import FileUploadRecord from '/@/components/FileUpload/FileUploadRecord.vue'

const bizId = ref('')

const [register, { closeModal }] = useModalInner((data) => {
    console.log('FileViewModal 接收数据:', data)
    bizId.value = data?.bizId || ''
})

const handleOk = () => {
    closeModal()
}
</script>

<style lang="less" scoped>
</style>

