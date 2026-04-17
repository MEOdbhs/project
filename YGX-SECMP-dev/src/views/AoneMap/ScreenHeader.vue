<template>
  <header class="screen-header">
    <!-- 顶部 SVG 艺术波浪线 -->
    <svg class="screen-header__wave screen-header__wave--top" viewBox="0 0 1920 10" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,6 C240,2 480,9 720,5 C960,1 1200,9 1440,5 C1680,1 1800,7 1920,5" stroke="rgba(56,189,248,0.15)" stroke-width="8" fill="none"/>
      <path d="M0,6 C240,2 480,9 720,5 C960,1 1200,9 1440,5 C1680,1 1800,7 1920,5" stroke="rgba(56,189,248,0.75)" stroke-width="1.2" fill="none"/>
    </svg>

    <!-- 单行内容区 -->
    <div class="screen-header__row">

      <!-- 左侧：logo + 时间天气 -->
      <div class="screen-header__left">
        <RouterLink
          class="screen-header__home"
          to="/majorTarget/hydraulicEngineering"
          title="返回上级"
          aria-label="返回上级"
        >
          <LeftOutlined class="screen-header__back-icon" />
        </RouterLink>
        <div class="screen-header__vline" />
        <div class="screen-header__meta">
          <div>
            <p class="screen-header__date">{{ dateText }}</p>
            <p class="screen-header__clock">{{ timeText }}</p>
          </div>
          <div class="screen-header__weather">
            <span class="screen-header__witem">🌡 24°C</span>
            <span class="screen-header__witem">💧 68%</span>
            <span class="screen-header__witem">🌬 3级</span>
            <span class="screen-header__witem"><CloudOutlined /> 多云</span>
          </div>
        </div>
      </div>

      <!-- 中间：导航菜单（左4 + 中心核心 + 右4） -->
      <nav class="screen-header__nav">
        <RouterLink
          v-for="item in leftItems"
          :key="item.to"
          :to="item.to"
          class="screen-header__nav-item"
          active-class="screen-header__nav-item--active"
        >
          <component :is="item.icon" class="screen-header__nav-icon" />
          <span>{{ item.label }}</span>
        </RouterLink>

        <!-- 左侧弧形分隔 -->
        <svg class="screen-header__arc screen-header__arc--left" viewBox="0 0 18 52" fill="none" aria-hidden="true">
          <path d="M16,2 C6,10 2,22 2,26 C2,30 6,42 16,50" stroke="rgba(56,189,248,0.65)" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M16,2 C6,10 2,22 2,26 C2,30 6,42 16,50" stroke="rgba(56,189,248,0.12)" stroke-width="6" stroke-linecap="round"/>
        </svg>

        <!-- 中间核心入口 -->
        <RouterLink
          :to="centerItem.to"
          class="screen-header__nav-item screen-header__nav-item--center"
          active-class="screen-header__nav-item--active"
        >
          <component :is="centerItem.icon" class="screen-header__nav-icon" />
          <span>{{ centerItem.label }}</span>
        </RouterLink>

        <!-- 右侧弧形分隔 -->
        <svg class="screen-header__arc screen-header__arc--right" viewBox="0 0 18 52" fill="none" aria-hidden="true">
          <path d="M2,2 C12,10 16,22 16,26 C16,30 12,42 2,50" stroke="rgba(56,189,248,0.65)" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M2,2 C12,10 16,22 16,26 C16,30 12,42 2,50" stroke="rgba(56,189,248,0.12)" stroke-width="6" stroke-linecap="round"/>
        </svg>

        <RouterLink
          v-for="item in rightItems"
          :key="item.to"
          :to="item.to"
          class="screen-header__nav-item"
          active-class="screen-header__nav-item--active"
        >
          <component :is="item.icon" class="screen-header__nav-icon" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- 右侧：通知 + 用户 -->
      <div class="screen-header__right">
        <button type="button" class="screen-header__bell" aria-label="通知">
          <BellOutlined />
          <span class="screen-header__badge">3</span>
        </button>
        <div class="screen-header__user">
          <span class="screen-header__avatar">管</span>
          <span class="screen-header__uname">系统管理员</span>
        </div>
      </div>
    </div>

    <!-- 底部 SVG 艺术波浪线 -->
    <svg class="screen-header__wave screen-header__wave--bottom" viewBox="0 0 1920 10" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,4 C240,8 480,1 720,5 C960,9 1200,1 1440,5 C1680,9 1800,3 1920,5" stroke="rgba(56,189,248,0.12)" stroke-width="8" fill="none"/>
      <path d="M0,4 C240,8 480,1 720,5 C960,9 1200,1 1440,5 C1680,9 1800,3 1920,5" stroke="rgba(56,189,248,0.55)" stroke-width="1.2" fill="none"/>
    </svg>
  </header>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import {
  BankOutlined,
  BellOutlined,
  CloudOutlined,
  DeploymentUnitOutlined,
  ExperimentOutlined,
  GlobalOutlined,
  LeftOutlined,
  SafetyOutlined,
  SecurityScanOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons-vue';

const currentTime = ref(new Date());
const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

const timer = window.setInterval(() => {
  currentTime.value = new Date();
}, 1000);

const dateText = computed(() => {
  const d = currentTime.value;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}年${m}月${day}日 ${weekdays[d.getDay()]}`;
});

const timeText = computed(() =>
  currentTime.value.toLocaleTimeString('zh-CN', { hour12: false }),
);

onUnmounted(() => clearInterval(timer));

const leftItems = [
  { to: '/geological', label: '地质灾害一张图', icon: GlobalOutlined },
  { to: '/hydrology', label: '水文监测一张图', icon: DeploymentUnitOutlined },
  { to: '/forestFire', label: '森林防火一张图', icon: ThunderboltOutlined },
  { to: '/public-safety', label: '公共安全一张图', icon: SafetyOutlined },
  
];

const centerItem = { to: '/emergency-safety', label: '应急安全一张图', icon: SecurityScanOutlined };

const rightItems = [
{ to: '/emergency-rescue', label: '应急救援一张图', icon: TeamOutlined },
{ to: '/industry-trade', label: '工贸行业监管', icon: BankOutlined },
  { to: '/mining-industry', label: '矿山行业监管', icon: BankOutlined },
  { to: '/hazardous', label: '危化品监管一张图', icon: ExperimentOutlined },
 
 
];
</script>

<style lang="less" scoped>
.screen-header {
  position: relative;
  display: flex;
  flex-direction: column;
  background: rgba(8, 14, 28, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 100;
  overflow: hidden;
}

/* ====== SVG 波浪线 ====== */
.screen-header__wave {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 10px;
  pointer-events: none;

  &--top { top: 0; }
  &--bottom { bottom: 0; }
}

/* ====== 单行主体 ====== */
.screen-header__row {
  display: flex;
  align-items: center;
  height: 68px;
  padding: 0 20px;
  gap: 0;
}

/* ====== 左侧区域 ====== */
.screen-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.screen-header__home {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(34, 211, 238, 0.06));
  border: 1px solid rgba(56, 189, 248, 0.28);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: rgba(56, 189, 248, 0.55);
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
  }
}

.screen-header__back-icon {
  font-size: 20px;
  color: #7dd3fc;
}

.screen-header__vline {
  width: 1px;
  height: 30px;
  flex-shrink: 0;
  background: linear-gradient(180deg, transparent, rgba(56, 189, 248, 0.35), transparent);
}

.screen-header__meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.screen-header__date {
  margin: 0;
  font-size: 10px;
  color: #4b5a6e;
  letter-spacing: 0.03em;
}

.screen-header__clock {
  margin: 2px 0 0;
  font-size: 16px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  color: #cbd5e1;
}

.screen-header__weather {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 14px;
  border-left: 1px solid rgba(56, 189, 248, 0.15);
  font-size: 11px;
  color: #4b5a6e;
}

.screen-header__witem {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

/* ====== 导航菜单 ====== */
.screen-header__nav {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0;
}

.screen-header__nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 100%;
  color: rgba(100, 116, 139, 0.9);
  text-decoration: none;
  font-size: 13px;
  letter-spacing: 0.04em;
  white-space: nowrap;
  position: relative;
  transition: color 0.22s;

  /* 底部悬停曲线指示 */
  &::after {
    content: '';
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, transparent, #38bdf8, transparent);
    transition: width 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &:hover {
    color: #cbd5e1;
    &::after { width: 65%; }
  }

  &--active {
    color: #7dd3fc;
    &::after {
      width: 70%;
      box-shadow: 0 0 6px rgba(56, 189, 248, 0.5);
    }
  }
}

.screen-header__nav-icon {
  font-size: 14px;
  flex-shrink: 0;
}

/* ====== 弧形曲线括号（SVG） ====== */
.screen-header__arc {
  width: 18px;
  height: 52px;
  flex-shrink: 0;
}

/* ====== 中间核心入口 ====== */
.screen-header__nav-item--center {
  padding: 0 18px;
  color: #38bdf8;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.07em;
  background: radial-gradient(ellipse at 50% 120%, rgba(56, 189, 248, 0.12) 0%, transparent 70%);

  &::after {
    width: 75%;
    background: linear-gradient(90deg, transparent, #38bdf8, transparent);
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
    bottom: 4px;
  }

  &:hover {
    color: #bae6fd;
    background: radial-gradient(ellipse at 50% 120%, rgba(56, 189, 248, 0.18) 0%, transparent 70%);
  }

  &.screen-header__nav-item--active {
    color: #bae6fd;
    text-shadow: 0 0 14px rgba(56, 189, 248, 0.55);
  }
}

/* ====== 右侧区域 ====== */
.screen-header__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.screen-header__bell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: 8px;
  background: rgba(22, 33, 52, 0.7);
  color: #64748b;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;

  &:hover {
    background: rgba(30, 44, 68, 0.9);
    border-color: rgba(56, 189, 248, 0.38);
    color: #94a3b8;
  }
}

.screen-header__badge {
  position: absolute;
  right: 2px;
  top: 2px;
  min-width: 13px;
  height: 13px;
  padding: 0 3px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 700;
  line-height: 13px;
  text-align: center;
  color: #fff;
  background: #ef4444;
}

.screen-header__user {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 11px;
  border-radius: 8px;
  background: rgba(22, 33, 52, 0.7);
  border: 1px solid rgba(56, 189, 248, 0.13);
}

.screen-header__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  color: #0c1220;
  background: linear-gradient(135deg, #22d3ee, #38bdf8);
}

.screen-header__uname {
  font-size: 12px;
  color: #94a3b8;
}
</style>
