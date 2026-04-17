<template>
    <BasicModal :title="title" :width="'70vw'" :height="600" :can-fullscreen="false" :keyboard="false"
        :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
        :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
        @cancel="handleCancel">
        <div class="h-full pl-10px pr-10px" v-loading="state.loading">
            <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol"
                :disabled="readonly" autocomplete="off" ref="formRef">
                <h3 class="modal-content-title">企业基础信息</h3>
                <a-row>
                    <a-col :span="8">
                        <a-form-item label="企业名称" name="name" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="企业编码" name="code" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.code" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="统一社会信用代码" name="creditCode" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.creditCode" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="行政区划" name="areaId" :rules="[{ required: true, message: '请输入' }]">
                            <!-- <a-input v-model:value="state.formState.areaId" placeholder="请输入" allowClear>
                            </a-input> -->
                            <JDictSelectTag v-model:value="state.formState.areaId" placeholder="请选择" dictCode="areaName" :showChooseOption="false" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="法定代表人" name="legalPerson" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.legalPerson" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="法人手机" name="legalPersonPhone" :rules="[{ required: false, message: '请输入' }]">
                            <a-input v-model:value="state.formState.legalPersonPhone" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="工商注册地址" name="registerAddress" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.registerAddress" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="生产场所地址" name="productAddress" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.productAddress" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <!-- <a-col :span="8">
                        <a-form-item label="经纬度" name="latAndLng" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.latAndLng" placeholder="请输入经纬度，用逗号分隔" allowClear />
                        </a-form-item>
                    </a-col> -->
                    <a-col :span="8">
                        <a-form-item label="经度" name="longitude" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.longitude" placeholder="请输入经度" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="纬度" name="latitude" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.latitude" placeholder="请输入纬度" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="边界描绘" name="boundary" :rules="[{ required: false }]">
                            <a-input v-model:value="state.formState.boundary" placeholder="请输入" allowClear style="width: calc(100% - 64px)" />
                            <a-button type="primary" @click="openMapModal('boundary')">绘制</a-button>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="邮政编码" name="postalCode" :rules="[{ required: false, message: '请输入' }]">
                            <a-input v-model:value="state.formState.postalCode" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="成立日期" name="estableDate" :rules="[{ required: true, message: '请选择' }]">
                            <a-date-picker v-model:value="state.formState.estableDate" placeholder="请选择" allowClear style="width: 100%" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="厂区面积" name="size" :rules="[{ required: false, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.size" placeholder="请输入" :min="0" :precision="1" 
                                style="width: 100%" addon-after="m²" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="企业网址" name="website" :rules="[{ required: false, message: '请输入' }]">
                            <a-input v-model:value="state.formState.website" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="企业规模" name="scale" :rules="[{ required: false, message: '请选择' }]">
                            <JDictSelectTag v-model:value="state.formState.scale" placeholder="请选择" dictCode="enterprise_scale" :showChooseOption="false" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="经济类型" name="economicType" :rules="[{ required: true, message: '请选择' }]">
                            <JDictSelectTag v-model:value="state.formState.economicType" placeholder="请选择" dictCode="economic_type" :showChooseOption="false" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="所属行业" name="industry" :rules="[{ required: true, message: '请选择' }]">
                            <JDictSelectTag v-model:value="state.formState.industry" placeholder="请选择" dictCode="enterprise_industry" :showChooseOption="false" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="营业期限" name="businessPeriod" :rules="[{ required: false, message: '请输入' }]">
                            <a-input v-model:value="state.formState.businessPeriod" placeholder="请输入" allowClear style="width: calc(100% - 120px)" addon-after="年" @change="handleBusinessPeriodChange" />
                            <a-checkbox v-model:checked="state.formState.isUnlimited" style="margin-left: 10px;margin-top: 5px" @change="handleUnlimitedChange">无期限</a-checkbox>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="注册资金" name="capital" :rules="[{ required: false, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.capital" placeholder="请输入" :min="0" :precision="0" 
                                style="width: 100%" addon-after="万元" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="企业状态" name="status" :rules="[{ required: true, message: '请选择' }]">
                             <a-select v-model:value="state.formState.status" placeholder="请选择">
                                <a-select-option :value="0">在用</a-select-option>
                                <a-select-option :value="1">停用</a-select-option>
                             </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="企业类型" name="type" :rules="[{ required: true, message: '请选择' }]">
                            <JDictSelectTag v-model:value="state.formState.type" placeholder="请选择" dictCode="enterprise_type" :showChooseOption="false" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="16">
                        <a-form-item label="主营业务经营范围" name="mainBusinessScope" :rules="[{ required: false, message: '请输入' }]">
                            <a-textarea :rows="4" :maxlength="1000" v-model:value="state.formState.mainBusinessScope"
                                placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="附件信息">
                            <FileUploadRecord v-model:value="state.formState.fileIds" :bizId="state.formState.id" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="厂区信息">
                            <a-button type="primary" style="margin-left: 10px;margin-bottom: 10px;" @click="handleAddFactory">新增</a-button>
                            <a-table :data-source="state.formState.factoryList" :pagination="false" bordered>
                                <a-table-column title="厂区名称" dataIndex="factoryName" key="factoryName">
                                    <template #default="{ record }">
                                        <a-input v-model:value="record.factoryName" placeholder="请输入厂区名称" allowClear />
                                    </template>
                                </a-table-column>
                                <a-table-column title="厂区编码" dataIndex="factoryCode" key="factoryCode">
                                    <template #default="{ record }">
                                        <a-input v-model:value="record.factoryCode" placeholder="请输入厂区编码" allowClear />
                                    </template>
                                </a-table-column>
                                <a-table-column title="厂区地址" dataIndex="factoryAddress" key="factoryAddress">
                                    <template #default="{ record }">
                                        <a-input v-model:value="record.factoryAddress" placeholder="请输入厂区地址" allowClear />
                                    </template>
                                </a-table-column>
                                <a-table-column title="厂区经纬度" dataIndex="latAndLng" key="latAndLng">
                                    <template #default="{ record }">
                                        <a-input v-model:value="record.latAndLng" placeholder="请输入厂区经纬度" allowClear />
                                    </template>
                                </a-table-column>
                                <a-table-column title="厂区边界" dataIndex="factoryBoundary" key="factoryBoundary">
                                    <template #default="{ record, index }">
                                        <a-input v-model:value="record.factoryBoundary" placeholder="请输入厂区边界" style="width: calc(100% - 64px)" allowClear />
                                        <a-button type="primary" @click="openMapModal('factoryBoundary', index)">绘制</a-button>
                                    </template>
                                </a-table-column>
                                <a-table-column title="厂区面积(m²)" dataIndex="factorySize" key="factorySize">
                                    <template #default="{ record }">
                                        <a-input v-model:value="record.factorySize" placeholder="请输入厂区面积" allowClear />
                                    </template>
                                </a-table-column>
                                
                                <a-table-column title="操作" key="operation" width="150">
                                    <template #default="{ record, index }">
                                        <a-button type="link" size="small" danger @click="handleDeleteFactory(index)">删除</a-button>
                                    </template>
                                </a-table-column>
                        </a-table>
                        </a-form-item>
                    </a-col>
                </a-row>
                <h3 class="modal-content-title">安全管理信息</h3>
                <a-row>
                    <a-col :span="8">
                        <a-form-item label="企业负责人" name="leader" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.leader" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="企业负责人学历" name="leaderDegree"
                            :rules="[{ required: false, message: '请选择' }]">
                            <JDictSelectTag v-model:value="state.formState.leaderDegree" placeholder="请选择" dictCode="degree" :showChooseOption="false" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="企业负责人电话" name="leaderPhone"
                            :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.leaderPhone" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="安全责任人" name="safer" :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.safer" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="安全责任人学历" name="saferDegree"
                            :rules="[{ required: false, message: '请选择' }]">
                            <JDictSelectTag v-model:value="state.formState.saferDegree" placeholder="请选择" dictCode="degree" :showChooseOption="false" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="安全责任人电话" name="saferPhone"
                            :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.saferPhone" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="安全值班电话" name="dutyPhone"
                            :rules="[{ required: true, message: '请输入' }]">
                            <a-input v-model:value="state.formState.dutyPhone" placeholder="请输入" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="安全生产标准化等级" name="safeLevel"
                            :rules="[{ required: false, message: '请选择' }]">
                            <JDictSelectTag v-model:value="state.formState.safeLevel" placeholder="请选择" dictCode="safety_standard_level" :showChooseOption="false" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="从业人员" name="employees" :rules="[{ required: true, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.employees" placeholder="请输入" :min="0" :precision="0" 
                                style="width: 100%" addon-after="人" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="注册安全工程师" name="engineers"
                            :rules="[{ required: false, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.engineers" placeholder="请输入" :min="0" :precision="0"
                                style="width: 100%" addon-after="人" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="专职安全生产管理人员" name="fullTimeStaffs"
                            :rules="[{ required: false, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.fullTimeStaffs" placeholder="请输入" :min="0" :precision="0"
                                style="width: 100%" addon-after="人" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="兼职安全生产管理人员" name="partTimeStaffs"
                            :rules="[{ required: false, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.partTimeStaffs" placeholder="请输入" :min="0" :precision="0"
                                style="width: 100%" addon-after="人" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="两重点一重大作业人员" name="keyOperators"
                            :rules="[{ required: false, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.keyOperators" placeholder="请输入" :min="0" :precision="0"
                                style="width: 100%" addon-after="人" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="应急救援队伍专职人员" name="emergencyFullStaffs"
                            :rules="[{ required: false, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.emergencyFullStaffs" placeholder="请输入" :min="0" :precision="0"
                                style="width: 100%" addon-after="人" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="应急救援队伍兼职人员" name="emergencyPartStaffs"
                            :rules="[{ required: false, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.emergencyPartStaffs" placeholder="请输入" :min="0" :precision="0"
                                style="width: 100%" addon-after="人" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="剧毒化学品作业人员" name="highlyToxicOperators"
                            :rules="[{ required: false, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.highlyToxicOperators" placeholder="请输入" :min="0" :precision="0"
                                style="width: 100%" addon-after="人" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="危险化学品作业人员" name="riskOperators"
                            :rules="[{ required: false, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.riskOperators" placeholder="请输入" :min="0" :precision="0"
                                style="width: 100%" addon-after="人" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="特种作业人员" name="specialOperators"
                            :rules="[{ required: false, message: '请输入' }]">
                            <a-input-number v-model:value="state.formState.specialOperators" placeholder="请输入" :min="0" :precision="0"
                                style="width: 100%" addon-after="人" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <h3 class="modal-content-title">企业危险特性</h3>
                <a-row>
                    <a-col :span="8">
                        <a-form-item label="是否涉及危险等级" name="sourceDanger"
                            :rules="[{ required: true, message: '请选择' }]">
                            <a-radio-group v-model:value="state.formState.sourceDanger">
                                <a-radio :value="1">是</a-radio>
                                <a-radio :value="0">否</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="最高危险源等级" name="hightDangerLevel" :rules="[{ required: false, message: '请选择' }]">
                            <JDictSelectTag v-model:value="state.formState.hightDangerLevel" placeholder="请选择" dictCode="dangerous_level" :showChooseOption="false" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="是否使用特种设备" name="specialEquipment"
                            :rules="[{ required: true, message: '请选择' }]">
                            <a-radio-group v-model:value="state.formState.specialEquipment">
                                <a-radio :value="1">是</a-radio>
                                <a-radio :value="0">否</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="特种设施种类" name="specialEquipmentType"
                            :rules="[{ required: false, message: '请选择' }]">
                            <JDictSelectTag v-model:value="state.formState.specialEquipmentType" placeholder="请选择(可多选)"
                                dictCode="special_equipment_type" mode="multiple" :maxTagCount="2" :showChooseOption="false" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="是否使用危险设备" name="dangerEquipment"
                            :rules="[{ required: true, message: '请选择' }]">
                            <a-radio-group v-model:value="state.formState.dangerEquipment">
                                <a-radio :value="1">是</a-radio>
                                <a-radio :value="0">否</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="是否使用危险工艺" name="dangerCraft"
                            :rules="[{ required: true, message: '请选择' }]">
                            <a-radio-group v-model:value="state.formState.dangerCraft">
                                <a-radio :value="1">是</a-radio>
                                <a-radio :value="0">否</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                </a-row>
                <h3 class="modal-content-title">企业平面图</h3>
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="企业照片" name="企业照片" :rules="[{ required: false, message: '请上传' }]">
                            <SimpleImageUpload v-model:value="state.formState.fileSubIds" :bizId="state.formState.subId" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </BasicModal>
    <MapModal @register="registerMapModal" @success="handleMapSuccess" />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { BasicModal, useModalInner, useModal } from '/@/components/Modal'
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue'
import MapModal from './MapModal.vue'
import FileUploadRecord from '/@/components/FileUpload/FileUploadRecord.vue'
import SimpleImageUpload from '/@/components/FileUpload/SimpleImageUpload.vue'
import { saveOrUpdate, getViewByOrgCode } from '../basic.api';
import { message } from 'ant-design-vue'
import { useUserStore } from '/@/store/modules/user';
const userStore = useUserStore();
const emit = defineEmits(['success', 'register'])
const formRef = ref()
const labelCol = { style: { width: '170px' } }
const wrapperCol = { style: { width: 'calc(100% - 170px)' } }
const factoryColumns = [
    { title: '厂区名称', dataIndex: 'factoryName', key: 'factoryName' },
    { title: '厂区编码', dataIndex: 'factoryCode', key: 'factoryCode' },
    { title: '厂区地址', dataIndex: 'factoryAddress', key: 'factoryAddress' },
    { title: '厂区经纬度', dataIndex: 'latAndLng', key: 'latAndLng' },
    { title: '厂区边界', dataIndex: 'factoryBoundary', key: 'factoryBoundary' },
    { title: '操作', key: 'operation', width: 150 },
]

const state = reactive({
    loading: false,
    formState: {
        factoryList: [],
        id: '',
        // 基础信息
        name: '',
        code: '',
        creditCode: '',
        areaName: '',
        legalPerson: '',
        legalPersonPhone: '',
        registerAddress: '',
        productAddress: '',
        latAndLng: '',
        latitude:'',
        longitude:"",
        boundary: '',
        postalCode: '',
        estableDate: '',
        size: '',
        website: '',
        scale: '',
        economicType: '',
        industry: '',
        businessTerm: '',
        businessTermType: '',
        businessPeriod: '',
        isUnlimited: false,
        capital: '',
        status: '',
        type: '',
        mainBusinessScope: '',
        mainPurpose: '',
        remarks: '',
        // 安全管理信息
        leader: '',
        leaderDegree: '',
        leaderPhone: '',
        safer: '',
        saferDegree: '',
        saferPhone: '',
        dutyPhone: '',
        safeLevel: '',
        employees: '',
        engineers: '',
        fullTimeStaffs: '',
        partTimeStaffs: '',
        keyOperators: '',
        emergencyFullStaffs: '',
        emergencyPartStaffs: '',
        highlyToxicOperators: '',
        riskOperators: '',
        specialOperators: '',
        // 企业危险特性
        sourceDanger: 0,
        hightDangerLevel: '',
        specialEquipment: 0,
        specialEquipmentType: '',
        dangerEquipment: 0,
        dangerCraft: 0,
    },
})

// 当前的弹窗数据
let type = ref('')
let row = ref({})
let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看'
    return `${str}企业基础信息`
})
let readonly = computed(() => {
    return type.value == 'view'
})
// 注册弹窗
const [registerModal, { closeModal }] = useModalInner(async (data) => {
    row.value = data.row
    type.value = data.type
    resetForm()
    if (type.value == 'view' || type.value == 'edit') {
        getData()
    }
})

// 注册地图弹窗
const [registerMapModal, { openModal: openMapModalInner }] = useModal()

const getData = async () => {
    state.loading = true
    const res = await getViewByOrgCode({ orgCode: userStore.currentEnterpriseCode });
    if(res.specialEquipmentType) {
        res.specialEquipmentType = res?.specialEquipmentType?.split(',')
    }
    if(res.latAndLng) {
        res.longitude = res.latAndLng?.split(',')?.[0]
        res.latitude = res.latAndLng?.split(',')?.[1]
    }
    // 处理营业期限数据
    if (res.businessPeriod === '无期限') {
        res.isUnlimited = true
        res.businessPeriod = ''
    } else {
        res.isUnlimited = false
    }
    res.factoryList = res.factoryList ?? []
    Object.assign(state.formState, res);
    state.loading = false
}

// 处理营业期限输入框变化
const handleBusinessPeriodChange = () => {
    // 如果输入框有值，取消无期限选中
    if (state.formState.businessPeriod) {
        state.formState.isUnlimited = false
    }
}

// 处理无期限复选框变化
const handleUnlimitedChange = (e) => {
    // 如果无期限被选中，清空输入框的值
    if (e.target.checked) {
        state.formState.businessPeriod = ''
    }
}

// 新增厂区
const handleAddFactory = () => {
    state.formState.factoryList.push({
        factoryName: '',
        factoryCode: '',
        factoryAddress: '',
        latAndLng: '',
        factoryBoundary: '',
        factorySize: '',
        sort: state.formState.factoryList.length + 1
    })
}

// 删除厂区
const handleDeleteFactory = (index) => {
    state.formState.factoryList.splice(index, 1)
}

// 打开地图弹窗进行边界绘制
const currentIndex = ref(null)
const openMapModal = (type, index) => {
    currentIndex.value = index
    // 如果是厂区边界绘制且企业边界有值，传递企业边界数据用于定位
    const locateBoundary = (type === 'factoryBoundary' && state.formState.boundary) 
        ? state.formState.boundary 
        : null
    
    // 获取当前编辑的边界数据（如果存在）
    let editBoundary = null
    if (type === 'boundary' && state.formState.boundary) {
        editBoundary = state.formState.boundary
    } else if (type === 'factoryBoundary' && state.formState.factoryList[index]?.factoryBoundary) {
        editBoundary = state.formState.factoryList[index].factoryBoundary
    }
    
    openMapModalInner(true, { 
        type,
        locateBoundary,
        editBoundary // 用于编辑的边界数据
    })
}

// 处理地图返回的数据
const handleMapSuccess = (data) => {
    const { type, coordinateString } = data
    if (type === 'boundary') {
        state.formState.boundary = coordinateString
        // message.success('边界数据已保存到表单')
    }
    if (type === 'factoryBoundary') {
        state.formState.factoryList[currentIndex.value].factoryBoundary = coordinateString
    }
}

const handleOk = () => {
    formRef.value.validate().then(() => {
        state.loading = true
        let params = { ...state.formState }
        params.orgCode = userStore.currentEnterpriseCode
        
        // 处理特种设备类型
        if(params.specialEquipmentType) {
            params.specialEquipmentType = params?.specialEquipmentType?.join(',')
        } else {
            params.specialEquipmentType = ''
        }
        params.latAndLng = params.longitude + ',' + params.latitude
        // 处理营业期限数据
        if (params.isUnlimited) {
            params.businessPeriod = '无期限'
        }
        saveOrUpdate(params)
          .then(() => {
            emit('success');
            message.success('保存成功');
            closeModal();
            resetForm();
          })
          .catch(() => {
            message.error('保存失败,请稍后再试');
          })
          .finally(() => {
            state.loading = false;
          });
    })
}
// 初始化表单值
const resetForm = () => {
    // form的resetFields在部分情况下，部分表单值和校验结果无法清除重置、故用以下方式
    formRef.value.clearValidate()
    state.formState = {
        id: '',
        // 基础信息
        name: '',
        code: '',
        creditCode: '',
        areaName: '',
        legalPerson: '',
        legalPersonPhone: '',
        registerAddress: '',
        productAddress: '',
        latAndLng: '',
        latitude:'',
        longitude:"",
        boundary: '',
        postalCode: '',
        estableDate: '',
        size: '',
        website: '',
        scale: '',
        economicType: '',
        industry: '',
        businessTerm: '',
        businessTermType: '',
        businessPeriod: '',
        isUnlimited: false,
        capital: '',
        status: '',
        type: '',
        mainBusinessScope: '',
        mainPurpose: '',
        remarks: '',
        // 安全管理信息
        leader: '',
        leaderDegree: '',
        leaderPhone: '',
        safer: '',
        saferDegree: '',
        saferPhone: '',
        dutyPhone: '',
        safeLevel: '',
        employees: '',
        engineers: '',
        fullTimeStaffs: '',
        partTimeStaffs: '',
        keyOperators: '',
        emergencyFullStaffs: '',
        emergencyPartStaffs: '',
        highlyToxicOperators: '',
        riskOperators: '',
        specialOperators: '',
        // 企业危险特性
        sourceDanger: 0,
        hightDangerLevel: '',
        specialEquipment: 0,
        specialEquipmentType: '',
        dangerEquipment: 0,
        dangerCraft: 0,
        factoryList:[]
    }
    state.loading = false
}
const handleCancel = () => {
    resetForm()
};
</script>
<style lang="less" scoped>
.modal-content-title {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0 10px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(253, 253, 253, 0.12);
}
</style>