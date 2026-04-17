<template>
    <a-card :bordered="false" class="data-overview-card">
        <template #title>
            <div class="card-header-box">
                <span>数据概览</span>
                <div v-if="props.pageType === 'pageConfig'" class="card-actions">
                    <Icon icon="ant-design:swap-outlined" class="action-icon" @click="handleReplace" />
                    <Icon icon="ant-design:delete-outlined" class="action-icon" @click="handleDelete" />
                </div>
            </div>
        </template>

        <div class="overview-content">
            <!-- 个人待办 -->
            <div class="overview-item">
                <div class="item-header">
                    <div class="icon-circle icon-green">
                        <Icon size="20" icon="ant-design:check-circle-outlined" />
                    </div>
                    <span class="item-title">个人待办</span>
                </div>
                <div class="item-stats">
                    <div class="stat-item">
                        <span class="stat-value">{{ todoData.pending }}</span>
                        <span class="stat-label">待处理</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">{{ todoData.going }}</span>
                        <span class="stat-label">进行中</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">{{ todoData.unfinished }}</span>
                        <span class="stat-label">未完成</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">{{ todoData.finished }}</span>
                        <span class="stat-label">已完成</span>
                    </div>
                </div>
            </div>

            <!-- 特殊作业 -->
            <div class="overview-item">
                <div class="item-header">
                    <div class="icon-circle icon-blue">
                        <Icon size="20" icon="ant-design:tool-outlined" />
                    </div>
                    <span class="item-title">特殊作业</span>
                </div>
                <div class="item-stats special-ops">
                    <div class="stat-item" v-for="item in specialOpsData" :key="item.label">
                        <span class="stat-value">{{ item.value }}</span>
                        <span class="stat-label">{{ item.name }}</span>
                    </div>
                </div>
            </div>

            <!-- 隐患排查 -->
            <div class="overview-item"
                v-if="userStore.userInfo?.userType === 0 || props.workbenchType === 'enterprise'">
                <div class="item-header">
                    <div class="icon-circle icon-purple">
                        <Icon size="20" icon="ant-design:warning-outlined" />
                    </div>
                    <span class="item-title">隐患排查</span>
                </div>
                <div class="item-stats">
                    <div class="stat-item">
                        <span class="stat-value">{{ hazardData.planManualCount }}</span>
                        <span class="stat-label">计划排查项目</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">{{ hazardData.alreadyManualCount }}</span>
                        <span class="stat-label">已排查项目</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">{{ hazardData.pendingManualCount }}</span>
                        <span class="stat-label">未排查项目</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">{{ hazardData.hiddenDangerCount }}</span>
                        <span class="stat-label">发现隐患</span>
                    </div>
                </div>
            </div>
            <!-- 隐患排查 -->
            <div class="overview-item" v-else>
                <div class="item-header">
                    <div class="icon-circle icon-purple">
                        <Icon size="20" icon="ant-design:warning-outlined" />
                    </div>
                    <span class="item-title">企业接入</span>
                </div>
                <div class="item-stats">
                    <div class="stat-item">
                        <span class="stat-value">{{ hazardData.planManualCount }}</span>
                        <span class="stat-label">应接入</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">{{ hazardData.alreadyManualCount }}</span>
                        <span class="stat-label">已接入</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">{{ hazardData.pendingManualCount }} %</span>
                        <span class="stat-label">企业接入率</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">{{ hazardData.hiddenDangerCount }} %</span>
                        <span class="stat-label">企业在线率</span>
                    </div>
                </div>
            </div>
        </div>
    </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { Icon } from '/@/components/Icon'
import { getDataOverview } from '../line.api'
import { useUserStore } from '/@/store/modules/user'

const props = defineProps<{
    pageType: 'workbench' | 'pageConfig'
    workbenchType: 'enterprise' | 'supervision'
}>()

const userStore = useUserStore()

// 模拟数据
const emit = defineEmits(['replace', 'delete'])
const todoData = ref({
    pending: 0,
    going: 0,
    unfinished: 0,
    finished: 0
})

const specialOpsData = ref([
    {
        name: '动火作业',
        label: 'fireWork',
        value: 0
    },
    {
        name: '受限空间作业',
        label: 'restrictedWork',
        value: 0
    },
    {
        name: '盲板抽堵作业',
        label: 'blindWork',
        value: 0
    },
    {
        name: '高处作业',
        label: 'highWork',
        value: 0
    },
    {
        name: '吊装作业',
        label: 'ceilingWork',
        value: 0
    },
    {
        name: '临时用电作业',
        label: 'electricityWork',
        value: 0
    },
    {
        name: '动土作业',
        label: 'soilWork',
        value: 0
    },
    {
        name: '断路作业',
        label: 'roadWork',
        value: 0
    }
])

const hazardData = ref({
    planManualCount: 0,
    alreadyManualCount: 0,
    pendingManualCount: 0,
    hiddenDangerCount: 0
})

const handleReplace = () => {
    emit('replace')
}

const handleDelete = () => {
    emit('delete')
}

const getOverviewData = async () => {
    let params = {}
    if (userStore?.userInfo?.userType === 1 && props.workbenchType === 'supervision') {
        params = {
            workType: 'manage',
            orgCode: '',
        }
    } else {
        params = {
            workType: 'average',
            orgCode: userStore.currentEnterpriseCode,
        }
    }
    const res = await getDataOverview(params)
    const { personBlack, specialWork, enterpriseAccess } = res
    if (personBlack) {
        todoData.value.pending = personBlack.pending || 0
        todoData.value.going = personBlack.going || 0
        todoData.value.unfinished = personBlack.unfinished || 0
        todoData.value.finished = personBlack.finished || 0
    }
    if (specialWork) {
        Object.keys(specialWork).forEach(key => {
            const item = specialOpsData.value.find(i => i.label === key)
            if (item) {
                item.value = specialWork[key] || 0
            }
        })
    }
    if (props.workbenchType === 'enterprise') {
        hazardData.value.planManualCount = enterpriseAccess?.planManualCount || 0
        hazardData.value.alreadyManualCount = enterpriseAccess?.alreadyManualCount || 0
        hazardData.value.pendingManualCount = enterpriseAccess?.pendingManualCount || 0
        hazardData.value.hiddenDangerCount = enterpriseAccess?.hiddenDangerCount || 0
    }

    if (props.workbenchType === 'supervision') {
        hazardData.value.planManualCount = enterpriseAccess?.shouldAccess || 0
        hazardData.value.alreadyManualCount = enterpriseAccess?.alreadyAccess || 0
        hazardData.value.pendingManualCount = enterpriseAccess?.accessRate || 0
        hazardData.value.hiddenDangerCount = enterpriseAccess?.onlineRate || 0
    }
}

onMounted(() => {
    getOverviewData()
})

watch(() => userStore.currentEnterpriseCode, (newVal) => {
    if (newVal && props.workbenchType === 'enterprise') {
        getOverviewData()
    }
})
</script>

<style lang="less" scoped>
.data-overview-card {
    background-color: #0b1c36;
    height: 100%;
    overflow-y: auto;
    color: #fff;

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

                &:hover {
                    color: #40a9ff;
                }
            }
        }
    }

    .overview-content {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .overview-item {
        display: flex;
        gap: 12px;
        color: #fff;

        .item-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-align: center;
            margin-right: 12px;

            .icon-circle {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: #fff;

                &.icon-green {
                    background: #52c41a;
                }

                &.icon-blue {
                    background: #1890ff;
                }

                &.icon-purple {
                    background: #722ed1;
                }

                :deep(.anticon) {
                    font-size: 20px;
                }
            }

            .item-title {
                font-size: 16px;
                font-weight: 500;
                color: #fff;
            }
        }

        .item-stats {
            display: grid;
            flex: 1;
            width: 100%;
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;


            &.special-ops {
                grid-template-columns: repeat(4, 1fr);
            }

            .stat-item {
                display: flex;
                flex-direction: column;
                gap: 4px;

                .stat-label {
                    font-size: 14px;
                    text-align: center;
                    color: #fff;
                }

                .stat-value {
                    font-size: 20px;
                    font-weight: 600;
                    text-align: center;
                    color: #fff;
                }
            }
        }

        // .todo-stats {
        //       display: grid;
        //       grid-template-columns: repeat(4, 1fr);
        //     }

    }
}
</style>
