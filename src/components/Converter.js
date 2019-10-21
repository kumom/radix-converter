import React from "react";
import { isValidNumber, convert2all } from "../utils/algo";
import { saveCaret, restoreCaret } from "../utils/caretPositioning";
import "../stylesheets/Converter.css";
import { inheritInnerComments } from "@babel/types";

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
      numRows: 35,
      // radix in the last row
      lastRadix: 36
    };
  }

  handleChange = (event, radix) => {
    let target = this.numRefs[radix].current,
      input = target.textContent;

    if (!isValidNumber(input, radix)) {
      target.textContent = this.state.radixValues[radix];
      restoreCaret(target);
    } else {
      saveCaret(event, target);
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
    const ref = this.numRefs[radix];

    return (
      <>
        <span
          className="radix-number"
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
        <sub style={{ fontSize: "50%" }}>{radix}</sub>
      </>
    );
  };

  render() {
    let allNumbers = [];
    [...this.numRefs.keys()].forEach(radix => {
      if (radix === 0 || radix === 1) return;
      allNumbers.push(
        <div className="radix-number-container">
          <div className="radix-number">{this.renderNumber(radix)}</div>
          <div style={{ lineHeight: "80%" }}>
            {radix === this.state.lastRadix ? "\n" : "="}
          </div>
        </div>
      );
    });

    return <div className="Converter">{allNumbers}</div>;
  }
}

export default Converter;
