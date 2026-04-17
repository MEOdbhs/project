<template>
    <div class="project-detail-container">


        <a-card :title="projectName" :bordered="false">
            <!-- <div style="float: right; cursor: pointer; color: rgb(40, 92, 216);" @click="$router.back()">
          < 返回上级</div> -->
            <a-tabs v-model:activeKey="activeTab" type="card">
                <a-tab-pane key="contract" tab="企业基础信息">
                    <BasicEnterpriseInformation :projectId="projectId" />
                </a-tab-pane>
                <a-tab-pane key="cost" tab="安全管理信息">
                    <SafetyManagementInformation :projectId="projectId" />
                </a-tab-pane>
                <a-tab-pane key="archive" tab="企业危险特性">
                    <EnterpriseHazardCharacteristics :projectId="projectId" />
                </a-tab-pane>
            </a-tabs>
        </a-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BasicEnterpriseInformation from '../basicEnterpriseInformation/index.vue';   // 企业基础信息
import SafetyManagementInformation from '../safetyManagementInformation/index.vue';           // 安全管理信息
import EnterpriseHazardCharacteristics from '../enterpriseHazardCharacteristics/index.vue';     // 企业危险特性
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