//
// src/index.tsx
//

import { render } from "solid-js/web";
import { App as SolidApp } from "./ui/App";

import { Game } from "./game/Game";

import "./styles/index.css";

async function bootstrap() {
  // Initialize SolidJS
  render(() => <SolidApp />, document.getElementById("ui-root")!);

  // Initialize Game
  const game = new Game();
  await game.init(document.getElementById("game-root")!);
}

bootstrap().catch(console.error);
