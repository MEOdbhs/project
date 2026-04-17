<template>
  <BasicModal :title="title" :width="'92vw'" :height="700" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" :maskClosable="false" v-bind="$attrs" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full overflow-y-auto" v-loading="state.loading">
      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol"
        :disabled="readonly" autocomplete="off">
        <!-- 隐患点基本信息 -->
        <div class="section-title">隐患点基本信息</div>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="隐患点名称" name="name" :rules="[{ required: true, message: '请输入隐患点名称' }]">
              <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear :maxlength="200" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="隐患点类型" name="geoHazardTypeId" :rules="[{ required: true, message: '请选择隐患点类型' }]">
              <JDictSelectTag v-model:value="state.formState.geoHazardTypeId" placeholder="请选择"
                dictCode="geo_hazard_type" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="风险等级" name="riskLevelId" :rules="[{ required: true, message: '请选择风险等级' }]">
              <JDictSelectTag v-model:value="state.formState.riskLevelId" placeholder="请选择"
                dictCode="geohazard_risk_type" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="经度坐标" name="lng" :rules="[{ required: true, message: '请输入经度' }]">
              <a-input-number v-model:value="state.formState.lng" :min="-180" :max="180" :precision="6"
                style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="纬度坐标" name="lat" :rules="[{ required: true, message: '请输入纬度' }]">
              <a-input-number v-model:value="state.formState.lat" :min="-90" :max="90" :precision="6"
                style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="地理位置" name="loc" :rules="[{ required: true, message: '请输入地理位置' }]">
              <a-input v-model:value="state.formState.loc" placeholder="请输入" allowClear :maxlength="500" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="受威胁范围面积(㎡)" name="threatArea" :rules="[{ required: true, message: '请输入受威胁范围面积' }]">
              <a-input-number v-model:value="state.formState.threatArea" :min="0" :precision="2" style="width: 100%"
                placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="危险范围边界坐标" name="boundCoords">
              <a-input v-model:value="state.formState.boundCoords" placeholder="请输入" allowClear :maxlength="200" />
            </a-form-item>
          </a-col>


        </a-row>

        <!-- 历史灾害情况 -->
        <div class="section-title">历史灾害情况</div>
        <div class="table-toolbar" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddHistory">添加</a-button>
          <a-button danger @click="handleBatchDelete('historyList')">删除</a-button>
        </div>
        <a-table :columns="historyColumns" :data-source="state.formState.historyList" :pagination="false" rowKey="rowId"
          :row-selection="readonly ? undefined : rowSelection('historyList')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly"
                @click="handleDeleteRow('historyList', record.rowId)">删除</a-button>
              <span v-else>-</span>
            </template>
            <template v-else-if="!readonly && editableHistoryFields.includes(column.dataIndex)">
              <a-date-picker v-if="column.dataIndex === 'pasthazardDt'" v-model:value="record.pasthazardDt"
                valueFormat="YYYY-MM-DD HH:mm:ss" placeholder="选择时间" style="width: 100%" />
              <a-input v-else v-model:value="record[column.dataIndex]" allowClear :maxlength="2000" />
            </template>
            <template v-else>
              <span>{{ record[column.dataIndex] ?? '-' }}</span>
            </template>
          </template>
        </a-table>

        <!-- 受威胁居民区 -->
        <div class="section-title">受威胁居民区</div>
        <a-row :gutter="24" class="summary-row">
          <a-col :span="12">
            <a-form-item label="受威胁居民区数量" name="residenceCount">
              <a-input-number v-model:value="state.formState.residenceCount" style="width: 100%" placeholder="请输入"
                allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="受威胁总户数" name="threatHouseCount">
              <a-input-number v-model:value="state.formState.threatHouseCount" style="width: 100%" placeholder="请输入"
                allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="受威胁总人口" name="threatPeopleCount">
              <a-input-number v-model:value="state.formState.threatPeopleCount" style="width: 100%" placeholder="请输入"
                allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="主要房屋结构类型" name="residenceType">
              <a-input-number v-model:value="state.formState.residenceType" style="width: 100%" placeholder="请输入"
                allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <div class="table-toolbar" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddResident">添加</a-button>
          <a-button danger @click="handleBatchDelete('residentList')">删除</a-button>
        </div>
        <a-table :columns="residentColumns" :data-source="state.formState.residentList" :pagination="false"
          rowKey="rowId" :row-selection="readonly ? undefined : rowSelection('residentList')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly"
                @click="handleDeleteRow('residentList', record.rowId)">删除</a-button>
              <span v-else>-</span>
            </template>
            <template v-else-if="!readonly && editableResidentFields.includes(column.dataIndex)">
              <a-input
                v-if="['name', 'residenceStandard', 'residenceManager', 'owner', 'contact', 'relation'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" allowClear :maxlength="200" />
              <a-input-number v-else-if="['buildYear', 'lng', 'lat'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" :precision="column.dataIndex === 'buildYear' ? 0 : 6"
                style="width: 100%" />
              <JDictSelectTag v-else-if="column.dataIndex === 'riskLevelId'" v-model:value="record.riskLevelId"
                placeholder="请选择" dictCode="geohazard_risk_type" style="width: 100%" />
              <JDictSelectTag v-else-if="column.dataIndex === 'residenceTypeId'" v-model:value="record.residenceTypeId"
                placeholder="请选择" dictCode="geohazard_fac_type" style="width: 100%" />
            </template>
            <template v-else>
              <span>{{ record[column.dataIndex] ?? '-' }}</span>
            </template>
          </template>
        </a-table>

        <!-- 重要基础设施 -->
        <div class="section-title">重要基础设施</div>
        <a-row :gutter="24" class="summary-row">
          <a-col :span="12">
            <a-form-item label="受威胁基础设施数量" name="facbaseCount">
              <a-input v-model:value="state.formState.facbaseCount" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="主要类型" name="facbaseType">
              <a-input v-model:value="state.formState.facbaseType" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <div class="table-toolbar" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddInfrastructure">添加</a-button>
          <a-button danger @click="handleBatchDelete('infrastructureList')">删除</a-button>
        </div>
        <a-table :columns="infrastructureColumns" :data-source="state.formState.infrastructureList" :pagination="false"
          rowKey="rowId" :row-selection="readonly ? undefined : rowSelection('infrastructureList')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly"
                @click="handleDeleteRow('infrastructureList', record.rowId)">删除</a-button>
              <span v-else>-</span>
            </template>
            <template v-else-if="!readonly && editableInfrastructureFields.includes(column.dataIndex)">
              <a-input
                v-if="['name', 'disResStd', 'manager', 'owner', 'contact', 'relation'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" allowClear :maxlength="200" />
              <a-input-number v-else-if="['year', 'lng', 'lat'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" :precision="column.dataIndex === 'year' ? 0 : 6"
                style="width: 100%" />
              <JDictSelectTag v-else-if="column.dataIndex === 'riskLevelId'" v-model:value="record.riskLevelId"
                placeholder="请选择" dictCode="geohazard_risk_type" style="width: 100%" />
              <JDictSelectTag v-else-if="column.dataIndex === 'facTypeId'" v-model:value="record.facTypeId"
                placeholder="请选择" dictCode="geohazard_fac_type" style="width: 100%" />
            </template>
            <template v-else>
              <span>{{ record[column.dataIndex] ?? '-' }}</span>
            </template>
          </template>
        </a-table>

        <!-- 公共服务场所 -->
        <div class="section-title">公共服务场所</div>
        <a-row :gutter="24" class="summary-row">
          <a-col :span="12">
            <a-form-item label="主要类型" name="threatenedType">
              <a-input v-model:value="state.formState.threatenedType" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="数量" name="threatenedCount">
              <a-input v-model:value="state.formState.threatenedCount" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <div class="table-toolbar" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddPublicService">添加</a-button>
          <a-button danger @click="handleBatchDelete('publicServiceList')">删除</a-button>
        </div>
        <a-table :columns="publicServiceColumns" :data-source="state.formState.publicServiceList" :pagination="false"
          rowKey="rowId" :row-selection="readonly ? undefined : rowSelection('publicServiceList')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly"
                @click="handleDeleteRow('publicServiceList', record.rowId)">删除</a-button>
              <span v-else>-</span>
            </template>
            <template v-else-if="!readonly && editablePublicServiceFields.includes(column.dataIndex)">
              <a-input
                v-if="['name', 'address', 'structdisres', 'owner', 'contact', 'relation'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" allowClear :maxlength="200" />
              <a-input-number v-else-if="['capacity', 'lng', 'lat'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]"
                :min="column.dataIndex === 'capacity' ? 0 : (column.dataIndex === 'lng' ? -180 : -90)"
                :max="column.dataIndex === 'lng' ? 180 : 90" :precision="column.dataIndex === 'capacity' ? 0 : 6"
                style="width: 100%" />
              <JDictSelectTag v-else-if="column.dataIndex === 'riskLevelId'" v-model:value="record.riskLevelId"
                placeholder="请选择" dictCode="geohazard_risk_type" style="width: 100%" />
            </template>
            <template v-else>
              <span>{{ record[column.dataIndex] ?? '-' }}</span>
            </template>
          </template>
        </a-table>

        <!-- 生产经营单位 -->
        <div class="section-title">生产经营单位</div>
        <a-row :gutter="24" class="summary-row">
          <a-col :span="8">
            <a-form-item label="受威胁单位数量" name="entityCount">
              <a-input-number v-model:value="state.formState.entityCount" placeholder="请输入" allowClear
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="主要类型" name="entityType">
              <a-input-number v-model:value="state.formState.entityType" placeholder="请输入" allowClear
                style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <div class="table-toolbar" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddProductionUnit">添加</a-button>
          <a-button danger @click="handleBatchDelete('productionUnitList')">删除</a-button>
        </div>
        <a-table :columns="productionUnitColumns" :data-source="state.formState.productionUnitList" :pagination="false"
          rowKey="rowId" :row-selection="readonly ? undefined : rowSelection('productionUnitList')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly"
                @click="handleDeleteRow('productionUnitList', record.rowId)">删除</a-button>
              <span v-else>-</span>
            </template>
            <template v-else-if="!readonly && editableProductionUnitFields.includes(column.dataIndex)">
              <a-input
                v-if="['name', 'creditCode', 'business', 'owner', 'contact', 'relation'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" allowClear :maxlength="200" />
              <a-input-number v-else-if="['staffNum', 'lng', 'lat'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]"
                :min="column.dataIndex === 'staffNum' ? 0 : (column.dataIndex === 'lng' ? -180 : -90)"
                :max="column.dataIndex === 'lng' ? 180 : 90" :precision="column.dataIndex === 'staffNum' ? 0 : 6"
                style="width: 100%" />
              <JDictSelectTag v-else-if="column.dataIndex === 'riskLevelId'" v-model:value="record.riskLevelId"
                placeholder="请选择" dictCode="geohazard_risk_type" style="width: 100%" />
            </template>
            <template v-else>
              <span>{{ record[column.dataIndex] ?? '-' }}</span>
            </template>
          </template>
        </a-table>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { saveOrUpdate, getViewById } from '../line.api'; // 请替换为实际API

// 类型定义（与后端实体完全匹配）
interface HazardPointInfo {
  id?: string;
  name: string;                     // 地质灾害场景名称
  geoHazardTypeId: string;           // 隐患点类型字典ID
  lng: number;                       // 经度
  lat: number;                       // 纬度
  loc: string;                        // 地理位置
  threatArea: number;                 // 受威胁范围(㎡)
  riskLevelId: string;                // 风险等级字典ID
  boundCoords: string;                // 威胁边界坐标
  residenceCount: string;                // 居民区数量
  facbaseCount: string;                // 基础设施数量
  // 汇总字段（设计图保留，提交时一并发送）
  threatHouseCount?: string;
  threatPeopleCount?: string;
  residenceType?: string;
  facbaseType?: string;
  threatPublicService?: string;
  threatenedType?: string;
  threatenedCount?: string;
  threatProductionUnit?: string;
  entityType?: string;
  entityCount?: string;
  // 子表
  historyList: HistoryRecord[];
  residentList: ResidentRecord[];
  infrastructureList: InfrastructureRecord[];
  publicServiceList: PublicServiceRecord[];
  productionUnitList: ProductionUnitRecord[];
}

// 历史灾害
interface HistoryRecord {
  rowId: string;
  pasthazardDt: string;              // 发生时间 (yyyy-MM-dd HH:mm:ss)
  loss: string;                       // 损失情况
  sortNum?: number;                   // 排序编号（前端自动维护）
}

// 受威胁居民区
interface ResidentRecord {
  rowId: string;
  name: string;                        // 名称
  residenceTypeId: string;              // 设施类型
  buildYear: number;                    // 建设年代
  lng: number;                          // 经度
  lat: number;                          // 纬度
  residenceStandard: string;            // 抗灾标准
  residenceManager: string;             // 管理单位
  riskLevelId: string;                  // 风险等级
  owner: string;                        // 负责人
  contact: string;                      // 联系方式
  relation: string;                     // 与隐患点位置关系
  sortNum?: number;                     // 排序编号
}

// 重要基础设施
interface InfrastructureRecord {
  rowId: string;
  name: string;                         // 名称
  facTypeId: string;                     // 设施类型字典ID
  year: number;                          // 建设年代
  lng: number;                           // 经度
  lat: number;                           // 纬度
  disResStd: string;                     // 设计抗灾标准
  riskLevelId: string;                   // 风险等级
  owner: string;                         // 运维负责人
  contact: string;                       // 联系方式
  manager: string;                       // 管理单位
  relation: string;                      // 与隐患点位置关系
  sortNum?: number;                      // 排序编号
}

// 公共服务场所
interface PublicServiceRecord {
  rowId: string;
  name: string;                          // 名称
  address: string;                       // 地址
  lng: number;                            // 经度
  lat: number;                            // 纬度
  capacity: number;                       // 容纳人数
  riskLevelId: string;                    // 风险等级
  structdisres: string;                   // 建筑结构抗灾能力
  owner: string;                          // 负责人
  contact: string;                        // 联系方式
  relation: string;                       // 与隐患点位置关系
  sortNum?: number;                       // 排序编号
}

// 生产经营单位
interface ProductionUnitRecord {
  rowId: string;
  name: string;                           // 名称
  creditCode: string;                     // 统一社会信用代码
  lng: number;                             // 经度
  lat: number;                             // 纬度
  riskLevelId: string;                     // 风险等级
  business: string;                        // 主要生产经营活动
  staffNum: number;                        // 从业人员数量
  owner: string;                           // 负责人
  contact: string;                         // 联系方式
  relation: string;                        // 与隐患点位置关系
  sortNum?: number;                        // 排序编号
}

// 列定义（与上述接口字段对应）
const historyColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '发生时间', dataIndex: 'pasthazardDt', width: 170 },
  { title: '损失情况', dataIndex: 'loss', width: 200 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' },
];

const residentColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '名称', dataIndex: 'name', width: 120 },
  { title: '设施类型', dataIndex: 'residenceTypeId', width: 100 },
  { title: '建设年代', dataIndex: 'buildYear', width: 100 },
  { title: '经度坐标', dataIndex: 'lng', width: 100 },
  { title: '纬度坐标', dataIndex: 'lat', width: 100 },
  { title: '抗灾标准', dataIndex: 'residenceStandard', width: 120 },
  { title: '管理单位', dataIndex: 'residenceManager', width: 120 },
  { title: '风险等级', dataIndex: 'riskLevelId', width: 100 },
  { title: '负责人', dataIndex: 'owner', width: 100 },
  { title: '联系方式', dataIndex: 'contact', width: 120 },
  { title: '与隐患点关系', dataIndex: 'relation', width: 130 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' },
];

const infrastructureColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '名称', dataIndex: 'name', width: 120 },
  { title: '设施类型', dataIndex: 'facTypeId', width: 100 },
  { title: '建设年代', dataIndex: 'year', width: 100 },
  { title: '经度坐标', dataIndex: 'lng', width: 100 },
  { title: '纬度坐标', dataIndex: 'lat', width: 100 },
  { title: '设计抗灾标准', dataIndex: 'disResStd', width: 130 },
  { title: '管理单位', dataIndex: 'manager', width: 120 },
  { title: '风险等级', dataIndex: 'riskLevelId', width: 100 },
  { title: '运维负责人', dataIndex: 'owner', width: 100 },
  { title: '联系方式', dataIndex: 'contact', width: 120 },
  { title: '与隐患点关系', dataIndex: 'relation', width: 130 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' },
];

const publicServiceColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '名称', dataIndex: 'name', width: 120 },
  { title: '地址', dataIndex: 'address', width: 150 },
  { title: '经度坐标', dataIndex: 'lng', width: 100 },
  { title: '纬度坐标', dataIndex: 'lat', width: 100 },
  { title: '容纳人数', dataIndex: 'capacity', width: 100 },
  { title: '风险等级', dataIndex: 'riskLevelId', width: 100 },
  { title: '建筑抗灾能力', dataIndex: 'structdisres', width: 130 },
  { title: '负责人', dataIndex: 'owner', width: 100 },
  { title: '联系方式', dataIndex: 'contact', width: 120 },
  { title: '与隐患点关系', dataIndex: 'relation', width: 130 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' },
];

const productionUnitColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '名称', dataIndex: 'name', width: 120 },
  { title: '统一社会信用代码', dataIndex: 'creditCode', width: 150 },
  { title: '经度坐标', dataIndex: 'lng', width: 100 },
  { title: '纬度坐标', dataIndex: 'lat', width: 100 },
  { title: '风险等级', dataIndex: 'riskLevelId', width: 100 },
  { title: '主要经营活动', dataIndex: 'business', width: 130 },
  { title: '从业人员', dataIndex: 'staffNum', width: 100 },
  { title: '负责人', dataIndex: 'owner', width: 100 },
  { title: '联系方式', dataIndex: 'contact', width: 120 },
  { title: '与隐患点关系', dataIndex: 'relation', width: 130 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' },
];

// 可编辑字段列表（不包括 rowId、sortNum）
const editableHistoryFields = ['pasthazardDt', 'loss'];
const editableResidentFields = ['name', 'residenceTypeId', 'buildYear', 'lng', 'lat', 'residenceStandard', 'residenceManager', 'riskLevelId', 'owner', 'contact', 'relation'];
const editableInfrastructureFields = ['name', 'facTypeId', 'year', 'lng', 'lat', 'disResStd', 'manager', 'riskLevelId', 'owner', 'contact', 'relation'];
const editablePublicServiceFields = ['name', 'address', 'lng', 'lat', 'capacity', 'riskLevelId', 'structdisres', 'owner', 'contact', 'relation'];
const editableProductionUnitFields = ['name', 'creditCode', 'lng', 'lat', 'riskLevelId', 'business', 'staffNum', 'owner', 'contact', 'relation'];

const emit = defineEmits(['success', 'register']);
const formRef = ref();
const type = ref('add');
const row = ref<any>({});

const labelCol = { style: { width: '130px' } };
const wrapperCol = { style: { width: 'calc(100% - 130px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    name: '',
    geoHazardTypeId: '',
    lng: 0,
    lat: 0,
    loc: '',
    threatArea: 0,
    riskLevelId: '',
    boundCoords: '',
    residenceCount: '',
    facbaseCount: '',
    threatHouseCount: '',
    threatPeopleCount: '',
    residenceType: '',
    facbaseType: '',
    threatPublicService: '',
    threatenedType: '',
    threatenedCount: '',
    threatProductionUnit: '',
    entityType: '',
    entityCount: '',
    historyList: [] as HistoryRecord[],
    residentList: [] as ResidentRecord[],
    infrastructureList: [] as InfrastructureRecord[],
    publicServiceList: [] as PublicServiceRecord[],
    productionUnitList: [] as ProductionUnitRecord[],
  } as HazardPointInfo,
});

const selectedRowKeys = reactive({
  historyList: [] as string[],
  residentList: [] as string[],
  infrastructureList: [] as string[],
  publicServiceList: [] as string[],
  productionUnitList: [] as string[],
});

const title = computed(() => {
  const map = { add: '新增', edit: '修改', view: '查看' };
  return `${map[type.value] || '查看'} 隐患点信息`;
});

const readonly = computed(() => type.value === 'view');

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  type.value = data.type;
  row.value = data.row || {};
  resetForm();
  if (type.value === 'add') return;
  await getData();
});

async function getData() {
  state.loading = true;
  try {
    const result = await getViewById({ id: row.value.id });
    if (result) {
      // 辅助函数：为列表添加 rowId
      const addRowId = (items: any[]) =>
        items.map(item => ({ ...item, rowId: generateRowId() }));

      // 映射后端字段名到内部字段名
      state.formState = {
        ...result,
        // 生产经营单位：后端 entityList → 内部 productionUnitList
        productionUnitList: addRowId(result.entityList || []),
        // 重要基础设施：后端 facbaseList → 内部 infrastructureList
        infrastructureList: addRowId(result.facbaseList || []),
        // 历史灾害：后端 pasthazardList → 内部 historyList
        historyList: addRowId(result.pasthazardList || []),
        // 受威胁居民区：后端 residenceList → 内部 residentList
        residentList: addRowId(result.residenceList || []),
        // 公共服务场所：后端 threatenedList → 内部 publicServiceList
        publicServiceList: addRowId(result.threatenedList || []),
      };
    }
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    state.loading = false;
  }
}

function resetForm() {
  formRef.value?.clearValidate();
  Object.keys(selectedRowKeys).forEach(key => (selectedRowKeys[key] = []));
  state.formState = {
    id: '',
    name: '',
    geoHazardTypeId: '',
    lng: 0,
    lat: 0,
    loc: '',
    threatArea: 0,
    riskLevelId: '',
    boundCoords: '',
    residenceCount: '',
    facbaseCount: '',
    threatHouseCount: '',
    threatPeopleCount: '',
    residenceType: '',
    facbaseType: '',
    threatPublicService: '',
    threatenedType: '',
    threatenedCount: '',
    threatProductionUnit: '',
    entityType: '',
    entityCount: '',
    historyList: [],
    residentList: [],
    infrastructureList: [],
    publicServiceList: [],
    productionUnitList: [],
  };
  state.loading = false;
}

function generateRowId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 添加行（自动填充 sortNum）
function handleAddHistory() {
  if (readonly.value) return;
  state.formState.historyList.push({
    rowId: generateRowId(),
    pasthazardDt: '',
    loss: '',
    sortNum: state.formState.historyList.length + 1,
  });
}

function handleAddResident() {
  if (readonly.value) return;
  state.formState.residentList.push({
    rowId: generateRowId(),
    name: '',
    residenceTypeId: '',
    buildYear: 0,
    lng: 0,
    lat: 0,
    residenceStandard: '',
    residenceManager: '',
    riskLevelId: '',
    owner: '',
    contact: '',
    relation: '',
    sortNum: state.formState.residentList.length + 1,
  });
}

function handleAddInfrastructure() {
  if (readonly.value) return;
  state.formState.infrastructureList.push({
    rowId: generateRowId(),
    name: '',
    facTypeId: '',
    year: 0,
    lng: 0,
    lat: 0,
    disResStd: '',
    manager: '',
    riskLevelId: '',
    owner: '',
    contact: '',
    relation: '',
    sortNum: state.formState.infrastructureList.length + 1,
  });
}

function handleAddPublicService() {
  if (readonly.value) return;
  state.formState.publicServiceList.push({
    rowId: generateRowId(),
    name: '',
    address: '',
    lng: 0,
    lat: 0,
    capacity: 0,
    riskLevelId: '',
    structdisres: '',
    owner: '',
    contact: '',
    relation: '',
    sortNum: state.formState.publicServiceList.length + 1,
  });
}

function handleAddProductionUnit() {
  if (readonly.value) return;
  state.formState.productionUnitList.push({
    rowId: generateRowId(),
    name: '',
    creditCode: '',
    lng: 0,
    lat: 0,
    riskLevelId: '',
    business: '',
    staffNum: 0,
    owner: '',
    contact: '',
    relation: '',
    sortNum: state.formState.productionUnitList.length + 1,
  });
}

function handleDeleteRow(tableKey: keyof typeof selectedRowKeys, rowId: string) {
  if (readonly.value) return;
  state.formState[tableKey] = state.formState[tableKey].filter((item: any) => item.rowId !== rowId);
  selectedRowKeys[tableKey] = selectedRowKeys[tableKey].filter(id => id !== rowId);
  // 重新排序 sortNum
  state.formState[tableKey].forEach((item: any, idx: number) => { item.sortNum = idx + 1; });
}

function handleBatchDelete(tableKey: keyof typeof selectedRowKeys) {
  if (readonly.value || !selectedRowKeys[tableKey].length) return;
  state.formState[tableKey] = state.formState[tableKey].filter((item: any) => !selectedRowKeys[tableKey].includes(item.rowId));
  selectedRowKeys[tableKey] = [];
  // 重新排序 sortNum
  state.formState[tableKey].forEach((item: any, idx: number) => { item.sortNum = idx + 1; });
}

function rowSelection(tableKey: keyof typeof selectedRowKeys) {
  return {
    selectedRowKeys: selectedRowKeys[tableKey],
    onChange: (keys: string[]) => {
      selectedRowKeys[tableKey] = keys;
    },
  };
}

function handleCancel() {
  resetForm();
}

async function handleOk() {
  if (readonly.value) {
    closeModal();
    return;
  }
  try {
    await formRef.value?.validate();
  } catch {
    message.error('请检查表单填写');
    return;
  }

  state.loading = true;
  // 移除临时 rowId，并映射内部字段名到后端期望的字段名
  const params = {
    ...state.formState,
    // 生产经营单位：内部 productionUnitList → 后端 entityList
    entityList: state.formState.productionUnitList.map(({ rowId, ...rest }) => rest),
    // 重要基础设施：内部 infrastructureList → 后端 facbaseList
    facbaseList: state.formState.infrastructureList.map(({ rowId, ...rest }) => rest),
    // 历史灾害：内部 historyList → 后端 pasthazardList
    pasthazardList: state.formState.historyList.map(({ rowId, ...rest }) => rest),
    // 受威胁居民区：内部 residentList → 后端 residenceList
    residenceList: state.formState.residentList.map(({ rowId, ...rest }) => rest),
    // 公共服务场所：内部 publicServiceList → 后端 threatenedList
    threatenedList: state.formState.publicServiceList.map(({ rowId, ...rest }) => rest),
  };

  // 移除内部字段名，避免重复提交
  // delete params.productionUnitList;
  // delete params.infrastructureList;
  // delete params.historyList;
  // delete params.residentList;
  // delete params.publicServiceList;

  if (type.value === 'add') delete params.id;

  try {
    await saveOrUpdate(params);
    message.success('保存成功');
    emit('success');
    closeModal();
    resetForm();
  } catch (error: any) {
    message.error(error.message || '保存失败');
  } finally {
    state.loading = false;
  }
}
</script>

<style lang="less" scoped>
.section-title {
  margin: 16px 0 12px;
  padding-left: 10px;
  border-left: 2px solid #1677ff;
  font-weight: 600;
  font-size: 16px;
}

.table-toolbar {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
}

.mr-8px {
  margin-right: 8px;
}

.summary-row {
  margin-bottom: 12px;
}
</style>