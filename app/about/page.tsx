import type { Metadata } from "next";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "关于胡宇杰 — HUYU",
  description: "胡宇杰的个人信息、教育经历、产品实践与专业能力。求职方向：影像产品经理 / AI 产品经理。",
  openGraph: {
    title: "关于胡宇杰 — HUYU",
    description: "影像产品经理 / AI 产品经理：连接用户问题、模型能力与工程约束。",
    type: "profile",
    locale: "zh_CN",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "胡宇杰 HUYU 个人作品集" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "关于胡宇杰 — HUYU",
    description: "影像产品经理 / AI 产品经理：连接用户问题、模型能力与工程约束。",
    images: ["/og.png"],
  },
};

const capabilities = [
  ["01", "产品定义", "用户研究、竞品与数据分析、需求拆解、方案设计与版本规划。"],
  ["02", "AI 产品化", "将 AIGC、LLM、Embedding 与向量检索转译为可评估、可交付的产品链路。"],
  ["03", "智能影像", "理解拍摄、处理、剪辑、模板生产与分享链路中的体验和工程约束。"],
  ["04", "验证推进", "通过 Demo、内测、实验与问题案例回归，让证据真正改变产品决策。"],
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.wordmark} href="/" aria-label="返回胡宇杰个人网站首页">胡宇杰</a>
        <div className={styles.navMeta}><span>PERSONAL PROFILE</span><span className={styles.mono}>2026 / SHENZHEN</span></div>
        <a className={styles.back} href="/"><span aria-hidden="true">←</span> 返回首页</a>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroIndex}><span>HU</span><span>YUJIE</span></div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>AI PRODUCT · IMAGING · USER RESEARCH</p>
          <h1>把复杂的 AI 能力，<br />变成可以被理解、<br />使用与验证的影像产品。</h1>
          <p className={styles.lead}>
            我是胡宇杰，设计学背景的 AI 与影像产品实践者。
            我关注的不只是“技术能否实现”，更关注它是否解决真实问题、是否值得用户等待，以及能否稳定进入产品链路。
          </p>
        </div>
      </section>

      <section className={styles.identity} aria-label="个人基础信息">
        <article><span>NAME</span><strong>胡宇杰 / Hu Yujie</strong></article>
        <article><span>LOCATION</span><strong>广东 · 深圳</strong></article>
        <article><span>FOCUS</span><strong>影像产品 / AI 产品</strong></article>
        <article><span>CONTACT</span><a href="mailto:huyuj@hnu.edu.cn">huyuj@hnu.edu.cn ↗</a></article>
      </section>

      <section className={styles.profileSection}>
        <div className={styles.sectionLabel}><span>01</span><p>PROFILE</p></div>
        <div className={styles.profileCopy}>
          <h2>设计让我对体验敏感，<br />产品让我对结果负责。</h2>
          <div className={styles.profileText}>
            <p>我的实践覆盖相机固件、AI 修图、AI 剪辑与内容生产工具，贯穿“拍摄—处理—剪辑—生产—分享”的影像链路。</p>
            <p>面对探索型项目，我习惯先识别最大的不确定性，再选择成本匹配的验证方式：用 Demo 验证技术可行性，用内测检验产品可用性，用访谈与实验判断用户价值。</p>
          </div>
        </div>
      </section>

      <section className={styles.experienceSection}>
        <div className={styles.sectionLabel}><span>02</span><p>EXPERIENCE</p></div>
        <div className={styles.experienceList}>
          <article>
            <div><span className={styles.mono}>RECENT</span><strong>01</strong></div>
            <h3>影石 Insta360</h3>
            <p className={styles.role}>软件产品实习生 · AI 剪辑 / 相机固件</p>
            <p>参与相机端 AI 修图、闪补光灯固件适配与 AI 模板自动化生产，连接硬件、App、云端、算法和运营团队。</p>
          </article>
          <article>
            <div><span className={styles.mono}>2025</span><strong>02</strong></div>
            <h3>快手 · 快影</h3>
            <p className={styles.role}>交互设计实习生（产品方向）</p>
            <p>围绕 AI 营销封面与智能口播剪辑，参与用户研究、产品定义、生成链路设计与效果验证。</p>
          </article>
        </div>
      </section>

      <section className={styles.educationSection}>
        <div className={styles.sectionLabel}><span>03</span><p>EDUCATION &amp; RESEARCH</p></div>
        <div className={styles.educationLead}>
          <h2>从工业设计，<br />走向人本智能。</h2>
          <p>跨越产品、交互和研究的训练，让我能够同时理解人的感受、技术边界与验证证据。</p>
        </div>
        <div className={styles.educationGrid}>
          <article><span className={styles.mono}>2024—2027</span><h3>湖南大学</h3><strong>设计学硕士 · 推荐免试</strong><p>GPA 前 10%；第一作者论文收录于 IASDR 2025 Human-Centered AI Track。</p></article>
          <article><span className={styles.mono}>2020—2024</span><h3>中国海洋大学</h3><strong>工业设计学士</strong><p>GPA 前 10%；建立产品设计、工程表达与用户研究基础。</p></article>
        </div>
      </section>

      <section className={styles.capabilitySection}>
        <div className={styles.sectionLabel}><span>04</span><p>CAPABILITIES</p></div>
        <header><h2>我的能力不是工具清单，<br />而是一套推进问题的方式。</h2></header>
        <div className={styles.capabilityGrid}>
          {capabilities.map(([index, title, body]) => <article key={index}><span className={styles.mono}>{index}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className={styles.practiceSection}>
        <div><p className={styles.eyebrow}>CREATIVE PRACTICE</p><h2>产品之外，<br />我也用摄影观察光线与情绪。</h2></div>
        <a href="/photography">进入摄影档案 <span>↗</span></a>
      </section>

      <section className={styles.contactSection}>
        <p className={styles.eyebrow}>LET&apos;S BUILD SOMETHING USEFUL</p>
        <h2>如果你也在做<br />AI 与影像的下一步。</h2>
        <a href="mailto:huyuj@hnu.edu.cn">huyuj@hnu.edu.cn <span>↗</span></a>
      </section>

      <footer className={styles.footer}><span>HUYU · PERSONAL PROFILE</span><a href="/">返回作品集</a></footer>
    </main>
  );
}
