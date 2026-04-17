<template>
  <div class="user-select-trigger">
    <a-input
      readonly
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="user-select-input"
      @click="handleOpenModal"
    />
    <a-button type="primary" :disabled="disabled" @click="handleOpenModal">
      {{ buttonText }}
    </a-button>

    <SelectModal
      :rowSelectionType="rowSelectionType"
      @register="registerModal"
      @select="handleSelectKeys"
      @selectRows="handleSelectRows"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, toRaw } from 'vue';
import type { PropType } from 'vue';
import { useModal } from '@/components/Modal';
import SelectModal from './selectModal.vue';

interface UserRecord {
  [key: string]: any;
}

const props = defineProps({
  value: {
    type: Array as PropType<Array<string | number>>,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  buttonText: {
    type: String,
    default: '选择',
  },
  rowSelectionType: {
    type: String as PropType<'radio' | 'checkbox'>,
    default: 'checkbox',
  },
  displayField: {
    type: String,
    default: 'realname',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  otherParams: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:value', 'change', 'select', 'selectRows', 'confirm']);

const selectedKeys = ref<Array<string | number>>([]);
const selectedRows = ref<UserRecord[]>([]);

watch(
  () => props.value,
  (val) => {
    selectedKeys.value = Array.isArray(val) ? [...val] : [];
  },
  { immediate: true }
);

const displayValue = computed(() => {
  if (selectedRows.value.length) {
    return selectedRows.value
      .map((item) => item?.[props.displayField])
      .filter((item) => !!item)
      .join('、');
  }
  if (selectedKeys.value.length) {
    return selectedKeys.value.join('、');
  }
  return '';
});

const [registerModal, { openModal }] = useModal();

function handleOpenModal() {
  if (props.disabled) return;
  // 打开弹窗时把当前已选数据传给弹窗，用于回显
  openModal(true, {
    otherParams: props.otherParams,
    selectedKeys: toRaw(selectedKeys.value),
    selectedRows: toRaw(selectedRows.value),
    rowSelectionType: props.rowSelectionType,
  });
}

function handleSelectKeys(keys: Array<string | number>, extra?: Record<string, any>) {
  selectedKeys.value = keys;
  emit('update:value', keys);
  emit('select', { keys, extra });
  emit('change', {
    keys: toRaw(keys),
    rows: toRaw(selectedRows.value),
    extra,
  });
}

function handleSelectRows(rows: UserRecord[], extra?: Record<string, any>) {
  selectedRows.value = rows;
  emit('selectRows', { rows, extra });
  emit('confirm', { rows, keys: toRaw(selectedKeys.value), extra });
  emit('change', {
    keys: toRaw(selectedKeys.value),
    rows: toRaw(rows),
    extra,
  });
}
</script>

<style scoped lang="less">
.user-select-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.user-select-input {
  flex: 1;
}
</style>
