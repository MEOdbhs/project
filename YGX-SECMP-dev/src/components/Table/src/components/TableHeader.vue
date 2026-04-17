<template>
  <div style="width: 100%">
    <div v-if="$slots.headerTop" style="margin: 5px">
      <slot name="headerTop"></slot>
    </div>
    <div class="new-title position-relative mb-8px pl-7px" v-if="isQD">
      <div>
        <TableTitle :helpMessage="titleHelpMessage" :title="title" v-if="title" useTo="Table" />
      </div>
    </div>
    <div :class="`flex items-center ${prefixCls}__table-title-box`">
      <div :class="`${prefixCls}__tableTitle`">
        <slot name="tableTitle" v-if="$slots.tableTitle"></slot>
        <!--修改标题插槽位置-->
        <TableTitle :helpMessage="titleHelpMessage" :title="title" v-if="!$slots.tableTitle && title && !isQD" />
      </div>

      <div :class="`${prefixCls}__toolbar`">
        <slot name="toolbar"></slot>
        <Divider type="vertical" v-if="$slots.toolbar && showTableSetting" />
        <TableSetting
          :class="`${prefixCls}__toolbar-desktop`"
          style="white-space: nowrap"
          :setting="tableSetting"
          v-if="showTableSetting"
          @columns-change="handleColumnChange"
        />
        <a-popover :overlayClassName="`${prefixCls}__toolbar-mobile`" trigger="click" placement="left" :getPopupContainer="(n) => n?.parentElement">
          <template #content>
            <TableSetting mode="mobile" :setting="tableSetting" v-if="showTableSetting" @columns-change="handleColumnChange" />
          </template>
          <a-button :class="`${prefixCls}__toolbar-mobile`" v-if="showTableSetting" type="text" preIcon="ant-design:menu" shape="circle" />
        </a-popover>
      </div>
    </div>
    <!--添加tableTop插槽-->
    <div style="margin: -4px 0 -2px; padding-top: 5px">
      <slot name="tableTop">
        <a-alert type="info" show-icon class="alert" v-if="openRowSelection != null && selectRowKeys.length > 0">
          <template #message>
            <template v-if="selectRowKeys.length > 0">
              <span>
                <span>已选中 {{ selectRowKeys.length }} 条记录</span>
                <span v-if="isAcrossPage">(可跨页)</span>
              </span>
              <a-divider type="vertical" />
              <a @click="setSelectedRowKeys([])">清空</a>
              <slot name="alertAfter"></slot>
            </template>
            <template v-else>
              <span>未选中任何数据</span>
            </template>
          </template>
        </a-alert>
      </slot>
    </div>
    <!--添加tableTop插槽-->
  </div>
</template>
<script lang="ts">
  import type { TableSetting, ColumnChangeParam } from '../types/table';
  import type { PropType } from 'vue';
  import { defineComponent, computed } from 'vue';
  import { Divider } from 'ant-design-vue';
  import TableSettingComponent from './settings/index.vue';
  import TableTitle from './TableTitle.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useTableContext } from '../hooks/useTableContext';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { ThemeEnum } from '/@/enums/appEnum';
  export default defineComponent({
    name: 'BasicTableHeader',
    components: {
      Divider,
      TableTitle,
      TableSetting: TableSettingComponent,
    },
    props: {
      title: {
        type: [Function, String] as PropType<string | ((data: Recordable) => string)>,
      },
      tableSetting: {
        type: Object as PropType<TableSetting>,
      },
      showTableSetting: {
        type: Boolean,
      },
      titleHelpMessage: {
        type: [String, Array] as PropType<string | string[]>,
        default: '',
      },
    },
    emits: ['columns-change'],
    setup(_, { emit }) {
      const { prefixCls } = useDesign('basic-table-header');

      function handleColumnChange(data: ColumnChangeParam[]) {
        emit('columns-change', data);
      }

      const { getSelectRowKeys, setSelectedRowKeys, getRowSelection } = useTableContext();
      const selectRowKeys = computed(() => getSelectRowKeys());
      const openRowSelection = computed(() => getRowSelection());
      // 是否允许跨页选择
      const isAcrossPage = computed(() => openRowSelection.value?.preserveSelectedRowKeys === true);
      const { getDarkMode } = useRootSetting();
      const isQD = computed(() => {
        return getDarkMode.value === ThemeEnum.LIGHT_QD;
      });
      return { prefixCls, handleColumnChange, selectRowKeys, setSelectedRowKeys, openRowSelection, isAcrossPage, isQD };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-header';

  .@{prefix-cls} {
    &__toolbar {
      //flex: 1;
      width: 140px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      > * {
        margin-right: 8px;
      }

      &-desktop {
        display: block;
      }

      &-mobile {
        display: none;
      }
    }

    &__tableTitle {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;

      > * {
        margin-right: 4px;
        margin-bottom: 4px;
      }
    }

    @media (max-width: @screen-lg) {
      &__table-title-box {
        align-items: flex-end;
      }

      &__toolbar {
        width: 30px;
        text-align: center;

        > * {
          margin-right: 0;
        }

        .table-settings > * {
          margin-right: 0;
          margin-bottom: 6px;
        }

        &-desktop {
          display: none;
        }

        &-mobile {
          display: block;

          .table-settings > * {
            margin-right: 6px;
            margin-bottom: 0;
          }
        }
      }
    }
  }

  html[data-theme='lightQD'] {
    .alert {
      background-color: rgba(@primary-color, 0.3);
      border: 1px solid @primary-color;
    }

    .new-title :before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      right: 0;
      background: linear-gradient(90deg, #c4d5e7, rgba(196, 213, 231, 0) 65%);
    }
  }
</style>
