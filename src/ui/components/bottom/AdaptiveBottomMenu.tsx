//
// src/ui/components/bottom/AdaptiveBottomMenu.tsx
//

import { createSignal, onCleanup, ParentComponent, onMount } from "solid-js";

import "./AdaptiveBottomMenu.css";

export const AdaptiveBottomMenu: ParentComponent = (props) => {
  const DESIGN_BLOCK_WIDTH = 780;

  const calculateMetrics = () => {
    let scale = 1;
    const full_width = DESIGN_BLOCK_WIDTH;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const isLandscape = windowWidth > windowHeight;

    if (windowWidth < full_width) {
      scale = Math.min(windowWidth / full_width);
    }

    if (isLandscape && windowHeight < full_width) {
      scale = scale * 0.8;
    }

    return { scale, windowWidth, isLandscape };
  };

  const [metrics, setMetrics] = createSignal(calculateMetrics());

  const handleResize = () => {
    setMetrics(calculateMetrics());
  };

  onMount(() => {
    window.addEventListener("resize", handleResize);
  });

  onCleanup(() => {
    window.removeEventListener("resize", handleResize);
  });

  return (
    <div
      class="bottom-menu-wrapper"
      style={{
        padding: `${metrics().isLandscape ? "10px" : "0"}`,
      }}
    >
      <div
        class="bottom-menu-resizer"
        style={{
          width:
            metrics().windowWidth < DESIGN_BLOCK_WIDTH
              ? `${DESIGN_BLOCK_WIDTH}px`
              : "100%",
          transform: `scale(${metrics().scale})`,
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
