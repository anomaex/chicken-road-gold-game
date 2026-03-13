//
// src/ui/components/top/Logo.tsx
//

import "./Logo.css";
import logoImg from "../../assets/images/logo.png";

export const Logo = () => {
  return (
    <div class="logo-wrapper">
      <img
        src={logoImg}
        alt="https://github.com/anomaex/chicken-road-gold-game"
        class="logo-image"
        onClick={() =>
          window.open(
            "https://anomaex.github.io/chicken-road-gold-game/",
            "_blank",
          )
        }
      />
    </div>
  );
};
