import React from "react";
import { isValidNumber } from "../utils/utils";
import "../stylesheets/Calculator.css";

function RadixNumber(props) {
  const radixFontSize = props.numFontSize / 2;
  return (
    <div style={{ fontSize: props.numFontSize + "vh" }}>
      <span
        className="number"
        contentEditable="true"
        suppressContentEditableWarning={true}
        onInput={props.onInput}
      >
        {props.value}
      </span>
      <sub style={{ fontSize: radixFontSize + "vh", lineHeight: "100%" }}>
        {props.radix}
      </sub>

      <div>{props.isLastNumber ? "" : "="}</div>
    </div>
  );
}

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // values[i] stores the representation of value in radix i
      values: Array(37).fill(""),
      // initial placeholder value
      value: 1024,
      numRadix: 4,
      lastRadix: 16
    };
    this.state.values.map((currentVal, index) => {
      if (index === 0 || index === 1) {
        return "NaN";
      } else {
        return parseInt(this.state.value, index);
      }
    });
  }

  handleInput(event, radix) {
    const oldVal = this.state.value;
    const newVal = parseInt(event.target.textContent, radix);
    this.setState({ value: isValidNumber(newVal, radix) ? newVal : oldVal });
    console.log(isValidNumber(newVal, radix));
    console.log(oldVal, newVal);
    console.log(radix);
  }

  renderNumber(radix) {
    // we should maybe set an upper bound for the font size to avoid overflow
    const numFontSize = 3 + 10 / this.state.numRadix + radix / 3;
    const value = this.state.value.toString(radix);
    return (
      <RadixNumber
        numFontSize={numFontSize}
        value={value}
        radix={radix}
        isLastNumber={radix === this.state.lastRadix}
        onInput={event => this.handleInput(event, radix)}
      />
    );
  }

  render() {
    return (
      <div className="Calculator">
        {this.renderNumber(2)}
        {this.renderNumber(8)}
        {this.renderNumber(10)}
        {this.renderNumber(16)}
      </div>
    );
  }
}

export default Converter;
