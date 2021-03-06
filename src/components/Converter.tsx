import React, { useState } from "react";
import BigNumber from "bignumber.js";
import "../stylesheets/Converter.css";
import { activeColor } from "../util";

export default function Converter(props: {
  currentValue: string
  currentRadix: number,
  decimalPlaces: number,
  mask: boolean[],
  updateValue: (v: string, radix: number) => void
}) {
  const [editingRadix, setEditingRadix] = useState(0);

  let firstRadix: number = 2;
  for (let i = 2; i <= 36; i++) {
    if (props.mask[i]) {
      firstRadix = i;
      break;
    }
  }

  BigNumber.set({ DECIMAL_PLACES: props.decimalPlaces })

  return <div className="Converter">
    {
      Array(37).fill(null).map((v: any, radix: number) => {
        if (radix < 2 || !props.mask[radix]) return null;

        const value: BigNumber = new BigNumber(props.currentValue, props.currentRadix);
        const valueStr: string = value.toString(radix);
        const showValue: string = radix === props.currentRadix ? props.currentValue : valueStr;

        return <div key={radix} className="number-line"
          onFocus={() => { setEditingRadix(radix) }}
          onBlur={() => { setEditingRadix(0) }}>
          <span className="equal-sign" style={{ visibility: firstRadix === radix ? "hidden" : "visible" }}>=</span>
          <NumberContainerMemo value={showValue} radix={radix} editing={editingRadix === radix}
            updateValue={props.updateValue} />
          <div className="stepButtons" style={{ display: radix === editingRadix ? "block" : "none" }}>
            <button
              style={{ backgroundColor: activeColor(radix) }}
              onMouseDown={event => { event.preventDefault() }}
              onClick={() => {
                const newValue = value.plus(1);
                props.updateValue(newValue.toString(props.currentRadix), props.currentRadix);
              }}>+</button>
            <button
              style={{ backgroundColor: activeColor(radix) }}
              onMouseDown={event => { event.preventDefault() }}
              onClick={() => {
                const newValue = value.minus(1);
                props.updateValue(newValue.toString(props.currentRadix), props.currentRadix);
              }}>-</button>
          </div>
        </div>
      })
    }
  </div>;
}

function NumberContainer(props: {
  value: string, radix: number, editing: boolean,
  updateValue: (v: string, radix: number) => void
}) {

  const unfocusedColor = "rgba(10, 10, 10, 0.82)";

  return <div className="number-container">
    <div
      className="number"
      contentEditable={true}
      suppressContentEditableWarning={true}
      onInput={(event: React.ChangeEvent<HTMLDivElement>) => {
        props.updateValue(event.target.innerText, props.radix);
      }}
      onFocus={event => {
        event.target.style.color = `hsla(${props.radix * 10}, 70%, 40%, 0.6)`;
      }}
      onBlur={event => {
        event.target.style.color = unfocusedColor;
        if (props.value === "")
          props.updateValue("0", props.radix);
      }}
      style={{ color: unfocusedColor }}>
      {props.value}
    </div>
    <span className="radix">{props.radix}</span>
  </div>;
}

const NumberContainerMemo = React.memo(NumberContainer, (props, nextProps) => nextProps.editing);