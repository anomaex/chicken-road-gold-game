//
// src/types.d.ts
//

interface MRAID {
  getState(): 'loading' | 'default' | 'expanded' | 'hidden' | 'resized';
  open(url: string): void;
  addEventListener(event: string, callback: () => void): void;
  removeEventListener(event: string, callback: () => void): void;
  close(): void;
  isViewable(): boolean;
}

declare const mraid: MRAID | undefined;
