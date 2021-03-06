import React from "react";
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

  BigNumber.set({ DECIMAL_PLACES: props.decimalPlaces })

  return <div className="Converter">
    {
      Array(37).fill(null).map((v: any, radix: number) => {
        if (radix < 2 || !props.mask[radix]) return null;

        const value: BigNumber = new BigNumber(props.currentValue, props.currentRadix);
        const valueStr: string = radix === props.currentRadix ? props.currentValue : value.toString(radix);

        return <div key={radix} className="number-line">
          <span className="equal-sign" style={{ visibility: props.currentRadix === radix ? "hidden" : "visible" }}>=</span>
          <NumberContainerMemo value={valueStr} radix={radix}
            currentRadix={props.currentRadix}
            updateValue={props.updateValue} />
          <div className="stepButtons" style={{ display: radix === props.currentRadix ? "block" : "none" }}>
            <button
              style={{ backgroundColor: activeColor(radix) }}
              onMouseDown={event => { event.preventDefault() }}
              onClick={event => {
                event.currentTarget.focus();
                const newValue = value.plus(1);
                props.updateValue(newValue.toString(props.currentRadix), props.currentRadix);
              }}>+</button>
            <button
              style={{ backgroundColor: activeColor(radix) }}
              onMouseDown={event => { event.preventDefault() }}
              onClick={event => {
                event.currentTarget.focus();
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
  value: string, radix: number,
  currentRadix: number,
  updateValue: (v: string, radix: number) => void
}) {

  const unfocusedColor = "rgba(10, 10, 10, 0.82)";

  return <div className="number-container">
    <div
      className="number"
      spellCheck={false}
      tabIndex={1}
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
        if (event.currentTarget.innerText === "") {
          props.updateValue("0", props.radix);
          event.currentTarget.innerText = "0";
        }
      }}
      style={{ color: unfocusedColor }}>
      {props.value}
    </div>
    <span className="radix">{props.radix}</span>
  </div>;
}

const NumberContainerMemo = React.memo(NumberContainer, (props, nextProps) => {
  const editing = props.radix === nextProps.currentRadix;
  const focused = !document.activeElement ||
    document.activeElement.classList.contains("number");
  return editing && focused;
});