//
// src/ui/App.tsx
//

import { Component } from "solid-js";

import "./App.css";

import { Logo } from "./components/top/Logo";
import { WinNotify } from "./components/top/WinNotify";
import { BottomMenu } from "./components/bottom/BottomMenu";

export const App: Component = () => {
  return (
    <div class="ui-wrapper">
      <Logo />
      <WinNotify />
      <BottomMenu />
    </div>
  );
};
