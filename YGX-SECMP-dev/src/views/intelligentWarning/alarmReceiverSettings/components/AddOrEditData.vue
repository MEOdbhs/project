<template>
  <BasicModal :title="title" :width="'80vw'" :height="700" :can-fullscreen="false" :keyboard="false"
    :destroy-on-close="true" :maskClosable="false" v-bind="$attrs" :okText="readonly ? undefined : '确定'"
    :cancelText="readonly ? '关闭' : '取消'" :showOkBtn="!readonly" @register="registerModal" @ok="handleOk"
    @cancel="handleCancel">
    <div class="h-full overflow-y-auto" style="margin-top: 20px;" v-loading="state.loading">
      <a-form ref="formRef" :model="state.formState" :label-col="labelCol" :wrapper-col="wrapperCol"
        :disabled="readonly" autocomplete="off">
        <!-- 基本信息 -->
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="区县" name="areaId" :rules="[{ required: true, message: '请选择区县' }]">
              <a-select v-model:value="state.formState.areaId" placeholder="请选择区县">
                <a-select-option v-for="item in ThemeList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="单位名称" name="unitName" :rules="[{ required: true, message: '请输入单位名称' }]">
              <a-input v-model:value="state.formState.unitName" placeholder="请输入" allowClear :maxlength="100" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="描述" name="memo">
              <a-textarea v-model:value="state.formState.memo" placeholder="请输入描述" :rows="3" allowClear />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 预警等级接收人设置（左右布局） -->
        <div class="section-title">接收人设置</div>
        <div class="receiver-layout">
          <!-- 左侧：预警等级列表（动态） -->
          <div class="level-list">
            <div v-for="level in levelOptions" :key="level.value" class="level-item"
              :style="{ backgroundColor: level.color }"
              :class="['level-item', { active: currentLevel === level.value }]" @click="handleSelectLevel(level.value)">
              {{ level.label }}
            </div>
          </div>

          <!-- 右侧：人员表格 -->
          <div class="person-table">
            <div class="table-header">
              <span class="table-title">{{ currentLevelLabel }}接收人</span>
              <a-button v-if="!readonly" type="primary" size="small" @click="handleAddPerson">
                添加
              </a-button>
            </div>
            <a-table :columns="personColumns" :data-source="currentPersonList" :pagination="false" rowKey="rowId"
              size="small">
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.dataIndex === 'index'">
                  {{ index + 1 }}
                </template>
                <template v-else-if="column.dataIndex === 'name'">
                  <a-input v-if="!readonly" v-model:value="record.name" placeholder="姓名" :maxlength="200" />
                  <span v-else>{{ record.name }}</span>
                </template>
                <template v-else-if="column.dataIndex === 'phone'">
                  <a-input v-if="!readonly" v-model:value="record.phone" placeholder="电话" :maxlength="16" />
                  <span v-else>{{ record.phone }}</span>
                </template>
                <template v-else-if="column.dataIndex === 'memo'">
                  <a-input v-if="!readonly" v-model:value="record.memo" placeholder="描述" :maxlength="200" />
                  <span v-else>{{ record.memo }}</span>
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                  <a-button v-if="!readonly" type="link" danger size="small" @click="handleDeletePerson(record.rowId)">
                    删除
                  </a-button>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { saveOrUpdate, getViewById, getThemeListApi, getLevelOptionsApi } from '../line.api';

const emit = defineEmits(['success']);
const formRef = ref();
const type = ref('add');
const row = ref<any>({});
const ThemeList = ref([]);
const labelCol = { style: { width: '100px' } };
const wrapperCol = { style: { width: 'calc(100% - 100px)' } };

// 预警等级选项（动态）
const levelOptions = ref<Array<{ value: string; label: string; color: string }>>([]);

// 人员表格列
const personColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '姓名', dataIndex: 'name', width: 150 },
  { title: '电话', dataIndex: 'phone', width: 150 },
  { title: '描述', dataIndex: 'memo', width: 200 },
  { title: '操作', dataIndex: 'action', width: 80 },
];

// 状态管理
const state = reactive({
  loading: false,
  formState: {
    id: '',
    areaId: '',
    unitName: '',
    memo: '',
  },
  detailList: {} as Record<string, PersonRecord[]>, // 按等级 value 存储人员列表
});

interface PersonRecord {
  rowId: string;        // 前端唯一标识
  id?: string;          // 后端主键（编辑时存在）
  alarmLevelId: string; // 预警等级 value
  name: string;
  phone: string;
  memo?: string;
  userId?: string;      // 平台内用户ID（若有）
  userStatus?: 'Y' | 'N';
}

const currentLevel = ref(''); // 当前选中的预警等级 value
const currentLevelLabel = computed(() => {
  return levelOptions.value.find(l => l.value === currentLevel.value)?.label || '';
});
const currentPersonList = computed(() => state.detailList[currentLevel.value] || []);

const title = computed(() => {
  const map = { add: '新增', edit: '编辑', view: '查看' };
  return `${map[type.value] || '查看'} 预警接收设置`;
});

const readonly = computed(() => type.value === 'view');

const [registerModal, { closeModal }] = useModalInner(async (data) => {
  type.value = data.type;
  row.value = data.row || {};
  resetForm();
  await getThemeList();
  await loadLevelOptions(); // 先加载等级选项
  if (type.value === 'add') return;
  await getData();
});

// 获取区县列表
async function getThemeList() {
  ThemeList.value = await getThemeListApi({ areaLevel: '3' });
}

// 获取预警等级选项（动态）
async function loadLevelOptions() {
  try {
    const options = await getLevelOptionsApi('/monitor_alarm_level');
    // 假设返回格式如 [{ value: "monitor_alarm_blue", label: "蓝色预警", color: "#2196F3" }, ...]
    levelOptions.value = options;
    // 初始化 detailList 对象，每个等级对应空数组
    const initDetailList: Record<string, PersonRecord[]> = {};
    options.forEach(level => {
      initDetailList[level.value] = [];
    });
    state.detailList = initDetailList;
    // 设置默认选中第一个等级
    if (options.length > 0 && !currentLevel.value) {
      currentLevel.value = options[0].value;
    }
  } catch (error) {
    message.error('加载预警等级失败');
  }
}

// 获取编辑/查看数据
async function getData() {
  state.loading = true;
  try {
    const result = await getViewById({ id: row.value.id });
    if (result) {
      // 填充主表信息
      Object.assign(state.formState, result);
      // 清空现有 detailList（保留空数组）
      for (const level of levelOptions.value) {
        state.detailList[level.value] = [];
      }
      // 按 alarmLevelId 分组填充 detailList
      const receiverList = result.detailList || [];
      receiverList.forEach((item: any) => {
        const levelId = item.alarmLevelId;
        if (state.detailList[levelId]) {
          state.detailList[levelId].push({
            rowId: item.id,          // 使用后端 id 作为 rowId
            id: item.id,
            alarmLevelId: levelId,
            name: item.name,
            phone: item.phone,
            memo: item.memo,
            userId: item.userId,
            userStatus: item.userStatus,
          });
        }
      });
    }
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    state.loading = false;
  }
}

function resetForm() {
  formRef.value?.clearValidate();
  state.formState = { id: '', areaId: '', unitName: '', memo: '' };
  // 重置 detailList 但保留空数组结构（需要等 levelOptions 加载后，在 loadLevelOptions 中初始化）
  // 如果 levelOptions 未加载，则暂不操作
  if (levelOptions.value.length) {
    const initDetailList: Record<string, PersonRecord[]> = {};
    levelOptions.value.forEach(level => {
      initDetailList[level.value] = [];
    });
    state.detailList = initDetailList;
  } else {
    state.detailList = {};
  }
  currentLevel.value = levelOptions.value[0]?.value || '';
  state.loading = false;
}

// 生成临时 rowId
function generateTempId() {
  return `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function handleSelectLevel(levelId: string) {
  currentLevel.value = levelId;
}

function handleAddPerson() {
  if (readonly.value) return;
  const levelId = currentLevel.value;
  if (!levelId) return;
  const newPerson: PersonRecord = {
    rowId: generateTempId(),
    alarmLevelId: levelId,
    name: '',
    phone: '',
    memo: '',
  };
  state.detailList[levelId].push(newPerson);
}

function handleDeletePerson(rowId: string) {
  if (readonly.value) return;
  const levelId = currentLevel.value;
  if (!levelId) return;
  state.detailList[levelId] = state.detailList[levelId].filter(p => p.rowId !== rowId);
}

function handleCancel() {
  resetForm();
}

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
  // 组装子表数据
  const receiverList: any[] = [];
  for (const [levelId, persons] of Object.entries(state.detailList)) {
    persons.forEach(person => {
      // 判断是否为新增记录（rowId 以 "new-" 开头或没有 id 字段）
      const isNew = person.rowId.startsWith('new-') || !person.id;
      receiverList.push({
        id: isNew ? undefined : person.id, // 新增时不传 id
        alarmLevelId: levelId,
        name: person.name,
        phone: person.phone,
        memo: person.memo,
        userStatus: person.userStatus || 'N',
        userId: person.userId,
      });
    });
  }

  const params = {
    ...state.formState,
    'detailList': receiverList,
  };
  console.log(receiverList, 'receiverList')
  // if (type.value === 'add') delete params.id;

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
</script>

<style lang="less" scoped>
.section-title {
  margin: 16px 0 12px;
  padding-left: 10px;
  border-left: 2px solid #1677ff;
  font-weight: 600;
  font-size: 16px;
}

.receiver-layout {
  display: flex;
  gap: 24px;
  min-height: 300px;
  border-radius: 4px;
  padding: 16px;

  .level-list {
    width: 140px;
    flex-shrink: 0;
    padding-right: 16px;

    .level-item {
      padding: 10px 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
      color: #fff;
      text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);

      &.active {
        border: 2px solid #fff;
        box-shadow: 0 0 0 2px #1890ff;
      }
    }
  }

  .person-table {
    flex: 1;
    overflow-x: auto;

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .table-title {
        font-size: 14px;
        font-weight: 500;
      }
    }

    :deep(.ant-table) {
      background: transparent;
    }
  }
}
</style>