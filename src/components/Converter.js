import React from "react";
import { isValidNumber, convert2all } from "../utils/algo";
import { saveCaret, restoreCaret } from "../utils/caretPositioning";
import "../stylesheets/Converter.css";

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.numRefs = Array(37)
      .fill(null)
      .map(_ => React.createRef());
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
    let target = event.target,
      input = target.textContent,
      ref = this.numRefs[radix];

    if (!isValidNumber(input, radix)) {
      target.textContent = this.state.radixValues[radix];
      restoreCaret(ref.current);
    } else {
      saveCaret(event, ref.current);
      this.setState(
        {
          radixValues: convert2all(
            input.replace(/\s/g, ""),
            radix,
            this.state.precision
          )
        },
        () => {
          restoreCaret(ref.current);
        }
      );
    }
  };

  renderNumber = radix => {
    // we should maybe set an upper bound for the font size to avoid overflow
    const numFontSize = 3 + 10 / this.state.numRows + radix / 3;
    const radixFontSize = numFontSize / 2;
    const ref = this.numRefs[radix];

    return (
      <div className="RadixNumber" style={{ fontSize: numFontSize + "vh" }}>
        <div>{radix === 2 ? "\n" : "="}</div>
        <div>
          <span
            ref={ref}
            contentEditable={true}
            suppressContentEditableWarning="true"
            onInput={event => this.handleChange(event, radix)}
            onClick={event => saveCaret(event, ref.current)}
            onKeyDown={event => saveCaret(event, ref.current)}
            tabIndex={1}
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
