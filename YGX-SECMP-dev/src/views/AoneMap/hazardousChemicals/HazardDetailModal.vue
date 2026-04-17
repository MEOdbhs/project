<template>
  <Teleport to="body">
    <Transition name="hc-modal">
      <div v-if="modelValue" class="hc-modal" @click.self="close">
        <div class="hc-modal__box">
          <div class="hc-modal__head">
            <div class="hc-modal__title-block">
              <div class="hc-modal__ico"><InfoCircleOutlined /></div>
              <div>
                <h3 class="hc-modal__title">{{ detail?.name || detail?.enterprise || '详情' }}</h3>
                <p class="hc-modal__sub">{{ detail?.region || '详细信息' }}</p>
              </div>
            </div>
            <button type="button" class="hc-modal__close" aria-label="关闭" @click="close">×</button>
          </div>
          <div class="hc-modal__grid">
            <div>
              <div class="hc-modal__sec">基本信息</div>
              <div class="hc-modal__card">
                <div class="hc-modal__row"><span>类型</span><span>{{ detail?.type || '生产企业' }}</span></div>
                <div class="hc-modal__row"><span>风险等级</span><span class="hc-modal__risk">重大风险 (红)</span></div>
                <div class="hc-modal__row"><span>管控责任人</span><span>王建国</span></div>
                <div class="hc-modal__row"><span>联系方式</span><span class="hc-modal__link">138-xxxx-8888</span></div>
              </div>
            </div>
            <div>
              <div class="hc-modal__sec">实时监测</div>
              <div class="hc-modal__card">
                <div class="hc-modal__live">
                  <span>运行状态</span>
                  <span class="hc-modal__ok"><span class="hc-modal__pulse" />正常运行</span>
                </div>
                <div class="hc-modal__bar">
                  <div class="hc-modal__bar-fill" />
                </div>
                <div class="hc-modal__live-sub"><span>负荷: 65%</span><span>更新于: 刚刚</span></div>
              </div>
            </div>
          </div>
          <div class="hc-modal__actions">
            <button type="button" class="hc-modal__btn hc-modal__btn--muted">查看历史轨迹</button>
            <button type="button" class="hc-modal__btn hc-modal__btn--primary">进入企业一张图</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import type { DetailPayload } from './types';

defineProps<{
  modelValue: boolean;
  detail: DetailPayload | null;
}>();

const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

function close() {
  emit('update:modelValue', false);
}
</script>

<style lang="less" scoped>
.hc-modal {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
}

.hc-modal__box {
  width: min(560px, 100%);
  border-radius: 12px;
  padding: 22px;
  border: 1px solid rgba(56, 189, 248, 0.25);
  background: rgba(15, 23, 42, 0.95);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
}

.hc-modal__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.hc-modal__title-block {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.hc-modal__ico {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(56, 189, 248, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #38bdf8;
}

.hc-modal__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
}

.hc-modal__sub {
  margin: 4px 0 0;
  font-size: 13px;
  color: #94a3b8;
}

.hc-modal__close {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: #94a3b8;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }
}

.hc-modal__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

@media (max-width: 560px) {
  .hc-modal__grid {
    grid-template-columns: 1fr;
  }
}

.hc-modal__sec {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  margin-bottom: 8px;
}

.hc-modal__card {
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.hc-modal__row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 6px 0;
  color: #e2e8f0;

  span:first-child {
    color: #94a3b8;
  }
}

.hc-modal__risk {
  font-weight: 700;
  color: #f87171 !important;
}

.hc-modal__link {
  color: #38bdf8 !important;
}

.hc-modal__live {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 10px;
}

.hc-modal__ok {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4ade80;
  font-size: 12px;
}

.hc-modal__pulse {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #4ade80;
  animation: hc-pulse 1.5s ease-in-out infinite;
}

@keyframes hc-pulse {
  50% {
    opacity: 0.5;
  }
}

.hc-modal__bar {
  height: 6px;
  border-radius: 999px;
  background: #1e293b;
  overflow: hidden;
}

.hc-modal__bar-fill {
  height: 100%;
  width: 65%;
  border-radius: 999px;
  background: #38bdf8;
}

.hc-modal__live-sub {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 10px;
  color: #64748b;
}

.hc-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.hc-modal__btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  border: none;

  &--muted {
    background: #1e293b;
    color: #e2e8f0;
  }
  &--primary {
    background: #38bdf8;
    color: #0f172a;
    font-weight: 700;
  }
}

.hc-modal-enter-active,
.hc-modal-leave-active {
  transition: opacity 0.2s ease;
}
.hc-modal-enter-active .hc-modal__box,
.hc-modal-leave-active .hc-modal__box {
  transition: transform 0.2s ease;
}
.hc-modal-enter-from,
.hc-modal-leave-to {
  opacity: 0;
}
.hc-modal-enter-from .hc-modal__box,
.hc-modal-leave-to .hc-modal__box {
  transform: scale(0.95) translateY(12px);
}
</style>
