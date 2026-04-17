<template>
  <BasicModal :title="title" :width="'60vw'" :height="550" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" okText="确定" cancelText="取消" @register="registerModal"
    @ok="handleOk" @cancel="handleCancel">
    <div class="h-full" v-loading="state.loading">
      <a-form :model="state.formState" name="basic" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly"
        autocomplete="off" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item label="监控设备名称" name="deviceMonitor" :rules="[{ required: true, message: '请输入监控设备名称' }]">
              <a-input v-model:value="state.formState.deviceMonitor" placeholder="控制室" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备编码" name="deviceCode" :rules="[{ required: true, message: '请输入设备编码' }]">
              <a-input v-model:value="state.formState.deviceCode" placeholder="" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="视频传输协议" name="playProtocol" :rules="[{ required: true, message: '请选择视频传输协议' }]">
              <a-select v-model:value="state.formState.playProtocol" placeholder="请选择" allowClear>
                <a-select-option value="RTSP">RTSP</a-select-option>
                <a-select-option value="RTMP">RTMP</a-select-option>
                <a-select-option value="HLS">HLS</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="监控区域" name="monitorZone" :rules="[{ required: true, message: '请输入监控区域' }]">
              <a-input v-model:value="state.formState.monitorZone" placeholder="控制室" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="摄像头类型" name="cameraType" :rules="[{ required: true, message: '请选择摄像头类型' }]">
              <JDictSelectTag v-model:value="state.formState.cameraType" placeholder="请选择" dictCode="safe_device_video_camera_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="在线状态" name="onlineStatus" :rules="[{ required: true, message: '请选择在线状态' }]">
              <a-select v-model:value="state.formState.onlineStatus" placeholder="请选择">
                <a-select-option :value="0">在线</a-select-option>
                <a-select-option :value="1">离线</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属危险源" name="seriousOriginalId">
              <a-select v-model:value="state.formState.seriousOriginalId" placeholder="请选择" allowClear>
                <!-- <a-select-option value="">请选择</a-select-option> -->
                <a-select-option v-for="item in hsList" :key="item.id" :value="item.id">
                  {{ item.hazardName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="rtmp协议url" name="rtmpUrl">
              <a-input v-model:value="state.formState.rtmpUrl" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="rtsp协议url" name="rtspUrl">
              <a-input v-model:value="state.formState.rtspUrl" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="hls协议url" name="hlsUrl">
              <a-input v-model:value="state.formState.hlsUrl" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="坐标经度" name="longitude" :rules="[{ required: true, message: '请输入坐标经度' }]">
              <a-input v-model:value="state.formState.longitude" placeholder="101.3453254,24.785543,13,4" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="坐标纬度" name="latitude" :rules="[{ required: true, message: '请输入坐标纬度' }]">
              <a-input v-model:value="state.formState.latitude" placeholder="24.785543" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="附件" name="fileIds">
             
              <FileUploadRecord v-model:value="state.formState.fileIds" :bizId="state.formState.id"
                :readonly="readonly" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { saveOrUpdate, getViewById,hsListPage } from '../line.api';
import { message } from 'ant-design-vue';
import FileUploadRecord from '/@/components/FileUpload/FileUploadRecord.vue';
import { useUserStore } from '/@/store/modules/user';
const userStore = useUserStore();

const emit = defineEmits(['success', 'register']);
const formRef = ref();
const labelCol = { style: { width: '150px' } };
const wrapperCol = { style: { width: 'calc(100% - 150px)' } };

const state = reactive({
  loading: false,
  formState: {
    id: '',
    deviceMonitor: '',
    deviceCode: '',
    playProtocol: '',
    monitorZone: '',
    cameraType: '',
    seriousOriginalId: '',
    onlineStatus: 0,
    rtmpUrl: '',
    rtspUrl: '',
    hlsUrl: '',
    longitude: '',
    latitude: '',
    attachmentPath: '',
    fileIds: [],
  },
});
const hsList = ref([]);
// 当前的弹窗数据
let type = ref('');
let row = ref({});
let title = computed(() => {
  const typeMap = {
    add: '新增',
    edit: '编辑',
    view: '查看',
  };
  const str = typeMap[type.value] || '查看';
  return `${str}视频监控设备`;
});
let readonly = computed(() => {
  return type.value === 'view';
});

// 注册弹窗
const [registerModal, { closeModal }] = useModalInner(async (data) => {
  row.value = data.row;
  type.value = data.type;
  resetForm();
  getHsList();
  // 除了新增模式，其他模式都需要加载数据
  if (type.value !== 'add') {
    getData();
  }
});

const getHsList = async () => {
  const res = await hsListPage({
    orgCode: userStore.currentEnterpriseCode
  });
  console.log(res);
  
  hsList.value = res;
};

const getData = async () => {
  state.loading = true;
  const res = await getViewById({ id: row.value.id });
  Object.assign(state.formState, res);
  state.loading = false;
};

const handleOk = () => {
  formRef.value.validate().then(() => {
    state.loading = true;
    let params = { ...state.formState };
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
  formRef.value?.clearValidate();
  state.formState = {
    id: '',
    deviceMonitor: '',
    deviceCode: '',
    playProtocol: '',
    monitorZone: '',
    cameraType: '',
    seriousOriginalId: '',
    onlineStatus: 0,
    rtmpUrl: '',
    rtspUrl: '',
    hlsUrl: '',
    longitude: '',
    latitude: '',
    attachmentPath: '',
    fileIds: [],
  };
  state.loading = false;
};

const handleCancel = () => {
  resetForm();
};
</script>
<style lang="less" scoped></style>
