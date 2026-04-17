<template>
  <BasicModal :title="title" :width="1400" :can-fullscreen="true" :keyboard="false" :destroy-on-close="true"
    v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'" :cancelText="readonly ? '关闭' : '取消'"
    :showOkBtn="!readonly" @register="registerModal" @ok="handleOk" @cancel="handleCancel">
    <div v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="监测对象" name="checkTargetId" :rules="[{ required: true, message: '请选择' }]">
              <JDictSelectTag v-model:value="state.formState.checkTargetId" placeholder="请选择"
                dictCode="safe_device_check_target" :showChooseOption="false" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="重大危险源" name="seriousOriginalId">
              <a-select v-model:value="state.formState.seriousOriginalId" placeholder="请选择" allowClear showSearch
               >
                <a-select-option v-for="item in hazardList" :key="item.id" :value="item.id">
                  {{ item.hazardName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="监测点名称" name="deviceName" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.deviceName" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备编码" name="deviceCode">
              <a-input v-model:value="state.formState.deviceCode" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="设备类别" name="deviceCategory">
              <a-select v-model:value="state.formState.deviceCategory" placeholder="请选择" allowClear
                @change="handleDeviceCategoryChange">
                <a-select-option :value="1">矿山监测设备</a-select-option>
                <a-select-option :value="0">非矿山监测设备</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="state.formState.deviceCategory === 1">
            <a-form-item label="设备类型" name="deviceTypeId">
              <a-tree-select v-model:value="state.formState.deviceTypeId" placeholder="请选择设备类型" 
                :tree-data="deviceTypeTree" :replaceFields="{ children: 'childList', title: 'title', key: 'id', value: 'id' }"
                tree-default-expand-all allowClear show-search
                :tree-line="{ showLeafIcon: false }"
                @change="handleDeviceTypeChange">
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="state.formState.deviceCategory === 1">
          <a-col :span="12">
            <a-form-item label="单位" name="unit">
              <a-input v-model:value="state.formState.unit" placeholder="请输入单位" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安装位置" name="installLocation">
              <a-input v-model:value="state.formState.installLocation" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="生产厂家" name="produceFactory">
              <a-input v-model:value="state.formState.produceFactory" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安装日期" name="installDate">
              <a-date-picker v-model:value="state.formState.installDate" placeholder="请选择安装日期" 
                style="width: 100%" format="YYYY-MM-DD " show-time />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="厂家编码" name="factoryCode">
              <a-input v-model:value="state.formState.factoryCode" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="高程（米）" name="elevation">
              <a-input-number v-model:value="state.formState.elevation" placeholder="请输入" style="width: 100%" :precision="2" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="是否是基站" name="baseStationIs">
              <a-select v-model:value="state.formState.baseStationIs" placeholder="请选择" allowClear>
                <a-select-option :value="0">是</a-select-option>
                <a-select-option :value="1">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="孔深（米）" name="holeDepth">
              <a-input-number v-model:value="state.formState.holeDepth" placeholder="请输入" style="width: 100%" :precision="2" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="埋深（米）" name="buriedDepth">
              <a-input-number v-model:value="state.formState.buriedDepth" placeholder="请输入" style="width: 100%" :precision="2" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安装高度（米）" name="installHeight">
              <a-input-number v-model:value="state.formState.installHeight" placeholder="请输入" style="width: 100%" :precision="2" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="坡度（米）" name="gradient">
              <a-input-number v-model:value="state.formState.gradient" placeholder="请输入" style="width: 100%" :precision="2" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最小滩长（米）" name="minBeachLength">
              <a-input-number v-model:value="state.formState.minBeachLength" placeholder="请输入" style="width: 100%" :precision="2" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="showAAAAFields">
          <a-col :span="12">
            <a-form-item label="安装方向" name="installDirection">
              <a-input v-model:value="state.formState.installDirection" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="DTU_ID" name="dtuId">
              <a-input v-model:value="state.formState.dtuId" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="showBBBBFields">
          <a-col :span="12">
            <a-form-item label="负延时" name="negativeDelay">
              <a-input v-model:value="state.formState.negativeDelay" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="储存时长" name="storageDuration">
              <a-input v-model:value="state.formState.storageDuration" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="showBBBBFields">
          <a-col :span="12">
            <a-form-item label="幅值" name="amplitude">
              <a-input v-model:value="state.formState.amplitude" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="位置描述" name="locationDesc">
              <a-input v-model:value="state.formState.locationDesc" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="坐标地点经度" name="longitude" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.longitude" placeholder="请输入经度" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="坐标地点纬度" name="latitude" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.latitude" placeholder="请输入纬度" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">指标信息</a-divider>
        <a-form-item label="" :wrapper-col="{ span: 24 }">
          <QuotaTable v-model:value="state.formState.deviceSafeCheckQuotas" :disabled="readonly" />
        </a-form-item>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import QuotaTable from './QuotaTable.vue';
import { saveOrUpdate, getViewById, getQuotaList, getHazardManageList, getDeviceTypeTree } from '../line.api';
import { message } from 'ant-design-vue';
import { useUserStore } from '/@/store/modules/user';
import dayjs from 'dayjs';

const emit = defineEmits(['success', 'register']);
const formRef = ref();
const labelCol = { style: { width: '120px' } };
const wrapperCol = { style: { width: 'calc(100% - 120px)' } };
const userStore = useUserStore();
const orgCode = ref('');

const hazardList = ref([]);
const deviceTypeTree = ref([]);
const state = reactive({
  loading: false,
  formState: {
    id: '',
    checkTargetId: '',
    seriousOriginalId: '',
    deviceName: '',
    deviceCode: '',
    deviceCategory: undefined,
    deviceTypeId: '',
    unit: '',
    installLocation: '',
    produceFactory: '',
    installDate: undefined,
    factoryCode: '',
    installDirection: '',
    elevation: undefined,
    negativeDelay: '',
    storageDuration: '',
    amplitude: '',
    baseStationIs: undefined,
    holeDepth: undefined,
    buriedDepth: undefined,
    dtuId: '',
    installHeight: undefined,
    gradient: undefined,
    minBeachLength: undefined,
    locationDesc: '',
    longitude: '',
    latitude: '',
    deviceSafeCheckQuotas: [],
  },
});

// 控制AAAA和BBBB类型的字段显示
const showAAAAFields = computed(() => {
  return state.formState.deviceTypeId === '597105b92891628cb8d4513fcbfaecb4';
});

const showBBBBFields = computed(() => {
  return state.formState.deviceTypeId === '7f577913b348722e41375e47f7a6d294';
});

// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}设备安全检测`;
});
let readonly = computed(() => {
  return type.value == 'view';
});

// 注册弹窗
const [registerModal, { closeModal }] = useModalInner(async (data) => {
  row.value = data.row;
  type.value = data.type;
  resetForm();
  
  // 打开弹窗时就加载设备类型树
  loadDeviceTypeTree();
  
  if (type.value == 'view' || type.value == 'edit') {
    getData();
  }
});

const getData = async () => {
  state.loading = true;
  try {
    // 获取基本信息
    const res = await getViewById({ id: row.value.id });
    Object.assign(state.formState, res);
    
    // 处理日期字段
    if (res.installDate) {
      state.formState.installDate = dayjs(res.installDate);
    }

    // 单独查询指标列表
    const quotaList = await getQuotaList({ deviceSafeCheckId: row.value.id });
    state.formState.deviceSafeCheckQuotas = quotaList || [];
  } catch (error) {
    console.error('获取详情失败:', error);
  } finally {
    state.loading = false;
  }
};

const handleOk = () => {
  formRef.value.validate().then(() => {
    // 验证指标信息
    // if (!state.formState.deviceSafeCheckQuotas || state.formState.deviceSafeCheckQuotas.length === 0) {
    //   message.warning('请至少添加一条指标信息');
    //   return;
    // }

    // 验证每条指标信息的必填字段
    for (let i = 0; i < state.formState.deviceSafeCheckQuotas.length; i++) {
      const quota = state.formState.deviceSafeCheckQuotas[i];
      if (!quota.quotaType) {
        message.warning(`第${i + 1}条指标的类型不能为空`);
        return;
      }
      if (!quota.quotaName) {
        message.warning(`第${i + 1}条指标的名称不能为空`);
        return;
      }
      if (!quota.quotaCode) {
        message.warning(`第${i + 1}条指标的编码不能为空`);
        return;
      }
      if (!quota.unit) {
        message.warning(`第${i + 1}条指标的单位不能为空`);
        return;
      }
      // if (quota.meterUpperLimit === null || quota.meterUpperLimit === undefined) {
      //   message.warning(`第${i + 1}条指标的仪表量程上限不能为空`);
      //   return;
      // }
      // if (quota.meterLowerLimit === null || quota.meterLowerLimit === undefined) {
      //   message.warning(`第${i + 1}条指标的仪表量程下限不能为空`);
      //   return;
      // }
      // if (quota.firstThresholdUpper === null || quota.firstThresholdUpper === undefined) {
      //   message.warning(`第${i + 1}条指标的一级阈值上限不能为空`);
      //   return;
      // }
      // if (quota.firstThresholdLower === null || quota.firstThresholdLower === undefined) {
      //   message.warning(`第${i + 1}条指标的一级阈值下限不能为空`);
      //   return;
      // }
      // if (quota.secondThresholdUpper === null || quota.secondThresholdUpper === undefined) {
      //   message.warning(`第${i + 1}条指标的二级阈值上限不能为空`);
      //   return;
      // }
      // if (quota.secondThresholdLower === null || quota.secondThresholdLower === undefined) {
      //   message.warning(`第${i + 1}条指标的二级阈值下限不能为空`);
      //   return;
      // }
    }

    state.loading = true;
    let params = { ...state.formState };
    
    // 处理日期格式
    if (params.installDate) {
      params.installDate = dayjs(params.installDate).format('YYYY-MM-DD ');
    }

    if (type.value === 'add') {
      delete params.id;
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
  });
};

// 初始化表单值
const resetForm = () => {
  if (formRef.value) {
    formRef.value.clearValidate();
  }
  state.formState = {
    id: '',
    checkTargetId: '',
    seriousOriginalId: '',
    deviceName: '',
    deviceCode: '',
    deviceCategory: undefined,
    deviceTypeId: '',
    unit: '',
    installLocation: '',
    produceFactory: '',
    installDate: undefined,
    factoryCode: '',
    installDirection: '',
    elevation: undefined,
    negativeDelay: '',
    storageDuration: '',
    amplitude: '',
    baseStationIs: undefined,
    holeDepth: undefined,
    buriedDepth: undefined,
    dtuId: '',
    installHeight: undefined,
    gradient: undefined,
    minBeachLength: undefined,
    locationDesc: '',
    longitude: '',
    latitude: '',
    deviceSafeCheckQuotas: [],
  };
  state.loading = false;
};

const handleCancel = () => {
  resetForm();
};

// 加载重大危险源列表
const loadHazardList = async () => {
  orgCode.value = userStore.currentEnterpriseCode;
  // console.log( orgCode.value);
  // console.log('---');
  
  try {
    const res = await getHazardManageList({ orgCode: orgCode.value });
    hazardList.value = res || [];
  } catch (error) {
    console.error('获取重大危险源列表失败:', error);
  }
};



// 设备类别变化处理
const handleDeviceCategoryChange = (value) => {
  if (value !== 1) {
    // 非矿山设备，清空相关字段
    state.formState.deviceTypeId = '';
    state.formState.unit = '';
  }
};

// 设备类型变化处理
const handleDeviceTypeChange = (value) => {
  // 可以在这里根据设备类型做一些额外处理
  console.log('设备类型变化:', value);
};

// 加载设备类型树形数据
const loadDeviceTypeTree = async () => {
  try {
    const res = await getDeviceTypeTree();
    // 处理树形数据，过滤掉父节点（只允许选择子节点）
    deviceTypeTree.value = processTreeData(res || []);
  } catch (error) {
    console.error('获取设备类型树失败:', error);
  }
};

// 处理树形数据，设置父节点不可选
const processTreeData = (data) => {
  return data.map(item => {
    const node = {
      ...item,
      // 父节点使用 mineType 作为标题，添加一个唯一的 id
      id: item.mineType,
      title: item.mineType,
      // 如果有子节点，则该节点不可选
      disabled: item.childList && item.childList.length > 0,
      selectable: false, // 父节点不可选
    };
    
    if (item.childList && item.childList.length > 0) {
      node.childList = item.childList.map(child => ({
        ...child,
        title: child.sensorName, // 子节点使用 sensorName 作为标题
        disabled: false, // 子节点可选
        selectable: true, // 子节点可选
      }));
    }
    
    return node;
  });
};

onMounted(() => {
  loadHazardList();
});
</script>
<style lang="less" scoped></style>
