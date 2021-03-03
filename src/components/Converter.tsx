import React, { useCallback } from "react";
import BigNumber from "bignumber.js";
import "../stylesheets/Converter.css";
import { getDimension } from "../util/resize";

const fontStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "5vmin" };

export default function Converter(props: {
  currentValue: string
  currentRadix: number,
  decimalPlaces: number,
  mask: boolean[],
  changeValue: (v: string, radix: number) => void
}) {
  const padding = 10;
  const extraPadding = getDimension('=', fontStyle)[0];

  let firstRadix: number | null = null;
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

        return <div key={radix}><NumberContainer value={showValue} radix={radix}
          firstRadix={radix === firstRadix} changeValue={props.changeValue}
          marginRight={radix === firstRadix ? `${extraPadding + padding}px` : `${padding}px`} />
          <div className={"input-validity"}
            style={{
              display: valid ? "none" : "block",
              marginLeft: `${extraPadding + padding}px`
            }}>(Invalid input)</div>
        </div>
      })
    }
  </div>;
}

function NumberContainer(
  props: {
    value: string, radix: number, firstRadix: boolean, marginRight: string
    changeValue: (v: string, radix: number) => void
  }) {
  const unfocusedColor = "rgba(10, 10, 10, 0.82)";
  const marginRight = props.marginRight;

  const setDimension = useCallback((node: HTMLTextAreaElement | null) => {
    if (!node) return;
    const [width, height] = getDimension(node.innerHTML, fontStyle);
    node.style.width = (width + 4) + 'px';
    // We only set the height when the component is mounted for the first time
    if (height)
      node.style.height = (height + 10) + 'px';
  }, [props.value])

  return <div className="number-container">
    {props.firstRadix ? (<span style={{ marginRight }}></span>) : (<span style={{ marginRight }}>=</span>)}
    <textarea
      className="number"
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
      ref={setDimension}
    />
    <span className="radix">{props.radix}</span>
  </div>;
}