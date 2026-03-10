//
// src/assets/manifest.ts
//

import type { AssetsManifest } from "pixi.js";

import bgStartImg from "./images/bg/bgStart.png";
import bgRoadImg from "./images/bg/bgRoad.png";
import bgFinishImg from "./images/bg/bgFinish.png";

import chickenStaticImg from "./images/chicken/chickenStatic.png";
import chickenScoreImg from "./images/chicken/chickenScore.png";

import coinBronzeImg from "./images/road/coinBronze.png";
import coinGoldImg from "./images/road/coinGold.png";
import fencingImg from "./images/road/fencing.png";

import springBoardImg from "./images/decoration/springBoard.png";

export const manifest: AssetsManifest = {
  bundles: [
    {
      name: "bg",
      assets: [
        { alias: "bgStart", src: bgStartImg },
        { alias: "bgRoad", src: bgRoadImg },
        { alias: "bgFinish", src: bgFinishImg },
      ],
    },
    {
      name: "chicken",
      assets: [
        { alias: "chickenStatic", src: chickenStaticImg },
        { alias: "chickenScore", src: chickenScoreImg },
      ],
    },
    {
      name: "road",
      assets: [
        { alias: "coinBronze", src: coinBronzeImg },
        { alias: "coinGold", src: coinGoldImg },
        { alias: "fencing", src: fencingImg },
      ],
    },
    {
      name: "decoration",
      assets: [{ alias: "springBoard", src: springBoardImg }],
    },
  ],
};
