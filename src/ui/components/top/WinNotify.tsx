//
// src/ui/components/top/WinNotify.tsx
//

import { createEffect, createSignal, Show } from "solid-js";

import "./WinNotify.css";

import { store } from "../../../store";

export const WinNotify = () => {
  const [isVisible, setIsVisible] = createSignal(false);

  const formatScore = (val: number) => {
    return Number.isInteger(val) ? val : val.toFixed(2);
  };

  createEffect(() => {
    const score = store.state.winScore;

    if (score > 0) setIsVisible(true);
    else setIsVisible(false);
  });

  return (
    <Show when={isVisible()}>
      <div class="win-notify-wrapper">
        <div class="top-shadow-gradient" />
        <div class="win-notify-overlay">
          <div class="win-notify-card">
            <div class="win-notify-badge">WIN!</div>
            <div class="win-notify-row">
              <span class="win-notify-score">
                {formatScore(store.state.winScore)}
              </span>
              <span class="coin-icon">$</span>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};
