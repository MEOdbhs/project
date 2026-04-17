<template>
  <BasicModal
    title="配置"
    width="60%"
    :height="500"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    v-bind="$attrs"
    :maskClosable="false"
    okText="确定"
    cancelText="关闭"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full m-t-4" v-loading="state.loading">
      <a-button @click="handleAddDeviceType" class="mb-3" type="primary">添加设备类型</a-button>
      
      <div v-if="state.deviceConfigs.length === 0" class="text-center text-gray-400 py-8">
        暂无数据，请点击"添加设备类型"按钮添加
      </div>
      
      <div v-for="(config, index) in state.deviceConfigs" :key="config.key" class="device-config-item">
        <a-form
          :model="config"
          name="basic"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          autocomplete="off"
        >
          <a-row :gutter="12">
            <!-- <a-col :span="24">
              <div class="config-header">
                <span class="config-title">设备类别</span>
                <a-button type="link" danger size="small" @click="handleRemoveDevice(index)">删除</a-button>
              </div>
            </a-col> -->
            
            <a-col :span="7">
              <a-form-item label="设备类别" :rules="[{ required: true, message: '请选择设备类别' }]">
                <JDictSelectTag 
                  v-model:value="config.deviceTypeId" 
                  placeholder="请选择" 
                  dictCode="pm_device_network_video_type"
                  @change="handleDeviceTypeChange(index)"
                />
              </a-form-item>
            </a-col>
            
            <a-col :span="7">
              <a-form-item label="阈值上限" :rules="[{ required: true, message: '请输入阈值上限' }]">
                <a-input-number 
                  v-model:value="config.thresholdUpper" 
                  placeholder="10" 
                  :min="0"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            
            <a-col :span="7">
              <a-form-item label="阈值下限" :rules="[{ required: true, message: '请输入阈值下限' }]">
                <a-input-number 
                  v-model:value="config.thresholdLower" 
                  placeholder="1" 
                  :min="0"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="3">
              <a-button type="link" danger size="small" @click="handleRemoveDevice(index)">删除</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
  </BasicModal>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message } from 'ant-design-vue';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { alarmRuleSaveOrUpdateBatch } from '../network.api';
import { useUserStore } from '/@/store/modules/user';
const userStore = useUserStore();
const emit = defineEmits(['success']);
const labelCol = { style: { width: '100px' } };
const wrapperCol = { style: { width: 'calc(100% - 100px)' } };

let keyCounter = 0; // 用于生成唯一的 key

const state = reactive({
  loading: false,
  deviceConfigs: [],
});

// 注册弹窗
const [registerModal, { closeModal }] = useModalInner(async (data) => {
  resetForm();
  if (data && data.configs) {
    console.log(data.configs,'data.configs');
    
    // 如果有现有配置，加载进来
    state.deviceConfigs = data.configs.map((config) => ({
      ...config,
      key: keyCounter++,
    }));
  }
});

/**
 * 添加设备类型配置
 */
const handleAddDeviceType = () => {
  state.deviceConfigs.push({
    key: keyCounter++,
    deviceTypeId: undefined,
    thresholdUpper: 10,
    thresholdLower: 1,
  });
};

/**
 * 删除设备配置
 */
const handleRemoveDevice = (index) => {
  state.deviceConfigs.splice(index, 1);
};

/**
 * 设备类型改变时的处理
 */
const handleDeviceTypeChange = (index) => {
  // 可以在这里添加额外的逻辑
  console.log('设备类型改变:', state.deviceConfigs[index]);
};

/**
 * 表单验证
 */
const validateForm = () => {
  if (state.deviceConfigs.length === 0) {
    message.warning('请至少添加一条设备类型配置');
    return false;
  }

  const deviceTypeSet = new Set();

  for (let i = 0; i < state.deviceConfigs.length; i++) {
    const config = state.deviceConfigs[i];

    if (!config.deviceTypeId) {
      message.warning(`第 ${i + 1} 条配置：请选择设备类别`);
      return false;
    }

    if (deviceTypeSet.has(config.deviceTypeId)) {
      message.warning(`第 ${i + 1} 条配置：设备类别重复，请重新选择`);
      return false;
    }
    deviceTypeSet.add(config.deviceTypeId);

    if (config.thresholdUpper === undefined || config.thresholdUpper === null) {
      message.warning(`第 ${i + 1} 条配置：请输入阈值上限`);
      return false;
    }
    
    if (config.thresholdLower === undefined || config.thresholdLower === null) {
      message.warning(`第 ${i + 1} 条配置：请输入阈值下限`);
      return false;
    }
    
    if (config.thresholdUpper <= config.thresholdLower) {
      message.warning(`第 ${i + 1} 条配置：阈值上限必须大于阈值下限`);
      return false;
    }
  }
  
  return true;
};

/**
 * 确定按钮
 */
const handleOk = async () => {
  if (!validateForm()) {
    return;
  }
  
  state.loading = true;
  
  // 准备提交的数据
  const params = state.deviceConfigs.map(config => ({
    deviceTypeId: config.deviceTypeId,
    id: config.id,
    thresholdUpper: config.thresholdUpper,
    thresholdLower: config.thresholdLower,
    orgCode: userStore.currentEnterpriseCode,
  }));
  
  // 这里需要调用实际的API保存数据，暂时模拟成功
  console.log(params,'params');
  
  // saveAlarmConfig(params)
  await alarmRuleSaveOrUpdateBatch(params).then(res => {
    message.success('保存成功');
    emit('success');
    closeModal();
    resetForm();
  });

};

/**
 * 重置表单
 */
const resetForm = () => {
  state.deviceConfigs = [];
  state.loading = false;
};

/**
 * 取消按钮
 */
const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped>
.device-config-item {
  // padding: 16px;
  border-radius: 4px;
  position: relative;
  
  .config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e8e8e8;
    
    .config-title {
      font-weight: 500;
      color: #333;
    }
  }
}

.mb-3 {
  margin-bottom: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}

.text-center {
  text-align: center;
}

.text-gray-400 {
  color: #999;
}

.py-8 {
  padding-top: 32px;
  padding-bottom: 32px;
}
</style>

