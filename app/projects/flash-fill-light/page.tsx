import type { Metadata } from "next";
import styles from "./project.module.css";

const project = {
  title: "二合一闪补光灯固件适配",
  description:
    "Ace Pro 2 相机固件侧的需求定义、体验保障与版本交付案例。",
  image: "/projects/flash-fill-light.jpg",
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
      images: [{ url: project.image, width: 1280, height: 1280, alt: "Ace Pro 2 与二合一闪补光灯" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — HUYU`,
      description: project.description,
      images: [project.image],
    },
  };
}

const responsibilities = [
  ["需求转译与范围定义", "将配件线的产品目标转化为 Ace Pro 2 固件需求，独立输出相机端需求文档，定义连接、闪光、补光、亮度、开关与状态反馈，并结合上市节奏收敛 MVP 范围。"],
  ["方案决策与体验兜底", "评估相机端与配件端的能力边界，明确两种灯光模式的控制语义与异常状态；针对硬件缺少休眠能力，推动增加相机界面开关，降低误触、耗电和状态不清晰风险。"],
  ["跨团队适配与开发推进", "协同配件线 Owner、相机固件研发、配件研发、交互与测试，拉齐实现逻辑、硬件依赖和验收标准，跟进联调、问题定位与方案收口。"],
  ["媒体版风险识别与交付", "持续收集 KOL 真实使用反馈，从多起同类断连问题中判断严重性，推动问题定级、责任拆解、方案决策和回归验证，最终实现正式版 0 个重大体验问题并按期上市。"],
];

const flow = ["发现配件", "蓝牙连接", "选择闪光 / 补光", "调节亮度", "拍摄触发", "状态反馈"];

export default function FlashFillLightProject() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.wordmark} href="/" aria-label="返回胡宇杰个人网站首页">胡宇杰</a>
        <div className={styles.navMeta}>
          <span>CASE STUDY</span>
          <span className={styles.mono}>01 / 2026</span>
        </div>
        <a className={styles.back} href="/#project-gallery"><span aria-hidden="true">←</span> 返回作品</a>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>INSTA360 · ACE PRO 2 · FIRMWARE PRODUCT</p>
          <h1>闪光与补光，如何在一台相机上自然共存？</h1>
          <p className={styles.lead}>
            我负责二合一闪补光灯的 Ace Pro 2 固件适配，
            从需求转译、功能定义到媒体版风险闭环，保障核心体验按期上市。
          </p>
        </div>
        <figure className={styles.heroVisual}>
          <img src="/projects/flash-fill-light.jpg" alt="二合一闪补光灯安装在 Ace Pro 2 上的暗光人像场景" />
          <figcaption><span>01</span> NIGHT PORTRAIT / FILL MODE</figcaption>
        </figure>
      </section>

      <section className={styles.outcome} aria-label="项目成果">
        <div><strong>06</strong><span>核心交互节点完整交付</span></div>
        <div><strong>0</strong><span>正式版重大体验问题</span></div>
        <div><strong>ON TIME</strong><span>随「白色影像大师」版本上市</span></div>
      </section>

      <section className={styles.context}>
        <div className={styles.sectionLabel}><span>01</span><p>CONTEXT</p></div>
        <div className={styles.contextCopy}>
          <div className={styles.contextIntro}>
            <h2>不只是给相机<br />“加一盏灯”。</h2>
            <p>
              真正要补齐的，是运动相机在夜景人像、城市街拍与生活美学创作中，
              一套可控、稳定、能够直接使用的光线体验。
            </p>
          </div>
          <div className={styles.flow} aria-label="用户核心链路">
            {flow.map((item, index) => (
              <div key={item}><span className={styles.mono}>0{index + 1}</span><p>{item}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.roleSection}>
        <div className={styles.sectionLabel}><span>02</span><p>MY RESPONSIBILITIES</p></div>
        <div className={styles.roleIntro}>
          <h2>整体 Owner 在配件线，<br />我对相机侧结果负责。</h2>
          <p>我的交付不止是一份 PRD，而是从需求转译、方案收口、跨端联调到媒体版问题闭环，对 Ace Pro 2 上的最终使用体验负责。</p>
        </div>
        <div className={styles.responsibilitySummary} aria-label="我的核心交付物">
          <span>相机端需求文档</span><i aria-hidden="true">→</i>
          <span>功能与状态规则</span><i aria-hidden="true">→</i>
          <span>跨端适配与联调</span><i aria-hidden="true">→</i>
          <span>版本风险闭环</span>
        </div>
        <div className={styles.scopeList}>
          {responsibilities.map(([name, detail], index) => (
            <div key={name}><span className={styles.mono}>0{index + 1}</span><h3>{name}</h3><p>{detail}</p></div>
          ))}
        </div>
      </section>

      <section className={styles.riskSection}>
        <div className={styles.riskLead}>
          <div className={styles.sectionLabel}><span>03</span><p>MEDIA BUILD</p></div>
          <p className={styles.riskNumber}>7—8</p>
          <h2>来自达人的同类反馈，<br />让我确认这不是偶发瑕疵。</h2>
          <p>
            媒体版用于 KOL 体验、拍摄素材和营销内容。多名达人集中反馈连接困难、
            使用中断开，且断开后无法回连。连接是全部功能的前提，因此我将它提升为正式发布前必须解决的高优风险。
          </p>
        </div>
        <figure className={styles.offCameraImage}>
          <img src="/projects/off-camera-light.jpg" alt="二合一闪补光灯通过蓝牙连接进行离机补光" />
          <figcaption>WIRELESS / 当连接不可信，所有创作价值都无法成立。</figcaption>
        </figure>
      </section>

      <section className={styles.responseSection}>
        <div className={styles.sectionLabel}><span>04</span><p>RESPONSE</p></div>
        <h2>我不只转发反馈，<br />而是把零散问题重新推入闭环。</h2>
        <div className={styles.responseSteps}>
          <div><span>01</span><h3>识别严重性</h3><p>同类反馈集中出现，并且直接阻断核心链路。</p></div>
          <div><span>02</span><h3>拉齐责任方</h3><p>第一时间同步配件线 Owner，拉起相机固件、配件研发与测试。</p></div>
          <div><span>03</span><h3>追溯问题</h3><p>发现早期测试已暴露过问题，但缺少定级、定责与关闭结论。</p></div>
          <div><span>04</span><h3>推动解决</h3><p>促成方案决策、修复与回归，将风险截止在正式版之前。</p></div>
        </div>
        <p className={styles.responseQuote}>“已经有人提过”，不等于“问题正在被解决”。</p>
      </section>

      <section className={styles.hardwareSection}>
        <figure className={styles.productImage}>
          <img src="/projects/product-detail.png" alt="二合一闪补光灯产品细节" />
        </figure>
        <div className={styles.hardwareCopy}>
          <div className={styles.sectionLabel}><span>05</span><p>EXPERIENCE GUARDRAIL</p></div>
          <h2>硬件能力有边界，<br />体验不应该没有补偿。</h2>
          <p>
            识别到配件缺少休眠能力可能带来误触、耗电和状态不清晰后，
            我推动增加相机界面开关，用固件侧控制与反馈降低潜在体验风险。
          </p>
          <div className={styles.guardrail}><span>HARDWARE LIMIT</span><i aria-hidden="true">→</i><span>CAMERA CONTROL</span><i aria-hidden="true">→</i><span>VISIBLE STATE</span></div>
        </div>
      </section>

      <section className={styles.learningSection}>
        <div className={styles.sectionLabel}><span>06</span><p>LEARNINGS</p></div>
        <div className={styles.learningHeadline}>
          <h2>结果如期，<br />过程让我建立了更成熟的交付方法。</h2>
          <p>项目最终成功上市，但媒体版的问题说明：跨软硬件项目不能只管功能完成，还要管信息、依赖和问题是否真正关闭。</p>
        </div>
        <div className={styles.learningList}>
          <article><span>01</span><h3>需求结构化</h3><p>对多模式、强状态的功能，用状态表、异常逻辑和验收用例消除解释空间。</p></article>
          <article><span>02</span><h3>风险闭环</h3><p>问题必须经过定级、定责、决策、修复、验证和关闭。</p></article>
          <article><span>03</span><h3>依赖可见</h3><p>为硬件基线、变更通知和软件影响评估建立明确节点。</p></article>
        </div>
      </section>

      <section className={styles.finalResult}>
        <p className={styles.eyebrow}>FINAL DELIVERY</p>
        <h2>核心链路完整交付。<br />0 个重大体验问题。<br />按期上市。</h2>
        <p>跟随「白色影像大师」版本顺利发布，未影响既定版本节奏。</p>
        <a href="/#project-gallery">返回所有作品 <span aria-hidden="true">↗</span></a>
      </section>

      <footer className={styles.footer}>
        <span>HUYU · PRODUCT CASE STUDY</span>
        <span>场景与产品图来源：Insta360 官方公开素材</span>
      </footer>
    </main>
  );
}
