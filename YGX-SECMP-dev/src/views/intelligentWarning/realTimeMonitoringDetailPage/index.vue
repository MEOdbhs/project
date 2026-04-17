<template>
    <div class="equipment-list">
        <div class="header">
            <div class="toolbar">
                <a-radio-group v-model:value="deviceType" button-style="solid" @change="handleDeviceTypeChange">
                    <a-radio-button value="sensor">传感器</a-radio-button>
                    <a-radio-button value="video">视频监控</a-radio-button>
                </a-radio-group>
            </div>
            <a-button @click="goBack">返回上一页</a-button>
        </div>
        <div class="company-info">
            <h2>{{ companyName }}</h2>
            <span class="big-type">{{ bigTypeName }}</span>
            <span class="online-count">在线数量：{{ onlineCount }}</span>

        </div>



        <!-- 搜索表单 -->
        <div class="search-form">
            <a-form layout="inline" :model="searchForm" @finish="handleSearch">
                <a-form-item>
                    <div style="display: flex;align-items: center;">
                        <div style="width: 180px;">设备名称/编号:</div>
                        <a-input v-model:value="searchForm.monitorNameAndCode" placeholder="请输入" allowClear />
                    </div>
                </a-form-item>
                <a-form-item>
                    <div style="display: flex;align-items: center;">
                        <div style="width: 120px;">在线状态:</div>
                        <a-select v-model:value="searchForm.onlineStatus" placeholder="请选择" allowClear>
                            <a-select-option value="Y">在线</a-select-option>
                            <a-select-option value="N">离线</a-select-option>
                        </a-select>
                    </div>
                </a-form-item>
                <!-- 危险化学品额外字段 -->
                <template v-if="bigType === 'chemical'">
                    <a-form-item label="是否关联重大危险源">
                        <a-select v-model:value="searchForm.majorSources" placeholder="请选择" allowClear
                            style="width: 150px">
                            <a-select-option value="Y">是</a-select-option>
                            <a-select-option value="N">否</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="重大危险源等级">
                        <a-select v-model:value="searchForm.majorLevel" placeholder="请选择" allowClear
                            style="width: 150px">
                            <a-select-option value="一级危险源">一级危险源</a-select-option>
                            <a-select-option value="二级危险源">二级危险源</a-select-option>
                            <a-select-option value="三级危险源">三级危险源</a-select-option>
                        </a-select>
                    </a-form-item>
                </template>
                <a-form-item>
                    <a-button type="primary" html-type="submit">搜索</a-button>
                    <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
                </a-form-item>
            </a-form>
        </div>

        <!-- 表格 -->
        <BasicTable @register="registerTable">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'onlineStatus'">
                    <a-tag :color="record.onlineStatus === 'Y' ? 'green' : 'red'">
                        {{ record.onlineStatus === 'Y' ? '在线' : '离线' }}
                    </a-tag>
                </template>
                <template v-else-if="column.dataIndex === 'isInUse'">
                    <a-tag :color="record.isInUse === 'Y' ? 'green' : 'red'">
                        {{ record.isInUse === 'Y' ? '在用' : '停用' }}
                    </a-tag>
                </template>
                <template v-else-if="column.dataIndex === 'majorSources'">
                    <span>{{ record.majorSources === 'Y' ? '是' : '否' }}</span>
                </template>
                <template v-else-if="column.key === 'action'">
                    <a-button type="link" @click="handleViewData(record)">查看</a-button>
                </template>
            </template>
        </BasicTable>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BasicTable, useTable } from '/@/components/Table';
import { listSensingPage } from '../realTimeMonitoring/line.api';
import { message } from 'ant-design-vue';

const route = useRoute();
const router = useRouter();

const realtimeMonitoringId = route.query.realtimeMonitoringId as string;
const bigType = route.query.bigType as string; // 'mine', 'industry', 'chemical'
const companyName = route.query.companyName as string;

const bigTypeName = computed(() => {
    if (bigType === 'mine') return '矿山';
    if (bigType === 'industry') return '工贸';
    if (bigType === 'chemical') return '危险化学品';
    return '';
});

const onlineCount = ref('0/0');
const deviceType = ref<'sensor' | 'video'>('sensor');

const searchForm = reactive({
    monitorNameAndCode: undefined,
    onlineStatus: undefined,
    majorSources: undefined,
    majorLevel: undefined,
});

// 动态生成表格列（根据行业类型和设备类型）
const getColumns = () => {
    if (deviceType.value === 'video') {
        // 视频监控模式：所有行业统一
        return [
            { title: '设备名称', dataIndex: 'deviceName', width: 150 },
            { title: '设备编号', dataIndex: 'deviceCode', width: 150 },
            { title: '安装位置', dataIndex: 'installLocation', width: 180 },
            { title: '最近采集时间', dataIndex: 'collectTime', width: 160 },
            { title: '在线状态', dataIndex: 'onlineStatus', width: 100 },
            { title: '操作', key: 'action', width: 80, fixed: 'right' },
        ];
    }

    // 传感器模式：按行业区分
    const commonColumns = [
        { title: '设备名称', dataIndex: 'deviceName', width: 150 },
        { title: '设备编号', dataIndex: 'deviceCode', width: 150 },
    ];

    if (bigType === 'monitor_category_mining') {
        // 矿山：设备名称、设备编号、安装位置、最近采集时间、在线状态、采集指标、监测数据
        commonColumns.push(
            { title: '安装位置', dataIndex: 'installLocation', width: 180 },
            { title: '最近采集时间', dataIndex: 'collectTime', width: 160 },
            { title: '在线状态', dataIndex: 'onlineStatus', width: 100 },
            { title: '采集指标', dataIndex: 'collectIndex', width: 100 },
            { title: '监测数据', key: 'action', width: 80, fixed: 'right' }
        );
    } else if (bigType === 'monitor_category_industry') {
        // 工贸：设备名称、设备编号、安装位置、最近采集时间、是否在用、采集指标、监测数据
        commonColumns.push(
            { title: '安装位置', dataIndex: 'installLocation', width: 180 },
            { title: '最近采集时间', dataIndex: 'collectTime', width: 160 },
            { title: '是否在用', dataIndex: 'isInUse', width: 100 },
            { title: '采集指标', dataIndex: 'collectIndex', width: 100 },
            { title: '监测数据', key: 'action', width: 80, fixed: 'right' }
        );
    } else if (bigType === 'monitor_category_hazchem') {
        // 危险化学品：设备名称、设备编号、是否关联重大危险源、重大危险源等级、安装位置、最近采集时间、在线状态、采集指标、监测数据
        commonColumns.push(
            { title: '是否关联重大危险源', dataIndex: 'majorSources', width: 150 },
            { title: '重大危险源等级', dataIndex: 'majorLevel', width: 150 },
            { title: '安装位置', dataIndex: 'installLocation', width: 180 },
            { title: '最近采集时间', dataIndex: 'collectTime', width: 160 },
            { title: '在线状态', dataIndex: 'onlineStatus', width: 100 },
            { title: '采集指标', dataIndex: 'collectIndex', width: 100 },
            { title: '监测数据', key: 'action', width: 80, fixed: 'right' }
        );
    }
    return commonColumns;
};

const [registerTable, { reload, setProps }] = useTable({
    api: listSensingPage,
    columns: getColumns(),
    beforeFetch: (params) => {
        return {
            ...params,
            realtimeMonitoringId,
            bigType,
            associatedDeviceId: deviceType.value === 'sensor' ? '1' : '2',
            monitorNameAndCode: searchForm.monitorNameAndCode,
            onlineStatus: searchForm.onlineStatus,
            majorSources: searchForm.majorSources,
            majorLevel: searchForm.majorLevel,
        };
    },
    pagination: { pageSize: 10 },
});

const handleDeviceTypeChange = () => {
    setProps({ columns: getColumns() });
    reload();
};

const handleSearch = () => reload();
const resetSearch = () => {
    searchForm.monitorNameAndCode = undefined;
    searchForm.onlineStatus = undefined;
    searchForm.majorSources = undefined;
    searchForm.majorLevel = undefined;
    reload();
};

const handleViewData = (record: any) => {
    console.log('查看监测数据', record);
    // 待实现：打开监测数据详情弹窗
};

const goBack = () => router.back();

const fetchOnlineCount = async () => {
    // 可选：调用接口获取在线数量，例如 /count?realtimeMonitoringId=...
    // 这里暂时模拟，可根据实际接口调整
    // onlineCount.value = '23/40';
};

onMounted(() => {
    fetchOnlineCount();
    reload();
});
</script>

<style lang="less" scoped>
.equipment-list {
    margin: 20px;
    padding: 20px;
    background: rgb(11, 28, 54);
    min-height: 100%;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;


    }

    .company-info {
        width: 100%;
        display: flex;
        gap: 20px;
        align-items: baseline;

        h2 {
            margin: 0;
            color: #fff;
        }

        .big-type {
            color: #ccc;
        }

        .online-count {
            color: #1890ff;
        }
    }

    .toolbar {
    }

    .search-form {
        background: #0a1a2f;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
    }
}
</style>