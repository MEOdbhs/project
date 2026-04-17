# 样式差异对比报告

## 目标

将 React 版本的科技风（`--tech-*` 变量体系）在 Vue3（YGX-SECMP-dev）中还原到模块级别，尽量做到布局与色彩一致，同时遵循项目组件规范（表格使用 BasicTable）。

## 已还原项

- 主题变量：
  - 通过 [techTheme.less](file:///workspace/YGX-SECMP-dev/src/assets/less/techTheme.less) 在 `.tech-page` 容器上定义 `--tech-*` CSS 变量（卡片、边框、主色、危险/警告/成功、输入背景、hover 等）。
- 卡片结构：
  - 通过 `.tech-card / .tech-card__header / .tech-card__body` 复刻 React 的 `TechCard` 视觉（标题左侧竖条、边框、背景、间距）。
- 筛选条：
  - 通过 `.tech-filter` 复刻 React 的筛选区域背景与控件样式（原生 `<select>/<input>`）。
- 表格样式：
  - 按要求使用 `BasicTable`，并在页面内用 `:deep(...)` 覆盖 Ant Table 头部背景/字体色、行 hover、分页按钮色彩，使之贴近 React 的 `TechTable` 视觉。
- 图表：
  - React `recharts` 方案替换为 `echarts`（项目内置），保持图表类型（折线/条形/雷达）与配色（`--tech-cyan / --tech-active` 等）。

## 不可避免差异

- 分页控件：
  - React 版本为自绘分页按钮；Vue 版本使用 Ant Pagination（由 BasicTable 提供），通过样式覆盖保持配色一致，但结构与交互细节会有差异。
- 字体与 Tailwind 细节：
  - React 使用 Tailwind Utility 与全局字体定义；Vue 版本按模块级自定义 CSS 还原主要布局与色彩，个别细微间距/字号可能存在 1-2px 的差异。

