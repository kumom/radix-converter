import React from "react";
import { saveCaret } from "../utils/caretPositioning";
import "../stylesheets/Converter.css";

class Converter extends React.Component {
  renderNumber = radix => {
    return (
      <div
        onFocus={event => {
          event.target.style.color = `hsla(${radix * 10}, 70%, 40%, 0.5)`;
        }}
        onBlur={event => {
          event.target.style.color = `rgba(10, 10, 10, 1)`;
        }}
      >
        <span
          className="radix-number"
          contentEditable={true}
          suppressContentEditableWarning="true"
          onInput={event => this.props.handleInput(event, radix)}
          onClick={event => saveCaret(event.target)}
          onKeyDown={event => saveCaret(event.target)}
          tabIndex={1}
          spellCheck={false}
        >
          {this.props.radixValues[radix]}
        </span>
        <sub style={{ fontSize: "50%", color: "inherit" }}>{radix}</sub>
      </div>
    );
  };

  render() {
    let allNumbers = [];
    [...this.props.radixes].forEach(radix => {
      if (radix === 0 || radix === 1) return;
      allNumbers.push(
        <div className="radix-number-container" key={radix}>
          <div className="radix-number">{this.renderNumber(radix)}</div>
          <div style={{ lineHeight: "80%" }}>
            {radix === this.props.lastRadix ? "\n" : "="}
          </div>
        </div>
      );
    });

    return <div className="Converter">{allNumbers}</div>;
  }
}

export default Converter;
