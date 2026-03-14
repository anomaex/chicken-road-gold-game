//
// src/systems/mraid.ts
//

export const mraidSystem = {
  get isAvailable() {
    return typeof mraid !== "undefined";
  },

  openStore(url: string) {
    if (this.isAvailable && mraid) {
      mraid.open(url);
    } else {
      //console.warn("MRAID not found, using window.open");
      window.open(url, "_blank");
    }
  },

  finishAd() {
    if (this.isAvailable && mraid) {
      mraid.close();
    }
  },
};
