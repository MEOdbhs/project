<template>
  <BasicModal
    :title="title"
    :width="'70vw'"
    :height="600"
    :can-fullscreen="false"
    :keyboard="false"
    v-bind="$attrs"
    :maskClosable="false"
    okText="确定"
    cancelText="取消"
    :show-ok-btn="!readonly"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full pl-10px pr-10px" v-loading="state.loading">
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
          <a-col :span="8">
            <a-form-item label="接口名称" name="interfaceName" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.interfaceName" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="接口地址" name="url" :rules="[{ required: true, message: '请输入' }]">
              <a-input v-model:value="state.formState.url" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="请求方式" name="interfaceOption" :rules="[{ required: true, message: '请输入' }]">
              <a-select
                ref="select"
                v-model:value="state.formState.interfaceOption"
                style="width: 100%"
                placeholder="请选择"
                :options="interfaceOptionList"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item label="请求超时时间(s)" name="requestTimeout" :rules="[{ required: false, message: '请输入' }]">
              <a-input-number v-model:value="state.formState.requestTimeout" :min="0" :max="60 * 60 * 24" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否鉴权" name="authType" :rules="[{ required: true, message: '请选择' }]">
              <a-select ref="select" v-model:value="state.formState.authType" style="width: 100%" placeholder="请选择">
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否启用" name="status" :rules="[{ required: true, message: '请选择' }]">
              <a-select ref="select" v-model:value="state.formState.status" style="width: 100%" placeholder="请选择">
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item label="请求体内容类型" name="contentType" :rules="[{ required: true, message: '请选择' }]">
              <a-input v-model:value="state.formState.contentType" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="响应体格式" name="responseType" :rules="[{ required: false, message: '请选择' }]">
              <a-input v-model:value="state.formState.responseType" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="接口标签" name="interfaceTag" :rules="[{ required: false, message: '请选择' }]">
              <a-input v-model:value="state.formState.interfaceTag" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="备注" name="memo">
              <a-textarea v-model:value="state.formState.memo" placeholder="请输入" :rows="2" :maxlength="100" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="请求头" name="requestHeaders">
              <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd1" :disabled="readonly">新增</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <div style="width: calc(100% - 150px); margin-left: 150px">
            <a-table :columns="columns1" size="small" :data-source="state.tableData1" bordered :pagination="false" :scroll="{ y: '320px' }">
              <template #bodyCell="{ column, record }">
                <div v-if="column.dataIndex === 'itemName' || column.dataIndex === 'itemValue'">
                  <a-input v-model:value="record[column.dataIndex]" placeholder="请输入" allowClear />
                </div>
                <div v-if="column.dataIndex === 'action'">
                  <a-button type="link" @click="handleDelete1" :disabled="readonly">删除</a-button>
                </div>
              </template>
            </a-table>
          </div>
        </a-row>
        <a-row class="mt-12px">
          <a-col :span="24">
            <a-form-item label="接口输入参数" name="interfaceParams">
              <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd2" :disabled="readonly">新增</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <div style="width: calc(100% - 150px); margin-left: 150px">
            <a-table :columns="columns2" size="small" :data-source="state.tableData2" bordered :pagination="false" :scroll="{ y: '320px' }">
              <template #bodyCell="{ column, record }">
                <div v-if="column.dataIndex === 'itemName' || column.dataIndex === 'itemCode'">
                  <a-input v-model:value="record[column.dataIndex]" placeholder="请输入" allowClear />
                </div>
                <div v-if="column.dataIndex === 'dataType'">
                  <a-select v-model:value="record[column.dataIndex]" style="width: 100%" allowClear :options="dataTypeList" />
                </div>
                <div v-if="column.dataIndex === 'nullFlag'">
                  <a-select v-model:value="record[column.dataIndex]" style="width: 100%" allowClear>
                    <a-select-option :value="1">是</a-select-option>
                    <a-select-option :value="0">否</a-select-option>
                  </a-select>
                </div>
                <div v-if="column.dataIndex === 'action'">
                  <a-button type="link" @click="handleDelete2" :disabled="readonly">删除</a-button>
                </div>
              </template>
            </a-table>
          </div>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  import { saveOrUpdateInterface, getViewByIdInterface } from '../appPermission.api';
  import { message } from 'ant-design-vue';
  import { dataTypeList, interfaceOptionList } from '../appPermission.data';
  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const labelCol = { style: { width: '150px' } };
  const wrapperCol = { style: { width: 'calc(100% - 150px)' } };
  const columns1 = [
    {
      title: '属性名称',
      dataIndex: 'itemName',
      align: 'center',
    },
    {
      title: '属性值',
      dataIndex: 'itemValue',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 80,
    },
  ];
  const columns2 = [
    {
      title: '属性名称',
      dataIndex: 'itemName',
      align: 'center',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      align: 'center',
    },
    {
      title: '属性编码',
      dataIndex: 'itemCode',
      align: 'center',
    },
    {
      title: '是否为空',
      dataIndex: 'nullFlag',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 80,
    },
  ];
  const state = reactive({
    loading: false,
    showOkBtn: true,
    formState: {
      id: '',
      //
      interfaceName: '', //接口名称
      url: '', //接口url
      interfaceOption: 0, //请求方式  0:get 1:post 2:put 3:delete 4:options 5:head 6:patch 7:trace
      requestTimeout: 3, //请求超时时间 单位：秒
      authType: 1, //鉴权方式 0不鉴权，1鉴权
      contentType: 'application/json, text/plain, */*', //请求体内容类型
      responseType: 'application/json', //响应体格式
      interfaceTag: '', //	接口标签
      interfaceParams: '', //	接口参数 存放json
      requestHeaders: '', //请求头
      memo: '', //备注
      status: 1, //是否启用 0：停用 1：启用
    },
    tableData1: [],
    tableData2: [],
  });

  // 当前的弹窗数据
  let type = ref('');
  let row = ref({});
  let title = computed(() => {
    const str = type.value == 'add' ? '新增' : type.value == 'edit' ? '编辑' : '查看';
    return `${str}接口`;
  });
  let readonly = computed(() => {
    return type.value == 'view';
  });
  // 注册弹窗
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    row.value = data.row;
    type.value = data.type;
    setForm();
    if (type.value == 'view' || type.value == 'edit') {
      getData();
    }
    if (type.value == 'view') {
      state.showOkBtn = false;
    } else {
      state.showOkBtn = true;
    }
  });

  const getData = async () => {
    state.loading = true;
    const res = await getViewByIdInterface({ id: row.value.id });
    Object.assign(state.formState, res);
    state.tableData1 = JSON.parse(res.requestHeaders);
    state.tableData2 = JSON.parse(res.interfaceParams);
    state.loading = false;
  };
  const resetForm = () => {
    formRef.value.resetFields();
  };
  const handleOk = () => {
    formRef.value.validate().then(() => {
      state.loading = true;
      let params = state.formState;
      if (type.value === 'add') {
        delete params.id;
      }
      params.requestHeaders = JSON.stringify(state.tableData1);
      params.interfaceParams = JSON.stringify(state.tableData2);
      saveOrUpdateInterface(params)
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
  const setForm = () => {
    state.formState = {
      id: '',
      //
      interfaceName: '', //接口名称
      url: '', //接口url
      interfaceOption: 0, //请求方式  0:get 1:post 2:put 3:delete 4:options 5:head 6:patch 7:trace
      requestTimeout: 3, //请求超时时间 单位：秒
      authType: 1, //鉴权方式 0不鉴权，1鉴权
      contentType: 'application/json, text/plain, */*', //请求体内容类型
      responseType: 'application/json', //响应体格式
      interfaceTag: '', //	接口标签
      interfaceParams: '', //	接口参数 存放json
      requestHeaders: '', //请求头
      memo: '', //备注
      status: 1, //是否启用 0：停用 1：启用
    };
    state.tableData1 = [
      {
        key: 'key' + new Date().getTime(),
        itemName: 'Authorization',
        itemValue: 'eyJhbGciOiJIUzI1NiIsInCJ9......(举例)',
      },
    ];
    state.tableData2 = [];
  };
  const handleCancel = () => {
    resetForm();
  };
  const handleAdd1 = () => {
    const item = {
      key: 'key' + new Date().getTime(),
      itemName: '',
      itemValue: '',
    };
    state.tableData1.push(item);
  };
  const handleAdd2 = () => {
    const item = {
      key: 'key' + new Date().getTime(),
      itemName: '',
      dataType: 'string',
      itemCode: '',
      nullFlag: 0,
    };
    state.tableData2.push(item);
  };
  const handleDelete1 = (record) => {
    state.tableData1.splice(record, 1);
  };
  const handleDelete2 = (record) => {
    state.tableData2.splice(record, 1);
  };
</script>
<style lang="less" scoped>
  :deep(.select-user) {
    display: flex;
    border-radius: 4px;
    min-height: 32px;
    align-items: center;
    padding: 4px 11px;
    flex-wrap: wrap;
    .ant-tag {
      margin: 2px 6px;
    }
  }
  :deep(.select-user-light) {
    border: 1px solid #d9d9d9;
  }
  :deep(.select-user-dark) {
    border: 1px solid #163260;
  }
</style>
