//
// src/ui/components/bottom/BottomMenu.tsx
//
import { createSignal, Show, For } from "solid-js";

import "./BottomMenu.css";

import { store } from "../../../store";

export const BottomMenu = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  const options = ["EASY", "NORMAL", "HARD", "HARDCORE"];
  
  const getDifficyltyName = (index: number): string => {
    return options[index] ?? "EASY";
  };

  const getDifficultyIndex = (name: string): number => {
    const index = options.indexOf(name);
    return index !== -1 ? index : 0;
  };

  const increment = () => {
    if (store.state.isGameStarted) return;

    let newNum = store.state.bet;
    if (newNum < 10) newNum += 1;
    else if (newNum < 50) newNum += 5;
    else if (newNum < 100) newNum += 25;
    else if (newNum < 300) newNum += 50;
    if (newNum < 1)
      newNum = 1;
    if (newNum >= 300)
      newNum = 300;
    store.state.bet = newNum;
  };

  const decrement = () => {
    if (store.state.isGameStarted) return;

    let newNum = store.state.bet;
    if (newNum <= 1) newNum = 1;
    else if (newNum <= 10) newNum -= 1;
    else if (newNum <= 50) newNum -= 5;
    if (newNum <= 100) newNum -= 25;
    if (newNum <= 300) newNum -= 50;
    if (newNum > 300) newNum = 300;
    store.state.bet = 1;
  };

  const handleInput = (e: InputEvent) => {
    if (store.state.isGameStarted) return;

    const target = e.target as HTMLInputElement;
    const cleanValue = target.value.replace(/\D/g, "");
    let num = Number(cleanValue) || 0;
    if (num >= 300)
      num = 300;
    else if (num < 1)
      num = 1;
    store.state.bet = num;
    target.value = String(num);
  };

  const changeDifficulty = (increase: boolean) => {
    if (store.state.isGameStarted) return;

    const currentIndex = store.state.difficulty;
    let newIndex = increase ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= options.length) newIndex = options.length - 1;
    store.state.difficulty = newIndex;
  };

  const handleSelect = (opt: string, e: MouseEvent) => {
    if (store.state.isGameStarted) return;
    
    e.stopPropagation();
    store.state.difficulty = getDifficultyIndex(opt);
    setIsOpen(false);
  };
  
  return (
    <div class="bottom-menu-wrapper">
      <div class="bottom-shadow-gradient" />
      <div class="bottom-menu-overlay">
        <div class="bottom-menu-bar">

          <div class="balance">
            <div class="label">BALANCE</div>
            <div class="value-row">
              <span class="coin-icon">$</span>
              <span class="value">1 000 000</span>
            </div>
          </div>

          <div class="play-section">
            <div class={`bet ${store.state.isGameStarted ? 'disabled' : ''}`}>
              <div class="col-first">
                <div class="label">BET</div>
                <div class="value-row">
                  <span class="coin-icon">$</span>
                  <input type="number" inputmode="decimal" class="value-input" placeholder="0" value={store.state.bet} onInput={handleInput} />
                </div>
              </div>
              <div class="col-second">
                <button class="arrow-up" onClick={increment}>▲</button>
                <button class="arrow-down" onClick={decrement}>▼</button>
              </div>
            </div>

            <div class="play">
                <div class="icon">Play</div>
            </div>
            
            <div class={`bet difficulty ${store.state.isGameStarted ? 'disabled' : ''}`} onClick={() => setIsOpen(!isOpen())}>
              <div class="col-second">
                <button class="arrow-up" onClick={(e) => {
                    e.stopPropagation();
                    changeDifficulty(true)
                  }
                }>▲</button>
                <button class="arrow-down" onClick={(e) => {
                    e.stopPropagation();
                    changeDifficulty(false);
                  }
                }>▼</button>
              </div>
              <div class="col-first">
                <div class="label">DIFFICULTY</div>
                <div class="value-select">
                  {getDifficyltyName(store.state.difficulty)}
                </div>
              </div>
              <Show when={isOpen()}>
                <div class="option-list">
                  <For each={options}>
                    {(option) => (
                      <div 
                        class={`option-item ${getDifficyltyName(store.state.difficulty) === option ? 'selected' : ''}`}
                        onClick={(e) => {handleSelect(option, e)}}
                      >
                        {option}
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
