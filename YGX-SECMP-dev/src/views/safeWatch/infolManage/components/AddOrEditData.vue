<template>
  <BasicModal
    :title="title"
    :width="'62vw'"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    v-bind="$attrs"
    :maskClosable="false"
    :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'"
    :showOkBtn="!readonly"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div v-loading="state.loading">
      <a-form
        :model="state.formState"
        name="basic"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :disabled="readonly"
        autocomplete="off"
        ref="formRef"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item label="所属重大危险源" name="seriousOriginalId">
              <a-select
                @change="originChange"
                v-model:value="originForm.seriousOriginalId"
                placeholder="请选择"
                allowClear
                showSearch
                :filter-option="filterOption"
              >
                <a-select-option v-for="item in hazardList" :key="item.id" :value="item.id">
                  {{ item.hazardName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备名称" name="deviceName">
              <a-select @change="deviceChange" v-model:value="originForm.deviceName" placeholder="请选择" allowClear showSearch>
                <a-select-option v-for="item in deviceList" :key="item.id" :value="item.id">
                  {{ item.deviceName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="指标类型" name="safeDeviceQuotaId" :rules="[{ required: true, message: '请选择指标类型' }]">
              <a-select @change="typeChange" v-model:value="state.formState.safeDeviceQuotaId" placeholder="请选择" allowClear showSearch>
                <a-select-option v-for="item in indicatorList" :key="item.id" :value="item.id">
                  {{ item.quotaName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="指标名称" name="quotaName" :rules="[{ required: true, message: '请选择指标名称' }]">
              <a-input v-model:value="state.formState.quotaName" disabled placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备编码" name="deviceCode">
              <a-input v-model:value="state.formState.deviceCode" disabled placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="计量单位" name="unit" :rules="[{ required: true, message: '请选择计量单位' }]">
              <JDictSelectTag disabled v-model:value="state.formState.unit" placeholder="请选择" dictCode="safe_device_quota_unit" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="红色预警阈值" name="redThreshold" :rules="[{ pattern: /^-?\d+(\.\d{1,4})?$/, message: '请输入数字，小数保留4位' }]">
              <a-input v-model:value="state.formState.redThreshold" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="橙色预警阈值"
              name="orangeThreshold"
              :rules="[{ pattern: /^-?\d+(\.\d{1,4})?$/, message: '请输入数字，小数保留4位' }]"
            >
              <a-input v-model:value="state.formState.orangeThreshold" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="黄色预警阈值"
              name="yellowThreshold"
              :rules="[{ pattern: /^-?\d+(\.\d{1,4})?$/, message: '请输入数字，小数保留4位' }]"
            >
              <a-input v-model:value="state.formState.yellowThreshold" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="蓝色预警阈值" name="blueThreshold" :rules="[{ pattern: /^-?\d+(\.\d{1,4})?$/, message: '请输入数字，小数保留4位' }]">
              <a-input v-model:value="state.formState.blueThreshold" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="仪表量程上限"
              name="meterUpperLimit"
              :rules="[{ pattern: /^-?\d+(\.\d{1,4})?$/, message: '请输入数字，小数保留4位' }]"
            >
              <a-input v-model:value="state.formState.meterUpperLimit" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="仪表量程下限"
              name="meterLowerLimit"
              :rules="[{ pattern: /^-?\d+(\.\d{1,4})?$/, message: '请输入数字，小数保留4位' }]"
            >
              <a-input v-model:value="state.formState.meterLowerLimit" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
  import { saveOrUpdate, getViewById, getHazardManageList, getQuotaList, getDeviceList } from '../line.api';
  import { message } from 'ant-design-vue';
  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const labelCol = { style: { width: '200px' } };
  const wrapperCol = { style: { width: 'calc(100% - 200px)' } };
  const hazardList = ref([]); //危险源列表
  const deviceList = ref([]); //设备列表
  const indicatorList = ref([]); //指标列表
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
  const state = reactive({
    loading: false,
    typicalLoading: false,
    typicalOptions: [],
    formState: {
      id: '',
      dangerWorkmanship: '',
      typicalWorkmanship: '',
    },
  });
  const originForm = ref({
    seriousOriginalId: '',
    deviceName: '',
  });
  // 当前的弹窗数据
  let type = ref('');
  let row = ref({});
  let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
    return `${str}指标信息管理`;
  });
  let readonly = computed(() => {
    return type.value == 'view';
  });
  // 注册弹窗
  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    row.value = data.row;
    type.value = data.type;
    resetForm();
    if (type.value == 'view' || type.value == 'edit') {
      getData();
    }
  });

  const getData = async () => {
    state.loading = true;
    const res = await getViewById({ id: row.value.id });
    Object.assign(state.formState, res);
    originForm.value.seriousOriginalId = state.formState.seriousOriginalId;
    originForm.value.deviceName = state.formState.deviceSafeCheckId;
    handleView(null, originForm.value.seriousOriginalId);
    handleView('device', originForm.value.deviceName);
    state.loading = false;
  };

  const handleOk = () => {
    formRef.value
      .validate()
      .then(() => {
        state.loading = true;
        let params = state.formState;
        if (type.value === 'add') {
          delete params.id;
        }
        params.yellowThreshold = Number(params.yellowThreshold);
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
      .catch(() => {
        state.loading = false;
      });
  };
  // 初始化表单值
  const resetForm = () => {
    // form的resetFields在部分情况下，部分表单值和校验结果无法清除重置、故用以下方式
    formRef.value.clearValidate();
    state.formState = {
      id: '',
      dangerWorkmanship: '',
      typicalWorkmanship: '',
    };
    originForm.value = {
      seriousOriginalId: '',
      deviceName: '',
    };
    state.typicalOptions = [];
    state.loading = false;
  };
  const handleCancel = () => {
    resetForm();
  };

  /**
   * 危险源变更获取设备列表
   * @date 2025-11-12
   * @param {any} val
   * @returns {any}
   */
  const originChange = async (val) => {
    if (type.value == 'view') return;
    state.loading = true;
    state.formState.safeDeviceQuotaId = '';
    originForm.value.deviceName = '';
    indicatorList.value = [];
    const res = await getDeviceList({ seriousOriginalId: val });
    deviceList.value = [];
    if (res.records && res.records.length) {
      deviceList.value = res.records || [];
    }
    state.loading = false;
  };
  /**
   * 设备变更获取指标类型
   * @date 2025-11-12
   * @param {any} val
   * @returns {any}
   */
  const deviceChange = async (val) => {
    if (type.value == 'view') return;
    state.loading = true;
    state.formState.safeDeviceQuotaId = '';
    const res = await getQuotaList({ deviceSafeCheckId: val });
    indicatorList.value = [];
    if (res && res.length) {
      indicatorList.value = res || [];
    }
    state.loading = false;
  };
  /**
   * 指标类型变更
   * @author zx
   * @date 2025-11-12
   * @param {any} val
   * @returns {any}
   */
  const typeChange = (val) => {
    if (type.value == 'view') return;
    const res = indicatorList.value.filter((item) => item.id == val);
    if (res && res.length) {
      Object.assign(state.formState, res[0]);
    }
  };
  const handleView = async (type, id) => {
    if (type) {
      const res = await getQuotaList({ deviceSafeCheckId: id });
      indicatorList.value = [];
      if (res && res.length) {
        indicatorList.value = res || [];
      }
    } else {
      const res = await getDeviceList({ seriousOriginalId: id });
      deviceList.value = [];
      if (res.records && res.records.length) {
        deviceList.value = res.records || [];
      }
    }
  };
  // 加载重大危险源列表
  const loadHazardList = async () => {
    try {
      const res = await getHazardManageList({ orgCode: userStore.currentEnterpriseCode });
      hazardList.value = res || [];
    } catch (error) {
      console.error('获取重大危险源列表失败:', error);
    }
  };

  // 搜索过滤
  const filterOption = (input, option) => {
    return option.children[0].children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  onMounted(() => {
    loadHazardList();
  });
</script>
<style lang="less" scoped>
  :deep(.ant-form) {
    margin-right: 100px;
  }
</style>
