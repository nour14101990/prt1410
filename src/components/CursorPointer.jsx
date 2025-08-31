// src/components/CursorDot.jsx
import React, { useRef, useEffect } from "react";

/**
 * CursorDot
 *
 * Keeps the default/native cursor and shows a small circle below it.
 *
 * Props:
 *  - children: content under the custom dot
 *  - dotSize: px (default 8)
 *  - offsetY: px distance from cursor tip to dot (default 16)
 *  - color: css color for the dot (default "rgba(15,23,42,0.95)")
 *  - followSpeed: 0..1 interpolation speed (default 0.18)
 *  - hideOnTouch: boolean (default true) - disables on touch devices
 */
export default function CursorDot({
  children,
  dotSize = 8,
  offsetY = 16,
  color = "rgba(15,23,42,0.95)",
  followSpeed = 0.18,
  hideOnTouch = true,
  className = "",
}) {
  const wrapperRef = useRef(null);
  const dotRef = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: -9999, y: -9999 });
  const posRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    if (hideOnTouch && typeof window !== "undefined" && "ontouchstart" in window) {
      // don't show on touch devices
      return;
    }

    const wrapper = wrapperRef.current;
    const dotEl = dotRef.current;
    if (!dotEl) return;

    // ensure wrapper can position the dot absolutely
    if (wrapper) {
      const computed = window.getComputedStyle(wrapper);
      if (computed.position === "static") {
        wrapper.style.position = "relative";
      }
    }

    // initial style for dot
    Object.assign(dotEl.style, {
      position: "absolute",
      left: "0px",
      top: "0px",
      width: `${dotSize}px`,
      height: `${dotSize}px`,
      borderRadius: "50%",
      transform: `translate3d(-9999px,-9999px,0) translate(-50%,-50%) scale(0.95)`,
      background: color,
      pointerEvents: "none",
      zIndex: 9999,
      transition: "opacity 140ms ease, transform 120ms ease",
      opacity: "0.9",
      willChange: "transform",
    });

    // handlers
    function onMove(e) {
      const rect = wrapper ? wrapper.getBoundingClientRect() : { left: 0, top: 0 };
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      targetRef.current.x = x;
      targetRef.current.y = y + offsetY;
    }

    function onLeave() {
      targetRef.current.x = -9999;
      targetRef.current.y = -9999;
    }

    const target = wrapper || window;
    target.addEventListener("mousemove", onMove, { passive: true });
    target.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("scroll", onLeave, { passive: true });

    // RAF loop for smooth follow
    const lerp = (a, b, n) => a + (b - a) * n;
    let px = -9999, py = -9999;
    function frame() {
      px = lerp(px, targetRef.current.x, followSpeed);
      py = lerp(py, targetRef.current.y, followSpeed);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%,-50%) scale(${px === -9999 ? 0.9 : 1})`;
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);

    // cleanup
    return () => {
      target.removeEventListener("mousemove", onMove);
      target.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onLeave);
      cancelAnimationFrame(rafRef.current);
      // restore wrapper position style only if we set it? (we don't attempt to restore here to keep code simple)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dotSize, offsetY, color, followSpeed, hideOnTouch]);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {children}

      <div
        ref={dotRef}
        aria-hidden
       
      />
    </div>
  );
}
