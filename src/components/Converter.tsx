import React, { useCallback, useState } from "react";
import BigNumber from "bignumber.js";
import "../stylesheets/Converter.css";
import { activeColor, resize } from "../util";

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
        const valid: boolean = radix !== props.currentRadix || valueStr !== 'NaN';

        return <div key={radix} className="number-line"
            onFocus={() => { setEditingRadix(radix) }}
            onBlur={() => { setEditingRadix(0) }}>
            <span className="equal-sign" style={{ visibility: firstRadix === radix ? "hidden" : "visible" }}>=</span>
            <NumberContainer value={showValue} radix={radix}
              firstRadix={radix === firstRadix} updateValue={props.updateValue} />
            <div className="stepButtons" style={{ display: radix === editingRadix ? "block" : "none" }}>
              <button
                style={{ backgroundColor: activeColor(radix), lineHeight: "0.8em" }}
                onMouseDown={event => { event.preventDefault() }}
                onClick={() => {
                  const newValue = value.plus(1);
                  props.updateValue(newValue.toString(props.currentRadix), props.currentRadix);
                }}>+</button>
              <button
                style={{ backgroundColor: activeColor(radix), lineHeight: "0.5em" }}
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

function NumberContainer(
  props: {
    value: string, radix: number, firstRadix: boolean
    updateValue: (v: string, radix: number) => void
  }) {
  const unfocusedColor = "rgba(10, 10, 10, 0.82)";

  const setDimension = useCallback((node: HTMLTextAreaElement | null) => {
    if (!node) return;
    resize(node);
  }, [props.value])

  return <div className="number-container">
    <textarea
      className="number"
      ref={setDimension}
      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.updateValue(event.target.value, props.radix);
      }}
      onFocus={event => {
        event.target.style.color = `hsla(${props.radix * 10}, 70%, 40%, 0.6)`;
      }}
      onBlur={event => {
        event.target.style.color = unfocusedColor;
        if (props.value === "")
          props.updateValue("0", props.radix);
      }}
      style={{ color: unfocusedColor }}
      spellCheck={false}
      value={props.value}
    />
    <span className="radix">{props.radix}</span>
  </div>;
}