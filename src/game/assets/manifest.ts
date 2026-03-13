//
// src/game/assets/manifest.ts
//

import type { AssetsManifest } from "pixi.js";

import bgStartImg from "./images/bg/bgStart.png";
import bgRoadImg from "./images/bg/bgRoad.png";
import bgFinishImg from "./images/bg/bgFinish.png";

import springBoardImg from "./images/bg/decorations/springBoard.png";
import statuePhoneImg from "./images/bg/decorations/statuePhone.png";
import winnerWindowImg from "./images/winnerWindow.png";

import chickenStaticImg from "./images/chicken/chickenStatic.png";
import chickenScoreImg from "./images/chicken/chickenScore.png";
import chickenRunOverImg from "./images/chicken/chickenRunOver.png";

import coinBronzeImg from "./images/road/coinBronze.png";
import coinGoldImg from "./images/road/coinGold.png";
import fencingImg from "./images/road/fencing.png";

import car0Img from "./images/road/cars/car_0.png";
import car1Img from "./images/road/cars/car_1.png";
import car2Img from "./images/road/cars/car_2.png";
import car3Img from "./images/road/cars/car_3.png";

import mainMusicAudio from "./audio/mainMusic.mp3";
import jumpAudio from "./audio/jump.mp3";
import runOverAudio from "./audio/runOver.mp3";
import carBrakingAudio from "./audio/carBraking.mp3";
import carDriveAudio from "./audio/carDrive.mp3";
import winAudio from "./audio/win.mp3";
import cashoutAudio from "./audio/cashout.mp3";

export const manifest: AssetsManifest = {
  bundles: [
    // Images
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
        { alias: "chickenRunOver", src: chickenRunOverImg },
      ],
    },
    {
      name: "road",
      assets: [
        { alias: "coinBronze", src: coinBronzeImg },
        { alias: "coinGold", src: coinGoldImg },
        { alias: "fencing", src: fencingImg },
        { alias: "car_0", src: car0Img },
        { alias: "car_1", src: car1Img },
        { alias: "car_2", src: car2Img },
        { alias: "car_3", src: car3Img },
      ],
    },
    {
      name: "decorations",
      assets: [
        { alias: "springBoard", src: springBoardImg },
        { alias: "statuePhone", src: statuePhoneImg },
        { alias: "winnerWindow", src: winnerWindowImg },
      ],
    },
    // Audio
    {
      name: "audio",
      assets: [
        { alias: "mainMusic", src: mainMusicAudio },
        { alias: "jumpSound", src: jumpAudio },
        { alias: "runOverSound", src: runOverAudio },
        { alias: "carBrakingSound", src: carBrakingAudio },
        { alias: "carDriveSound", src: carDriveAudio },
        { alias: "winSound", src: winAudio },
        { alias: "cashoutSound", src: cashoutAudio },
      ],
    },
  ],
};
