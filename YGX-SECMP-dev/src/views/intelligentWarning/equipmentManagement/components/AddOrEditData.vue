<template>
  <BasicModal :title="title" :width="'60vw'" :height="550" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" v-bind="$attrs" :maskClosable="false" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full pl-10px pr-10px" v-loading="state.loading">
      <a-form :model="state.formState" name="deviceForm" :label-col="labelCol" :wrapper-col="wrapperCol"
        :disabled="readonly" autocomplete="off" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item label="设备类别" name="monitorCategoryId" :rules="[{ required: true, message: '请选择设备类别' }]">
              <a-select v-model:value="state.formState.monitorCategoryId" placeholder="请选择" allowClear
                :loading="state.dangerWorkmanshipLoading" showSearch optionFilterProp="label">
                <a-select-option v-for="item in state.typeList" :key="item.id" :value="item.id" :label="item.categoryName">
                  {{ item.categoryName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备类型" name="monitorTypeId" :rules="[{ required: true, message: '请选择设备类型' }]">
              <JDictSelectTag v-model:value="state.formState.monitorTypeId" placeholder="请选择"
                dictCode="monitor_detector_type" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备名称" name="monitorName" :rules="[{ required: true, message: '请输入设备名称' }]">
              <a-input v-model:value="state.formState.monitorName" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备编号" name="monitorCode" :rules="[{ required: true, message: '请输入设备编号' }]">
              <a-input v-model:value="state.formState.monitorCode" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安装位置" name="installLocation" :rules="[{ required: true, message: '请输入安装位置' }]">
              <a-input v-model:value="state.formState.installLocation" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="生产厂家" name="manufacturer" :rules="[{ required: true, message: '请输入生产厂家' }]">
              <a-input v-model:value="state.formState.manufacturer" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安装日期" name="installDate" :rules="[{ required: true, message: '请选择安装日期' }]">
              <a-date-picker v-model:value="state.formState.installDate"  format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD" placeholder="请选择" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安装方向" name="installDirectionId" :rules="[{ required: true, message: '请选择安装方向' }]">
              <JDictSelectTag v-model:value="state.formState.installDirectionId" placeholder="请选择"
                dictCode="monitor_install_direction" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="经度" name="lng" :rules="[{ required: true, message: '请输入经度' }]">
              <a-input-number v-model:value="state.formState.lng" placeholder="请输入" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="纬度" name="lat" :rules="[{ required: true, message: '请输入纬度' }]">
              <a-input-number v-model:value="state.formState.lat" placeholder="请输入" style="width: 100%" />
            </a-form-item>
          </a-col>
          
          <a-col :span="12">
            <a-form-item label="在线状态" name="onlineStatus" :rules="[{ required: true, message: '请选择在线状态' }]">
              <a-radio-group v-model:value="state.formState.onlineStatus">
                <a-radio value="Y">在线</a-radio>
                <a-radio value="N">离线</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
         
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="测点缩略图" name="fileSubIds" :rules="[{ required: false }]">
              <SimpleImageUpload ref="uploadRef" :bizId="state.formState.id" :apiFlieList="state.formState.fileList"
                :readonly="readonly" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="m-t-10">
          <a-col :span="24">
            <a-form-item label="经纬度拾取" label-align="left">
              <div class="map-preview">
                <iframe v-if="mapPreviewUrl" :src="mapPreviewUrl" frameborder="0"
                  style="width: 100%; height: 240px; border-radius: 4px;" allowfullscreen></iframe>
                <div v-else class="image-placeholder">请输入有效的经纬度</div>
              </div>
              <a-button type="link" @click="handleViewMap">点击查看大图</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <BasicModal :title="'经纬度拾取'" :width="'90vw'" :can-fullscreen="false" :keyboard="false" :destroy-on-close="true"
      :maskClosable="false" @register="registerMapModal" :footer="null" :closable="true">
      <iframe v-if="mapFullUrl" :src="mapFullUrl" frameborder="0"
        style="width: 100%; height: calc(90vh - 100px); border-radius: 4px;" allowfullscreen></iframe>
      <div v-else style="text-align: center; padding: 50px;">请输入有效的经纬度</div>
    </BasicModal>
  </BasicModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import SimpleImageUpload from '/@/components/FileUpload/SimpleImageUpload.vue';
import { message } from 'ant-design-vue';
// 请根据实际项目路径导入 API
import { saveOrUpdate, getViewById, getTypeList } from '../line.api';

// 注册全屏地图弹窗
const [registerMapModal, { openModal: openMapModal }] = useModal();
const emit = defineEmits(['success']);
const uploadRef = ref();
const formRef = ref();
const labelCol = { style: { width: '110px' } };
const wrapperCol = { style: { width: 'calc(100% - 110px)' } };

const state = reactive({
  loading: false,
  typeList: [],
  dangerWorkmanshipLoading: false,
  formState: {
    id: '',
    monitorCategoryId: '',
    monitorTypeId: '',
    monitorName: '',
    monitorCode: '',
    installLocation: '',
    manufacturer: '',
    installDate: '',
    lng: 0,
    lat: 0,
    installDirectionId: '',
    onlineStatus: 'Y', // 默认在线
    fileList: [],
  },
});

let type = ref('');
let row = ref({});
let title = computed(() => {
  const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
  return `${str}设备信息`;
});
let readonly = computed(() => type.value == 'view');

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  row.value = data.row;
  type.value = data.type;
  resetForm();
  getDangerWorkmanshipData();
  if (type.value == 'view' || type.value == 'edit') {
    await getData();
  }
});

// 获取设备类别下拉数据
const getDangerWorkmanshipData = async () => {
  state.dangerWorkmanshipLoading = true;
  try {
    const res = await getTypeList({ pageSize: 999 });
    state.typeList = res || [];
  } catch (error) {
    console.error('获取危险设备类型失败:', error);
  } finally {
    state.dangerWorkmanshipLoading = false;
  }
};

const getData = async () => {
  state.loading = true;
  try {
    const res = await getViewById({ id: row.value.id });
    Object.assign(state.formState, res);
    // 回显文件列表（若后端返回的字段为 fileList，直接赋值即可）
    if (res.fileList) {
      state.formState.fileList = res.fileList;
    }
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    state.loading = false;
  }
};

// ---------- 防抖处理经纬度 ----------
// 防抖函数
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
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

// 计算地图预览URL（使用防抖后的经纬度）
const mapPreviewUrl = computed(() => {
  const lng = debouncedLng.value;
  const lat = debouncedLat.value;
  if (lng != null && lat != null && !isNaN(lng) && !isNaN(lat)) {
    return `http://uri.amap.com/marker?position=${lng},${lat}&name=工程位置`;
  }
  return '';
});

// 全屏地图URL（使用防抖后的经纬度）
const mapFullUrl = computed(() => {
  const lng = debouncedLng.value;
  const lat = debouncedLat.value;
  if (lng != null && lat != null && !isNaN(lng) && !isNaN(lat)) {
    return `http://uri.amap.com/marker?position=${lng},${lat}&name=工程位置&src=工程管理`;
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

// 保存
const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      state.loading = true;
      if (uploadRef.value) {
        const rawFiles = uploadRef.value.imageFiles || [];
        let params = { ...state.formState };
        // 转换为后端要求的格式
        let fileList = rawFiles.map(file => ({
          bizId: file.bizId || params.id,
          fileName: file.fileName,
          fileType: file.fileType,
          fileSize: file.fileSize,
          fileExtname: file.fileExtname,
          fileAddr: file.fileAddr,
          filePath: file.filePath,
        }));
        params.fileList = fileList;
        // 删除旧的临时字段
        delete params.imageFiles;
        saveOrUpdate(params)
          .then(() => {
            emit('success');
            message.success('保存成功');
            closeModal();
            resetForm();
          })
          .catch((error) => {
            message.error(error.message || '保存失败');
          })
          .finally(() => {
            state.loading = false;
          });
      } else {
        saveOrUpdate(state.formState)
          .then(() => {
            emit('success');
            message.success('保存成功');
            closeModal();
            resetForm();
          })
          .catch((error) => {
            message.error(error.message || '保存失败');
          })
          .finally(() => {
            state.loading = false;
          });
      }
    })
    .catch(() => {
      message.error('请检查表单填写');
      state.loading = false;
    });
};

const resetForm = () => {
  formRef.value?.clearValidate();
  state.formState = {
    id: '',
    monitorCategoryId: '',
    monitorTypeId: '',
    monitorName: '',
    monitorCode: '',
    installLocation: '',
    manufacturer: '',
    installDate: '',
    fileList: [],
    lng: 0,
    lat: 0,
    installDirectionId: '',
    onlineStatus: 'Y',
  };
  // 重置防抖坐标
  debouncedLng.value = 0;
  debouncedLat.value = 0;
  state.loading = false;
};

const handleCancel = () => {
  resetForm();
};
</script>

<style lang="less" scoped>
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