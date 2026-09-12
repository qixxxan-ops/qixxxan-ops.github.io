"use client";

import { useState, type ReactNode } from "react";
import s from "./case-visuals.module.css";

export function CaseSummary({role,delivery,boundary}:{role:string;delivery:string;boundary:string}) {
  return <aside className={s.summary} aria-label="项目速览"><span className={s.meta}>AT A GLANCE / 项目速览</span><dl><div><dt>我的职责</dt><dd>{role}</dd></div><div><dt>核心交付</dt><dd>{delivery}</dd></div><div><dt>阅读边界</dt><dd>{boundary}</dd></div></dl></aside>;
}

function Frame({ number, title, intro, children }: {number: string; title: string; intro: string; children: ReactNode}) {
  return <section className={s.frame} aria-label={title}><header className={s.header}><span className={s.meta}>FIELD NOTES / {number}</span><h2>{title}</h2><p>{intro}</p></header>{children}</section>;
}

export function FlashVisual() {
  const [mode, setMode] = useState("闪光");
  const [connected, setConnected] = useState(true);
  const [enabled, setEnabled] = useState(true);
  return <Frame number="01" title="一套界面，两种光。" intro="从模式选择到异常反馈，把相机侧的交互边界拆开看。">
    <div className={s.split}><div className={s.console}>
      <div className={s.consoleHead}><span>CAMERA CONTROL</span><span>{connected ? "● 已连接" : "○ 连接中断"}</span></div>
      <strong className={s.readout}>{!connected ? "连接中断" : !enabled ? "已关闭" : mode + "模式"}</strong>
      <div className={s.controls}>{["闪光", "补光"].map(x=><button key={x} disabled={!connected || !enabled} aria-pressed={mode===x} onClick={()=>setMode(x)}>{x}</button>)}</div>
      <div className={s.controls}><button disabled={!connected} aria-pressed={enabled} onClick={()=>setEnabled(!enabled)}>{enabled ? "关闭灯光" : "开启灯光"}</button><button onClick={()=>setConnected(!connected)}>{connected ? "模拟断开" : "恢复连接"}</button></div>
      <p className={s.note}>交互逻辑示意，不是正式固件界面；不控制真实设备。</p>
    </div><div className={s.explanation} aria-live="polite"><span className={s.meta}>DESIGN DECISION</span><h3>{!connected ? "异常先于操作" : !enabled ? "软件补偿硬件边界" : mode === "闪光" ? "让触发语义清楚" : "让持续照明可理解"}</h3><p>{!connected ? "连接是控制的前提。异常状态明确提示，并暂时禁用模式操作；真实回连策略需以固件方案为准。" : !enabled ? "硬件缺少休眠能力时，通过相机界面提供开关，降低误触、耗电和状态不清晰的风险。" : mode === "闪光" ? "在拍摄触发链路中定义闪光行为，并对齐相机端与配件端的控制语义。" : "将补光与拍摄瞬间的闪光区分，明确模式、亮度与开关的状态反馈。"}</p></div></div>
    <div className={s.lanes} aria-label="协作责任图">{[["配件线 Owner","产品目标与整体节奏"],["我的工作 · 相机侧","需求转译 → 范围收敛 → 状态定义 → 风险推进"],["研发与测试","实现与联调 → 回归验证"]].map(([a,b])=><div key={a}><strong>{a}</strong><span>{b}</span></div>)}</div>
    <details className={s.details}><summary>查看断连风险如何进入交付闭环</summary><ol className={s.steps}>{["收集同类使用反馈","判断连接风险的严重性","推动定级与责任拆解","对齐解决方案","跟进修复与回归"].map(t=><li key={t}>{t}</li>)}</ol><p>这是对现有案例叙述的结构化整理，不代表公开了原始问题单。</p></details>
  </Frame>;
}

const nodes = [
  ["理解音乐","音乐与创作要求","节奏、情绪与片段结构","将创作输入转化为可编排的约束。"],
  ["构思与编排","素材标签与候选集","素材选择和时间安排","模型做创意判断，不直接承担文件正确性的保证。"],
  ["结构校验","结构化编排结果","问题列表与修改依据","用字段、枚举、时间与资源规则检查输出。"],
  ["确定性生成","通过检查的编排","可导入的模板文件","将创意表达与严格文件格式分层。"],
  ["人工终审","模板与预览","运营交付决策","保留审美判断与最终交付把关。"],
];
export function PipelineVisual() {
  const [active,setActive] = useState(0);
  const [fixed,setFixed] = useState(false);
  return <Frame number="02" title="创意与确定性，分层协作。" intro="选择一个节点，查看它处理什么、交付什么。">
    <div className={s.pipeline}>{nodes.map((n,i)=><button key={n[0]} aria-pressed={active===i} onClick={()=>setActive(i)}><span className={s.meta}>{i<2 ? "AI" : i<4 ? "SYSTEM" : "HUMAN"} / 0{i+1}</span><strong>{n[0]}</strong><span aria-hidden="true">{i<4 ? "→" : "✓"}</span></button>)}</div>
    <div className={s.nodeDetail} aria-live="polite"><div><span className={s.meta}>INPUT</span><h3>{nodes[active][1]}</h3></div><span aria-hidden="true">→</span><div><span className={s.meta}>OUTPUT</span><h3>{nodes[active][2]}</h3></div><p>{nodes[active][3]}</p></div>
    <div className={s.split}><div><h3>我的产品工作</h3><p>定义生产流程、模型边界、质量标准与运营交付闭环。工具的生成链路与人工终审各自承担明确职责。</p></div><div className={s.console}><span className={s.meta}>VALIDATION / 规则演示</span><p>片段总长 10 秒，素材结束时间 {fixed ? "10" : "12"} 秒。</p><div className={s.validation} role="status">{fixed ? "✓ 时间边界检查通过" : "! 结束时间超出片段范围"}</div><button onClick={()=>setFixed(!fixed)}>{fixed ? "重置示例" : "将结束时间修正为 10 秒"}</button><p className={s.note}>用于解释校验机制的示例数据，不是平台运行日志；单项通过不代表模板全部合格。</p></div></div>
  </Frame>;
}

export function RetouchVisual() {
  const [selected,setSelected] = useState(0);
  const evidence = [["模板供给","模板组对照问卷","质感与功能型方向更受偏好，调整供给方向。"],["效果质量","问题案例与同组图片回归","围绕人脸、主体和光线问题迭代，而不是仅修改入口。"],["场景分发","推荐策略对照","将主体、光线与环境纳入匹配，推动场景推荐进入核心能力。"]];
  return <Frame number="03" title="等待变短，判断不能省略。" intro="把链路性能和用户价值分开验证。">
    <figure className={s.chart}><figcaption>全链路耗时 · 秒</figcaption>{[["首版 Demo",154],["优化后",30]].map(([label,value])=><div className={s.barRow} key={label}><span>{label}</span><div className={s.track}><div style={{width:`${Number(value)/154*100}%`}} /></div><strong>{value}s</strong></div>)}<div className={s.axis}><span>0</span><span>154 秒 · 同一尺度</span></div><p className={s.note}>沿用案例记录的总耗时。未提供分环节测量、样本量与测试条件，不据此推导各项策略贡献或商业效果。</p></figure>
    <div className={s.three}>{[["相机侧","上传前压缩","在画质、文件大小和处理时间之间取舍。"],["传输中","核心任务优先","减少非关键任务对核心链路的竞争。"],["App / 云端","重排数据策略","避免大图在多个端之间重复流转。"]].map(([a,b,c])=><article key={a}><span className={s.meta}>{a}</span><h3>{b}</h3><p>{c}</p></article>)}</div>
    <h3>哪条证据，改变了哪项决策？</h3><div className={s.controls}>{evidence.map((e,i)=><button key={e[0]} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{e[0]}</button>)}</div><div className={s.nodeDetail} aria-live="polite"><div><span className={s.meta}>验证方式</span><h3>{evidence[selected][1]}</h3></div><span aria-hidden="true">→</span><div><span className={s.meta}>产品判断</span><p>{evidence[selected][2]}</p></div></div>
    <p className={s.note}>探索项目：链路耗时改善不等于付费意愿已改善。真实原图与调优样例尚未提供，此处不把概念封面当作效果证据。</p>
  </Frame>;
}

const conditions = [["无提示","—","基线条件"],["指示式","变道已完成","描述状态"],["中性拟人","感谢你的理解","表达理解与尊重"],["亲和拟人","真的非常感谢","更强的亲和表达"],["道歉拟人","对此感到抱歉","表达歉意"]];
export function ResearchVisual() {
  const [active,setActive] = useState(0);
  return <Frame number="04" title="同一个情境，不同的表达。" intro="比较语言条件，理解实验改变了什么。">
    <div className={s.controls}>{conditions.map((c,i)=><button key={c[0]} aria-pressed={active===i} onClick={()=>setActive(i)}>{c[0]}</button>)}</div>
    <div className={s.researchDisplay} aria-live="polite"><span className={s.meta}>eHMI / 条件示意 · 非原始实验界面</span><strong>{conditions[active][1]}</strong><span>{conditions[active][2]}</span></div>
    <ol className={s.steps}>{["统一情境与呈现条件","切换语言条件","情绪、生理与眼动测量","访谈解释反馈"].map(t=><li key={t}>{t}</li>)}</ol>
    <div className={s.three}>{[["主观情绪与偏好","案例报告拟人表达缓和负面情绪，中性拟人获得最高偏好。"],["生理与视觉注意","案例报告皮电存在差异；眼动仅总扫视幅度达到显著，不能概括为所有指标改善。"],["设计推论","语气应随场景调整。高风险道路部署的有效性不能由当前研究直接保证。"]].map(([a,b])=><article key={a}><span className={s.meta}>EVIDENCE / SCOPE</span><h3>{a}</h3><p>{b}</p></article>)}</div>
    <p className={s.note}>依据现有案例文字整理；未提供原始数值、误差范围与完整统计结果，因此不绘制数值排名或显著性图。</p>
  </Frame>;
}
