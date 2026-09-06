"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./photography.module.css";

type Photograph = {
  id: string;
  title: string;
  place: string;
  year: string;
  camera: string;
  src: string;
  alt: string;
  tone: string;
  width: number;
  height: number;
};

const photographs: Photograph[] = [
  {
    id: "01",
    title: "水的回声",
    place: "River study",
    year: "2024—26",
    camera: "HUYU ARCHIVE",
    src: "/photography/01.jpg",
    alt: "湍急水流上方的青铜雕塑",
    tone: "#417b83",
    width: 405,
    height: 270,
  },
  {
    id: "02",
    title: "林间残雪",
    place: "Winter study",
    year: "2024—26",
    camera: "HUYU ARCHIVE",
    src: "/photography/02.jpg",
    alt: "暗色树林与林间残雪",
    tone: "#3f3d3a",
    width: 1800,
    height: 1200,
  },
  {
    id: "03",
    title: "湖面来信",
    place: "City study",
    year: "2024—26",
    camera: "HUYU ARCHIVE",
    src: "/photography/03.jpg",
    alt: "树枝掩映下平静的城市湖面",
    tone: "#587581",
    width: 1620,
    height: 1080,
  },
  {
    id: "04",
    title: "风的形状",
    place: "Winter study",
    year: "2024—26",
    camera: "HUYU ARCHIVE",
    src: "/photography/04.jpg",
    alt: "枝条上被风塑形的白色冰晶",
    tone: "#c6d1d7",
    width: 1620,
    height: 1080,
  },
  {
    id: "05",
    title: "白色森林",
    place: "Winter study",
    year: "2024—26",
    camera: "HUYU ARCHIVE",
    src: "/photography/05.jpg",
    alt: "覆盖冰雪的寂静森林",
    tone: "#9ba0a1",
    width: 1800,
    height: 1200,
  },
  {
    id: "06",
    title: "温室漫游",
    place: "Daily study",
    year: "2024—26",
    camera: "HUYU ARCHIVE",
    src: "/photography/06.jpg",
    alt: "植物繁茂的旧温室内部",
    tone: "#405847",
    width: 1024,
    height: 768,
  },
];

const sizingVars = (photo: Photograph) => {
  const ratio = photo.width / photo.height;
  return {
    "--tone": photo.tone,
    "--frame-width": `clamp(${134 * ratio}px, calc(${31 * ratio}vh - ${101 * ratio}px), ${254 * ratio}px)`,
    "--mobile-frame-width": `${184 * ratio}px`,
  } as React.CSSProperties;
};

export default function PhotographyPage() {
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Photograph | null>(null);

  const updateActiveFrame = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const center = rail.scrollLeft + rail.clientWidth / 2;
    const frames = Array.from(rail.querySelectorAll<HTMLElement>("[data-frame]"));
    let closest = 0;
    let distance = Number.POSITIVE_INFINITY;
    frames.forEach((frame, index) => {
      const frameCenter = frame.offsetLeft + frame.offsetWidth / 2;
      const nextDistance = Math.abs(frameCenter - center);
      if (nextDistance < distance) {
        distance = nextDistance;
        closest = index;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActiveFrame);
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    updateActiveFrame();
    return () => {
      cancelAnimationFrame(raf);
      rail.removeEventListener("scroll", onScroll);
    };
  }, [updateActiveFrame]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail) return;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      rail.scrollLeft += event.deltaY * 1.35;
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current = { active: true, startX: event.clientX, startScroll: rail.scrollLeft };
    rail.setPointerCapture(event.pointerId);
    rail.dataset.dragging = "true";
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragRef.current.active) return;
    rail.scrollLeft = dragRef.current.startScroll - (event.clientX - dragRef.current.startX) * 1.18;
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current.active = false;
    rail.releasePointerCapture(event.pointerId);
    delete rail.dataset.dragging;
  };

  const jumpTo = (index: number) => {
    const rail = railRef.current;
    const frame = rail?.querySelectorAll<HTMLElement>("[data-frame]")[index];
    if (!rail || !frame) return;
    rail.scrollTo({ left: frame.offsetLeft - (rail.clientWidth - frame.offsetWidth) / 2, behavior: "smooth" });
  };

  const onRailKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = Math.min(Math.max(activeIndex + direction, 0), photographs.length - 1);
    jumpTo(nextIndex);
  };

  return (
    <main className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />
      <header className={styles.header}>
        <a href="/" className={styles.wordmark} aria-label="返回胡宇杰个人网站首页">胡宇杰</a>
        <div className={styles.headerMeta}>
          <span>Photography archive</span>
          <span className={styles.mono}>NO. 01—06</span>
        </div>
        <a className={styles.closeButton} href="/" aria-label="返回个人网站首页">
          <span />
          <span />
        </a>
      </header>

      <section className={styles.hero} aria-labelledby="archive-title">
        <div className={styles.ghostType} aria-hidden="true">
          <span>摄影</span>
          <span>PHOTOGRAPHY</span>
        </div>
        <div className={styles.intro}>
          <p className={styles.kicker}><i /> Selected frames · 2024—2026</p>
          <h1 id="archive-title">光留下的<br />一些证据。</h1>
        </div>
        <p className={styles.hint}>
          <span className={styles.mouseIcon}><i /></span>
          横向拖拽 / 滚动浏览
        </p>
      </section>

      <section className={styles.archive} aria-label="摄影作品胶片浏览器">
        <div className={styles.viewfinder} style={sizingVars(photographs[activeIndex])} aria-hidden="true"><i /><i /><i /><i /></div>
        <div
          className={styles.rail}
          ref={railRef}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onRailKeyDown}
          tabIndex={0}
          aria-label="使用左右方向键、滚轮或拖拽浏览照片"
        >
          <div className={styles.film}>
            <div className={`${styles.perforations} ${styles.perforationsTop}`} aria-hidden="true" />
            <div className={`${styles.perforations} ${styles.perforationsBottom}`} aria-hidden="true" />
            <div className={styles.leader} aria-hidden="true">
              <span>HUYU<br />COLOR 400</span>
              <b>START</b>
            </div>
            {photographs.map((photo, index) => (
              <article
                className={`${styles.frame} ${activeIndex === index ? styles.activeFrame : ""}`}
                data-frame
                key={photo.id}
                style={sizingVars(photo)}
              >
                <button className={styles.photoButton} onClick={() => setSelected(photo)} aria-label={`放大查看：${photo.title}`}>
                  <span className={styles.photoWell}>
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      draggable="false"
                    />
                    <span className={styles.focusRing} aria-hidden="true" />
                  </span>
                  <span className={styles.frameCaption}>
                    <span><b>{photo.title}</b><small>{photo.place}</small></span>
                    <span className={styles.exposure}><small>{photo.camera}</small><b>{photo.id}A</b></span>
                  </span>
                </button>
              </article>
            ))}
            <div className={styles.tail} aria-hidden="true"><span>END OF ROLL</span></div>
          </div>
        </div>

        <div className={styles.archiveFooter}>
          <div className={styles.counter}><span>0{activeIndex + 1}</span><i /><small>0{photographs.length}</small></div>
          <div className={styles.dots} aria-label="选择照片">
            {photographs.map((photo, index) => (
              <button
                key={photo.id}
                className={activeIndex === index ? styles.activeDot : ""}
                onClick={() => jumpTo(index)}
                aria-label={`跳转到 ${photo.title}`}
              />
            ))}
          </div>
          <p>Every frame is a decision.</p>
        </div>
      </section>

      {selected && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={selected.title}>
          <button className={styles.lightboxBackdrop} onClick={() => setSelected(null)} aria-label="点击背景关闭大图" />
          <div className={styles.lightboxImage}>
            <img src={selected.src} alt={selected.alt} />
            <div>
              <span className={styles.mono}>{selected.id} / {selected.year}</span>
              <h2>{selected.title}</h2>
              <p>{selected.place} · {selected.camera}</p>
            </div>
          </div>
          <button className={styles.lightboxClose} onClick={() => setSelected(null)} aria-label="关闭大图">CLOSE <span>×</span></button>
        </div>
      )}
    </main>
  );
}
