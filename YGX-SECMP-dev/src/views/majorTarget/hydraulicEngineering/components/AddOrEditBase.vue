<template>
  <BasicModal :title="title" :width="'80vw'" :height="700" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" :maskClosable="false" v-bind="$attrs" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full overflow-y-auto" v-loading="state.loading">
      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol"
        :disabled="readonly" autocomplete="off">
        <!-- 工程基本信息 -->
        <div class="section-title">工程基本信息</div>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="工程编号" name="no">
              <a-input v-model:value="state.formState.no" placeholder="自动生成" :disabled="true" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="工程名称" name="name" :rules="[{ required: true, message: '请输入工程名称' }]">
              <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="工程类型" name="waterprojTypeId" :rules="[{ required: true, message: '请选择工程类型' }]">
              <JDictSelectTag v-model:value="state.formState.waterprojTypeId" placeholder="请选择"
                dictCode="waterproj_type" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="地理位置" name="loc" :rules="[{ required: true, message: '请输入地理位置' }]">
              <a-input v-model:value="state.formState.loc" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="经度" name="lng" :rules="[{ required: true, message: '请输入经度' }]">
              <a-input-number v-model:value="state.formState.lng" :precision="6" style="width: 100%"
                placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="纬度" name="lat" :rules="[{ required: true, message: '请输入纬度' }]">
              <a-input-number v-model:value="state.formState.lat" :precision="6" style="width: 100%"
                placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 工程地理位置图 -->
        <a-row :gutter="24" class="m-t-10">
          <a-col :span="24">
            <a-form-item label="工程地理位置图" label-align="left">
              <div class="map-preview">
                <iframe v-if="mapPreviewUrl" :src="mapPreviewUrl" frameborder="0"
                  style="width: 100%; height: 240px; border-radius: 4px;" allowfullscreen></iframe>
                <div v-else class="image-placeholder">请输入有效的经纬度</div>
              </div>
              <a-button type="link" @click="handleViewMap">点击查看大图</a-button>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 排水闸参数信息 -->
        <div class="section-title" v-if="state.formState.waterprojTypeId === 'waterproj_type_sluice'">排水闸参数信息</div>
        <a-row :gutter="24" v-if="state.formState.waterprojTypeId === 'waterproj_type_sluice'">
          <a-col :span="8">
            <a-form-item label="涵闸类型" name="sluiceTypeId">
              <a-input v-model:value="state.formState.sluiceTypeId" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="孔径(米)" name="aperture">
              <a-input-number v-model:value="state.formState.aperture" :min="0" :precision="2" style="width: 100%"
                placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="净高(米)" name="netHeight">
              <a-input-number v-model:value="state.formState.netHeight" :min="0" :precision="2" style="width: 100%"
                placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="启闭方式" name="switchMode">
              <a-input v-model:value="state.formState.switchMode" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="设计过流能力" name="flowCap">
              <a-input-number v-model:value="state.formState.flowCap" :min="0" :precision="2" style="width: 100%"
                placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 水电站参数信息 -->
        <div class="section-title" v-if="state.formState.waterprojTypeId === 'waterproj_type_hydro'">水电站参数信息</div>
        <a-row :gutter="24" v-if="state.formState.waterprojTypeId === 'waterproj_type_hydro'">
          <a-col :span="12">
            <a-form-item label="装机容量" name="installCap" :rules="[{ required: true, message: '请输入排水闸参数信息' }]">
              <a-input-number v-model:value="state.formState.installCap" :min="0" style="width: 100%"
                placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="泄洪设施规格" name="dischargeFacilitySpec"
              :rules="[{ required: true, message: '请输入泄洪设施规格' }]">
              <a-input v-model:value="state.formState.dischargeFacilitySpec" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 跨河大桥参数信息 -->
        <div class="section-title" v-if="state.formState.waterprojTypeId === 'waterproj_type_bridge'">跨河大桥参数信息</div>
        <a-row :gutter="24" v-if="state.formState.waterprojTypeId === 'waterproj_type_bridge'">
          <a-col :span="12">
            <a-form-item label="跨河大桥类型" name="bridgeType" :rules="[{ required: true, message: '请输入跨河大桥类型' }]">
              <a-input v-model:value="state.formState.bridgeType" style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="跨河大桥跨度" name="spanLength" :rules="[{ required: true, message: '请输入跨河大桥跨度' }]">
              <a-input-number v-model:value="state.formState.spanLength" style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="梁底高程" name="beamElevation" :rules="[{ required: true, message: '请输入梁底高程' }]">
              <a-input-number v-model:value="state.formState.beamElevation" style="width: 100%" placeholder="请输入"
                allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="与河道水位关系" name="waterRelation" :rules="[{ required: true, message: '请输入与河道水位关系' }]">
              <a-input v-model:value="state.formState.waterRelation" style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 建设及运营主体 -->
        <div class="section-title">建设及运营主体</div>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="责任单位全称" name="dutyUnit">
              <a-input v-model:value="state.formState.dutyUnit" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="法定代表人" name="legalPrsn">
              <a-input v-model:value="state.formState.legalPrsn" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="分管负责人" name="chargePrsn">
              <a-input v-model:value="state.formState.chargePrsn" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系电话" name="contact">
              <a-input v-model:value="state.formState.contact" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="运维单位" name="oprUnit">
              <a-input v-model:value="state.formState.oprUnit" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="运维人员" name="oprPrsn">
              <a-input v-model:value="state.formState.oprPrsn" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" name="remark">
              <a-textarea v-model:value="state.formState.remark" placeholder="请输入" :rows="2" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 建设及现状概况 -->
        <div class="section-title">建设及现状概况</div>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="建设时间" name="buildTime">
              <a-date-picker v-model:value="state.formState.buildTime" valueFormat="YYYY-MM-DD" placeholder="请选择"
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="投入使用时间" name="useTime">
              <a-date-picker v-model:value="state.formState.useTime" valueFormat="YYYY-MM-DD" placeholder="请选择"
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设计标准" name="designStd">
              <a-input v-model:value="state.formState.designStd" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运行状态" name="waterprojStatusId">
              <JDictSelectTag v-model:value="state.formState.waterprojStatusId" placeholder="请选择"
                dictCode="waterproj_status_type" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="现状概况" name="statusDesc">
              <a-textarea v-model:value="state.formState.statusDesc" placeholder="请输入" :rows="2" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 改造升级记录 -->
        <div class="section-title">改造升级记录</div>
        <div class="table-toolbar" v-if="!readonly">
          <a-button type="primary" class="mr-8px" @click="handleAddRenovation">添加</a-button>
          <a-button danger @click="handleBatchDeleteRenovation">删除</a-button>
        </div>
        <a-table :columns="renovationColumns" :data-source="state.formState.renovationList" :pagination="false"
          rowKey="rowId" :row-selection="readonly ? undefined : rowSelection">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" size="small" v-if="!readonly" @click="handleEditRenovation(record)">编辑</a-button>
              <a-button type="link" danger size="small" v-if="!readonly"
                @click="handleDeleteRenovation(record.rowId)">删除</a-button>
              <span v-else>-</span>
            </template>
            <template v-else-if="column.dataIndex === 'renovModeId'">
              <JDictSelectTag :disabled="true" v-model:value="record.renovModeId" placeholder="请选择"
                dictCode="waterproj_renov_mode" />
            </template>
            <template v-else>
              <span>{{ record[column.dataIndex] ?? '-' }}</span>
            </template>
          </template>
        </a-table>
      </a-form>
    </div>

    <!-- 改造记录编辑弹窗 -->
    <BasicModal v-if="!readonly" :title="renovModalTitle" :width="500" :can-fullscreen="false"
      @register="registerRenovModal" @ok="handleRenovOk">
      <a-form ref="renovFormRef" :model="renovForm" :label-col="{ style: { width: '100px' } }"
        :wrapper-col="{ style: { width: 'calc(100% - 100px)' } }">
        <a-form-item label="改造原因" name="renovReason" :rules="[{ required: true, message: '请输入改造原因' }]">
          <a-input v-model:value="renovForm.renovReason" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="改造方式" name="renovModeId" :rules="[{ required: true, message: '请选择改造方式' }]">
          <JDictSelectTag v-model:value="renovForm.renovModeId" placeholder="请选择" dictCode="waterproj_renov_mode" />
        </a-form-item>
        <a-form-item label="改造时间" name="renovDt" :rules="[{ required: true, message: '请选择改造时间' }]">
          <a-date-picker v-model:value="renovForm.renovDt" valueFormat="YYYY-MM-DD HH:mm:ss" show-time placeholder="请选择"
            style="width: 100%" />
        </a-form-item>
      </a-form>
    </BasicModal>
    <BasicModal :title="'工程地理位置图'" :width="'90vw'" :can-fullscreen="false" :keyboard="false" :destroy-on-close="true"
      :maskClosable="false" @register="registerMapModal" :footer="null" :closable="true">
      <iframe v-if="mapFullUrl" :src="mapFullUrl" frameborder="0"
        style="width: 100%; height: calc(90vh - 100px); border-radius: 4px;" allowfullscreen></iframe>
      <div v-else style="text-align: center; padding: 50px;">请输入有效的经纬度</div>
    </BasicModal>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { message } from 'ant-design-vue';
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { saveOrUpdateBase, getBaseViewById } from '../line.api';

// 类型定义
interface RenovationRecord {
  rowId: string;
  id?: string;
  waterprojId?: string;
  renovReason: string;
  renovModeId: string;
  renovDt: string;
}

// ---------- 定义 state（必须在所有使用 state 的代码之前） ----------
const state = reactive({
  loading: false,
  formState: {
    id: '',
    no: '',
    name: '',
    waterprojTypeId: '',
    loc: '',
    lng: 0,
    lat: 0,
    sluiceTypeId: '',
    aperture: 0,
    netHeight: 0,
    switchMode: '',
    installCap: 0,
    dischargeFacilitySpec: '',
    flowCap: 0,
    dutyUnit: '',
    legalPrsn: '',
    chargePrsn: '',
    contact: '',
    oprUnit: '',
    oprPrsn: '',
    bridgeType: '',
    spanLength: 0,
    waterRelation: '',
    beamElevation: 0,
    buildTime: '',
    useTime: '',
    designStd: '',
    waterprojStatusId: '',
    statusDesc: '',
    remark: '',
    renovationList: [] as RenovationRecord[],
  },
});

// ---------- 防抖处理经纬度 ----------
function debounce(fn: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 防抖后的经纬度（用于地图预览）
const debouncedLng = ref(0);
const debouncedLat = ref(0);

// 更新防抖经纬度的函数（防抖包装）
const updateDebouncedPosition = debounce(() => {
  debouncedLng.value = state.formState.lng;
  debouncedLat.value = state.formState.lat;
}, 800);

// 监听原始经纬度变化，触发防抖更新
watch(
  () => [state.formState.lng, state.formState.lat],
  () => {
    updateDebouncedPosition();
  },
  { deep: true }
);

// 注册全屏地图弹窗
const [registerMapModal, { openModal: openMapModal }] = useModal();

// 计算地图预览URL（使用防抖后的经纬度）
const mapPreviewUrl = computed(() => {
  const lng = debouncedLng.value;
  const lat = debouncedLat.value;
  if (lng != null && lat != null && !isNaN(lng) && !isNaN(lat)) {
    return `https://uri.amap.com/marker?position=${lng},${lat}`;
  }
  return '';
});

// 全屏地图URL（使用防抖后的经纬度）
const mapFullUrl = computed(() => {
  const lng = debouncedLng.value;
  const lat = debouncedLat.value;
  if (lng != null && lat != null && !isNaN(lng) && !isNaN(lat)) {
    return `https://uri.amap.com/marker?position=${lng},${lat}`;
  }
  return '';
});

// 查看大图（使用防抖后的坐标）
function handleViewMap() {
  const lng = debouncedLng.value;
  const lat = debouncedLat.value;
  if (!lng || !lat) {
    message.warning('请先填写有效的经纬度');
    return;
  }
  openMapModal(true);
}

// 列定义
const renovationColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '改造原因', dataIndex: 'renovReason', width: 200 },
  { title: '改造方式', dataIndex: 'renovModeId', width: 120 },
  { title: '改造时间', dataIndex: 'renovDt', width: 150 },
  { title: '操作', dataIndex: 'action', width: 120, fixed: 'right' },
];

const emit = defineEmits(['success', 'register']);
const formRef = ref();
const renovFormRef = ref();

const labelCol = { style: { width: '130px' } };
const wrapperCol = { style: { width: 'calc(100% - 130px)' } };

// 当前操作类型
const type = ref('add');
const row = ref<any>({});

const title = computed(() => {
  const map = { add: '新增', edit: '编辑', view: '查看' };
  return `${map[type.value] || '查看'} 水利工程`;
});

const readonly = computed(() => type.value === 'view');

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  type.value = data.type;
  row.value = data.row || {};
  resetForm();
  if (type.value === 'add') {
    state.formState.no = '';
  } else {
    await getData();
  }
});

async function getData() {
  state.loading = true;
  try {
    const result = await getBaseViewById({ id: row.value.id });
    if (result) {
      const renovationList = (result.renovationList || []).map((item: any) => ({
        ...item,
        rowId: generateRowId(),
      }));
      Object.assign(state.formState, result, { renovationList });
      // 重置防抖坐标为实际值（避免编辑时地图显示旧坐标）
      debouncedLng.value = result.lng || 0;
      debouncedLat.value = result.lat || 0;
    }
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    state.loading = false;
  }
}

function resetForm() {
  formRef.value?.clearValidate();
  state.formState = {
    id: '',
    no: '',
    name: '',
    waterprojTypeId: '',
    loc: '',
    lng: 0,
    lat: 0,
    sluiceTypeId: '',
    aperture: 0,
    netHeight: 0,
    switchMode: '',
    installCap: 0,
    dischargeFacilitySpec: '',
    flowCap: 0,
    dutyUnit: '',
    legalPrsn: '',
    chargePrsn: '',
    contact: '',
    oprUnit: '',
    oprPrsn: '',
    bridgeType: '',
    spanLength: 0,
    waterRelation: '',
    beamElevation: 0,
    buildTime: '',
    useTime: '',
    designStd: '',
    waterprojStatusId: '',
    statusDesc: '',
    remark: '',
    renovationList: [],
  };
  // 重置防抖坐标
  debouncedLng.value = 0;
  debouncedLat.value = 0;
  state.loading = false;
  selectedRowKeys.value = [];
}

// 行选择
const selectedRowKeys = ref<string[]>([]);
const rowSelection = {
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys;
  },
};

// 改造记录编辑弹窗
const [registerRenovModal, { openModal: openRenovModal, closeModal: closeRenovModal }] = useModal();
const renovForm = reactive<RenovationRecord>({
  rowId: '',
  id: '',
  renovReason: '',
  renovModeId: '',
  renovDt: '',
});
const renovModalTitle = ref('新增改造记录');
const isEditRenov = ref(false);

function generateRowId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function handleAddRenovation() {
  isEditRenov.value = false;
  renovModalTitle.value = '新增改造记录';
  renovForm.rowId = '';
  renovForm.id = '';
  renovForm.renovReason = '';
  renovForm.renovModeId = '';
  renovForm.renovDt = '';
  openRenovModal(true);
}

function handleEditRenovation(record: RenovationRecord) {
  isEditRenov.value = true;
  renovModalTitle.value = '编辑改造记录';
  Object.assign(renovForm, record);
  openRenovModal(true);
}

function handleDeleteRenovation(rowId: string) {
  state.formState.renovationList = state.formState.renovationList.filter(item => item.rowId !== rowId);
  selectedRowKeys.value = selectedRowKeys.value.filter(id => id !== rowId);
}

function handleBatchDeleteRenovation() {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请至少选择一条记录');
    return;
  }
  state.formState.renovationList = state.formState.renovationList.filter(
    item => !selectedRowKeys.value.includes(item.rowId)
  );
  selectedRowKeys.value = [];
}

async function handleRenovOk() {
  try {
    await renovFormRef.value.validate();
  } catch {
    return;
  }
  if (isEditRenov.value) {
    const index = state.formState.renovationList.findIndex(item => item.rowId === renovForm.rowId);
    if (index !== -1) {
      state.formState.renovationList[index] = { ...renovForm };
    }
  } else {
    state.formState.renovationList.push({
      ...renovForm,
      rowId: generateRowId(),
    });
  }
  closeRenovModal();
}

async function handleOk() {
  if (readonly.value) {
    closeModal();
    return;
  }
  try {
    await formRef.value.validate();
  } catch {
    message.error('请检查表单填写');
    return;
  }

  state.loading = true;

  const params = {
    ...state.formState,
    renovationList: state.formState.renovationList.map(({ rowId, ...rest }) => rest),
  };
  if (type.value === 'add') delete params.id;
  try {
    await saveOrUpdateBase(params);
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

function handleCancel() {
  resetForm();
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

.m-t-10 {
  margin-top: 10px;
}

.image-placeholder {
  height: 120px;
  background: #f5f5f5;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  margin-bottom: 8px;
}
</style>