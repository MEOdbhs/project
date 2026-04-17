<template>
    <a-card :bordered="false" class="notifications-card">
        <template #title>
            <div class="card-header-box">
                <span>通知公告</span>
                <div v-if="props.pageType === 'pageConfig'" class="card-actions">
                    <Icon icon="ant-design:swap-outlined" class="action-icon" @click="handleReplace" />
                    <Icon icon="ant-design:delete-outlined" class="action-icon" @click="handleDelete" />
                </div>
                <div v-else>
                    <a-button type="link" @click="handleMore">更多</a-button>
                </div>
            </div>
        </template>

        <div class="notifications-list">
            <div v-for="(item, index) in notifications" :key="getNotificationKey(item, index)"
                class="notification-item">
                <div class="notification-content">
                    <div class="notification-title">{{ item.title }}</div>
                    <div class="notification-time">{{ item.date }}</div>
                </div>
            </div>
        </div>
        <div v-if="notifications.length === 0" class="no-data">暂无数据</div>
    </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { Icon } from '/@/components/Icon'
import { getNotice } from '../line.api'
import { useUserStore } from '/@/store/modules/user'
import { useRouter } from 'vue-router'

// ==================== 类型定义 ====================
type PageType = 'workbench' | 'pageConfig'

interface NoticeItem {
    title: string
    date: string
    id?: string | number
    [key: string]: unknown
}

interface NoticeApiParams {
    workType: 'manage' | 'average'
    orgCode: string
}

// ==================== 常量定义 ====================
const ROUTE_NOTICE = '/system/notice'
const USER_TYPE_MANAGE = 0
const WORK_TYPE_MANAGE = 'manage'
const WORK_TYPE_AVERAGE = 'average'

// ==================== Props & Emits ====================
const props = defineProps<{
    pageType: PageType
    workbenchType: 'enterprise' | 'supervision'
}>()

const emit = defineEmits<{
    replace: []
    delete: []
}>()

// ==================== 组合式函数 ====================
const router = useRouter()
const userStore = useUserStore()

// ==================== 响应式数据 ====================
const notifications = ref<NoticeItem[]>([])

// ==================== 计算/工具函数 ====================
/**
 * 获取通知项的唯一标识
 */
const getNotificationKey = (item: NoticeItem, index: number): string | number => {
    return item.id ?? item.title ?? index
}

/**
 * 获取工作类型
 */
const getWorkType = (): 'manage' | 'average' => {
    return userStore.userInfo?.userType === USER_TYPE_MANAGE
        ? WORK_TYPE_MANAGE
        : WORK_TYPE_AVERAGE
}

// ==================== 方法 ====================
/**
 * 处理"更多"按钮点击
 */
const handleMore = (): void => {
    router.push(ROUTE_NOTICE)
}

/**
 * 处理替换操作
 */
const handleReplace = (): void => {
    emit('replace')
}

/**
 * 处理删除操作
 */
const handleDelete = (): void => {
    emit('delete')
}

/**
 * 获取通知公告数据
 */
const getNoticeData = async (): Promise<void> => {
    try {
        const orgCode = userStore.currentEnterpriseCode
        if (!orgCode) {
            console.warn('企业代码为空，无法获取通知公告数据')
            return
        }
        let params = {}
        // 监管用户查看企业工作台的通知公告
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

        const res = await getNotice(params)

        if (res && Array.isArray(res)) {
            notifications.value = res
        }
    } catch (error) {
        console.error('获取通知公告数据失败:', error)
    }
}

// ==================== 生命周期 ====================
onMounted(() => {
    getNoticeData()
})

watch(
    () => userStore.currentEnterpriseCode,
    (newVal) => {
        if (newVal && props.workbenchType === 'enterprise') {
            getNoticeData()
        }
    }
)
</script>

<style lang="less" scoped>
.notifications-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #0b1c36;

    :deep(.ant-card-body) {
        flex: 1;
        overflow-y: auto;
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

    .notifications-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 600px;
    }

    .notification-item {
        padding: 8px 10px;
        border-bottom: 1px solid #303030;
        cursor: pointer;
        transition: all 0.3s;

        .notification-content {
            display: flex;
            justify-content: space-between;
            gap: 8px;

            .notification-title {
                font-size: 14px;
                color: #fff;
                line-height: 1.5;
            }

            .notification-time {
                font-size: 12px;
                color: #fff;
            }
        }
    }
}

.no-data {
    font-size: 14px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-weight: bold;
}
</style>
