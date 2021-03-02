import React, { useCallback } from "react";
import BigNumber from "bignumber.js";
import "../stylesheets/Converter.css";

export default function Converter(props: {
  currentValue: string
  currentRadix: number,
  decimalPlaces: number,
  mask: boolean[],
  changeValue: (v: string, radix: number) => void
}) {
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

        return <><NumberContainer key={radix} value={showValue} radix={radix}
          firstRadix={radix === firstRadix} changeValue={props.changeValue} />
          <div className={"input-validity"} style={{ display: valid ? "none" : "block" }}>Invalid input</div>
        </>
      })
    }
  </div>;
}

function NumberContainer(
  props: { value: string, radix: number, firstRadix: boolean, changeValue: (v: string, radix: number) => void }) {
  const unfocusedColor = "rgba(10, 10, 10, 0.82)";

  const getDimension = (content: string) => {
    // style has to match the <textarea/> element in order to precisely measure the dimension
    const sizeHelper = document.createElement('div');
    document.body.append(sizeHelper);
    sizeHelper.innerHTML = content;
    sizeHelper.style.display = "block";
    sizeHelper.style.visibility = "hidden";
    sizeHelper.style.maxHeight = "100vh";
    sizeHelper.style.maxWidth = "100vw";
    sizeHelper.style.fontFamily = "Montserrat, sans-serif";
    sizeHelper.style.fontSize = "5vmin";
    sizeHelper.style.position = "fixed";
    sizeHelper.style.overflow = "auto";
    const width = sizeHelper.offsetWidth;
    const height = sizeHelper.offsetHeight;
    document.body.removeChild(sizeHelper);
    return [width, height];
  }

  const setDimension = useCallback((node: HTMLTextAreaElement | null) => {
    if (!node) return;
    const dimension = getDimension(node.innerHTML);
    node.style.width = (dimension[0] + 4) + 'px';
    node.style.height = (dimension[1] + 10) + 'px';
  }, [props.value])

  const padding = 10;
  const extraPaddingForFirst = getDimension('=')[0];

  return <div className="number-container">
    {props.firstRadix ? (
      <span style={{ marginRight: `${extraPaddingForFirst + padding}px` }}></span>
    ) : (
        <span style={{ marginRight: `${padding}px` }}>=</span>
      )}
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