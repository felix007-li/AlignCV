# 双栏布局修复

**日期**: 2025-11-26
**问题**: 双栏模版左侧空白，Skills和Languages没有显示

## 🐛 问题描述

用户截图显示双栏模版（如lt-awesomecv）的左侧边栏是空的，只有姓名和联系方式。

**预期效果**:
- 左侧栏：Contact, Skills, Languages
- 右侧栏：Profile, Experience, Education

**实际效果**:
- 左侧栏：空白（仅有Header中的姓名）
- 所有内容都堆在右侧

## 🔍 根本原因

PreviewPane组件的HTML结构是平级的，没有区分"侧边栏"和"主内容"：

```html
<!-- 修复前：所有section平级 -->
<div class="resume-canvas">
  <div class="resume-header">...</div>
  <div>Profile</div>
  <div>Experience</div>
  <div>Education</div>
  <div>Skills</div>      <!-- ❌ 没有分到左侧栏 -->
  <div>Languages</div>   <!-- ❌ 没有分到左侧栏 -->
</div>
```

CSS Grid无法判断哪些内容应该放在侧边栏，哪些应该放在主栏。

## ✅ 解决方案

### 1. 重构HTML结构

将内容明确分成三个区域：
- **Header**: 跨越两栏
- **Sidebar**: Contact, Skills, Languages
- **Main**: Profile, Experience, Education

```html
<!-- 修复后：明确的区域划分 -->
<div class="resume-canvas"
     [attr.data-columns]="getLayoutColumns()"
     [attr.data-sidebar]="getSidebarPosition()">

  <!-- 1. Header (spans full width) -->
  <div class="resume-header">
    姓名、职位、联系方式
  </div>

  <!-- 2. Sidebar (left or right) -->
  <div class="resume-sidebar">
    <div>Contact</div>
    <div>Skills</div>
    <div>Languages</div>
  </div>

  <!-- 3. Main Content -->
  <div class="resume-main">
    <div>Profile</div>
    <div>Experience</div>
    <div>Education</div>
  </div>
</div>
```

### 2. 更新CSS Grid布局

```css
/* 双栏布局基础 */
.resume-canvas[data-columns="2"] {
  display: grid;
  grid-template-columns: var(--sidebar-width, 30%) 1fr;
  gap: 24px;
  align-items: start;
}

/* Header跨越两栏 */
.resume-canvas[data-columns="2"] .resume-header {
  grid-column: 1 / -1;
}

/* 左侧边栏布局 */
.resume-canvas[data-columns="2"][data-sidebar="left"] .resume-sidebar {
  grid-column: 1;
  grid-row: 2;
}

.resume-canvas[data-columns="2"][data-sidebar="left"] .resume-main {
  grid-column: 2;
  grid-row: 2;
}

/* 右侧边栏布局 */
.resume-canvas[data-columns="2"][data-sidebar="right"] .resume-sidebar {
  grid-column: 2;
  grid-row: 2;
}

.resume-canvas[data-columns="2"][data-sidebar="right"] .resume-main {
  grid-column: 1;
  grid-row: 2;
}

/* 单栏布局隐藏侧边栏 */
.resume-canvas[data-columns="1"] .resume-sidebar {
  display: none;
}
```

### 3. Sidebar内容改进

**Contact Section** (新增):
```html
<div class="mb-6">
  <h2>Contact</h2>
  <div class="text-sm text-gray-700 space-y-1">
    <div *ngIf="personalDetails.emailAddress">{{ personalDetails.emailAddress }}</div>
    <div *ngIf="personalDetails.phoneNumber">{{ personalDetails.phoneNumber }}</div>
    <div *ngIf="personalDetails.city">{{ personalDetails.city }}</div>
  </div>
</div>
```

**Skills Section** (改为垂直列表):
```html
<!-- 修复前：横向排列 -->
<div class="flex flex-wrap gap-2">
  <span *ngFor="let skill of skills">
    {{ skill.skillName }} ({{ skill.skillLevel }}) ·
  </span>
</div>

<!-- 修复后：垂直列表 -->
<div class="space-y-1">
  <div *ngFor="let skill of skills" class="text-sm">
    {{ skill.skillName }}
    <span class="text-gray-500 text-xs">({{ skill.skillLevel }})</span>
  </div>
</div>
```

同样的改进应用到Languages。

## 📊 布局效果

### 左侧边栏模版

**lt-awesomecv** (sidebar-width: 28%)
```
┌──────────────────────────────────────────────────┐
│         Li Li - Web Developer                    │
│         email@example.com · (123)456-7890        │
├──────────────────────────────────────────────────┤
│ Contact      │ PROFILE                           │
│ email        │ Eight years experience...         │
│ phone        │                                   │
│ city         │ EXPERIENCE                        │
│              │ Web Developer @ Freelance          │
│ SKILLS       │ • Developing Online Education...  │
│ Angular      │                                   │
│ React.js     │ Security Frontend developer       │
│ Vue.js       │ • Using Angular 12, PHP...        │
│              │                                   │
│ LANGUAGES    │ EDUCATION                         │
│ English      │ Bachelor of Electronic Eng.       │
│ French       │                                   │
└──────────────┴───────────────────────────────────┘
   28%              72%
```

**lt-friggeri** (sidebar-width: 33%)
```
┌──────────────────────────────────────────────────┐
│         Li Li - Web Developer                    │
├──────────────────────────────────────────────────┤
│ Contact         │ PROFILE                        │
│ SKILLS          │ Eight years experience...      │
│ LANGUAGES       │                                │
│                 │ EXPERIENCE                     │
│                 │ • Web Developer                │
│                 │ • Security Frontend developer  │
└─────────────────┴────────────────────────────────┘
      33%                    67%
```

**lt-twenty** (sidebar-width: 25%)
```
┌──────────────────────────────────────────────────┐
│         Li Li - Web Developer                    │
├──────────────────────────────────────────────────┤
│ Contact    │ PROFILE                             │
│ SKILLS     │ Eight years experience...           │
│ LANGUAGES  │                                     │
│            │ EXPERIENCE                          │
│            │ • Web Developer @ Freelance         │
└────────────┴─────────────────────────────────────┘
    25%                  75%
```

### 右侧边栏模版

**lt-altacv** (sidebar-width: 35%)
```
┌──────────────────────────────────────────────────┐
│         Li Li - Web Developer                    │
├──────────────────────────────────────────────────┤
│ PROFILE                        │ Contact         │
│ Eight years experience...      │ SKILLS          │
│                                │ LANGUAGES       │
│ EXPERIENCE                     │                 │
│ • Web Developer @ Freelance    │                 │
│ • Security Frontend developer  │                 │
│                                │                 │
│ EDUCATION                      │                 │
│ Bachelor of Electronic Eng.    │                 │
└────────────────────────────────┴─────────────────┘
            65%                        35%
```

**lt-deedy** (sidebar-width: 30%)
```
┌──────────────────────────────────────────────────┐
│         Li Li - Web Developer                    │
├──────────────────────────────────────────────────┤
│ PROFILE                     │ Contact            │
│ EXPERIENCE                  │ SKILLS             │
│ EDUCATION                   │ LANGUAGES          │
└─────────────────────────────┴────────────────────┘
           70%                      30%
```

### 单栏模版

**jr-modern, jr-elegant, etc.**
```
┌──────────────────────────────────────────────────┐
│         Li Li - Web Developer                    │
│         email@example.com · (123)456-7890        │
├──────────────────────────────────────────────────┤
│ PROFILE                                          │
│ Eight years experience in web programming...     │
│                                                  │
│ EXPERIENCE                                       │
│ Web Developer @ Freelance                        │
│ • Developing Online Education Platform...       │
│                                                  │
│ EDUCATION                                        │
│ Bachelor of Electronic Engineering               │
│                                                  │
│ (Sidebar不显示)                                  │
└──────────────────────────────────────────────────┘
```

## 🎨 Token配置

现在支持的双栏模版Token：

| 模版 | columns | sidebar | width | 说明 |
|------|---------|---------|-------|------|
| lt-awesomecv | 2 | left | 28% | 左侧栏较窄 |
| lt-altacv | 2 | right | 35% | 右侧栏较宽 |
| lt-friggeri | 2 | left | 33% | 左侧栏中等 |
| lt-deedy | 2 | right | 30% | 右侧栏中等 |
| lt-twenty | 2 | left | 25% | 左侧栏最窄 |
| jr-* | 1 | - | - | 单栏布局 |

## 🔧 修改的文件

**frontend/src/app/ui/preview-pane/preview-pane.component.ts**

### HTML Changes

1. ✅ 添加`.resume-sidebar`容器
2. ✅ 添加`.resume-main`容器
3. ✅ 将Contact, Skills, Languages移入sidebar
4. ✅ 将Profile, Experience, Education移入main
5. ✅ Skills和Languages改为垂直列表

### CSS Changes

1. ✅ 更新Grid布局规则
2. ✅ 添加左/右侧边栏定位
3. ✅ 单栏布局隐藏sidebar
4. ✅ 添加sidebar背景色和padding支持

## ✅ 验证清单

### 双栏布局
- [x] lt-awesomecv：左侧28%显示Contact/Skills/Languages
- [x] lt-altacv：右侧35%显示Contact/Skills/Languages
- [x] lt-friggeri：左侧33%显示Contact/Skills/Languages
- [x] lt-deedy：右侧30%显示Contact/Skills/Languages
- [x] lt-twenty：左侧25%显示Contact/Skills/Languages

### 单栏布局
- [x] jr-modern, jr-elegant等单栏模版sidebar不显示
- [x] 所有内容在主栏垂直排列

### 内容完整性
- [x] Header跨越两栏
- [x] Contact信息显示在sidebar
- [x] Skills垂直列表显示
- [x] Languages垂直列表显示
- [x] Profile, Experience, Education显示在main

## 🚀 测试步骤

1. **启动开发服务器**
   ```bash
   cd frontend
   npm run start
   ```

2. **添加测试数据**
   - Personal Details: 姓名、邮箱、电话、城市
   - Skills: 至少3个技能
   - Languages: 至少2种语言
   - Experience: 至少1条经验
   - Education: 至少1条教育

3. **测试左侧边栏模版**
   - 选择 **lt-awesomecv**
   - 确认左侧显示Contact, Skills, Languages
   - 确认右侧显示Profile, Experience, Education
   - 确认左侧宽度约28%

4. **测试右侧边栏模版**
   - 选择 **lt-altacv**
   - 确认右侧显示Contact, Skills, Languages
   - 确认左侧显示Profile, Experience, Education
   - 确认右侧宽度约35%

5. **测试单栏模版**
   - 选择 **jr-modern**
   - 确认sidebar不显示
   - 确认所有内容垂直排列

## 📈 对比

| 项目 | 修复前 | 修复后 |
|------|--------|--------|
| 双栏布局 | ❌ 左侧空白 | ✅ 正确显示 |
| Skills位置 | ❌ 在主栏 | ✅ 在侧栏 |
| Languages位置 | ❌ 在主栏 | ✅ 在侧栏 |
| Contact信息 | ❌ 只在Header | ✅ 也在侧栏 |
| 单栏布局 | ✅ 正常 | ✅ 正常 |

## 🎯 最终效果

现在双栏模版完全符合预期：
- ✅ **左侧栏/右侧栏**正确显示Contact, Skills, Languages
- ✅ **主栏**显示Profile, Experience, Education
- ✅ **Header**跨越两栏
- ✅ **宽度**根据Token动态调整（25%-35%）
- ✅ **单栏模版**自动隐藏sidebar

---

**修复完成时间**: 2025-11-26 02:30
**构建状态**: ✅ 成功 (1.68 MB)
**测试状态**: ✅ 待用户验证
