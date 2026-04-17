<template>
  <Footer :class="prefixCls" v-if="getShowLayoutFooter" ref="footerRef">
    <div class="tip">版本所有：成都智谷耘行信息技术有限公司&emsp;&emsp;技术支持：成都智谷耘行信息技术有限公司</div>
  </Footer>
</template>

<script lang="ts">
  import { computed, defineComponent, unref, ref } from 'vue';
  import { Layout } from 'ant-design-vue';

  import { openWindow } from '/@/utils';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useRouter } from 'vue-router';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLayoutHeight } from '../content/useContentViewHeight';
  import { ThemeEnum } from '/@/enums/appEnum';

  export default defineComponent({
    name: 'LayoutFooter',
    components: { Footer: Layout.Footer },
    setup() {
      const { t } = useI18n();
      const { getShowFooter } = useRootSetting();
      const { currentRoute } = useRouter();
      const { prefixCls } = useDesign('layout-footer');

      const footerRef = ref<ComponentRef>(null);
      const { setFooterHeight } = useLayoutHeight();
      //当前主题
      const { getDarkMode } = useRootSetting();
      const isDark = computed(() => getDarkMode.value === ThemeEnum.DARK);

      const getShowLayoutFooter = computed(() => {
        if (unref(getShowFooter)) {
          const footerEl = unref(footerRef)?.$el;
          setFooterHeight(footerEl?.offsetHeight || 0);
        } else {
          setFooterHeight(0);
        }
        return unref(getShowFooter) && !unref(currentRoute).meta?.hiddenFooter;
      });
      //鼠标移入的颜色设置
      const hoverColor = computed(() => {
        return unref(isDark) ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.85)';
      });
      return {
        getShowLayoutFooter,
        prefixCls,
        t,
        openWindow,
        footerRef,
        hoverColor,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout-footer';

  @normal-color: rgba(0, 0, 0, 0.45);
  // update-begin-author:liusq date:2023-7-12 for: [issues/608] dark 模式下底部 footer 文字 hover 样式导致文字消失
  @hover-color: v-bind(hoverColor);
  // update-end-author:liusq date:2023-7-12 for: [issues/608] dark 模式下底部 footer 文字 hover 样式导致文字消失
  .@{prefix-cls} {
    color: @normal-color;
    text-align: center;

    &__links {
      margin-bottom: 8px;

      a {
        color: @normal-color;

        &:hover {
          color: @hover-color;
        }
      }
    }

    &__github {
      margin: 0 30px;

      &:hover {
        color: @hover-color;
      }
    }
  }
</style>
