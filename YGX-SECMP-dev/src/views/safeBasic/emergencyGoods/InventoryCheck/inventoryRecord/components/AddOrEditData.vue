<template>
  <BasicModal
    :title="title"
    :width="'70vw'"
    :height="540"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    :maskClosable="false"
    :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'"
    :showOkBtn="!readonly"
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full" v-loading="state.loading">
      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="readonly" autocomplete="off">
        <a-row :gutter="24">
          <a-col :span="24">
            <div class="public-title">基本信息</div>
          </a-col>
          <a-col :span="12">
            <a-form-item label="盘点编号" name="inventoryNum">
              <a-input v-model:value="state.formState.inventoryNum" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="盘点计划名称" name="inventoryName">
              <a-input v-model:value="state.formState.inventoryName" allowClear disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="盘点区域" name="inventoryLocal">
              <a-select
                v-model:value="state.formState.inventoryLocal"
                :options="areaOptions"
                :field-names="{ label: 'storageName', value: 'id' }"
                allowClear
                placeholder="请选择"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="盘点时间" name="inventoryStatus">
              <a-input disabled :value="state.formState.startTime + '~' + state.formState.endTime" :rows="3" :maxlength="200" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="盘点人员" name="inventoryUserName">
              <div class="approval-user-select">
                <a-textarea disabled v-model:value="state.formState.inventoryUserName" allowClear />
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="盘点状态" name="inventoryStatus">
              <a-tag :color="state.formState.inventoryStatus == '1' ? 'green' : 'red'">{{
                state.formState.inventoryStatus == '1' ? '已完成' : '待完成'
              }}</a-tag>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <div class="public-title">盘点结果</div>
          </a-col>
          <a-col :span="24">
            <GoodsResultTable
              :columns="goodsColumns"
              :dataSource="goodsTableData"
              :readonly="readonly || type == 'apply'"
              :pagination="goodsPagination"
              @page-change="handleGoodsPageChange"
              @size-change="handleGoodsSizeChange"
            />
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" name="inventoryRemark">
              <a-textarea v-model:value="state.formState.inventoryRemark" :rows="3" :maxlength="200" :disabled="readonly || type == 'apply'" />
            </a-form-item>
          </a-col>
          <template v-if="type == 'view' || type == 'apply'">
            <a-col :span="24">
              <a-form-item label="审核状态" name="reviewStatus" :rules="[{ required: type == 'apply', message: '请选择审核状态' }]">
                <a-radio-group v-model:value="state.formState.reviewStatus">
                  <a-radio value="1">通过</a-radio>
                  <a-radio value="2">不通过</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="备注" name="reviewRemark">
                <a-textarea v-model:value="state.formState.reviewRemark" :rows="3" :maxlength="200" />
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </div>
    <selectUser @select="handleApproverSelected" @register="registerSelectUserModal" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { getMaterialsList, getStorageList, saveOrUpdateResult, getViewById, saveOrUpdateReview } from '../line.api';
  import selectUser from '/@/components/selectUser/index.vue';
  import GoodsResultTable from './GoodsResultTable.vue';
  import { goodsColumns } from '../line.data';

  const emit = defineEmits(['success', 'register']);
  const formRef = ref();
  const type = ref('add');
  const row = ref<any>({});
  const areaOptions = ref<{ label: string; value: string }[]>([]);
  const goodsPagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 当前仓库物资数据
  const goodsTableData = ref<any[]>([]);
  const goodsAllData = ref<any[]>([]); //总数据

  const labelCol = { style: { width: '120px' } };
  const wrapperCol = { style: { width: 'calc(100% - 120px)' } };

  // 表单默认值
  const createDefaultFormState = () => ({
    id: '',
    inventoryNum: '',
    inventoryName: '',
    inventoryLocal: '',
    startTime: '',
    endTime: '',
    inventoryUserId: '',
    inventoryUserName: '',
    remark: '',
    reviewStatus: '1',
    reviewRemark: '',
    inventoryRemark: '',
    inventoryStatus: '',
  });

  const state = reactive({
    loading: false,
    formState: createDefaultFormState(),
  });

  const title = computed(() => {
    const typeMap = {
      add: '新增',
      edit: '编辑',
      apply: '审核',
      view: '查看',
    };
    return typeMap[type.value] || '查看';
  });

  const readonly = computed(() => type.value === 'view');

  const [registerSelectUserModal, { openModal: openSelectUserModal }] = useModal();

  // 盘点区域数据
  const getStoragesData = async () => {
    const res = await getStorageList();
    areaOptions.value = res || [];
  };
  // 获取当前仓库下的所有物资
  const getALLGoodsList = async (warehouseId) => {
    const res = await getMaterialsList({ warehouseId });
    if (res && res.length) {
      goodsAllData.value = res.map((item) => ({
        ...item,
        nowStock: '',
        difference: 0,
        remake: '',
        inventoryId: state.formState.id,
        materialsName: item.materialName,
        materialsNum: item.materialCode,
        sysStock: item.materialNum,
      }));
    }
    goodsPagination.current = 1;
    goodsPagination.total = goodsAllData.value.length || 0;
    updateGoodsTableData();
  };

  const updateGoodsTableData = () => {
    const start = (goodsPagination.current - 1) * goodsPagination.pageSize;
    const end = start + goodsPagination.pageSize;
    goodsTableData.value = goodsAllData.value.slice(start, end);
  };

  const handleGoodsPageChange = (page: number, pageSize: number) => {
    goodsPagination.current = page;
    goodsPagination.pageSize = pageSize;
    updateGoodsTableData();
  };

  const handleGoodsSizeChange = (_current: number, pageSize: number) => {
    goodsPagination.current = 1;
    goodsPagination.pageSize = pageSize;
    updateGoodsTableData();
  };

  // 加载详情
  const getData = async () => {
    state.loading = true;
    const data = await getViewById({ id: row.value.id });
    if (data) {
      Object.assign(state.formState, data);
      if (data.reviewList && data.reviewList.length) {
        state.formState.reviewRemark = data.reviewList[0].reviewRemark;
      }
      if (type.value == 'view' || type.value == 'apply') {
        goodsAllData.value = data.resultList;
        goodsPagination.current = 1;
        goodsPagination.total = data.resultList.length;
        updateGoodsTableData();
      }
      if (type.value == 'apply') {
        state.formState.reviewStatus = '1';
      }
      if (type.value == 'edit') {
        await getALLGoodsList(data.inventoryLocal);
      }
    }
    state.loading = false;
  };

  // 人员选择弹窗回填
  const handleApproverSelected = (data, rows) => {
    if (rows && rows.length > 0) {
      state.formState.inventoryUserId = data;
      state.formState.inventoryUserName = rows.map((item) => item.username).join('，');
    }
  };

  // 打开人员选择弹窗
  const handleSelectApprover = (currentType) => {
    let selectedUserIds: any = state.formState.inventoryUserId;
    if (typeof selectedUserIds === 'string') {
      selectedUserIds = selectedUserIds.split(',');
    }
    openSelectUserModal(true, { type: currentType, data: selectedUserIds });
  };

  // 重置弹窗状态
  const resetForm = () => {
    formRef.value?.clearValidate?.();
    state.formState = createDefaultFormState();
    goodsTableData.value = [];
    goodsAllData.value = [];
    goodsPagination.current = 1;
    goodsPagination.pageSize = 10;
    goodsPagination.total = 0;
    state.loading = false;
  };

  const handleCancel = () => {
    resetForm();
  };

  // 保存
  const handleOk = async () => {
    if (readonly.value) {
      closeModal();
      return;
    }
    await formRef.value?.validate();
    state.loading = true;
    try {
      console.log(state.formState);
      console.log(goodsAllData.value);
      if (type.value == 'edit') {
        // 盘点
        const params = {
          ...state.formState,
          resultList: goodsAllData.value,
        };
        await saveOrUpdateResult(params);
      } else {
        // 审核
        const params = {
          ...state.formState,
          reviewList: [
            {
              reviewStatus: state.formState.reviewStatus,
              reviewRemark: state.formState.reviewRemark,
              inventoryId: state.formState.id,
            },
          ],
        };
        await saveOrUpdateReview(params);
      }

      message.success('保存成功');
      emit('success');
      closeModal();
      resetForm();
    } catch (error) {
      message.error('保存失败，请稍后重试');
    } finally {
      state.loading = false;
    }
  };

  // 弹窗打开初始化
  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    type.value = data.type;
    row.value = data.row || {};
    resetForm();
    await getStoragesData();
    await getData();
  });
</script>
<style>
  .approval-user-select {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
  }
  .public-title {
    font-size: 16px;
    font-weight: 600;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 12px;
    margin-left: 12px;
  }
</style>
