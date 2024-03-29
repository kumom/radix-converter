import React, { useEffect } from "react";
import BigNumber from "bignumber.js";
// import "../stylesheets/Converter.css";
import { activeColor } from "../util";

const unfocusedColor = "rgba(10, 10, 10, 0.82)";

export default function Converter(props: {
  currentValue: string
  currentRadix: number,
  decimalPlaces: number,
  mask: boolean[],
  updateValue: (v: string, radix: number) => void
}) {

  BigNumber.set({ DECIMAL_PLACES: props.decimalPlaces })
  const showRadixes = Array(37).fill(null).map((v: any, i: number) => i).filter(radix => radix >= 2 && props.mask[radix]);

  useEffect(() => {
    if (showRadixes.length && !props.mask[props.currentRadix]) {
      const newRadix = showRadixes[0];
      const newVal = new BigNumber(props.currentValue, props.currentRadix);
      props.updateValue(newVal.toString(newRadix), newRadix);
    }
  })

  return <div className="Converter">
    {
      showRadixes.map((radix: number) => {

        const value: BigNumber = new BigNumber(props.currentValue, props.currentRadix);
        const valueStr: string = radix === props.currentRadix ? props.currentValue : value.toString(radix);

        return <div key={radix} className="number-line">
          <span className="equal-sign"
            style={{
              visibility: props.currentRadix === radix ? "hidden" : "visible",
              color: unfocusedColor
            }}>
            =
          </span>
          <NumberContainerMemo value={valueStr} radix={radix}
            currentRadix={props.currentRadix}
            updateValue={props.updateValue} />
          <div className="stepButtons" style={{ display: props.currentRadix === radix ? "block" : "none" }}>
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
      onPaste={event => {
        const input = event.clipboardData.getData("text/plain");

        event.clipboardData.setData('text/plain', input);
        event.clipboardData.setData('text/html', input);
        // @ts-ignore
        event.target.innerHTML = input;
        event.preventDefault();

        if (input.split('').every(ch => Number(ch) && Number(ch) < props.radix)) {
          props.updateValue(input, props.radix);
        } else {
          props.updateValue("NaN", props.radix);
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