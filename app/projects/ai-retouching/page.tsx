import type { Metadata } from "next";
import { RetouchVisual, CaseSummary } from "../CaseVisuals";
import styles from "./project.module.css";

const project = {
  title: "相机端 AI 修图",
  description:
    "从跨端性能、模板质量到场景化分发，推动相机端 AI 修图从可运行 Demo 收敛为可验证的产品方案。",
  image: "/projects/ai-retouching/hero.png",
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
      images: [{ url: project.image, width: 1536, height: 1024, alt: "相机端 AI 修图项目视觉" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — HUYU`,
      description: project.description,
      images: [project.image],
    },
  };
}

const hypothesisRows = [
  ["01", "生成质量", "人脸变形、局部不自然", "直接破坏结果可信度", "高"],
  ["02", "模板供给", "热点与强风格模板偏多", "供给方向与相机用户期待错位", "高"],
  ["03", "场景分发", "模板与当前照片不匹配", "相关度不足，降低选择意愿", "高"],
  ["04", "交互流程", "封面、名称、展示顺序", "影响点击与理解，但难解释生成后低满意", "观察"],
  ["05", "商业认知", "价格、权益与付费时机", "价值未成立前，转化优化意义有限", "观察"],
];

const performanceSteps = [
  {
    number: "01",
    name: "相机侧",
    title: "上传前压缩",
    detail: "根据云端处理所需输入规格减少图片数据量，在画质、文件大小与压缩时间之间取舍。",
  },
  {
    number: "02",
    name: "传输中",
    title: "核心任务优先",
    detail: "传输期间调整部分非关键识别与连接任务的优先级，减少资源竞争对核心链路的干扰。",
  },
  {
    number: "03",
    name: "App / 云端",
    title: "重排数据策略",
    detail: "让原图优先留存在手机，优化压缩上传、结果下载与回传相机的先后关系，避免大图反复流转。",
  },
];

const governanceTracks = [
  {
    index: "A",
    title: "供给什么",
    method: "模板组对照问卷",
    text: "复盘用户研究、画像与深访后，设计原模板组和质感 / 功能型优化组，在司内回收约 100—200 份方向性反馈。",
    result: "验证质感、修复类模板更受偏好",
  },
  {
    index: "B",
    title: "效果是否过关",
    method: "问题案例回归 + 自建测试集",
    text: "收集人脸、主体、光线与背景问题案例，和运营、设计师逐条对齐；修改后使用同组图片回归，不合格继续打回。",
    result: "单模板通常经过 2—3 轮调优",
  },
  {
    index: "C",
    title: "应该推给谁",
    method: "推荐策略对照实验",
    text: "参考竞品粗粒度推荐，制作结合主体、光线与环境的精细匹配 Demo，观察用户对两类推荐的选择。",
    result: "场景推荐由可选项升级为核心能力",
  },
];

export default function AiRetouchingProject() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.wordmark} href="/" aria-label="返回胡宇杰个人网站首页">胡宇杰</a>
        <div className={styles.navMeta}>
          <span>CASE STUDY</span>
          <span className={styles.mono}>03 / AI IMAGING</span>
        </div>
        <a className={styles.back} href="/#project-gallery"><span aria-hidden="true">←</span> 返回作品</a>
      </header>

      <section className={styles.hero}>
        <figure className={styles.heroVisual}>
          <img src={project.image} alt="夜景人像从原始画面自然过渡为高质感增强效果" />
          <div className={styles.heroGrid} aria-hidden="true" />
          <figcaption><span>RAW SCENE</span><i>→</i><span>CONTEXTUAL ENHANCEMENT</span></figcaption>
        </figure>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>INSTA360 · AI IMAGING · EXPLORATORY PRODUCT</p>
          <h1>让 AI 修图，<br />回到真实场景。</h1>
          <p className={styles.lead}>
            在项目负责人完成前期可行性摸底后，我承接具体方案落地，
            通过 Demo、内测与用户实验，识别并闭环全链路耗时、模板质量和场景分发三类关键不确定性。
          </p>
        </div>
      </section>

      <CaseSummary role="承接具体方案落地，推进 Demo、内测与跨端问题拆解。" delivery="耗时优化、模板质量回归与场景匹配策略。" boundary="探索项目；技术性能改善不等同商业价值已验证。" />
      <section className={styles.signalBar} aria-label="项目关键验证信号">
        <div><strong>154→30s</strong><span>全链路耗时优化</span></div>
        <div><strong>2.5 / 5</strong><span>内测初始付费意愿</span></div>
        <div><strong>3</strong><span>核心问题闭环</span></div>
        <div><strong>2—3轮</strong><span>单模板效果调优</span></div>
      </section>

      <section className={styles.context}>
        <div className={styles.sectionLabel}><span>01</span><p>CONTEXT &amp; ROLE</p></div>
        <div className={styles.contextMain}>
          <h2>在既定方向下，<br />把概念推进成可验证的方案。</h2>
          <div className={styles.roleGrid}>
            <article>
              <span>项目产品负责人</span>
              <p>与各部门负责人确认项目方向、资源投入和初步技术可行性。</p>
            </article>
            <article className={styles.rolePrimary}>
              <span>我的工作</span>
              <p>具体方案对接、MVP 范围收敛、Demo 推进、跨端问题拆解，以及用户验证与运营策略闭环。</p>
            </article>
          </div>
          <div className={styles.timeline}>
            {["可行性摸底", "方案落地", "Demo 验证", "内测诊断", "方向修正"].map((item, index) => (
              <div key={item}><span className={styles.mono}>0{index + 1}</span><p>{item}</p></div>
            ))}
          </div>
        </div>
      </section>

      <RetouchVisual />

      <section className={styles.research}>
        <div className={styles.sectionLabel}><span>03</span><p>INNER TEST</p></div>
        <div className={styles.researchHeadline}>
          <h2>低分不是答案，<br />只是问题入口。</h2>
          <p>
            内测满意度与付费意愿低于预期。我先建立完整候选假设池，
            再按反馈频率、严重度、因果距离和依赖顺序，确定本轮优先级。
          </p>
        </div>
        <div className={styles.hypothesisTable} role="table" aria-label="低满意度候选原因与优先级">
          {hypothesisRows.map(([index, title, evidence, impact, priority]) => (
            <div key={index} role="row" className={priority === "高" ? styles.highPriority : undefined}>
              <span className={styles.mono}>{index}</span>
              <strong>{title}</strong>
              <p>{evidence}</p>
              <p>{impact}</p>
              <em>{priority}</em>
            </div>
          ))}
        </div>
        <p className={styles.researchNote}>
          封面、名称和流程并非无关，但它们主要影响点击与理解；
          在结果本身尚不可信时，优先修交互无法解释生成后的低满意。
        </p>
      </section>

      <section className={styles.governance}>
        <div className={styles.governanceIntro}>
          <div className={styles.sectionLabel}><span>04</span><p>TEMPLATE GOVERNANCE</p></div>
          <h2>供给什么、<br />效果是否过关、<br />应该推给谁。</h2>
          <p>我把一次性的“找运营调模板”，转化为可验证、可验收、可持续复用的三套机制。</p>
        </div>
        <div className={styles.governanceTracks}>
          {governanceTracks.map((track) => (
            <article key={track.index}>
              <span className={styles.trackIndex}>{track.index}</span>
              <div>
                <p className={styles.trackMethod}>{track.method}</p>
                <h3>{track.title}</h3>
                <p>{track.text}</p>
                <strong>{track.result}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.qualityLab}>
        <figure>
          <img src="/projects/ai-retouching/quality-lab.png" alt="使用固定测试图片多轮验收 AI 修图模板效果的编辑型海报" />
        </figure>
        <div className={styles.qualityCopy}>
          <div className={styles.sectionLabel}><span>05</span><p>QUALITY LAB</p></div>
          <h2>一次生成不满意，<br />就把它变成下一轮测试。</h2>
          <p>
            我收集人脸、主体、光线与背景问题案例，与运营、模板设计师逐条确认效果点；
            设计师修改后，用原案例和自建测试集回归，不达标则继续打回。
          </p>
          <ol>
            <li><span>01</span>收集内测问题案例与修改建议</li>
            <li><span>02</span>按人脸、主体、光线、背景分类</li>
            <li><span>03</span>设计调优后使用固定测试集验收</li>
            <li><span>04</span>邀请内测用户复测感知是否改善</li>
          </ol>
          <blockquote>内部验收确认“改对了”，用户复测确认“真的变好了”。</blockquote>
        </div>
      </section>

      <section className={styles.supply}>
        <div className={styles.sectionLabel}><span>06</span><p>SUPPLY DIRECTION</p></div>
        <div className={styles.supplyHeadline}>
          <p className={styles.quoteMark}>“</p>
          <h2>用户不是不要修图，<br />而是不要离开原场景的修图。</h2>
        </div>
        <div className={styles.supplyGrid}>
          <article>
            <span>原供给逻辑</span>
            <h3>追热点、强风格、重变化</h3>
            <p>在 App 里强调新奇和传播感，但进入相机端后，人物变形和氛围改变过强会降低结果可信度。</p>
          </article>
          <div className={styles.supplyArrow}>→</div>
          <article className={styles.supplyWin}>
            <span>验证后的方向</span>
            <h3>保留现场，增加质感</h3>
            <p>光线修复、主体自然优化与功能型模板，在原照片基础上提供明确、克制、可感知的改善。</p>
          </article>
        </div>
        <div className={styles.surveyProof}>
          <strong>100—200</strong>
          <p>份司内方向性问卷<br />原模板组 vs. 质感 / 功能型优化组</p>
          <span>优化组获得更高偏好，推动模板供给方向调整</span>
        </div>
      </section>

      <section className={styles.matching}>
        <div className={styles.matchingCopy}>
          <div className={styles.sectionLabel}><span>07</span><p>SCENE MATCHING</p></div>
          <h2>好模板，<br />也要在对的场景出现。</h2>
          <p>
            从高满意案例中，我观察到模板与原场景往往具有更强相关性。
            于是参考竞品粗粒度匹配，制作更精细的主体 × 光线 × 环境推荐 Demo 进行方向性对照。
          </p>
          <div className={styles.matchExamples}>
            <div><span>儿童</span><i>→</i><strong>童真 / 成长氛围</strong></div>
            <div><span>暗光人像</span><i>→</i><strong>闪光灯 / 光线修复</strong></div>
            <div><span>海岸风景</span><i>→</i><strong>通透 / 高光平衡</strong></div>
          </div>
          <blockquote>对照中，用户更偏好与当前主体、光线和环境相关的推荐结果。</blockquote>
        </div>
        <figure>
          <img src="/projects/ai-retouching/scene-matching.png" alt="儿童、暗光人像与海岸风景分别匹配不同质感模板的场景推荐视觉" />
        </figure>
      </section>

      <section className={styles.solution}>
        <div className={styles.sectionLabel}><span>08</span><p>AI SOLUTION</p></div>
        <div className={styles.solutionHeadline}>
          <h2>把“要匹配”翻译成<br />技术可以实现的输入与输出。</h2>
          <p>
            场景推荐从“可能有用”升级为核心能力后，我牵头与技术产品对接，
            共同将用户问题转化为图像输入、场景语义、模板映射与推荐结果要求。
          </p>
        </div>
        <div className={styles.vectorFlow} aria-label="场景推荐技术链路">
          <div><span>01</span><strong>当前照片</strong><p>主体、光线、环境</p></div>
          <i>→</i>
          <div><span>02</span><strong>视觉模型</strong><p>图像向量化</p></div>
          <i>→</i>
          <div><span>03</span><strong>场景向量库</strong><p>相似度匹配</p></div>
          <i>→</i>
          <div><span>04</span><strong>云端模板</strong><p>拉取高相关结果</p></div>
          <i>→</i>
          <div><span>05</span><strong>相机呈现</strong><p>优先推荐</p></div>
        </div>
        <p className={styles.boundary}>
          我的贡献：验证场景推荐必要性，并参与定义输入、场景标签、模板映射和推荐输出；
          具体模型选型与工程实现由技术产品、算法和研发团队负责。
        </p>
      </section>

      <section className={styles.finalResult}>
        <p className={styles.eyebrow}>WHAT I LEARNED</p>
        <h2>探索不是一次想对，<br />而是让每次验证<br />都改变方案。</h2>
        <div className={styles.learningGrid}>
          <article><span>01</span><h3>先变得可测</h3><p>把方向落成 Demo，才能看到真实耗时、质量与使用问题。</p></article>
          <article><span>02</span><h3>再拆解归因</h3><p>将“低满意”拆成质量、供给、分发及次要体验因素。</p></article>
          <article><span>03</span><h3>证据进入决策</h3><p>让问题案例、问卷和对照实验分别改变验收、供给和技术方案。</p></article>
        </div>
        <a href="/#project-gallery">返回所有作品 <span aria-hidden="true">↗</span></a>
      </section>

      <footer className={styles.footer}>
        <span>HUYU · AI PRODUCT CASE STUDY</span>
        <span>项目视觉由本人策划并使用生成式工具制作 · 数据口径以项目内测为准</span>
      </footer>
    </main>
  );
}
