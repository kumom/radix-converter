import React, { useState } from "react";
import Converter from "./Converter";
import Header from "./Header";
// import "../stylesheets/App.css";


export default function App() {
  const [currentValue, setCurrentValue] = useState("10000000000");
  const [currentRadix, setCurrentRadix] = useState(2);
  const [decimalPlaces, setDecimalPlaces] = useState(10);
  const [mask, setMask] = useState(Array(37).fill(false).map((v, i) => [2, 8, 10, 16].includes(i)));

  function toggleVisibility(radix: number) {
    let newMask = mask.slice(0);
    newMask[radix] = !newMask[radix];
    setMask(newMask);
  }

  function updateValue(value: string, radix: number) {
    setCurrentValue(value);
    setCurrentRadix(radix);
  }

  function updateDecimalPlaces(newValue: number) {
    setDecimalPlaces(newValue);
  };

  return <div className="App">
      <Header
        currentValue={currentValue}
        currentRadix={currentRadix}
        decimalPlaces={decimalPlaces}
        mask={mask}
        toggleVisibility={toggleVisibility}
        updateDecimalPlaces={updateDecimalPlaces}
      />
      <Converter
        currentValue={currentValue}
        currentRadix={currentRadix}
        decimalPlaces={decimalPlaces}
        mask={mask}
        updateValue={updateValue}
      />
    </div>
}
