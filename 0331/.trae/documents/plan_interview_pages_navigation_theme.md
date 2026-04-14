# 实施计划：访谈页导航与 Jack 页面搭建

## 1. Summary
- 依据 `t.md` 的需求，补齐三个页面协作：
  - 新建 `index.html`（两个入口按钮：Lesley / jack）
  - 完成 `jack.html`（布局与 `Lesley.html` 一致，内容替换为 Jack 问答）
  - 三个页面都支持黑白主题切换
- 保持现有视觉风格（字体、间距、卡片、标题、主题色）一致，不额外引入框架或依赖。

## 2. Current State Analysis
- 当前目录存在：
  - `Lesley.html`（已是完整页面，包含样式与主题切换逻辑）
  - `Jack.html`（文件存在但为空）
  - `scripts.js`（只做 `body.light-mode` 切换）
  - 资源图：`interview1.jpg`、`interview2.png`、`interview3.jpg`、`change.png`、`Icon*.png`
  - `index.html` 已被删除（需重建）
- `Lesley.html` 当前含内联脚本用于切换 `Icon.png / Icon3.png`，说明页面已在使用“亮色主题时图标替换”的行为。

## 3. Proposed Changes

### A. 新建入口页 `index.html`
- **做什么**
  - 新建简洁入口页，放置两个按钮（Lesley、jack）。
  - 按钮分别跳转到 `Lesley.html`、`jack.html`。
  - 提供主题切换按钮（复用 `change.png` 与 `js-toggle-mode` 机制）。
- **为什么**
  - 满足“从主页进入两个访谈页”的明确导航需求。
- **怎么做**
  - 使用与现有页面一致的深色默认、亮色切换变量（`body.light-mode`）。
  - 使用可点击按钮或 `<a>` 样式按钮，保证交互明确。

### B. 新建 `jack.html`（小写文件名）
- **做什么**
  - 以 `Lesley.html` 为结构模板，保持同样布局层次与样式风格。
  - 替换文案为 `t.md` 中 10 组问答。
  - 添加“回答”区 4 条摘要（按 Lesley 页的 `KEY INSIGHTS` 卡片风格输出）。
  - 将 `interview1/2/3` 三张图插入到 Jack 页面的合适位置。
- **为什么**
  - 满足“样式布局一样、内容不同”的核心要求。
  - 图片插入增强页面信息层次，符合题设要求。
- **怎么做（决策落位）**
  - 图片插入策略：
    - `interview1.jpg`：放在 BIO 段后，作为主视觉内容图。
    - `interview2.png`：放在中段问答（约 Q4-Q6 区域）后，作为段落分隔图。
    - `interview3.jpg`：放在回答摘要区前或页尾前，作为收束视觉。
  - 问答区仍使用 `p-label + m-title + m-content` 结构，保证与 Lesley 页一致。
  - 主题切换按钮位置与行为与 Lesley 页保持一致。

### C. 主题切换能力统一（三页）
- **做什么**
  - 三个页面都保留 `js-toggle-mode` 切换入口。
  - Lesley 与 Jack 页面在亮色模式下同步处理 `Icon.png -> Icon3.png`（深色反向恢复）。
- **为什么**
  - 满足“3 个页面都要黑白主题切换”且与当前 Lesley 页体验一致。
- **怎么做**
  - 不依赖修改 `scripts.js` 的前提，采用页面内同构脚本：
    - 点击切换时仅切换 `body.light-mode`
    - 同步扫描 `img[src="./Icon.png"], img[src="./Icon3.png"]` 做图标替换
  - `index.html` 无 `Icon.png` 内容时，仅保留主题切换即可。

## 4. Assumptions & Decisions
- 决策 1：按需求创建 `jack.html`（小写），不依赖现有空文件 `Jack.html`。
- 决策 2：保持 `Lesley.html` 原有视觉规则，不做无关重构，仅补齐与三页统一有关的最小改动。
- 决策 3：图片“合适位置”按内容节奏分布在开头/中段/收尾，优先可读性与版式平衡。
- 决策 4：不引入新依赖，不改构建流程，全部使用静态 HTML/CSS/JS 完成。

## 5. Verification Steps
- 结构与跳转验证
  - 打开 `index.html`，点击 Lesley 按钮可进入 `Lesley.html`。
  - 点击 jack 按钮可进入 `jack.html`。
- 内容验证
  - `jack.html` 包含 10 个问题与对应回答文本。
  - `回答` 区域存在 4 条摘要内容。
  - 三张图片均可加载并出现在计划位置。
- 主题验证
  - 三个页面点击切换按钮均能在深/浅主题间切换。
  - Lesley/jack 页中 `Icon.png` 在浅色主题变为 `Icon3.png`，切回恢复。
- 诊断验证
  - 对 `index.html`、`Lesley.html`、`jack.html` 执行诊断检查，确保无新增语法错误。
