//
// src/global.d.ts
//

import { Application } from "pixi.js";

declare global {
  var __PIXI_APP__: Application | undefined;
}

export {};
