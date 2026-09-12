import type { Metadata } from "next";
import { PipelineVisual, CaseSummary } from "../CaseVisuals";
import type { CSSProperties } from "react";
import styles from "./project.module.css";

const project = {
  title: "AI 视频模板自动化生产平台",
  description:
    "以 AI 编排与确定性编译的分层架构，将音乐、贴纸、转场和特效自动组合为可直接上传运营后台的视频模板。",
  image: "/projects/ai-template-pipeline/hero.png",
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
      images: [{ url: project.image, width: 1536, height: 1024, alt: "AI 视频模板自动化生产管线概念视觉" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — HUYU`,
      description: project.description,
      images: [project.image],
    },
  };
}

const pipeline = [
  ["01", "INPUT", "输入目标场景、情绪、风格与可选音乐片段"],
  ["02", "UNDERSTAND", "读取 BPM、高潮、歌词进入时机，规划片段数量与长度"],
  ["03", "CONCEPT", "先定义一句话核心概念，再推导视觉路线、色彩和包装风格"],
  ["04", "ORCHESTRATE", "编排封面、开闭场、转场、贴纸、文字与特效"],
  ["05", "VALIDATE", "审查视听一致性、时长、位置、字段与结构规范"],
  ["06", "PUBLISH", "生成模板及素材 JSON，人工终审后一键上传运营后台"],
];

const orchestration = [
  ["理解音乐", "分析节奏、高潮与歌词语义，让包装动作发生在正确的时间。"],
  ["确立概念", "从场景与风格要求中提炼核心概念，统一视觉路线和色彩意图。"],
  ["定义片段", "先明确开场、歌词回应、高潮强调与收尾等叙事作用。"],
  ["选择资源", "每一次转场、贴纸和特效选择都必须给出语义或节奏依据。"],
  ["终审输出", "检查视觉一致性与包装密度，输出结构化编排结果。"],
];

const checks = [
  "字段完整性", "枚举值约束", "数值范围", "资源可用性", "素材挂载规则",
  "时间区间合法", "安全区域", "片段结构", "转场边界", "JSON Schema",
];

export default function AITemplatePipelineProject() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.wordmark} href="/" aria-label="返回胡宇杰个人网站首页">胡宇杰</a>
        <div className={styles.navMeta}>
          <span>AI PRODUCT CASE STUDY</span>
          <span className={styles.mono}>02 / 2026</span>
        </div>
        <a className={styles.back} href="/#project-gallery"><span aria-hidden="true">←</span> 返回作品</a>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>GENERATIVE AI · CONTENT PIPELINE · 0→1</p>
          <h1>AI 编排创意，<br />系统保证输出。</h1>
          <p className={styles.lead}>
            我从 0 到 1 负责 AI 视频模板自动化生产平台：让大模型理解音乐、构思创意并编排包装，
            再由确定性编译器生成可直接导入的模板文件。
          </p>
        </div>
        <figure className={styles.heroVisual}>
          <img src={project.image} alt="音乐波形经过 AI 编排生成结构化视频模板的抽象视觉" />
          <figcaption><span>AI ORCHESTRATION</span><span>DETERMINISTIC OUTPUT</span></figcaption>
        </figure>
      </section>

      <CaseSummary role="定义生产流程、模型边界、质量标准与运营交付闭环。" delivery="AI 编排与确定性生成的分层生产方案。" boundary="校验面板为解释性示例，不是运行日志或实时平台。" />
      <section className={styles.outcomes} aria-label="项目成果">
        <div><strong>1 MIN</strong><span>单次模板生成</span></div>
        <div><strong>700+</strong><span>音乐与包装素材结构化</span></div>
        <div><strong>20+</strong><span>自动质量检查</span></div>
        <div><strong>0→1</strong><span>生产、校验到上传完整闭环</span></div>
      </section>

      <section className={styles.projectBrief} aria-label="项目职责与核心判断">
        <article><span className={styles.mono}>MY ROLE</span><strong>0→1 产品负责人</strong><p>定义生产流程、模型边界、质量标准与运营交付闭环。</p></article>
        <article><span className={styles.mono}>CORE DECISION</span><strong>AI 负责编排，系统负责确定</strong><p>把开放的审美判断与严格的文件生成拆成两层，兼顾创意与稳定。</p></article>
        <article><span className={styles.mono}>PRODUCT VALUE</span><strong>从“生成内容”到“交付产能”</strong><p>产物不是演示稿，而是能校验、能追踪、能直接进入运营后台的模板。</p></article>
      </section>

      <PipelineVisual />
      <section className={styles.context}>
        <div className={styles.sectionLabel}><span>01</span><p>WHY</p></div>
        <div className={styles.contextMain}>
          <h2>模板决定一键成片的上限，<br />供给却被人工产能锁住。</h2>
          <p className={styles.contextLead}>
            一键成片的留存与转化高度依赖模板效果。传统模板生产依靠人工选材、卡点、配置和校验，
            单个模板周期长，且个人审美惯性导致场景覆盖不足、风格趋同。
          </p>
          <div className={styles.supplySplit}>
            <article>
              <span className={styles.mono}>HUMAN TEMPLATE</span>
              <h3>追热度，做精品，强传播</h3>
              <p>人负责高价值创意与精品表达，发挥审美判断和热点敏感度。</p>
            </article>
            <article>
              <span className={styles.mono}>AI TEMPLATE</span>
              <h3>大数量，强差异，去重复</h3>
              <p>AI 承担规模化组合，覆盖更多场景、情绪与风格的长尾需求。</p>
            </article>
          </div>
        </div>
      </section>



      <section className={styles.directorSection}>
        <div className={styles.directorIntro}>
          <div className={styles.sectionLabel}><span>04</span><p>AI AS DIRECTOR</p></div>
          <h2>AI 不是随机挑素材，<br />而是先建立叙事意图。</h2>
          <p>
            我要求模型先回答“这支模板想表达什么”，再决定视觉与包装；每个素材必须有歌词、节奏、场景或情绪依据，
            避免用“好看、适合”这类不可验证的理由。
          </p>
        </div>
        <div className={styles.directorList}>
          {orchestration.map(([title, detail], index) => (
            <article key={title}><span className={styles.mono}>0{index + 1}</span><h3>{title}</h3><p>{detail}</p></article>
          ))}
        </div>
      </section>

      <section className={styles.skillSection}>
        <div className={styles.skillMetric}>
          <p className={styles.mono}>TEMPLATE KNOWLEDGE</p>
          <strong>100+</strong>
          <span>真实模板 JSON</span>
        </div>
        <div className={styles.skillCopy}>
          <div className={styles.sectionLabel}><span>05</span><p>SKILLIZATION</p></div>
          <h2>把隐性的模板经验，<br />变成模型可调用的 Skill。</h2>
          <p>
            我分析 100+ 真实模板 JSON，将素材挂载、片段结构、安全范围、内容编排和输出格式等范式拆解出来，
            封装为可复用 Skill 注入生成流程。它不是静态示例，而是模型在关键节点必须遵守的领域知识与操作规范。
          </p>
          <div className={styles.controlGrid}>
            <span>片段数量</span><span>整体时长</span><span>转场类型</span><span>包装密度</span><span>封面开关</span><span>风格约束</span>
          </div>
        </div>
      </section>

      <section className={styles.assetsSection}>
        <div className={styles.sectionLabel}><span>06</span><p>ASSET INTELLIGENCE</p></div>
        <div className={styles.assetsHeadline}>
          <h2>先让素材可理解，<br />才能让组合有依据。</h2>
          <p>
            依托内容、图片与音频理解能力，为 700+ 音乐和包装素材建立结构化标签。
            大模型先推理目标标签、圈定候选集，再在候选集内受约束组合。
          </p>
        </div>
        <div className={styles.tagUniverse} aria-label="素材标签体系">
          <span className={styles.tagLarge}>SCENE</span><span>人像</span><span>旅行</span><span>宠物</span><span>夜景</span>
          <span className={styles.tagLarge}>STYLE</span><span>复古</span><span>清透</span><span>电影感</span>
          <span className={styles.tagLarge}>EMOTION</span><span>松弛</span><span>热烈</span><span>治愈</span>
          <span className={styles.tagLarge}>LYRICS</span><span>关键词</span><span>意象</span><span>进入时机</span>
        </div>
        <div className={styles.dedupeRule}>
          <span className={styles.mono}>DE-DUPLICATION</span>
          <p>记录已使用素材 → 传入下一轮排除列表 → 降低跨模板重复与内容同质化</p>
        </div>
      </section>

      <section className={styles.compilerSection}>
        <div className={styles.compilerCopy}>
          <div className={styles.sectionLabel}><span>07</span><p>QUALITY GATE</p></div>
          <h2>模型可以有灵感，<br />文件不能有侥幸。</h2>
          <p>
            模型只输出结构化编排意图，最终文件由确定性编译器生成；随后执行 20+ 项质量检查，
            将格式错误、字段幻觉和非法参数拦截在上传之前。
          </p>
          <div className={styles.checkList}>
            {checks.map((check, index) => <span key={check}><i>{String(index + 1).padStart(2, "0")}</i>{check}</span>)}
          </div>
        </div>
        <div className={styles.codeWindow} aria-label="结构化模板 JSON 示例">
          <div className={styles.codeBar}><span /><span /><span /><p>template.output.json</p></div>
          <pre>{`{
  "concept": "summer pulse",
  "duration": 18.4,
  "segments": [
    {
      "role": "opening",
      "beat": 0.0,
      "transition": "light_leak",
      "reason": "first downbeat"
    },
    {
      "role": "chorus_emphasis",
      "beat": 8.2,
      "effect": "flash",
      "reason": "energy peak"
    }
  ],
  "validation": "passed"
}`}</pre>
        </div>
      </section>

      <section className={styles.observabilitySection}>
        <div className={styles.sectionLabel}><span>08</span><p>OBSERVABILITY</p></div>
        <div className={styles.observabilityHeadline}>
          <h2>让黑盒生成过程，<br />可观察、可定位、可回滚。</h2>
          <p>
            我设计本地 Web 平台实时呈现音乐波形、卡点、片段切分、候选素材、选择理由与分阶段中间结果，
            让运营不必阅读代码，也能判断问题发生在哪一个节点。
          </p>
        </div>
        <div className={styles.timelineMock} aria-label="模板生产平台时间轴示意">
          <div className={styles.waveform}>{Array.from({ length: 56 }).map((_, index) => <i key={index} style={{ "--h": `${18 + ((index * 37) % 76)}%` } as CSSProperties} />)}</div>
          <div className={styles.track}><span style={{ width: "18%" }}>OPENING</span><span style={{ width: "27%" }}>VERSE</span><span style={{ width: "36%" }}>CHORUS</span><span style={{ width: "19%" }}>OUTRO</span></div>
          <div className={styles.materialRail}><b>STICKER</b><i /><i /><i /><b>TRANSITION</b><i /><i /><b>FX</b><i /><i /></div>
        </div>
      </section>

      <section className={styles.resultSection}>
        <p className={styles.eyebrow}>FINAL DELIVERY</p>
        <h2>一分钟。<br />一套模板。<br />一键入库。</h2>
        <p>
          平台跑通了从需求输入、AI 编排、模板生成、自动校验到上传运营后台资源库的完整链路。
          人工从重复制作转向创意终审，AI 生产则承担规模、差异与长尾覆盖。
        </p>
        <a href="/#project-gallery">返回所有作品 <span aria-hidden="true">↗</span></a>
      </section>

      <footer className={styles.footer}>
        <span>HUYU · AI PRODUCT CASE STUDY</span>
        <span>项目视觉由 AI 生成；案例内容已做业务信息抽象化处理</span>
      </footer>
    </main>
  );
}
