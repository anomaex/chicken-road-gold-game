//
// src/index.tsx
//

import { render } from "solid-js/web";
import { App as SolidApp } from "./ui/App";

import { initGame } from "./game/main";

import "./styles/index.css";

async function bootstrap() {
  // Initialize Solid JS
  const uiRoot = document.getElementById("ui-root");
  if (uiRoot) {
    render(() => <SolidApp />, uiRoot);
  }

  // Initialize game engine
  await initGame();
}

bootstrap().catch(console.error);
