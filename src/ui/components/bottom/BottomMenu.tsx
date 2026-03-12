//
// src/ui/components/bottom/BottomMenu.tsx
//

import "./BottomMenu.css";

export const BottomMenu = () => {
  return (
    <div class="bottom-menu-wrapper">
      <div class="bottom-shadow-gradient" />
      <div class="bottom-menu-overlay">
        <div class="bottom-menu-bar">
          <div class="section left">
            <div class="info">
              <span class="label">BALANCE</span>
              <div class="value-row">
                <span class="coin-icon">$</span>
                <span class="value">1 000 000</span>
              </div>
            </div>
          </div>

          <div class="section right">
            <div class="info with-arrows">
              <span class="label">BET</span>
              <div class="value-row">
                <span class="coin-icon">$</span>
                <span class="value">3</span>
                <div class="arrows">
                  <button class="arrow-up">▲</button>
                  <button class="arrow-down">▼</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
