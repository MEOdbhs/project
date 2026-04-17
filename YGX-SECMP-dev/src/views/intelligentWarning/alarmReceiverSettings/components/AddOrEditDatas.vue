<template>
  <BasicModal
    :title="title"
    :width="'60vw'"
    :height="200"
    :can-fullscreen="false"
    :keyboard="false"
    :destroy-on-close="true"
    :maskClosable="false"
    v-bind="$attrs"
    :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'"
    :showOkBtn="!readonly"
    @register="registerModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="h-full overflow-y-auto" v-loading="state.loading" style="padding: 10px;">
      <a-form
        ref="formRef"
        :model="state.formState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :disabled="readonly"
        autocomplete="off"
      >
        <a-row :gutter="24">
          <!-- 姓名 -->
          <a-col :span="12">
            <a-form-item label="姓名" name="name" :rules="[{ required: true, message: '请输入姓名' }]">
              <a-input v-model:value="state.formState.name" placeholder="请输入" allowClear :maxlength="200" />
            </a-form-item>
          </a-col>
          <!-- 电话 -->
          <a-col :span="12">
            <a-form-item label="电话" name="phone" :rules="[{ required: true, message: '请输入电话' }]">
              <a-input v-model:value="state.formState.phone" placeholder="请输入" allowClear :maxlength="16" />
            </a-form-item>
          </a-col>
        
          <!-- 描述 -->
          <a-col :span="24">
            <a-form-item label="描述" name="memo">
              <a-textarea v-model:value="state.formState.memo" placeholder="请输入描述" :rows="3" :maxlength="500" allowClear />
            </a-form-item>
          </a-col>
       
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
// import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { saveOrUpdates, getViewByIds } from '../line.api'; // 请根据实际路径修改

const emit = defineEmits(['success']);
const formRef = ref();
const type = ref('add');      // add / edit / view
const row = ref<any>({});

const labelCol = { style: { width: '100px' } };
const wrapperCol = { style: { width: 'calc(100% - 100px)' } };

// 表单状态
const state = reactive({
  loading: false,
  formState: {
    receiveId: '',          // 主键
    alarmLevelId: '',       // 预警等级字典ID
    alarmLevelName: '',     // 预警等级名称（前端不编辑，后端自动处理）
    userStatus: 'N',        // 默认非平台内人员
    userId: '',             // 用户ID
    name: '',
    phone: '',
    memo: '',
    sortNum: undefined,
  },
});

const title = computed(() => {
  const map = { add: '新增', edit: '编辑', view: '查看' };
  return `${map[type.value] || '查看'} 预警接收人`;
});
const readonly = computed(() => type.value === 'view');

// 注册弹窗
const [registerModal, { closeModal }] = useModalInner(async (data) => {
  type.value = data.type;
  row.value = data.row || {};
  resetForm();
  if (type.value === 'add') return;
  await getData();
});

// 获取详情
async function getData() {
  state.loading = true;
  try {
    const result = await getViewByIds({ id: row.value.id });
    if (result) {
      // 直接覆盖表单数据（注意字段名与实体一致）
      Object.assign(state.formState, {
        receiveId: result.receiveId || result.id,
        alarmLevelId: result.alarmLevelId,
        alarmLevelName: result.alarmLevelName,
        userStatus: result.userStatus || 'N',
        userId: result.userId,
        name: result.name,
        phone: result.phone,
        memo: result.memo,
        sortNum: result.sortNum,
      });
    }
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    state.loading = false;
  }
}

// 重置表单
function resetForm() {
  formRef.value?.clearValidate();
  state.formState = {
    receiveId: '',
    alarmLevelId: '',
    alarmLevelName: '',
    userStatus: 'N',
    userId: '',
    name: '',
    phone: '',
    memo: '',
    sortNum: undefined,
  };
  state.loading = false;
}

// 取消
function handleCancel() {
  resetForm();
}

// 保存
async function handleOk() {
  if (readonly.value) {
    closeModal();
    return;
  }
  try {
    await formRef.value?.validate();
  } catch {
    message.error('请检查表单填写');
    return;
  }

  state.loading = true;
  // 构建提交参数，移除可能的空值
  const params = { ...state.formState };
  if (type.value === 'add') delete params.receiveId; // 新增时去掉主键

  try {
    await saveOrUpdates(params);
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

// 打开用户选择弹窗（根据实际需求实现）
// function openUserSelect() {
//   // 示例：使用一个简单的用户选择器（实际应根据项目框架实现）
//   // 这里演示一个模拟选择
//   layer.open({
//     type: 2,
//     title: '选择用户',
//     area: ['800px', '600px'],
//     content: '/path/to/userSelect.html',
//     end: () => {
//       // 假设全局变量 selectedUser 被赋值
//       if (window.selectedUser) {
//         state.formState.userId = window.selectedUser.id;
//         // 也可以同时更新姓名和电话（如果用户选择包含了这些信息）
//         // state.formState.name = window.selectedUser.name;
//         // state.formState.phone = window.selectedUser.phone;
//       }
//     },
//   });
// }
</script>

<style lang="less" scoped></style>