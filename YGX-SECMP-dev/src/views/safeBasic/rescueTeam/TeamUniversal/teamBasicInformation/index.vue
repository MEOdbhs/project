<template>
    <div class="project-detail-container">


        <a-card :title="projectName" :bordered="false">
            <!-- <div style="float: right; cursor: pointer; color: rgb(40, 92, 216);" @click="$router.back()">
          < 返回上级</div> -->
            <a-tabs v-model:activeKey="activeTab" type="card">
                <a-tab-pane key="contract" tab="队伍基本信息">
                    <BasicTeamInformation :projectId="projectId" />
                </a-tab-pane>
                <a-tab-pane key="cost" tab="装备配置信息">
                    <EquipmentConfigurationInformation :projectId="projectId" />
                </a-tab-pane>
                <a-tab-pane key="archive" tab="管理架构信息">
                    <ManagementArchitectureInformation :projectId="projectId" />
                </a-tab-pane>
                <a-tab-pane key="fund" tab="驻地及保障信息">
                    <ResidentAndSupportInformation :projectId="projectId" />
                </a-tab-pane>

            </a-tabs>
        </a-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BasicTeamInformation from '../BasicTeamInformation/index.vue';   // 原合同管理模块
import EquipmentConfigurationInformation from '../EquipmentConfigurationInformation/index.vue';           // 原成本管理模块
import ManagementArchitectureInformation from '../ManagementArchitectureInformation/index.vue';     // 原档案管理模块
import ResidentAndSupportInformation from '../ResidentAndSupportInformation/index.vue';           // 原资金管理模块
//   import { getProjectById } from './line.api'; // 假设有获取项目详情的接口

const route = useRoute();
const projectId = ref(route.query.id || route.params.id); // 根据路由传参方式调整
const projectName = ref('');
const activeTab = ref('contract');

onMounted(async () => {
    // if (projectId.value) {
    //   const res = await getProjectById({ id: projectId.value });
    //   projectName.value = res.projectName;
    // }
});
</script>

<style lang="less" scoped>
:deep(.ant-card) {
    padding: 12px;
    background-color: transparent;
}
:deep(.ant-card-body) {
    padding: 0px;
}
</style>