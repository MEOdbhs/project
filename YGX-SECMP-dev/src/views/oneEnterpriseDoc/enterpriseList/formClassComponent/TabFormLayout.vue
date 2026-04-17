<template>
  <div class="tfl">
    <!-- ① 顶部固定栏：企业名称 + 生产状态 + 返回按钮 -->
    <div class="tfl__topbar">
      <div class="tfl__topbar-left">
        <span class="tfl__title">{{ detail?.name }}</span>
        <a-tag v-if="detail?.productionStatusText" color="blue" class="tfl__tag">
          {{ detail.productionStatusText }}
        </a-tag>
        <a-tag v-if="isView" color="default" class="tfl__tag">查看模式</a-tag>
        <a-tag v-else color="orange" class="tfl__tag">编辑模式</a-tag>
      </div>
      <div class="tfl__topbar-right">
        <a-button class="tfl__back-btn" @click="emit('back')">返回列表页</a-button>
      </div>
    </div>

    <!-- ② 下半部分：左菜单 + 右内容，各自独立滚动 -->
    <div class="tfl__body">
      <!-- 左侧 Tab 菜单：内容超出才滚动 -->
      <div class="tfl__sider">
        <slot name="sider" />
      </div>

      <!-- 右侧：表单内容区（独立滚动）+ 底部保存行（固定在右侧底部） -->
      <div class="tfl__content-col">
        <div class="tfl__form-area">
          <slot />
        </div>
        <div v-if="!isView && showFooter" class="tfl__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  detail: Record<string, any> | null
  isView?: boolean
  /** 编辑模式下是否展示底部栏（用于无全局「保存」的嵌套页） */
  showFooter?: boolean
}

withDefaults(defineProps<Props>(), { isView: false, showFooter: true })

const emit = defineEmits<{ back: [] }>()
</script>

<style lang="less" scoped>
// 整个详情页外壳：绝对定位撑满，不依赖父容器是否有明确高度
.tfl {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #001529;

  // ---- 顶部固定栏 ----
  &__topbar {
    flex-shrink: 0;           // 不参与压缩，高度固定
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    border-bottom: 1px solid #0d2a45;
    background: #001529;
  }

  &__topbar-left {
    display: flex;
    align-items: center;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #e6f4ff;
  }

  &__tag {
    margin-left: 8px;
  }

  &__back-btn {
    width: 120px;
    height: 36px;
    border: 1px solid #1677ff;
    color: #1677ff;
    background: transparent;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #1677ff;
      color: #fff;
    }
  }

  // ---- 下半左右布局区 ----
  &__body {
    flex: 1;                  // 占据顶栏以外的全部剩余高度
    min-height: 0;            // 关键：让子元素能正确计算 flex 压缩
    display: flex;
    overflow: hidden;
  }

  // ---- 左侧菜单 ----
  &__sider {
    flex-shrink: 0;
    width: 160px;
    border-right: 1px solid #0d2a45;
    background: #001529;
    padding: 8px 0;
    // 菜单项超出时才出现滚动条
    overflow-y: auto;
    overflow-x: hidden;
  }

  // ---- 右侧内容列（纵向：表单区 + 保存栏） ----
  &__content-col {
    flex: 1;
    min-width: 0;             // 防止内容撑开父容器
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #002140;
  }

  // 右侧表单区：独立滚动，不影响顶栏和保存栏
  &__form-area {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }

  // 右侧底部保存行：固定在右侧底部，不随表单滚动
  &__footer {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 12px 28px;
    border-top: 1px solid #0d3a5e;
    background: #002140;
  }
}
</style>
