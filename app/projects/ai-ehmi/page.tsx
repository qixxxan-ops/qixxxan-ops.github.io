import type { Metadata } from "next";
import styles from "./project.module.css";

const project = {
  title: "学术研究｜人 × 智能体交互",
  description:
    "胡宇杰作为第一作者开展的 IASDR 2025 研究：探索自动驾驶 eHMI 语言策略如何调节驾驶者情绪、注意与接受度。",
  image: "/projects/ai-ehmi/cover-v2.png",
};

export function generateMetadata(): Metadata {
  return {
    title: `${project.title} — HUYU`,
    description: project.description,
    openGraph: {
      title: `${project.title} — HUYU`,
      description: project.description,
      type: "article",
      locale: "zh_CN",
      images: [{ url: project.image, width: 1536, height: 1024, alt: "人与自动驾驶智能体沟通的概念场景" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — HUYU`,
      description: project.description,
      images: [project.image],
    },
  };
}

const conditions = [
  ["01", "无界面提示", "基线条件"],
  ["02", "变道已完成", "指示式 · 中性"],
  ["03", "感谢你的理解", "拟人式 · 中性"],
  ["04", "真的非常感谢", "拟人式 · 亲和"],
  ["05", "对此感到抱歉", "拟人式 · 道歉"],
];

const findings = [
  ["01", "拟人语言缓和负面情绪", "相较无 eHMI 和指示式表达，拟人语言显著降低愤怒与恐惧，也更容易让驾驶者感到被尊重。"],
  ["02", "中性拟人最受偏好", "“Thank you for understanding” 在四种有 eHMI 的条件中偏好度最高，达到温度与专业性的平衡。"],
  ["03", "语气需要与场景对齐", "过度亲和或道歉在冲突性场景中可能被误读为反讽；高风险任务更需直接、高显著的表达。"],
  ["04", "情绪变化先于视觉变化", "主观情绪与皮电展示出明确差异，而眼动指标仅总扫视幅度达到显著，提示情绪调节未必立即改写注意模式。"],
];

export default function AiEhmiProject() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.wordmark} href="/" aria-label="返回胡宇杰个人网站首页">胡宇杰</a>
        <div className={styles.navMeta}>
          <span>RESEARCH CASE</span>
          <span className={styles.mono}>04 / IASDR 2025</span>
        </div>
        <a className={styles.back} href="/#project-gallery"><span aria-hidden="true">←</span> 返回作品</a>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.authorBadge}><span>设计学国际顶会</span><strong>IASDR 2025</strong></div>
          <p className={styles.authorMeta}>FIRST AUTHOR · 胡宇杰 / HU YUJIE</p>
          <p className={styles.eyebrow}>ACADEMIC RESEARCH · HUMAN-CENTERED AI · MIXED METHODS</p>
          <h1>人和智能体，<br />如何在道路上理解彼此？</h1>
          <p className={styles.lead}>
            该研究以第一作者发表于设计学国际顶会 IASDR 2025 Human-Centered AI Track。
            我将自动驾驶汽车视为一个会表达、会被解读的 AI 智能体，
            我们以 eHMI 为沟通媒介，通过模拟加塞实验，研究智能体的语言风格与语气如何调节人的情绪、注意与信任。
          </p>
        </div>
        <figure className={styles.heroVisual}>
          <img src={project.image} alt="驾驶者与自动驾驶车辆通过视觉信号建立沟通的概念场景" />
          <figcaption><span>01</span> HUMAN–AGENT COMMUNICATION / AFFECT + ATTENTION</figcaption>
        </figure>
      </section>

      <section className={styles.stats} aria-label="研究概览">
        <div><strong>IASDR</strong><span>设计学国际顶会 · 2025</span></div>
        <div><strong>01</strong><span>第一作者</span></div>
        <div><strong>20</strong><span>有效参与者</span></div>
        <div><strong>04</strong><span>数据证据通道</span></div>
      </section>

      <section className={styles.questionSection}>
        <div className={styles.sectionLabel}><span>01</span><p>THE QUESTION</p></div>
        <div className={styles.questionCopy}>
          <p className={styles.kicker}>加塞不只是路权冲突，也是人与智能体的一次沟通失败。</p>
          <h2>如果汽车能表达意图，<br />它应该“像机器”还是“像人”？</h2>
          <p>
            现有 eHMI 多将汽车状态“显示出来”，但较少回答信息应该如何被说出来。
            我们把自动驾驶汽车重新理解为一个参与社会沟通的 AI 智能体，将“语言风格 × 语气”作为可设计变量，
            探索它是否能在高压驾驶情境中降低敌意，同时不抢占安全注意。
          </p>
        </div>
      </section>

      <section className={styles.frameworkSection}>
        <div className={styles.frameworkCopy}>
          <div className={styles.sectionLabel}><span>02</span><p>THE FRAMEWORK</p></div>
          <h2>从“说什么”<br />到“怎么说”。</h2>
          <p>
            框架用两条轴拆解语言策略：横轴从指示式到拟人式，纵轴从敌意到亲和。
            这让语言不再是一句临时文案，而是可比较、可验证、可随情境调整的设计系统。
          </p>
        </div>
        <figure className={styles.frameworkImage}>
          <img src="/projects/ai-ehmi/language-framework.jpg" alt="以指示式到拟人式、敌意到亲和为两轴的语言策略框架" />
          <figcaption>LANGUAGE STYLE × TONE</figcaption>
        </figure>
      </section>

      <section className={styles.conditionsSection}>
        <div className={styles.sectionLabel}><span>03</span><p>EXPERIMENTAL CONDITIONS</p></div>
        <header className={styles.conditionsHeader}>
          <h2>只改变语言，<br />让因果更清晰。</h2>
          <p>统一视觉形式、字数、展示时长与字体，以语言内容作为唯一操控变量。</p>
        </header>
        <div className={styles.conditionList}>
          {conditions.map(([id, text, type]) => (
            <article key={id}><span>{id}</span><h3>{text}</h3><p>{type}</p></article>
          ))}
        </div>
      </section>

      <section className={styles.methodSection}>
        <div className={styles.sectionLabel}><span>04</span><p>MIXED-METHODS STUDY</p></div>
        <div className={styles.methodLead}>
          <h2>情绪不能只靠一个数字解释。</h2>
          <p>因此我们同时收集主观感受、生理唤醒、视觉注意与语义反馈，从四条证据链理解驾驶者反应。</p>
        </div>
        <div className={styles.methodGrid}>
          <article><span>01</span><h3>PANAS</h3><p>每轮后记录积极与消极情绪。</p></article>
          <article><span>02</span><h3>EDA</h3><p>用皮电反应追踪唤醒与压力波动。</p></article>
          <article><span>03</span><h3>EYE TRACKING</h3><p>观察注视、扫视与瞳孔变化。</p></article>
          <article><span>04</span><h3>INTERVIEW</h3><p>解释偏好、误读与驾驶决策背后的原因。</p></article>
        </div>
        <figure className={styles.processingVisual}>
          <img src="/projects/ai-ehmi/processing-framework.jpg" alt="AI 车辆通过文本和表情输出 eHMI，人类通过情绪和注意路径响应的框架" />
          <figcaption>CAR OUTPUT → eHMI → HUMAN AFFECT + COGNITION</figcaption>
        </figure>
      </section>

      <section className={styles.findingsSection}>
        <div className={styles.sectionLabel}><span>05</span><p>KEY FINDINGS</p></div>
        <header className={styles.findingsHeader}>
          <p className={styles.resultNumber}>中性拟人 &gt; 亲和拟人 &gt; 道歉拟人 &gt; 指示表达</p>
          <h2>最“可爱”的话，<br />不一定是最好的话。</h2>
        </header>
        <div className={styles.findingList}>
          {findings.map(([id, title, body]) => (
            <article key={id}><span>{id}</span><h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
      </section>

      <section className={styles.designSection}>
        <div className={styles.sectionLabel}><span>06</span><p>DESIGN IMPLICATION</p></div>
        <div className={styles.designHeadline}>
          <h2>不是让车永远更像人，<br />而是让它在正确的时刻说对的话。</h2>
        </div>
        <div className={styles.spectrum}>
          <article><span>HIGH RISK</span><h3>直接指示</h3><p>高速避险、碰撞警告：符号、灯光与简洁状态优先。</p></article>
          <article><span>MODERATE STRESS</span><h3>中性拟人</h3><p>加塞、合流等冲突性交互：以专业为底，补充适度社会温度。</p></article>
          <article><span>LOW PRESSURE</span><h3>亲和表达</h3><p>等待、低速或静止场景：可以用更友好的语气建立关系。</p></article>
        </div>
        <p className={styles.designQuote}>从静态信息板，走向能感知情境的沟通代理。</p>
      </section>

      <section className={styles.finalResult}>
        <p className={styles.eyebrow}>FIRST-AUTHOR RESEARCH / IASDR 2025</p>
        <h2>WHAT IS SAID.<br />HOW IT IS SAID.<br />WHEN IT IS SAID.</h2>
        <p>这项研究把 eHMI 从一块“输出信息”的界面，重新定义为人和智能体协调关系的媒介：智能体既要清晰地传达意图，也要理解它的表达会如何影响人。</p>
        <a href="/#project-gallery">返回所有作品 <span aria-hidden="true">↗</span></a>
      </section>

      <footer className={styles.footer}>
        <span>HUYU · FIRST AUTHOR · RESEARCH CASE STUDY</span>
        <span>Hu, Yujie; Cao, Qiyue; Liu, Youle; Fang, Shanhao; Zhang, Hanling</span>
      </footer>
    </main>
  );
}
