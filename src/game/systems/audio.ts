//
// src/game/systems/audio.ts
//

import { sound } from "@pixi/sound";

import { store } from "../../shared/store";

export const initAudio = () => {
  const toggleMute = (isMuted: boolean) => {
    if (isMuted) {
      sound.muteAll();
    } else {
      if (!store.state.isMuted) {
        sound.unmuteAll();
      }
    }
  };

  // 1. Обработка сворачивания вкладки
  document.addEventListener("visibilitychange", () => {
    toggleMute(document.hidden);
  });

  // 2. Обработка клика вне окна (unfocus)
  window.addEventListener("blur", () => toggleMute(true));
  window.addEventListener("focus", () => toggleMute(false));

  const mainMusic = sound.find("mainMusic");

  window.addEventListener("pointerdown", () => {
    if (!mainMusic.isPlaying)
      sound.play("mainMusic", {
        loop: true,
        volume: 0.25,
      });
  });
};

export const playCarBrakingAudio = () => {
  if (!store.state.isMuted) {
    sound.volume("carBrakingSound", 0.4);
    sound.play("carBrakingSound");
  }
};

export const playJumpAudio = () => {
  if (!store.state.isMuted) {
    sound.volume("jumpSound", 0.5);
    sound.play("jumpSound");
  }
};

export const playRunOverAudio = () => {
  if (!store.state.isMuted) {
    sound.volume("runOverSound", 0.8);
    sound.play("runOverSound");
  }
};

export const playCarDriveAudio = () => {
  if (!store.state.isMuted) {
    sound.volume("carDriveSound", 0.6);
    sound.play("carDriveSound");
  }
};

export const playWinAudio = () => {
  if (!store.state.isMuted) {
    sound.play("winSound");
  }
};

export const playCashoutAudio = () => {
  if (!store.state.isMuted) {
    sound.play("cashoutSound");
  }
};
