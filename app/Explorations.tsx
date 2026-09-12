"use client";
import {useEffect,useRef,useState} from "react";
import s from "./reader.module.css";
const works=[
{id:"cloud-journey",title:"云游 · 悟境",pages:23,paired:true},
{id:"nature-resonance",title:"自然共振",pages:8,paired:true},
{id:"underwater-robot",title:"水下机器人",pages:4,paired:false},
{id:"jinsha",title:"寻迹金沙",pages:3,paired:false},
{id:"photography",title:"摄影作品集",pages:18,paired:true}];
const pad=(n:number)=>String(n).padStart(2,"0");
function Sheet({src,alt,open}:{src:string;alt:string;open:()=>void}){
 const [status,setStatus]=useState("loading"),[retry,setRetry]=useState(0);
 const ref=useRef<HTMLImageElement>(null);
 const url=retry?src+"?retry="+retry:src;
 useEffect(()=>{setStatus("loading");if(ref.current?.complete)setStatus(ref.current.naturalWidth?"ready":"error");const timer=setTimeout(()=>setStatus(v=>v==="loading"?"error":v),8000);return()=>clearTimeout(timer)},[url]);
 return <div className={s.sheet}><img ref={ref} src={url} alt={alt} hidden={status==="error"} onLoad={()=>setStatus("ready")} onError={()=>setStatus("error")}/>{status==="loading"&&<p role="status">正在载入页面…</p>}{status==="error"&&<div role="status"><p>图片暂时无法加载。可重试、切换作品，或查看下方原稿 PDF。</p><button onClick={()=>setRetry(n=>n+1)}>重试图片</button></div>}{status==="ready"&&<button onClick={open}>放大阅读 ↗</button>}</div>;
}
export default function Explorations(){
 const [chapter,setChapter]=useState(0),[page,setPage]=useState(1),[mobile,setMobile]=useState(false),[zoom,setZoom]=useState<string|null>(null),[scale,setScale]=useState(1);
 const positions=useRef<Record<number,number>>({});
 const dialog=useRef<HTMLDialogElement>(null);
 const touch=useRef<{x:number;y:number}|null>(null);
 const work=works[chapter],step=work.paired&&!mobile?2:1;
 const first=step===2?Math.floor((page-1)/2)*2+1:page;
 const pages=step===2&&first<work.pages?[first,first+1]:[first];
 const pdf="/explorations/"+work.id+"/spread-"+pad(Math.ceil(page/(work.paired?2:1)))+".pdf";
 useEffect(()=>{const media=matchMedia("(max-width:700px)");const sync=()=>setMobile(media.matches);sync();media.addEventListener("change",sync);
 const restore=()=>{const params=new URLSearchParams(location.search);const c=works.findIndex(w=>w.id===params.get("work"));if(c>=0){setChapter(c);setPage(Math.max(1,Math.min(works[c].pages,Math.floor(Number(params.get("page")))||1)))}};restore();addEventListener("popstate",restore);return()=>{media.removeEventListener("change",sync);removeEventListener("popstate",restore)}},[]);
 useEffect(()=>{if(zoom){setScale(1);dialog.current?.showModal()}else dialog.current?.close()},[zoom]);
 function go(c:number,p:number){positions.current[chapter]=page;setChapter(c);setPage(p);const url=new URL(location.href);url.searchParams.set("work",works[c].id);url.searchParams.set("page",String(p));url.hash="explorations";history.replaceState(null,"",url)}
 function turn(d:number){const n=first+d*step;if(n>work.pages){if(chapter<4)go(chapter+1,1)}else if(n<1){if(chapter>0)go(chapter-1,works[chapter-1].pages)}else go(chapter,n)}
 return <section id="explorations" className={s.reader} aria-labelledby="explorations-title">
 <div className={s.kicker}><span>DESIGN PORTFOLIO</span><span>跨学科设计作品集</span></div>
 <header className={s.heading}><h2 id="explorations-title">设计探索<span>Across disciplines.</span></h2><p>设计训练连接了我对人的理解、技术的思考与审美表达。在产品案例之外，这里收录服务体验、仿生产品、文化交互与摄影的探索。</p></header>
 <nav className={s.chapters} aria-label="作品集项目导航">{works.map((w,i)=><button key={w.id} aria-current={chapter===i?"true":undefined} onClick={()=>go(i,positions.current[i]||1)}>{w.title}</button>)}</nav>
 <h3>{work.title}</h3>
 <div className={s.images} style={{gridTemplateColumns:"repeat("+pages.length+",minmax(0,1fr))"}} onKeyDown={e=>{if(e.key==="ArrowRight"){e.preventDefault();turn(1)}if(e.key==="ArrowLeft"){e.preventDefault();turn(-1)}}} onTouchStart={e=>{touch.current=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null}} onTouchEnd={e=>{const start=touch.current;touch.current=null;if(!start||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)turn(dx<0?1:-1)}}>
 {pages.map(n=>{const src="/explorations/"+work.id+"/page-"+pad(n)+".webp";return <Sheet key={src} src={src} alt={work.title+"原稿第 "+n+" 页"} open={()=>setZoom(src)}/>})}</div>
 <div className={s.toolbar}><button aria-label="上一页" disabled={chapter===0&&first===1} onClick={()=>turn(-1)}>← 上一页</button><label>页码 <select aria-label="选择原稿页码" value={page} onChange={e=>go(chapter,Number(e.target.value))}>{Array.from({length:work.pages},(_,i)=><option key={i} value={i+1}>{i+1} / {work.pages}</option>)}</select></label><button aria-label="下一页" disabled={chapter===4&&pages[pages.length-1]===work.pages} onClick={()=>turn(1)}>下一页 →</button></div>
 <div className={s.footer}><p aria-live="polite">{work.title} · 第 {pages.join("、")} / {work.pages} 页</p><a href={pdf} target="_blank" rel="noopener noreferrer">查看当前原稿 PDF ↗</a></div>
 <dialog ref={dialog} className={s.dialog} onClose={()=>setZoom(null)}><div className={s.toolbar}><button onClick={()=>setZoom(null)}>关闭阅读 ×</button><button onClick={()=>setScale(v=>v===1?2:1)}>{scale===1?"放大至 200%":"适应窗口"}</button><a href={pdf} target="_blank" rel="noopener noreferrer">原稿 PDF ↗</a></div><div className={s.zoomScroll}>{zoom&&<img src={zoom} alt={work.title+"放大原稿"} style={{width:scale*100+"%"}}/>}</div></dialog>
 </section>;
}
