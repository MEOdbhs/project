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
              <a-input-number v-model:value="state.formState.lng"  :precision="6"
                style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="纬度" name="lat" :rules="[{ required: true, message: '请输入纬度' }]">
              <a-input-number v-model:value="state.formState.lat"  :precision="6"
                style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 工程边界范围示意图及工程地理位置图（原型图占位） -->
        <a-row :gutter="24" class="m-t-10">
        
          <a-col :span="24">
            <a-form-item label="工程地理位置图" label-align="left">
              <div class="map-preview">
                <iframe
                  v-if="mapPreviewUrl"
                  :src="mapPreviewUrl"
                  frameborder="0"
                  style="width: 100%; height: 240px; border-radius: 4px;"
                  allowfullscreen
                ></iframe>
                <div v-else class="image-placeholder">请输入有效的经纬度</div>
              </div>
              <a-button type="link" @click="handleViewMap">点击查看大图</a-button>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 排水闸参数信息 -->
        <div class="section-title">排水闸参数信息</div>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="涵闸类型" name="sluiceTypeId" :rules="[{ required: true, message: '请选择涵闸类型' }]">
              <JDictSelectTag v-model:value="state.formState.sluiceTypeId" placeholder="请选择" dictCode="waterproj_sluice_type" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="孔径(米)" name="aperture" :rules="[{ required: true, message: '请输入孔径' }]">
              <a-input-number v-model:value="state.formState.aperture" :min="0" :precision="2" style="width: 100%"
                placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="净高(米)" name="netHeight" :rules="[{ required: true, message: '请输入净高' }]">
              <a-input-number v-model:value="state.formState.netHeight" :min="0" :precision="2" style="width: 100%"
                placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="启闭方式" name="switchMode" :rules="[{ required: true, message: '请输入启闭方式' }]">
              <a-input v-model:value="state.formState.switchMode" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="设计过流能力" name="flowCap" :rules="[{ required: true, message: '请输入设计过流能力' }]">
              <a-input-number v-model:value="state.formState.flowCap" :min="0" :precision="2" style="width: 100%"
                placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 建设及运营主体 -->
        <div class="section-title">建设及运营主体</div>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="责任单位全称" name="dutyUnit" :rules="[{ required: true, message: '请输入责任单位全称' }]">
              <a-input v-model:value="state.formState.dutyUnit" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="法定代表人" name="legalPrsn" :rules="[{ required: true, message: '请输入法定代表人' }]">
              <a-input v-model:value="state.formState.legalPrsn" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="分管负责人" name="chargePrsn" :rules="[{ required: true, message: '请输入分管负责人' }]">
              <a-input v-model:value="state.formState.chargePrsn" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系电话" name="contact" :rules="[{ required: true, message: '请输入联系电话' }]">
              <a-input v-model:value="state.formState.contact" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="运维单位" name="oprUnit" :rules="[{ required: true, message: '请输入运维单位' }]">
              <a-input v-model:value="state.formState.oprUnit" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="运维人员" name="oprPrsn" :rules="[{ required: true, message: '请输入运维人员' }]">
              <a-input v-model:value="state.formState.oprPrsn" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" name="remark" :rules="[{ required: true, message: '请输入备注' }]">
              <a-textarea v-model:value="state.formState.remark" placeholder="请输入" :rows="2" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 建设及现状概况 -->
        <div class="section-title">建设及现状概况</div>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="建设时间" name="buildTime" :rules="[{ required: true, message: '请选择建设时间' }]">
              <a-date-picker v-model:value="state.formState.buildTime" valueFormat="YYYY-MM-DD HH:mm:ss" show-time
                placeholder="请选择" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="投入使用时间" name="useTime" :rules="[{ required: true, message: '请选择投入使用时间' }]">
              <a-date-picker v-model:value="state.formState.useTime" valueFormat="YYYY-MM-DD HH:mm:ss" show-time
                placeholder="请选择" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设计标准" name="designStd" :rules="[{ required: true, message: '请输入设计标准' }]">
              <a-input v-model:value="state.formState.designStd" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
        
          <a-col :span="12">
            <a-form-item label="运行状态" name="waterprojStatusId" :rules="[{ required: true, message: '请选择运行状态' }]">
              <JDictSelectTag v-model:value="state.formState.waterprojStatusId" placeholder="请选择" dictCode="waterproj_status_type" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="现状概况" name="statusDesc" :rules="[{ required: true, message: '请输入现状概况' }]">
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
              <JDictSelectTag :disabled="true" v-model:value="record.renovModeId" placeholder="请选择" dictCode="waterproj_renov_mode" />
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
    <BasicModal
      :title="'工程地理位置图'"
      :width="'90vw'"
      :can-fullscreen="false"
      :keyboard="false"
      :destroy-on-close="true"
      :maskClosable="false"
      @register="registerMapModal"
      :footer="null"
      :closable="true"
    >
      <iframe
        v-if="mapFullUrl"
        :src="mapFullUrl"
        frameborder="0"
        style="width: 100%; height: calc(90vh - 100px); border-radius: 4px;"
        allowfullscreen
      ></iframe>
      <div v-else style="text-align: center; padding: 50px;">请输入有效的经纬度</div>
    </BasicModal>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
// import { saveOrUpdate, getViewById } from '../line.api';

// 类型定义
interface RenovationRecord {
  rowId: string;
  id?: string;
  waterprojId?: string;
  renovReason: string;
  renovModeId: string;
  renovDt: string;
}

interface EngineeringInfo {
  id?: string;
  no: string;               // 工程编号
  name: string;
  waterprojTypeId: string;
  loc: string;
  lng: number;
  lat: number;
  sluiceTypeId: string;
  aperture: number;
  netHeight: number;
  switchMode: string;
  flowCap: number;
  dutyUnit: string;
  legalPrsn: string;
  chargePrsn: string;
  contact: string;
  oprUnit: string;
  oprPrsn: string;
  buildTime: string;
  useTime: string;
  designStd: string;
  waterprojStatusId: string;
  statusDesc: string;
  remark: string;
  renovationList: RenovationRecord[];
}
// 注册全屏地图弹窗
const [registerMapModal, { openModal: openMapModal }] = useModal();

// 计算地图预览URL（使用高德地图URI，标记点位置）
const mapPreviewUrl = computed(() => {
  const { lng, lat } = state.formState;
  if (lng != null && lat != null && !isNaN(lng) && !isNaN(lat)) {
    // 高德地图URI：https://uri.amap.com/marker?position=经度,纬度&name=标记名称
    return `https://uri.amap.com/marker?position=${lng},${lat}&name=工程位置`;
  }
  return '';
});

// 全屏地图URL（可使用相同或更详细的视图）
const mapFullUrl = computed(() => {
  const { lng, lat } = state.formState;
  if (lng != null && lat != null && !isNaN(lng) && !isNaN(lat)) {
    // 全屏时使用相同的URI，iframe会自动适应大小
    return `https://uri.amap.com/marker?position=${lng},${lat}&name=工程位置&src=工程管理`;
  }
  return '';
});

// 查看大图
function handleViewMap() {
  if (!state.formState.lng || !state.formState.lat) {
    message.warning('请先填写有效的经纬度');
    return;
  }
  openMapModal(true);
}

// 查看边界示意图大图（可后续实现，目前占位）
function handleViewBoundMap() {
  message.info('边界示意图查看功能待实现');
}

// 列定义
const renovationColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '改造原因', dataIndex: 'renovReason', width: 200 },
  { title: '改造方式', dataIndex: 'renovModeId', width: 120 },
  { title: '改造时间', dataIndex: 'renovDt', width: 150 },
  { title: '操作', dataIndex: 'action', width: 120, fixed: 'right' },
];

// 字典缓存（仅用于表格显示）
const renovModeDict = ref([]);
const getDictText = (dict, value) => {
  const item = dict.find(d => d.value === value);
  return item ? item.text : value;
};

const emit = defineEmits(['success', 'register']);
const formRef = ref();
const renovFormRef = ref();

const labelCol = { style: { width: '130px' } };
const wrapperCol = { style: { width: 'calc(100% - 130px)' } };

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
    flowCap: 0,
    dutyUnit: '',
    legalPrsn: '',
    chargePrsn: '',
    contact: '',
    oprUnit: '',
    oprPrsn: '',
    buildTime: '',
    useTime: '',
    designStd: '',
    waterprojStatusId: '',
    statusDesc: '',
    remark: '',
    renovationList: [] as RenovationRecord[],
  } as EngineeringInfo,
});

// 当前操作类型
const type = ref('add');
const row = ref < any > ({});

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
    // 新增时可能自动生成编号，留空让后端生成
    state.formState.no = '';
  } else {
    await getData();
  }
});

async function getData() {
  state.loading = true;
  try {
    const result = await getViewById({ id: row.value.id });
    if (result) {
      // 为子表添加临时rowId
      const renovationList = (result.renovationList || []).map((item: any) => ({
        ...item,
        rowId: generateRowId(),
      }));
      Object.assign(state.formState, result, { renovationList });
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
    flowCap: 0,
    dutyUnit: '',
    legalPrsn: '',
    chargePrsn: '',
    contact: '',
    oprUnit: '',
    oprPrsn: '',
    buildTime: '',
    useTime: '',
    designStd: '',
    waterprojStatusId: '',
    statusDesc: '',
    remark: '',
    renovationList: [],
  };
  state.loading = false;
  selectedRowKeys.value = [];
}

// 行选择
const selectedRowKeys = ref < string[] > ([]);
const rowSelection = {
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys;
  },
};

// 改造记录编辑弹窗
const [registerRenovModal, { openModal: openRenovModal, closeModal: closeRenovModal }] = useModal();
const renovForm = reactive < RenovationRecord > ({
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
    // 更新
    const index = state.formState.renovationList.findIndex(item => item.rowId === renovForm.rowId);
    if (index !== -1) {
      state.formState.renovationList[index] = { ...renovForm };
    }
  } else {
    // 新增
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

  // 构建提交参数，移除临时rowId
  const params = {
    ...state.formState,
    renovationList: state.formState.renovationList.map(({ rowId, ...rest }) => rest),
  };
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