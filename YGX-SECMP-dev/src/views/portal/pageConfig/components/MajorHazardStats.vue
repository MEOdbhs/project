<template>
    <a-card v-if="userStore?.userInfo?.userType === 0 || props.workbenchType === 'enterprise'" :bordered="false"
        class="major-hazard-stats-card">
        <template #title>
            <div class="card-header-box">
                <span>重大危险源统计</span>
                <div v-if="props.pageType === 'pageConfig'" class="card-actions">
                    <Icon icon="ant-design:swap-outlined" class="action-icon" @click="handleReplace" />
                    <Icon icon="ant-design:delete-outlined" class="action-icon" @click="handleDelete" />
                </div>
            </div>
        </template>
        <div class="table-wrapper">
            <a-table :columns="columns" :data-source="dataSource" size="small" :pagination="false" row-key="id"
                :scroll="{ y: 260 }" />
        </div>
    </a-card>
    <a-card v-else :bordered="false" class="major-hazard-stats-card">
        <template #title>
            <div class="card-header-box">
                <span> 重大危险源统计</span>
                <div v-if="props.pageType === 'pageConfig'" class="card-actions">
                    <Icon icon="ant-design:swap-outlined" class="action-icon" @click="handleReplace" />
                    <Icon icon="ant-design:delete-outlined" class="action-icon" @click="handleDelete" />
                </div>
                <div v-else>
                    <a-input placeholder="企业名称" v-model:value="searchValue" @change="getHazardCountByManageData" />
                </div>
            </div>
        </template>
        <div class="table-wrapper">
            <a-table :columns="enterpriseColumns" :data-source="enterpriseDataSource" size="small" :pagination="false"
                :scroll="{ y: 260 }" row-key="id" />
        </div>
    </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '/@/store/modules/user'
import { getHazardCountByAverage, getHazardCountByManage } from '../line.api'
import { getDictTextByCode } from '/@/utils/dict'

const userStore = useUserStore()

const searchValue = ref('')

const props = defineProps<{
    pageType: 'workbench' | 'pageConfig'
    workbenchType: 'enterprise' | 'supervision'
}>()


const columns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 70 },
    {
        title: '危险源等级', dataIndex: 'hazardLevel', key: 'hazardLevel', ellipsis: true,
        customRender: ({ record }) => {
            return getDictTextByCode(record.hazardLevel, 'hs_level')
        }
    },
    { title: '危险源名称', dataIndex: 'hazardName', key: 'hazardName', ellipsis: true },
    {
        title: '危险源分类', dataIndex: 'hazardType', key: 'hazardType',
        customRender: ({ record }) => {
            return getDictTextByCode(record.hazardType, 'hs_category')
        }
    },
]

const enterpriseColumns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 70 },
    { title: '企业名称', dataIndex: 'enterpriseName', key: 'enterpriseName', ellipsis: true },
    { title: '重大危险源', dataIndex: 'hazard', key: 'hazard' },
    { title: '非重大危险源', dataIndex: 'unHazard', key: 'unHazard' },
]

const dataSource = ref<any[]>([])

const enterpriseDataSource = ref<any[]>([])

const emit = defineEmits(['replace', 'delete'])

const handleReplace = () => {
    emit('replace')
}

const handleDelete = () => {
    emit('delete')
}


/**
 * 获取企业部门危险源统计数据
 */
const getHazardCountByAverageData = async () => {
    const res = await getHazardCountByAverage({
        orgCode: userStore.currentEnterpriseCode,
    })
    if (res && Array.isArray(res)) {
        dataSource.value = res.map((item: any, index: number) => {
            return {
                id: index + 1,
                hazardLevel: item.hazardLevel,
                hazardName: item.hazardName,
                hazardType: item.hazardType,
            }
        })
    }
}

/**
 * 获取监管部门危险源统计数据
 */
const getHazardCountByManageData = async () => {
    const res = await getHazardCountByManage({
        name: searchValue.value,
    })
    if (res && Array.isArray(res)) {
        enterpriseDataSource.value = res.map((item: any, index: number) => {
            return {
                id: index + 1,
                enterpriseName: item.enterpriseName,
                hazard: item.hazard,
                unHazard: item.unHazard,
            }
        })
    }
}

onMounted(() => {
    if (userStore.userInfo?.userType === 0 || props.workbenchType === 'enterprise') {
        getHazardCountByAverageData()
    } else {
        getHazardCountByManageData()
    }
})

watch(() => userStore.currentEnterpriseCode, (newVal) => {
    if (newVal && props.workbenchType === 'enterprise') {
        getHazardCountByAverageData()
    }
})
</script>

<style lang="less" scoped>
.major-hazard-stats-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #0b1c36;

    :deep(.ant-card-body) {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
}

.card-header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-actions {
        display: flex;
        gap: 12px;

        .action-icon {
            cursor: pointer;
            font-size: 16px;
            color: #1890ff;
        }
    }
}

.table-wrapper {
    flex: 1;
    min-height: 0;
    overflow: hidden;

    :deep(.ant-table-body) {
        max-height: 100%;
        overflow-y: auto;
        padding-bottom: 12px;
        box-sizing: border-box;
    }
}
</style>
