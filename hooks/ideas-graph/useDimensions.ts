import { useEffect, useState } from "react";
import type { GraphDimensions } from "../../types/ideas-graph";

export function useDimensions(
  containerRef: React.RefObject<HTMLDivElement | null>,
): GraphDimensions {
  const [dimensions, setDimensions] = useState<GraphDimensions>({
    width: 1200,
    height: 800,
  });

  useEffect(() => {
    const updateFromRect = (rect: DOMRectReadOnly | DOMRect) => {
      const newWidth = Math.max(0, Math.round(rect.width));
      const newHeight = Math.max(
        0,
        Math.round(rect.height || window.innerHeight),
      );
      setDimensions({ width: newWidth, height: newHeight });
    };

    // Initial measurement
    if (containerRef.current) {
      updateFromRect(containerRef.current.getBoundingClientRect());
    } else {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }

    // Observe container size changes
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) updateFromRect(entry.contentRect);
      });
      ro.observe(containerRef.current);
    }

    // Fallback on window resize
    const onResize = () => {
      if (containerRef.current)
        updateFromRect(containerRef.current.getBoundingClientRect());
      else
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, [containerRef]);

  return dimensions;
}
