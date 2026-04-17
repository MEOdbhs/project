<template>
  <BasicModal :title="title" :width="'80vw'" :height="700" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full overflow-y-auto m-t-10" v-loading="state.loading">
      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol"
        :disabled="readonly" autocomplete="off">
        <!-- 基础信息 -->
        <div class="section-title">基本信息</div>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入名称' }]">
              <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属区域" name="region" :rules="[{ required: true, message: '请输入所属区域' }]">
              <a-input v-model:value="state.formState.region" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="经度" name="lon" :rules="[{ required: true, message: '请输入经度' }]">
              <a-input-number v-model:value="state.formState.lon" :min="-180" :max="180" :precision="6"
                style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="纬度" name="lat" :rules="[{ required: true, message: '请输入纬度' }]">
              <a-input-number v-model:value="state.formState.lat" :min="-90" :max="90" :precision="6"
                style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="类型" name="waterbodyTypeId" :rules="[{ required: true, message: '请选择类型' }]">
              <JDictSelectTag v-model:value="state.formState.waterbodyTypeId" placeholder="请选择"
                dictCode="waterbody_type" @change="handleTypeChange" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="建成时间" name="buildTime" :rules="[{ required: true, message: '请选择建成时间' }]">
              <a-date-picker v-model:value="state.formState.buildTime" valueFormat="YYYY-MM-DD HH:mm:ss" show-time
                placeholder="请选择" style="width: 100%" />
            </a-form-item>
          </a-col>
          <!-- 
          -->
        </a-row>

        <!-- 动态子表单：水库 -->
        <template v-if="state.formState.waterbodyTypeId === 'waterbody_type_reservoir'">
          <div class="section-title">水文及地形特征</div>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="总库容(立方米)" name="reservoir.totalStorage">
                <a-input-number v-model:value="state.formState.reservoir.totalStorage" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="死库容(立方米)" name="reservoir.deadStorage">
                <a-input-number v-model:value="state.formState.reservoir.deadStorage" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="坝高(米)" name="reservoir.damHeight">
                <a-input-number v-model:value="state.formState.reservoir.damHeight" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="坝长(米)" name="reservoir.damLength">
                <a-input-number v-model:value="state.formState.reservoir.damLength" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="坝型" name="reservoir.damType">
                <a-input v-model:value="state.formState.reservoir.damType" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="溢洪道尺寸(米)" name="reservoir.spillwaySize">
                <a-input-number v-model:value="state.formState.reservoir.spillwaySize" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="泄洪能力(立方米/秒)" name="reservoir.floodCapacity">
                <a-input-number v-model:value="state.formState.reservoir.floodCapacity" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="正常蓄水量(米)" name="reservoir.normalLevel">
                <a-input-number v-model:value="state.formState.reservoir.normalLevel" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="警戒水位(米)" name="reservoir.warningLevel">
                <a-input-number v-model:value="state.formState.reservoir.warningLevel" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="泄洪水位(米)" name="reservoir.dischargeLevel">
                <a-input-number v-model:value="state.formState.reservoir.dischargeLevel" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="死水位(米)" name="reservoir.deadLevel">
                <a-input-number v-model:value="state.formState.reservoir.deadLevel" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="入库河流" name="reservoir.inflowRiver">
                <a-input v-model:value="state.formState.reservoir.inflowRiver" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="汇水面积(平方公里)" name="reservoir.catchmentArea">
                <a-input-number v-model:value="state.formState.reservoir.catchmentArea" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="出库水流去向" name="reservoir.outflowDirection">
                <a-input v-model:value="state.formState.reservoir.outflowDirection" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="影响范围" name="reservoir.influenceScope">
                <a-textarea v-model:value="state.formState.reservoir.influenceScope" placeholder="请输入" :rows="2"
                  allowClear />
              </a-form-item>
            </a-col>
          </a-row>

          <div class="section-title">现状信息</div>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="坝体完好度" name="reservoir.damIntegrity">
                <a-input v-model:value="state.formState.reservoir.damIntegrity" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="溢洪道畅通情况" name="reservoir.spillwayStatus">
                <a-input v-model:value="state.formState.reservoir.spillwayStatus" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="监测设备运行状态" name="reservoir.monitorStatus">
                <a-input v-model:value="state.formState.reservoir.monitorStatus" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="水质情况" name="reservoir.waterQuality">
                <a-input v-model:value="state.formState.reservoir.waterQuality" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
          </a-row>
        </template>

        <!-- 动态子表单：河流 -->
        <template v-else-if="state.formState.waterbodyTypeId === 'waterbody_type_river'">
          <div class="section-title">水文及地形特征</div>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="流域面积(平方米)" name="river.basinArea">
                <a-input-number v-model:value="state.formState.river.basinArea" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="县级境内长度(米)" name="river.countyLength">
                <a-input-number v-model:value="state.formState.river.countyLength" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="河道最窄宽度(米)" name="river.minChannelWidth">
                <a-input-number v-model:value="state.formState.river.minChannelWidth" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="河道最宽宽度(米)" name="river.maxChannelWidth">
                <a-input-number v-model:value="state.formState.river.maxChannelWidth" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="水深(米)" name="river.waterDepth">
                <a-input-number v-model:value="state.formState.river.waterDepth" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="河床坡度" name="river.riverbedSlope">
                <a-input-number v-model:value="state.formState.river.riverbedSlope" :min="0" :precision="6"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="河流走向" name="river.flowDirection">
                <a-input v-model:value="state.formState.river.flowDirection" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="上下游连接水体及汇水范围信息" name="river.waterConnection">
                <a-textarea v-model:value="state.formState.river.waterConnection" placeholder="请输入" :rows="2"
                  allowClear />
              </a-form-item>
            </a-col>
          </a-row>

          <div class="section-title">现状信息</div>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="河流河道淤积状态" name="river.channelSiltation">
                <a-input v-model:value="state.formState.river.channelSiltation" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="河岸完好度" name="river.riverbankIntegrity">
                <a-input v-model:value="state.formState.river.riverbankIntegrity" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="生态环境状态" name="river.ecologicalStatus">
                <a-input v-model:value="state.formState.river.ecologicalStatus" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
          </a-row>
        </template>

        <!-- 动态子表单：湖泊 -->
        <template v-else-if="state.formState.waterbodyTypeId === 'waterbody_type_lake'">
          <div class="section-title">水文及地形特征</div>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="湖泊水域面积(平方米)" name="lake.area">
                <a-input-number v-model:value="state.formState.lake.area" :min="0" :precision="2" style="width: 100%"
                  placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="平均水深(米)" name="lake.avgDepth">
                <a-input-number v-model:value="state.formState.lake.avgDepth" :min="0" :precision="2"
                  style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="蓄水量(立方米)" name="lake.storage">
                <a-input-number v-model:value="state.formState.lake.storage" :min="0" :precision="2" style="width: 100%"
                  placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="周边地形地貌" name="lake.topo">
                <a-input v-model:value="state.formState.lake.topo" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="汇入及流出河流情况信息" name="lake.flow">
                <a-textarea v-model:value="state.formState.lake.flow" placeholder="请输入" :rows="2" allowClear />
              </a-form-item>
            </a-col>
          </a-row>

          <div class="section-title">现状信息</div>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="湖泊水质情况" name="lake.quality">
                <a-input v-model:value="state.formState.lake.quality" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="岸线保护现状" name="lake.shoreStatus">
                <a-input v-model:value="state.formState.lake.shoreStatus" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <div class="section-title">管理主体信息</div>
        <div class="section-titles">责任单位信息</div>
        <a-row>
          <a-col :span="12">
            <a-form-item label="责任单位全称" name="dept" :rules="[{ required: true, message: '请输入责任单位全称' }]">
              <a-input v-model:value="state.formState.dept" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="法定代表人" name="legal" :rules="[{ required: true, message: '请输入法定代表人' }]">
              <a-input v-model:value="state.formState.legal" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="负责人" name="manager" :rules="[{ required: true, message: '请输入负责人' }]">
              <a-input v-model:value="state.formState.manager" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="负责人联系方式" name="phone" :rules="[{ required: true, message: '请输入负责人联系方式' }]">
              <a-input v-model:value="state.formState.phone" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运维单位" name="omDept" :rules="[{ required: true, message: '请输入运维单位' }]">
              <a-input v-model:value="state.formState.omDept" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="管护人员数量" name="count" :rules="[{ required: true, message: '请输入管护人员数量' }]">
              <a-input-number v-model:value="state.formState.count" :min="0" style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
        <div class="section-titles">管理范围及协同管理</div>
        <a-row>
          <a-col :span="12">
            <a-form-item label="管理范围确权情况" name="confirm" :rules="[{ required: true, message: '请输入范围确权情况' }]">
              <a-input v-model:value="state.formState.confirm" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="周边涉及的乡镇、村(社区)" name="towns" :rules="[{ required: true, message: '请输入周边涉及的镇、村（社区）' }]">
              <a-input v-model:value="state.formState.towns" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="协同管理责任信息" name="duty" :rules="[{ required: true, message: '请输入管理责任信息' }]">
              <a-textarea v-model:value="state.formState.duty" placeholder="请输入" :rows="2" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { saveOrUpdate, getViewById } from '../line.api'; // 根据实际路径调整

const emit = defineEmits(['success']);
const formRef = ref();
const labelCol = { style: { width: '200px' } };
const wrapperCol = { style: { width: 'calc(100% - 150px)' } };

// 定义水库子表单初始结构
const initReservoir = {
  totalStorage: undefined,
  deadStorage: undefined,
  damHeight: undefined,
  damLength: undefined,
  damType: '',
  spillwaySize: undefined,
  floodCapacity: undefined,
  normalLevel: undefined,
  warningLevel: undefined,
  dischargeLevel: undefined,
  deadLevel: undefined,
  inflowRiver: '',
  catchmentArea: undefined,
  outflowDirection: '',
  influenceScope: '',
  damIntegrity: '',
  spillwayStatus: '',
  monitorStatus: '',
  waterQuality: '',
};

// 定义河流子表单初始结构
const initRiver = {
  basinArea: undefined,
  countyLength: undefined,
  minChannelWidth: undefined,
  maxChannelWidth: undefined,
  waterDepth: undefined,
  riverbedSlope: undefined,
  flowDirection: '',
  waterConnection: '',
  channelSiltation: '',
  riverbankIntegrity: '',
  ecologicalStatus: '',
};

// 定义湖泊子表单初始结构
const initLake = {
  area: undefined,
  avgDepth: undefined,
  storage: undefined,
  topo: '',
  flow: '',
  quality: '',
  shoreStatus: '',
};

const state = reactive({
  loading: false,
  formState: {
    id: '',
    name: '',
    region: '',
    lon: undefined,
    lat: undefined,
    waterbodyTypeId: '',
    buildTime: '',
    dept: '',
    legal: '',
    manager: '',
    phone: '',
    omDept: '',
    count: undefined,
    confirm: '',
    towns: '',
    duty: '',
    // 子表单
    reservoir: { ...initReservoir },
    river: { ...initRiver },
    lake: { ...initLake },
  },
});

let type = ref(''); // 'add', 'edit', 'view'
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}河湖库信息`;
});
let readonly = computed(() => type.value == 'view');

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  type.value = data.type;
  row.value = data.row || {};
  resetForm();
  if (type.value == 'view' || type.value == 'edit') {
    await getData();
  }
});

// 获取详情数据
const getData = async () => {
  state.loading = true;
  try {
    const result = await getViewById({ id: row.value.id });
    if (result) {
      // 基础信息
      const base = { ...result };
      delete base.reservoir;
      delete base.river;
      delete base.lake;
      Object.assign(state.formState, base);

      // 子表信息
      if (result.reservoir) {
        state.formState.reservoir = { ...initReservoir, ...result.reservoir };
      }
      if (result.river) {
        state.formState.river = { ...initRiver, ...result.river };
      }
      if (result.lake) {
        state.formState.lake = { ...initLake, ...result.lake };
      }
    }
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    state.loading = false;
  }
};

// 重置表单
const resetForm = () => {
  formRef.value?.clearValidate();
  state.formState = {
    id: '',
    name: '',
    region: '',
    lon: undefined,
    lat: undefined,
    waterbodyTypeId: '',
    buildTime: '',
    dept: '',
    legal: '',
    manager: '',
    phone: '',
    omDept: '',
    count: undefined,
    confirm: '',
    towns: '',
    duty: '',
    reservoir: { ...initReservoir },
    river: { ...initRiver },
    lake: { ...initLake },
  };
  state.loading = false;
};

// 监听类型变化，清空其他子表数据（仅新增模式下）
watch(
  () => state.formState.waterbodyTypeId,
  (newVal, oldVal) => {
    if (type.value === 'add' && newVal !== oldVal) {
      // 清空所有子表
      state.formState.reservoir = { ...initReservoir };
      state.formState.river = { ...initRiver };
      state.formState.lake = { ...initLake };
    }
  }
);

// 类型切换处理（可选，用于额外逻辑）
const handleTypeChange = () => {
  // 可以留空，watch已处理
};

// 保存
const handleOk = () => {
  formRef.value.validate().then(async () => {
    state.loading = true;
    try {
      // 构建提交参数
      const params = {
        ...state.formState,
        // 根据类型携带对应的子对象，移除其他子对象
        reservoir: state.formState.reservoir,
        river: state.formState.river,
        lake: state.formState.lake,
      };
      // 移除多余的子表字段（避免提交空对象）
      // if (params.waterbodyTypeId !== 'reservoir') delete params.reservoir;
      // if (params.waterbodyTypeId !== 'river') delete params.river;
      // if (params.waterbodyTypeId !== 'lake') delete params.lake;

      // if (type.value === 'add') delete params.id;

      await saveOrUpdate(params);
      emit('success');
      message.success('保存成功');
      closeModal();
      resetForm();
    } catch (error) {
      message.error(error.message || '保存失败');
    } finally {
      state.loading = false;
    }
  }).catch(() => {
    message.error('请检查表单填写');
  });
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped>
.section-title {
  margin: 16px 0 12px;
  padding-left: 10px;
  border-left: 2px solid #1677ff;
  font-weight: 600;
  font-size: 16px;
}
.section-titles {
  margin: 16px 0 12px;
  padding-left: 10px;
  font-weight: 600;
  font-size: 14px;
  border-left: 2px solid #1677ff;
}

.m-t-10 {
  margin-top: 10px;
}
</style>