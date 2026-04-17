<template>
  <BasicModal :title="title" :width="'92vw'" :height="700" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" :maskClosable="false" v-bind="$attrs" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full overflow-y-auto" v-loading="state.loading">
      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol"
        :disabled="readonly" autocomplete="off">
        <!-- 场景基础信息 -->
        <div class="section-title">场景基础信息</div>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="场景名称" name="name" :rules="[{ required: true, message: '请输入场景名称' }]">
              <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear :maxlength="200" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="地理位置" name="address" :rules="[{ required: true, message: '请输入地理位置' }]">
              <a-input v-model:value="state.formState.address" placeholder="请选择" allowClear :maxlength="200" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="风险等级" name="riskLevelId" :rules="[{ required: true, message: '请选择风险等级' }]">
              <JDictSelectTag v-model:value="state.formState.riskLevelId" placeholder="请选择"
                dictCode="firewatch_risk_type" />
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
        </a-row>

        <!-- 林区及周边居民区 -->
        <div class="section-title">林区及周边居民区</div>
        <div class="table-toolbar" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddVicinity">添加</a-button>
          <a-button danger @click="handleBatchDelete('vicinityList')">删除</a-button>
        </div>
        <a-table :columns="vicinityColumns" :data-source="state.formState.vicinityList" :pagination="false"
          rowKey="rowId" :row-selection="readonly ? undefined : rowSelection('vicinityList')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly"
                @click="handleDeleteRow('vicinityList', record.rowId)">删除</a-button>
              <span v-else>-</span>
            </template>
            <template v-else-if="!readonly && editableVicinityFields.includes(column.dataIndex)">
              <a-input
                v-if="['name', 'region', 'address', 'population', 'owner', 'contact', 'coverage', 'fireHistory'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" allowClear :maxlength="200" />
              <a-input-number v-else-if="['lng', 'lat', 'distance'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" :min="column.dataIndex === 'lng' ? -180 : -90"
                :max="column.dataIndex === 'lng' ? 180 : 90" :precision="6" style="width: 100%" />
            </template>
            <template v-else>
              <span>{{ record[column.dataIndex] ?? '-' }}</span>
            </template>
          </template>
        </a-table>

        <!-- 重要设施 -->
        <div class="section-title">重要设施3333</div>
        <div class="table-toolbar" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddFacility">添加</a-button>
          <a-button danger @click="handleBatchDelete('facilityList')">删除</a-button>
        </div>
        <a-table :columns="facilityColumns" :data-source="state.formState.facilityList" :pagination="false"
          rowKey="rowId" :row-selection="readonly ? undefined : rowSelection('facilityList')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly"
                @click="handleDeleteRow('facilityList', record.rowId)">删除</a-button>
              <span v-else>-</span>
            </template>
            <template v-else-if="!readonly && editableFacilityFields.includes(column.dataIndex)">
              <a-input
                v-if="['name', 'firewatchFacilityId', 'manager', 'owner', 'contact', 'fireGrade', 'cleanupRange'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" allowClear :maxlength="200" />
              <a-input-number v-else-if="['lng', 'lat', 'distance'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" :min="(column.dataIndex === 'lng' ? -180 : -90)"
                :max="column.dataIndex === 'lng' ? 180 : 90" :precision="column.dataIndex === 'year' ? 0 : 6"
                style="width: 100%" />
              <a-input-number v-else-if="column.dataIndex === 'year'" v-model:value="record[column.dataIndex]" :min="0"
                style="width: 100%" />
            </template>
            <template v-else>
              <span>{{ record[column.dataIndex] ?? '-' }}</span>
            </template>
          </template>
        </a-table>

        <!-- 生态敏感区 -->
        <div class="section-title">生态敏感区</div>
        <div class="table-toolbar" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddEcozone">添加</a-button>
          <a-button danger @click="handleBatchDelete('ecozoneList')">删除</a-button>
        </div>
        <a-table :columns="ecozoneColumns" :data-source="state.formState.ecozoneList" :pagination="false" rowKey="rowId"
          :row-selection="readonly ? undefined : rowSelection('ecozoneList')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly"
                @click="handleDeleteRow('ecozoneList', record.rowId)">删除</a-button>
              <span v-else>-</span>
            </template>
            <template v-else-if="!readonly && editableEcozoneFields.includes(column.dataIndex)">
              <a-input
                v-if="['name', 'scope', 'target', 'manager', 'owner', 'contact', 'redline'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" allowClear :maxlength="200" />
              <a-input-number v-else-if="['lng', 'lat', 'distance'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" :min="column.dataIndex === 'lng' ? -180 : -90"
                :max="column.dataIndex === 'lng' ? 180 : 90" :precision="6" style="width: 100%" />
            </template>
            <template v-else>
              <span>{{ record[column.dataIndex] ?? '-' }}</span>
            </template>
          </template>
        </a-table>

        <!-- 重点场所 -->
        <div class="section-title">重点场所</div>
        <div class="table-toolbar" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddSite">添加</a-button>
          <a-button danger @click="handleBatchDelete('siteList')">删除</a-button>
        </div>
        <a-table :columns="siteColumns" :data-source="state.formState.siteList" :pagination="false" rowKey="rowId"
          :row-selection="readonly ? undefined : rowSelection('siteList')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly"
                @click="handleDeleteRow('siteList', record.rowId)">删除</a-button>
              <span v-else>-</span>
            </template>
            <template v-else-if="!readonly && editableSiteFields.includes(column.dataIndex)">
              <a-input v-if="['name', 'address', 'manager', 'owner', 'contact', 'control'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" allowClear :maxlength="200" />
              <a-input-number v-else-if="['capacity', 'lng', 'lat', 'distance'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]"
                :min="column.dataIndex === 'capacity' ? 0 : (column.dataIndex === 'lng' ? -180 : -90)"
                :max="column.dataIndex === 'lng' ? 180 : 90" :precision="column.dataIndex === 'capacity' ? 0 : 6"
                style="width: 100%" />
              <a-select v-else-if="column.dataIndex === 'fireUse'" v-model:value="record.fireUse" style="width: 100%"
                placeholder="请选择" :options="[
                  { label: '否', value: 'N' },
                  { label: '是', value: 'Y' },
                ]" />
            </template>
            <template v-else>
              <span>{{ record[column.dataIndex] ?? '-' }}</span>
            </template>
          </template>
        </a-table>

        <!-- 应急疏散与避难 -->
        <div class="section-title">应急疏散与避难</div>
        <div class="table-toolbar" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddShelter">添加</a-button>
          <a-button danger @click="handleBatchDelete('shelterList')">删除</a-button>
        </div>
        <a-table :columns="shelterColumns" :data-source="state.formState.shelterList" :pagination="false" rowKey="rowId"
          :row-selection="readonly ? undefined : rowSelection('shelterList')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly"
                @click="handleDeleteRow('shelterList', record.rowId)">删除</a-button>
              <span v-else>-</span>
            </template>
            <template v-else-if="!readonly && editableShelterFields.includes(column.dataIndex)">
              <a-input
                v-if="['name', 'route', 'guide', 'manager', 'owner', 'contact', 'location', 'capacity', 'access'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" allowClear :maxlength="200" />
              <a-input-number v-else-if="['lng', 'lat'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" :min="column.dataIndex === 'lng' ? -180 : -90"
                :max="column.dataIndex === 'lng' ? 180 : 90" :precision="6" style="width: 100%" />
            </template>
            <template v-else>
              <span>{{ record[column.dataIndex] ?? '-' }}</span>
            </template>
          </template>
        </a-table>

        <!-- 应急物资与队伍 -->
        <div class="section-title">应急物资与队伍</div>
        <div class="table-toolbar" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddSupply">添加</a-button>
          <a-button danger @click="handleBatchDelete('supplyList')">删除</a-button>
        </div>
        <a-table :columns="supplyColumns" :data-source="state.formState.supplyList" :pagination="false" rowKey="rowId"
          :row-selection="readonly ? undefined : rowSelection('supplyList')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" danger v-if="!readonly"
                @click="handleDeleteRow('supplyList', record.rowId)">删除</a-button>
              <span v-else>-</span>
            </template>
            <template v-else-if="!readonly && editableSupplyFields.includes(column.dataIndex)">
              <a-input
                v-if="['name', 'address', 'manager', 'owner', 'contact', 'details', 'remark'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]" allowClear :maxlength="200" />
              <a-input-number v-else-if="['quantity', 'lng', 'lat', 'distance'].includes(column.dataIndex)"
                v-model:value="record[column.dataIndex]"
                :min="column.dataIndex === 'quantity' ? 0 : (column.dataIndex === 'lng' ? -180 : -90)"
                :max="column.dataIndex === 'lng' ? 180 : 90" :precision="column.dataIndex === 'quantity' ? 0 : 6"
                style="width: 100%" />
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

// 定义接口（与后端实体字段对应）
interface FirewatchInfo {
  id?: string;
  name: string;
  address: string;
  lng?: number;
  lat?: number;
  riskLevelId: string;
  // 子表数据，使用后端期望的字段名
  vicinityList: VicinityRecord[];
  facilityList: FacilityRecord[];
  ecozoneList: EcozoneRecord[];
  siteList: SiteRecord[];
  shelterList: ShelterRecord[];
  supplyList: SupplyRecord[];
}

// 林区及周边居民区
interface VicinityRecord {
  rowId: string;
  name: string;
  region: string;           // 行政区划
  address: string;          // 详细地址
  lng?: number;
  lat?: number;
  population: string;       // 常驻人口
  owner: string;            // 负责人
  contact: string;
  distance?: number;
  coverage: string;         // 林下植被覆盖度
  fireHistory: string;      // 历史火灾影响情况
  sortNum?: number;
}

// 重要设施
interface FacilityRecord {
  rowId: string;
  name: string;
  firewatchFacilityId: string; // 类型（字典ID）
  year?: number;                // 建设年代
  lng?: number;
  lat?: number;
  manager: string;
  owner: string;
  contact: string;
  distance?: number;
  fireGrade: string;            // 关键部位防火等级
  cleanupRange: string;         // 设施周边可燃物清理范围
  sortNum?: number;
}

// 生态敏感区
interface EcozoneRecord {
  rowId: string;
  name: string;
  scope: string;
  target: string;
  lng?: number;
  lat?: number;
  manager: string;
  owner: string;
  contact: string;
  distance?: number;
  redline: string;
  sortNum?: number;
}

// 重点场所
interface SiteRecord {
  rowId: string;
  name: string;
  address: string;
  capacity?: number;
  lng?: number;
  lat?: number;
  manager: string;
  owner: string;
  contact: string;
  distance?: number;
  fireUse: 'N' | 'Y';        // 是否涉及火源使用
  control: string;           // 火源管控措施信息
  sortNum?: number;
}

// 应急疏散与避难
interface ShelterRecord {
  rowId: string;
  name: string;
  route: string;             // 疏散路线图
  guide: string;             // 疏散引导员
  lng?: number;
  lat?: number;
  manager: string;
  owner: string;
  contact: string;
  location: string;          // 位置
  capacity: string;          // 容量（字符串类型）
  access: string;            // 交通可达性
  sortNum?: number;
}

// 应急物资与队伍
interface SupplyRecord {
  rowId: string;
  name: string;
  address: string;
  quantity?: number;
  lng?: number;
  lat?: number;
  manager: string;
  owner: string;
  contact: string;
  distance?: number;
  details: string;           // 详细信息
  remark: string;
  sortNum?: number;
}

const emit = defineEmits(['success', 'register']);
const formRef = ref();
const type = ref('add');
const row = ref<any>({});

const labelCol = { style: { width: '110px' } };
const wrapperCol = { style: { width: 'calc(100% - 110px)' } };

// 表格列定义（与实体字段对应）
const vicinityColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '名称', dataIndex: 'name', width: 120 },
  { title: '行政区划', dataIndex: 'region', width: 120 },
  { title: '详细地址', dataIndex: 'address', width: 150 },
  { title: '经度坐标', dataIndex: 'lng', width: 100 },
  { title: '纬度坐标', dataIndex: 'lat', width: 100 },
  { title: '常驻人口', dataIndex: 'population', width: 100 },
  { title: '负责人', dataIndex: 'owner', width: 100 },
  { title: '联系方式', dataIndex: 'contact', width: 120 },
  { title: '目标与森林距离', dataIndex: 'distance', width: 130 },
  { title: '林下植被覆盖度', dataIndex: 'coverage', width: 120 },
  { title: '历史火灾影响情况', dataIndex: 'fireHistory', width: 140 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' },
];

const facilityColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '名称', dataIndex: 'name', width: 120 },
  { title: '类型', dataIndex: 'firewatchFacilityId', width: 100 },
  { title: '建设年代', dataIndex: 'year', width: 100 },
  { title: '经度坐标', dataIndex: 'lng', width: 100 },
  { title: '纬度坐标', dataIndex: 'lat', width: 100 },
  { title: '管理单位', dataIndex: 'manager', width: 120 },
  { title: '负责人', dataIndex: 'owner', width: 100 },
  { title: '联系方式', dataIndex: 'contact', width: 120 },
  { title: '目标与森林距离', dataIndex: 'distance', width: 130 },
  { title: '关键部位防火等级', dataIndex: 'fireGrade', width: 140 },
  { title: '设施周边可燃物清理范围', dataIndex: 'cleanupRange', width: 150 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' },
];

const ecozoneColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '名称', dataIndex: 'name', width: 120 },
  { title: '保护范围', dataIndex: 'scope', width: 100 },
  { title: '保护对象', dataIndex: 'target', width: 120 },
  { title: '经度坐标', dataIndex: 'lng', width: 100 },
  { title: '纬度坐标', dataIndex: 'lat', width: 100 },
  { title: '管理单位', dataIndex: 'manager', width: 120 },
  { title: '负责人', dataIndex: 'owner', width: 100 },
  { title: '联系方式', dataIndex: 'contact', width: 120 },
  { title: '目标与森林距离', dataIndex: 'distance', width: 130 },
  { title: '红线边界', dataIndex: 'redline', width: 100 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' },
];

const siteColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '名称', dataIndex: 'name', width: 120 },
  { title: '地址', dataIndex: 'address', width: 150 },
  { title: '容纳人数', dataIndex: 'capacity', width: 100 },
  { title: '经度坐标', dataIndex: 'lng', width: 100 },
  { title: '纬度坐标', dataIndex: 'lat', width: 100 },
  { title: '管理单位', dataIndex: 'manager', width: 120 },
  { title: '负责人', dataIndex: 'owner', width: 100 },
  { title: '联系方式', dataIndex: 'contact', width: 120 },
  { title: '目标与森林距离', dataIndex: 'distance', width: 130 },
  { title: '场所是否涉及火源使用', dataIndex: 'fireUse', width: 140 },
  { title: '火源管控措施信息', dataIndex: 'control', width: 150 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' },
];

const shelterColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '名称', dataIndex: 'name', width: 120 },
  { title: '疏散路线图', dataIndex: 'route', width: 120 },
  { title: '疏散引导员', dataIndex: 'guide', width: 100 },
  { title: '经度坐标', dataIndex: 'lng', width: 100 },
  { title: '纬度坐标', dataIndex: 'lat', width: 100 },
  { title: '管理单位', dataIndex: 'manager', width: 120 },
  { title: '负责人', dataIndex: 'owner', width: 100 },
  { title: '联系方式', dataIndex: 'contact', width: 120 },
  { title: '位置', dataIndex: 'location', width: 100 },
  { title: '容量', dataIndex: 'capacity', width: 80 },
  { title: '交通可达性', dataIndex: 'access', width: 120 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' },
];

const supplyColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '名称', dataIndex: 'name', width: 120 },
  { title: '地址', dataIndex: 'address', width: 150 },
  { title: '数量', dataIndex: 'quantity', width: 80 },
  { title: '经度坐标', dataIndex: 'lng', width: 100 },
  { title: '纬度坐标', dataIndex: 'lat', width: 100 },
  { title: '管理单位', dataIndex: 'manager', width: 120 },
  { title: '负责人', dataIndex: 'owner', width: 100 },
  { title: '联系方式', dataIndex: 'contact', width: 120 },
  { title: '目标与森林距离', dataIndex: 'distance', width: 130 },
  { title: '详细信息', dataIndex: 'details', width: 150 },
  { title: '备注', dataIndex: 'remark', width: 120 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' },
];

// 可编辑字段列表（每个子表）
const editableVicinityFields = ['name', 'region', 'address', 'lng', 'lat', 'population', 'owner', 'contact', 'distance', 'coverage', 'fireHistory'];
const editableFacilityFields = ['name', 'firewatchFacilityId', 'year', 'lng', 'lat', 'manager', 'owner', 'contact', 'distance', 'fireGrade', 'cleanupRange'];
const editableEcozoneFields = ['name', 'scope', 'target', 'lng', 'lat', 'manager', 'owner', 'contact', 'distance', 'redline'];
const editableSiteFields = ['name', 'address', 'capacity', 'lng', 'lat', 'manager', 'owner', 'contact', 'distance', 'fireUse', 'control'];
const editableShelterFields = ['name', 'route', 'guide', 'lng', 'lat', 'manager', 'owner', 'contact', 'location', 'capacity', 'access'];
const editableSupplyFields = ['name', 'address', 'quantity', 'lng', 'lat', 'manager', 'owner', 'contact', 'distance', 'details', 'remark'];

// 状态管理
const state = reactive({
  loading: false,
  formState: {
    id: '',
    name: '',
    address: '',
    lng: undefined,
    lat: undefined,
    riskLevelId: '',
    vicinityList: [] as VicinityRecord[],
    facilityList: [] as FacilityRecord[],
    ecozoneList: [] as EcozoneRecord[],
    siteList: [] as SiteRecord[],
    shelterList: [] as ShelterRecord[],
    supplyList: [] as SupplyRecord[],
  } as FirewatchInfo,
});

// 当前选中行 keys（按表格区分）
const selectedRowKeys = reactive({
  vicinityList: [] as string[],
  facilityList: [] as string[],
  ecozoneList: [] as string[],
  siteList: [] as string[],
  shelterList: [] as string[],
  supplyList: [] as string[],
});

const title = computed(() => {
  const map = { add: '新增', edit: '修改', view: '查看' };
  return `${map[type.value] || '查看'} 森林防火场景`;
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
      // 为每个子表行添加 rowId
      const addRowId = (items: any[]) => items.map((item: any) => ({
        ...item,
        rowId: item.rowId || `${Date.now()}-${Math.random().toString(36)}`,
      }));
      result.vicinityList = addRowId(result.vicinityList || []);
      result.facilityList = addRowId(result.facilityList || []);
      result.ecozoneList = addRowId(result.ecozoneList || []);
      result.siteList = addRowId(result.siteList || []);
      result.shelterList = addRowId(result.shelterList || []);
      result.supplyList = addRowId(result.supplyList || []);
      Object.assign(state.formState, result);
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
    address: '',
    lng: undefined,
    lat: undefined,
    riskLevelId: '',
    vicinityList: [],
    facilityList: [],
    ecozoneList: [],
    siteList: [],
    shelterList: [],
    supplyList: [],
  };
  state.loading = false;
}

function generateRowId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 添加行函数（各子表）
function handleAddVicinity() {
  if (readonly.value) return;
  state.formState.vicinityList.push({
    rowId: generateRowId(),
    name: '',
    region: '',
    address: '',
    lng: undefined,
    lat: undefined,
    population: '',
    owner: '',
    contact: '',
    distance: undefined,
    coverage: '',
    fireHistory: '',
  });
}

function handleAddFacility() {
  if (readonly.value) return;
  state.formState.facilityList.push({
    rowId: generateRowId(),
    name: '',
    firewatchFacilityId: '',
    year: undefined,
    lng: undefined,
    lat: undefined,
    manager: '',
    owner: '',
    contact: '',
    distance: undefined,
    fireGrade: '',
    cleanupRange: '',
  });
}

function handleAddEcozone() {
  if (readonly.value) return;
  state.formState.ecozoneList.push({
    rowId: generateRowId(),
    name: '',
    scope: '',
    target: '',
    lng: undefined,
    lat: undefined,
    manager: '',
    owner: '',
    contact: '',
    distance: undefined,
    redline: '',
  });
}

function handleAddSite() {
  if (readonly.value) return;
  state.formState.siteList.push({
    rowId: generateRowId(),
    name: '',
    address: '',
    capacity: undefined,
    lng: undefined,
    lat: undefined,
    manager: '',
    owner: '',
    contact: '',
    distance: undefined,
    fireUse: 'N',
    control: '',
  });
}

function handleAddShelter() {
  if (readonly.value) return;
  state.formState.shelterList.push({
    rowId: generateRowId(),
    name: '',
    route: '',
    guide: '',
    lng: undefined,
    lat: undefined,
    manager: '',
    owner: '',
    contact: '',
    location: '',
    capacity: '',
    access: '',
  });
}

function handleAddSupply() {
  if (readonly.value) return;
  state.formState.supplyList.push({
    rowId: generateRowId(),
    name: '',
    address: '',
    quantity: undefined,
    lng: undefined,
    lat: undefined,
    manager: '',
    owner: '',
    contact: '',
    distance: undefined,
    details: '',
    remark: '',
  });
}

function handleDeleteRow(tableKey: keyof typeof selectedRowKeys, rowId: string) {
  if (readonly.value) return;
  state.formState[tableKey] = state.formState[tableKey].filter((item: any) => item.rowId !== rowId);
  selectedRowKeys[tableKey] = selectedRowKeys[tableKey].filter(id => id !== rowId);
}

function handleBatchDelete(tableKey: keyof typeof selectedRowKeys) {
  if (readonly.value || !selectedRowKeys[tableKey].length) return;
  state.formState[tableKey] = state.formState[tableKey].filter((item: any) => !selectedRowKeys[tableKey].includes(item.rowId));
  selectedRowKeys[tableKey] = [];
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
  // 构建提交参数，移除临时 rowId，使用后端期望的字段名
  const params = {
    ...state.formState,
    vicinityList: state.formState.vicinityList.map(({ rowId, ...rest }) => rest),
    facilityList: state.formState.facilityList.map(({ rowId, ...rest }) => rest),
    ecozoneList: state.formState.ecozoneList.map(({ rowId, ...rest }) => rest),
    siteList: state.formState.siteList.map(({ rowId, ...rest }) => rest),
    shelterList: state.formState.shelterList.map(({ rowId, ...rest }) => rest),
    supplyList: state.formState.supplyList.map(({ rowId, ...rest }) => rest),
  };
  if (type.value === 'add') delete params.id;

  try {
    await saveOrUpdate(params); // 请替换为实际 API
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
</style>