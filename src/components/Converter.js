import React from "react";
import { isValidNumber, convert2all } from "../utils/utils";
import { saveCaret, restoreCaret } from "../utils/caretPositioning";
import "../stylesheets/Converter.css";

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // radixValues[i] stores the representation of value in radix i
      radixValues: convert2all("1024", 10, 10),
      // how many digits would be calculated for the fractional part
      precision: 10,
      // how many radixes are shown
      numRows: 4
    };
  }

  handleChange = (event, radix) => {
    let target = event.target;
    let input = target.textContent;

    if (!isValidNumber(input, radix)) {
      target.textContent = this.state.radixValues[radix];
      restoreCaret(target);
    } else {
      saveCaret(target);
      this.setState(
        {
          radixValues: convert2all(
            input.replace(/\s/g, ""),
            radix,
            this.state.precision
          )
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

    return (
      <div className="RadixNumber" style={{ fontSize: numFontSize + "vh" }}>
        <div>{radix === 2 ? "\n" : "="}</div>
        <div>
          <span
            contentEditable={true}
            suppressContentEditableWarning="true"
            onInput={event => this.handleChange(event, radix)}
            onClick={event => saveCaret(event.target)}
            spellCheck={false}
          >
            {this.state.radixValues[radix]}
          </span>
          <sub style={{ fontSize: radixFontSize + "vh" }}>{radix}</sub>
        </div>
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
