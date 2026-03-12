//
// src/game/systems/audio.ts
//

import { sound } from "@pixi/sound";

import { store } from "../../store";

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
};

export const playCarBrakingAudio = () => {
  if (!store.state.isMuted) {
    sound.play("carBrakingSound");
  }
};

export const playJumpAudio = () => {
  if (!store.state.isMuted) {
    sound.play("jumpSound");
  }
};

export const playRunOverAudio = () => {
  if (!store.state.isMuted) {
    sound.play("runOverSound");
  }
};

export const playCarDriveAudio = () => {
  if (!store.state.isMuted) {
    sound.play("carDriveSound");
  }
};
