import React from "react";
import JSBI from "jsbi";
import { isValidNumber, convert2all } from "../utils/utils";
import { saveCaret, restoreCaret } from "../utils/caretPositioning";
import "../stylesheets/Converter.css";

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // radixValues[i] stores the representation of value in radix i
      radixValues: convert2all("1024", 10),
      // how many radixes are shown
      numRows: 4,
      // the last radix in the rows of numbers
      lastRadix: 16
    };
  }

  handleChange = (event, radix) => {
    let input = event.target.textContent;
    const target = event.target;

    if (!isValidNumber(input, radix)) {
      event.target.textContent = this.state.radixValues[radix];
      restoreCaret(target);
    } else {
      saveCaret(target);
      this.setState(
        {
          radixValues: convert2all(input, radix)
        },
        () => {
          restoreCaret(target);
        }
      );
    }
  };

  renderNumber = radix => {
    // we should maybe set an upper bound for the font size to avoid overflow
    const numFontSize = 3 + 10 / this.state.numRows + radix / 3;
    const radixFontSize = numFontSize / 2;
    const value = this.state.radixValues[radix];

    return (
      <div className="RadixNumber" style={{ fontSize: numFontSize + "vh" }}>
        <div>=</div>
        <span
          contentEditable={true}
          suppressContentEditableWarning="true"
          onInput={event => this.handleChange(event, radix)}
          onClick={event => saveCaret(event.target)}
        >
          {value}
        </span>
        <sub style={{ fontSize: radixFontSize + "vh" }}>{radix}</sub>
      </div>
    );
  };

  render() {
    return (
      <div className="Converter">
        {this.renderNumber(2)}
        {this.renderNumber(8)}
        {this.renderNumber(10)}
        {this.renderNumber(16)}
      </div>
    );
  }
}

export default Converter;
