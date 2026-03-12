//
// src/ui/App.tsx
//

import { Component } from "solid-js";

import { WinNotify } from "./components/top/WinNotify";

export const App: Component = () => {
  return (
    <div class="ui-wrapper">
      <WinNotify />
    </div>
  );
};
