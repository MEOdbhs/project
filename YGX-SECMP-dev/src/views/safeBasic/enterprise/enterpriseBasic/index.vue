<template>
    <div class="basic-container">

        <div class="enterprise-basic">
            <!-- 企业基础信息 -->
            <div class="section-header">
                <div class="section-title">企业基础信息</div>
                <div class="header-actions">
                    <a-space>
                        <span>企业状态</span>
                        <a-button type="primary">{{ state.enterpriseData.status === 0 ? '在用' : '停用' }}</a-button>
                        <a-button v-auth="'enterprise:edit'" @click="handleEdit">修改</a-button>
                    </a-space>
                </div>
            </div>
            <a-descriptions bordered :column="3" size="middle">
                <a-descriptions-item label="企业名称">{{ state.enterpriseData.name ?? '-' }}</a-descriptions-item>
                <a-descriptions-item label="企业编码">{{ state.enterpriseData.code ?? '-' }}</a-descriptions-item>
                <a-descriptions-item label="统一社会信用代码">{{ state.enterpriseData.creditCode ?? '-' }}</a-descriptions-item>

                <a-descriptions-item label="行政区划">{{ getDictTextByCode(state.enterpriseData.areaId, 'areaName') ||
                    '-' }}</a-descriptions-item>
                <a-descriptions-item label="法定代表人">{{ state.enterpriseData.legalPerson ?? '-' }}</a-descriptions-item>
                <a-descriptions-item label="法人手机号">{{ state.enterpriseData.legalPersonPhone ?? '-'
                }}</a-descriptions-item>

                <a-descriptions-item label="工商注册地址">{{ state.enterpriseData.registerAddress ?? '-'
                }}</a-descriptions-item>
                <a-descriptions-item label="生产场所地址">{{ state.enterpriseData.productAddress ?? '-'
                }}</a-descriptions-item>
                <!-- <a-descriptions-item label="经纬度">{{ state.enterpriseData.latAndLng }}</a-descriptions-item> -->
                <!-- longitude -->
                <!-- latitude -->
                <a-descriptions-item label="经度">{{ state.enterpriseData.latAndLng?.split(',')?.[0] ||
                    '-' }}</a-descriptions-item>
                <a-descriptions-item label="纬度">{{ state.enterpriseData.latAndLng?.split(',')?.[1] || '-'
                }}</a-descriptions-item>

                <a-descriptions-item label="边界坐标">
                    <a-button type="link" size="small" v-if="state.enterpriseData.boundary"
                        @click="handleViewMap(state.enterpriseData.boundary, '', 'enterprise')">查看地图</a-button>
                    <span v-else>-</span>
                </a-descriptions-item>
                <a-descriptions-item label="邮政编码">{{ state.enterpriseData.postalCode || '-' }}</a-descriptions-item>
                <a-descriptions-item label="成立日期">{{ state.enterpriseData.estableDate || '-' }}</a-descriptions-item>

                <a-descriptions-item label="企业面积">
                    <div class="value-with-unit">
                        <span class="value">{{ state.enterpriseData.size || '-' }}</span>
                        <span class="unit">㎡</span>
                    </div>
                </a-descriptions-item>
                <a-descriptions-item label="企业网址">{{ state.enterpriseData.website || '-' }}</a-descriptions-item>
                <a-descriptions-item label="企业规模">{{ getDictTextByCode(state.enterpriseData.scale, 'enterprise_scale')
                    ||
                    '-' }}</a-descriptions-item>

                <a-descriptions-item label="经济类型">{{
                    getDictTextByCode(state.enterpriseData.economicType, 'economic_type') || '-'
                    }}</a-descriptions-item>
                <a-descriptions-item label="所属行业">{{
                    getDictTextByCode(state.enterpriseData.industry, 'enterprise_industry') || '-'
                    }}</a-descriptions-item>
                <a-descriptions-item label="营业期限">
                    {{ businessTerm }}
                </a-descriptions-item>

                <a-descriptions-item label="注册资金">
                    <div class="value-with-unit">
                        <span class="value">{{ state.enterpriseData.capital || '-' }}</span>
                        <span class="unit">万元</span>
                    </div>
                </a-descriptions-item>
                <a-descriptions-item label="企业状态">{{ state.enterpriseData.status === 0 ? '在用' : '停用'
                    }}</a-descriptions-item>
                <a-descriptions-item label="企业类型">{{ getDictTextByCode(state.enterpriseData.type, 'enterprise_type') ||
                    '-' }}</a-descriptions-item>

                <a-descriptions-item label="主营业务或经营范围" :span="2">{{ state.enterpriseData.mainBusinessScope || '-'
                    }}</a-descriptions-item>
                <a-descriptions-item label="附件信息" :span="3">
                    <a-button type="link" size="small" @click="handleViewFiles"
                        v-if="state.enterpriseData.id">查看</a-button>
                    <span v-else>-</span>
                </a-descriptions-item>

                <template v-for="(factory, index) in state.factoryList" :key="index">
                    <a-descriptions-item :label="`厂区${index + 1}名称`">{{ factory.factoryName }}</a-descriptions-item>
                    <a-descriptions-item :label="`厂区${index + 1}编号`">{{ factory.factoryCode }}</a-descriptions-item>
                    <a-descriptions-item :label="`厂区${index + 1}地址`">{{ factory.factoryAddress }}</a-descriptions-item>

                    <a-descriptions-item :label="`厂区${index + 1}经纬度`">{{ factory.latAndLng }}</a-descriptions-item>
                    <a-descriptions-item :label="`厂区${index + 1}边界`">
                        <a-button type="link" size="small" v-if="factory.factoryBoundary"
                            @click="handleViewMap(factory.factoryBoundary, state.enterpriseData.boundary, `factory${index + 1}`)">查看地图</a-button>
                        <span v-else>-</span>
                    </a-descriptions-item>
                    <a-descriptions-item :label="`厂区${index + 1}面积`">
                        <div class="value-with-unit">
                            <span class="value">{{ factory.factorySize || '-' }}</span>
                            <span class="unit">㎡</span>
                        </div>
                    </a-descriptions-item>
                </template>
            </a-descriptions>

            <!-- 安全管理信息 -->
            <div class="section-header">
                <div class="section-title">安全管理信息</div>
            </div>
            <a-descriptions bordered :column="3" size="middle">
                <a-descriptions-item label="企业负责人">{{ state.enterpriseData.leader ?? '-' }}</a-descriptions-item>
                <a-descriptions-item label="企业负责人学历">{{ getDictTextByCode(state.enterpriseData.leaderDegree, 'degree')
                    ||
                    '-'
                }}</a-descriptions-item>
                <a-descriptions-item label="企业负责人电话">{{ state.enterpriseData.leaderPhone ?? '-' }}</a-descriptions-item>

                <a-descriptions-item label="安全责任人">{{ state.enterpriseData.safer ?? '-' }}</a-descriptions-item>
                <a-descriptions-item label="安全责任人学历">{{ getDictTextByCode(state.enterpriseData.saferDegree, 'degree') ||
                    '-'
                    }}</a-descriptions-item>
                <a-descriptions-item label="安全责任人电话">{{ state.enterpriseData.saferPhone ?? '-' }}</a-descriptions-item>

                <a-descriptions-item label="安全值班电话">{{ state.enterpriseData.dutyPhone ?? '-' }}</a-descriptions-item>
                <a-descriptions-item label="安全生产标准化等级">{{
                    getDictTextByCode(state.enterpriseData.safeLevel, 'safety_standard_level')
                    || '-' }}</a-descriptions-item>
                <a-descriptions-item label="从业人员">
                    <div class="value-with-unit">
                        <span class="value">{{ state.enterpriseData.employees || '-' }}</span>
                        <span class="unit">人</span>
                    </div>
                </a-descriptions-item>

                <a-descriptions-item label="注册安全工程师">
                    <div class="value-with-unit">
                        <span class="value">{{ state.enterpriseData.engineers || '-' }}</span>
                        <span class="unit">人</span>
                    </div>
                </a-descriptions-item>
                <a-descriptions-item label="专职安全生产管理人员">
                    <div class="value-with-unit">
                        <span class="value">{{ state.enterpriseData.fullTimeStaffs || '-' }}</span>
                        <span class="unit">人</span>
                    </div>
                </a-descriptions-item>
                <a-descriptions-item label="兼职安全生产管理人员">
                    <div class="value-with-unit">
                        <span class="value">{{ state.enterpriseData.partTimeStaffs || '-' }}</span>
                        <span class="unit">人</span>
                    </div>
                </a-descriptions-item>

                <a-descriptions-item label="两重点一重大作业人员">
                    <div class="value-with-unit">
                        <span class="value">{{ state.enterpriseData.keyOperators || '-' }}</span>
                        <span class="unit">人</span>
                    </div>
                </a-descriptions-item>
                <a-descriptions-item label="应急救援队伍专职人员">
                    <div class="value-with-unit">
                        <span class="value">{{ state.enterpriseData.emergencyFullStaffs || '-' }}</span>
                        <span class="unit">人</span>
                    </div>
                </a-descriptions-item>
                <a-descriptions-item label="应急救援队伍兼职人员">
                    <div class="value-with-unit">
                        <span class="value">{{ state.enterpriseData.emergencyPartStaffs || '-' }}</span>
                        <span class="unit">人</span>
                    </div>
                </a-descriptions-item>

                <a-descriptions-item label="剧毒化学品作业人员">
                    <div class="value-with-unit">
                        <span class="value">{{ state.enterpriseData.highlyToxicOperators || '-' }}</span>
                        <span class="unit">人</span>
                    </div>
                </a-descriptions-item>
                <a-descriptions-item label="危险化学品作业人员">
                    <div class="value-with-unit">
                        <span class="value">{{ state.enterpriseData.riskOperators || '-' }}</span>
                        <span class="unit">人</span>
                    </div>
                </a-descriptions-item>
                <a-descriptions-item label="特种作业人员">
                    <div class="value-with-unit">
                        <span class="value">{{ state.enterpriseData.specialOperators || '-' }}</span>
                        <span class="unit">人</span>
                    </div>
                </a-descriptions-item>
            </a-descriptions>

            <!-- 企业危险特性 -->
            <div class="section-header">
                <div class="section-title">企业危险特性</div>
            </div>
            <a-descriptions bordered :column="3" size="middle">
                <a-descriptions-item label="是否涉及危险等级">{{ state.enterpriseData.sourceDangerText ?? '-'
                    }}</a-descriptions-item>
                <a-descriptions-item label="最高危险源等级">{{
                    getDictTextByCode(state.enterpriseData.hightDangerLevel, 'dangerous_level')
                    || '-' }}</a-descriptions-item>
                <a-descriptions-item label="是否使用特种设备">{{ state.enterpriseData.specialEquipmentText ?? '-'
                    }}</a-descriptions-item>
                <a-descriptions-item label="特种设施种类">{{
                    getDictTextByCode(state.enterpriseData.specialEquipmentType, 'special_equipment_type') || '-'
                    }}</a-descriptions-item>
                <a-descriptions-item label="是否使用危险设备">{{ state.enterpriseData.dangerEquipmentText ?? '-'
                    }}</a-descriptions-item>
                <a-descriptions-item label="是否使用危险工艺">{{ state.enterpriseData.dangerCraftText ?? '-'
                    }}</a-descriptions-item>
            </a-descriptions>

            <div class="section-header">
                <div class="section-title">企业平面图</div>
            </div>
            <SimpleImageUpload :bizId="state.enterpriseData.subId"
                :readonly="true" />
        </div>
        <AddOrEditData @register="registerModal" @success="reload" />
        <MapModal @register="registerMapModal" />
        <FileViewModal @register="registerFileViewModal" />
    </div>
</template>

<script lang='ts' setup>
import { reactive, onMounted, watch, computed } from 'vue'
import AddOrEditData from './components/AddOrEditData.vue'
import MapModal from './components/MapModal.vue'
import FileViewModal from './components/FileViewModal.vue'
import SimpleImageUpload from '/@/components/FileUpload/SimpleImageUpload.vue'
import { useModal } from '/@/components/Modal'
import { useUserStore } from '/@/store/modules/user'
import { getViewByOrgCode } from './basic.api'
import { getDictTextByCode } from '/@/utils/dict'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
const userStore = useUserStore()

watch(() => userStore.currentEnterpriseCode, (newVal) => {
    if (newVal) {
        loadData()
    }
})

const businessTerm = computed(() => {
    if (state.enterpriseData.businessPeriod === '无期限') {
        return state.enterpriseData.estableDate + ' 至 无期限'
    } else if (state.enterpriseData.businessPeriod) {
        return state.enterpriseData.estableDate + ' 至 ' + dayjs(state.enterpriseData.estableDate).add((state.enterpriseData.businessPeriod as unknown as number), 'year').format('YYYY-MM-DD')
    }
    return '-'
})
const [registerModal, { openModal }] = useModal()
const [registerMapModal, { openModal: openMapModal }] = useModal()
const [registerFileViewModal, { openModal: openFileViewModal }] = useModal()

// 企业基础信息数据
const state = reactive({
    loading: false,
    enterpriseData: {
        // 基础信息
        id: '',
        name: '',
        businessPeriod: '',
        code: '',
        creditCode: '',
        areaId: '',
        areaName: '',
        legalPerson: '',
        legalPersonPhone: '',
        registerAddress: '',
        productAddress: '',
        latAndLng: '',
        boundary: '',
        postalCode: '',
        estableDate: '',
        size: '',
        website: '',
        scale: '',
        economicType: '',
        industry: '',
        capital: '',
        status: 0,
        type: '',
        mainBusinessScope: '',
        // 安全管理信息
        leader: '',
        leaderDegree: '',
        leaderPhone: '',
        safer: '',
        saferDegree: '',
        saferPhone: '',
        dutyPhone: '',
        safeLevel: '',
        employees: 0,
        engineers: 0,
        fullTimeStaffs: 0,
        partTimeStaffs: 0,
        keyOperators: 0,
        emergencyFullStaffs: 0,
        emergencyPartStaffs: 0,
        highlyToxicOperators: 0,
        riskOperators: 0,
        specialOperators: 0,
        // 企业危险特性
        sourceDanger: 0,
        sourceDangerText: '',
        hightDangerLevel: '',
        specialEquipment: 0,
        specialEquipmentText: '',
        specialEquipmentType: '',
        dangerEquipment: 0,
        dangerEquipmentText: '',
        dangerCraft: 0,
        dangerCraftText: '',
        subId: '',
        fileSubIds: [] as Array<any>,
        fileIds: [] as Array<any>,
        imageList: [] as Array<any>,
    },
    factoryList: [] as Array<{
        factoryName: string
        factoryCode: string
        factoryAddress: string
        latAndLng: string
        factoryBoundary: string
        factorySize: string
    }>
})

// 加载数据
const loadData = async () => {
    state.loading = true
    try {
        const res = await getViewByOrgCode({ orgCode: userStore.currentEnterpriseCode })
        state.enterpriseData = Object.assign(state.enterpriseData, res)
        state.factoryList = res.factoryList || []
        state.enterpriseData.fileSubIds = res.fileSubIds || []
        state.enterpriseData.fileIds = res.fileIds || []
    } catch (error) {
        console.error('加载数据失败', error)
        state.factoryList = []
    } finally {
        state.loading = false
    }
}

const reload = () => {
    loadData()
}

const handleEdit = () => {
    openModal(true, { type: 'edit', row: state.enterpriseData })
}

const handleViewMap = (boundary: string, locateBoundary: string, type: string) => {
    openMapModal(true, {
        mode: 'view',
        boundary: boundary,
        locateBoundary,
        type: type
    })
}


// 查看附件信息
const handleViewFiles = () => {
    if (!state.enterpriseData.id) {
        message.error('无附件信息')
        return
    }
    openFileViewModal(true, {
        bizId: state.enterpriseData.id
    })
}

onMounted(() => {
    loadData()
})
</script>

<style lang='less' scoped>
@border-color: #0446b3 !important;

.basic-container {
    padding: 10px;
}

.enterprise-basic {
    padding: 10px;
    background-color: #0b1c36;

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        &:not(:first-child) {
            margin-top: 24px;
        }
    }

    .header-actions {
        display: flex;
        align-items: center;
    }

    .section-title {
        font-size: 16px;
        font-weight: 500;
        color: #fff;
        margin: 0;
    }

    .value-with-unit {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .value {
            flex: 1;
        }

        .unit {
            position: absolute;
            right: 10px;
            color: #1890ff;
        }
    }

    :deep(.ant-descriptions-bordered) {
        border-color: @border-color !important;

        .ant-descriptions-view {
            border-color: @border-color !important;
        }

        table {
            table-layout: fixed;
            border-color: @border-color !important;
        }

        .ant-descriptions-item-label {
            background-color: #163461;
            color: #ffffffa6;
            font-weight: 400;
            width: 240px;
            min-width: 240px;
            border-color: @border-color !important;
        }

        .ant-descriptions-item-content {
            position: relative;
            width: auto;
            border-color: @border-color !important;
        }

        .ant-descriptions-row {
            border-color: @border-color !important;

            &:first-child {

                th,
                td {
                    border-top-color: @border-color !important;
                }
            }

            &:last-child {

                th,
                td {
                    border-bottom-color: @border-color !important;
                }
            }
        }

        th,
        td {
            border-color: @border-color !important;
        }

        thead tr:first-child th {
            border-top-color: @border-color !important;
        }

        tbody tr:last-child td {
            border-bottom-color: @border-color !important;
        }

        tr:first-child th:first-child,
        tr:first-child td:first-child {
            border-top-color: @border-color !important;
        }

        tr:last-child th:last-child,
        tr:last-child td:last-child {
            border-bottom-color: @border-color !important;
        }
    }

    .image-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        padding: 20px 0;

        .image-item {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 200px;

            img {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: 1px solid #0446b3;

                &:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(4, 70, 179, 0.3);
                }
            }

            .file-name {
                margin-top: 8px;
                font-size: 14px;
                color: #ffffffa6;
                text-align: center;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 0 4px;
            }
        }
    }
}
</style>