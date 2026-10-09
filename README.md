# 《信息系统分析与设计》数字教材

<div align="center">

[![在线站点](https://img.shields.io/badge/在线站点-ISAD%20课程门户-blue?logo=githubpages)](https://dsdh-python.github.io/ISAD/)
[![课程对象](https://img.shields.io/badge/面向-信息资源管理专业-orange)](https://dsdh-python.github.io/ISAD/)
[![内容类型](https://img.shields.io/badge/资源-数字教材%20%2B%20互动练习-purple)](https://dsdh-python.github.io/ISAD/)

</div>

苏州大学《信息系统分析与设计》（ISAD）课程配套资源，面向信息资源管理专业本科生。教材以信息系统分析与设计方法为主线，结合智能体与低代码（扣子 Coze）案例和实践，旨在帮助学生在课程学习、案例分析和实践应用之间建立完整闭环。

> 在线学习入口：<https://dsdh-python.github.io/ISAD/>

## 🌟 课程概览

<table>
  <tr>
    <td width="33%"><strong>📘 教材内容</strong><br>覆盖信息系统分析与设计的核心方法、案例与实务，支持第 1–9 章学习。</td>
    <td width="33%"><strong>🎮 互动练习</strong><br>配套各章练习与场景化任务，提升知识理解与应用能力。</td>
    <td width="33%"><strong>🤖 智能体实践</strong><br>结合智能体与低代码案例，促进课程与前沿技术的衔接。</td>
  </tr>
</table>

## 🗂️ 资源结构

| 路径 | 内容 |
| --- | --- |
| [`html教材/`](html教材/) | 教材门户及第 1–9 章 |
| [`games/`](games/) | 对应各章的互动练习 |
| [`pages/appendix.html`](pages/appendix.html) | 课程附录正文 |
| [`pages/legacy/`](pages/legacy/) | 已归档的章节与附录旧网址跳转页 |
| [`style.css`](style.css)、[`app.js`](app.js) | 全站样式与交互 |
| [`images/`](images/)、[`media/`](media/) | 教材配图、操作截图与案例素材 |
| [`media/前沿文献_候选清单.md`](media/前沿文献_候选清单.md)、[`media/AI蓝皮书.md`](media/AI蓝皮书.md) | 补充阅读资料 |
| [`media/智能体创新实践汇编_案例提取.md`](media/智能体创新实践汇编_案例提取.md)、[`pages/智能体创新实践汇编_思维导图.html`](pages/智能体创新实践汇编_思维导图.html) | 智能体案例资料 |
| [`media/职业与资格速查表.docx`](media/职业与资格速查表.docx) | 职业与资格参考 |
| [`github+VScode.md`](github+VScode.md)、[`media/`](media/) 中的截图 | Git 与 VS Code 使用说明及配图 |

## ▶️ 使用方式

- 从 [`html教材/index.html`](html教材/index.html) 浏览教材。
- 在 [`games/`](games/) 中打开 `game_chNN.html` 体验对应章节练习。
- 根目录 [`index.html`](index.html) 是 GitHub Pages 首页入口，会跳转到教材门户。
- 章节及附录正文分别位于 [`html教材/`](html教材/) 和 [`pages/`](pages/)。旧网址跳转页收纳在 [`pages/legacy/`](pages/legacy/)；根目录只保留首页，旧的根路径章节及附录网址不再使用。
- 使用 VS Code 和 Git 的说明见 [`github+VScode.md`](github+VScode.md)。

> 教材章节位于 `html教材/`，通过相对路径引用根目录中的样式、脚本、图片、媒体和练习。请勿删除仍被页面引用的资源。

## 📜 许可信息

- 课程材料的版权与使用限制见根目录 [`LICENSE`](LICENSE)。
- 教材中派生自 yeasy《智能体 AI 权威指南》v1.0.0 的内容按 CC BY-NC-SA 4.0 使用。再利用时须遵守署名、非商业使用和相同方式共享要求：<https://creativecommons.org/licenses/by-nc-sa/4.0/>。

## 🛠️ 维护说明

修改后检查网页资源路径和章节导航，并运行：

```bash
git status
git diff --check
```

推送到 `main` 后，GitHub Actions 会自动发布站点。
