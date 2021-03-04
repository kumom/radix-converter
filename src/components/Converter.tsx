import React, { useCallback, useState } from "react";
import BigNumber from "bignumber.js";
import "../stylesheets/Converter.css";
import { resize } from "../util/resize";

export default function Converter(props: {
  currentValue: string
  currentRadix: number,
  decimalPlaces: number,
  mask: boolean[],
  changeValue: (v: string, radix: number) => void
}) {
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

        const value: string = new BigNumber(props.currentValue, props.currentRadix).toString(radix);
        const showValue: string = radix === props.currentRadix ? props.currentValue : value;
        const valid: boolean = radix !== props.currentRadix || value !== 'NaN';

        return <div key={radix} className="converter-item">
          <div className="equals-number">
            <span className="equal-sign" style={{ visibility: firstRadix === radix ? "hidden" : "visible" }}>=</span>
            <NumberContainer value={showValue} radix={radix}
              firstRadix={radix === firstRadix} changeValue={props.changeValue} />
          </div>
          <div className="input-validity" style={{ display: valid ? "none" : "block" }}>
            <span className="equal-sign" style={{ visibility: "hidden" }}>=</span>
            (Invalid input)
          </div>
        </div>
      })
    }
  </div>;
}

function NumberContainer(
  props: {
    value: string, radix: number, firstRadix: boolean
    changeValue: (v: string, radix: number) => void
  }) {
  const unfocusedColor = "rgba(10, 10, 10, 0.82)";

  const setDimension = useCallback((node: HTMLTextAreaElement | null) => {
    if (!node) return;
    resize(node, 15);
    window.addEventListener('resize', () => resize(node));
  }, [props.value])

  return <div className="number-container">
    <textarea
      className="number"
      ref={setDimension}
      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.changeValue(event.target.value, props.radix);
      }}
      onFocus={event => {
        event.target.style.color = `hsla(${props.radix * 10}, 70%, 40%, 0.6)`;
      }}
      onBlur={event => {
        event.target.style.color = unfocusedColor;
      }}
      style={{ color: unfocusedColor }}
      spellCheck={false}
      value={props.value}
    />
    <span className="radix">{props.radix}</span>
  </div>;
}