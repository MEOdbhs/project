<template>
  <span :class="getClass">
    <slot></slot>
    <BasicHelp :class="`${prefixCls}-help`" v-if="helpMessage" :text="helpMessage" />
  </span>
</template>
<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { useSlots, computed } from 'vue';
  import BasicHelp from './BasicHelp.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { ThemeEnum } from '/@/enums/appEnum';
  const props = defineProps({
    /**
     * Help text list or string
     * @default: ''
     */
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    /**
     * Whether the color block on the left side of the title
     * @default: false
     */
    span: { type: Boolean },
    /**
     * Whether to default the text, that is, not bold
     * @default: false
     */
    normal: { type: Boolean },
    useTo: {
      type: String, //'Modal'|'Drawer'|'Table'|'TableForm'
      default: '',
    },
  });

  const { prefixCls } = useDesign('basic-title');
  const slots = useSlots();
  const { getDarkMode } = useRootSetting();
  const isQD = computed(() => {
    return getDarkMode.value === ThemeEnum.LIGHT_QD;
  });
  const getClass = computed(() => [
    prefixCls,
    { [`${prefixCls}-show-span`]: props.span && slots.default },
    { [`${prefixCls}-normal`]: props.normal },
    { [`${prefixCls}-use-to-table`]: props.useTo === 'Table' },
    { [`${prefixCls}-use-to-modal`]: props.useTo === 'Modal' },
    { [`${prefixCls}-use-to-drawer`]: props.useTo === 'Drawer' },
    { [`${prefixCls}-use-to-table-form`]: props.useTo === 'TableForm' },
    { 'basic-title-qd': isQD.value },
  ]);
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-title';
  @prefix-cls-table: ~'@{namespace}-basic-title-use-to-table';
  @prefix-cls-modal: ~'@{namespace}-basic-title-use-to-modal';
  @prefix-cls-drawer: ~'@{namespace}-basic-title-use-to-drawer';
  @prefix-cls-table-form: ~'@{namespace}-basic-title-use-to-table-form';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    // padding-left: 7px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: @text-color-base;
    cursor: move;
    user-select: none;

    &.is-drawer {
      cursor: default;
    }

    &-normal {
      font-size: 14px;
      font-weight: 500;
    }

    &-show-span::before {
      position: absolute;
      top: 4px;
      left: 0;
      width: 3px;
      height: 16px;
      margin-right: 4px;
      background-color: @primary-color;
      content: '';
    }

    &-help {
      margin-left: 10px;
    }
  }
  .basic-title-qd {
    font-size: 20px;
    color: #2c73d4;
    display: inline-flex;
    line-height: 1.5 !important;
    &:after {
      content: '';
      position: absolute;
      // bottom: -12px;
      left: -7px;
      width: calc(100% + 14px);
      height: 2px;
      background-color: #2c73d4;
    }
  }
  .@{prefix-cls-table} {
    &:after {
      bottom: 0px;
    }
  }
  .@{prefix-cls-table-form} {
    &:after {
      bottom: 0px;
    }
  }
  .@{prefix-cls-modal} {
    &:after {
      bottom: -10px;
    }
  }
  .@{prefix-cls-drawer} {
    &:after {
      bottom: -12px;
    }
  }
</style>
