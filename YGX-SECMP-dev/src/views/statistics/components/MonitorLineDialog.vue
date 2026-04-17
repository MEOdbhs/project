<template>
    <BasicModal :width="'90vw'" :height="600" :destroyOnClose="true" :can-fullscreen="false" :maskClosable="false"
        :keyboard="false" v-bind="$attrs" cancelText="关闭" @register="registerModal" :showOkBtn="false"
        :draggable="false" :footer="null" class="monitor-line-dialog">
        <template #title>
            <div class="header-tabs">
                <div class="header-tab" :class="{ active: activeTab === 'online' }" @click="activeTab = 'online'">
                    在线监测
                </div>
                <div class="header-tab-line"></div>
                <div class="header-tab" :class="{ active: activeTab === 'warning' }" @click="activeTab = 'warning'">
                    预警信息
                </div>
                <div class="header-btn">
                    <a-button type="primary" @click="openCall">移动通讯</a-button>
                </div>
            </div>
        </template>
        <div class="h-full">
            <MonitorLine :mineInfo="mineInfo" v-if="activeTab === 'online' && mineInfo.orgCode" />
            <AlarmInfoList :mineInfo="mineInfo" v-if="activeTab === 'warning' && mineInfo.orgCode" />
        </div>
    </BasicModal>
</template>

<script setup>
import { BasicModal, useModalInner } from '/@/components/Modal'
import { ref } from 'vue'
import MonitorLine from './MonitorLine.vue'
import AlarmInfoList from './AlarmInfoList.vue'
import { message } from 'ant-design-vue'
const activeTab = ref('online')
const mineInfo = ref({})
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    mineInfo.value = data.mineInfo
    activeTab.value = 'online'
})

const openCall = () => {
    message.info('功能暂未接入，敬请期待')
}
</script>

<style lang='less' scoped>
.header-tabs {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 30px;

    .header-tab {
        cursor: pointer;

        &.active {
            color: #177dcc;
        }
    }
}

.header-tab-line {
    width: 2px;
    height: 16px;
    background-color: #fff;
}

.header-btn {
    margin-left: auto;
    margin-right: 40px;
}

:deep(.ant-modal-body) {
    .scroll-container .scrollbar__wrap {
        margin-bottom: 0 !important;
    }
}

:deep .ant-modal .ant-modal-close {
    top: 9px;
}
</style>