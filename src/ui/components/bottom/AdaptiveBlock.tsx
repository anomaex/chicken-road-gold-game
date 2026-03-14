import { Component, createSignal, onCleanup, ParentComponent, onMount, children } from "solid-js";

import "./AdaptiveBlock.css";

export const AdaptiveBlock: ParentComponent = (props) => {
  const DESIGN_BLOCK_WIDTH = 780; // origin width only a block who neeed resize
  const height = 50;

  const getScale = () => {
    let scale = 1;
    const full_width = DESIGN_BLOCK_WIDTH + 20; // DESIGN_BLOCK_WIDTH + parent PADDING
    if (window.innerWidth < full_width)
      scale = Math.min(window.innerWidth / full_width, window.innerHeight / height);  
    
    return scale;
  };

  const [scale, setScale] = createSignal(getScale());

  const handleResize = () => {
    setScale(getScale());
  };

  onMount(() => {
    window.addEventListener('resize', handleResize);
  });

  onCleanup(() => {
    window.removeEventListener('resize', handleResize);
  });

  return (
    <div class="bottom-menu-wrapper">

      <div class="bottom-menu-resizer"
        style={{
          width: `${window.innerWidth < DESIGN_BLOCK_WIDTH ? DESIGN_BLOCK_WIDTH + "px" : "100%"}`,
          height: `${height}`,
          transform: `scale(${scale()})`,
          "transform-origin": "bottom left",
        }}
      >
        {props.children}
      </div>

    </div>
  );
}