import React from "react";
import { saveCaret } from "../utils/caretPositioning";
import "../stylesheets/Converter.css";

class Converter extends React.Component {
  renderNumber = radix => {
    let color = `hsla(${radix * 10}, 70%, 40%, 0.6)`;
    return (
      <>
        <div
          className="radix-number"
          contentEditable={true}
          suppressContentEditableWarning="true"
          onInput={event => this.props.handleInput(event, radix)}
          onClick={event => saveCaret(event.target)}
          onKeyDown={event => saveCaret(event.target)}
          onFocus={event => {
            event.target.style.color = color;
          }}
          onBlur={event => {
            event.target.style.color = `rgba(10, 10, 10, 0.9)`;
          }}
          tabIndex={1}
          spellCheck={false}
        >
          {this.props.radixValues[radix]}
        </div>
        <span className="radix">{radix}</span>
      </>
    );
  };

  render() {
    let allNumbers = [];
    [...this.props.radixes].forEach(radix => {
      if (radix === 0 || radix === 1) return;
      allNumbers.push(
        <div className="radix-number-container" key={radix}>
          {radix === this.props.firstRadix ? (
            <span>&nbsp;&nbsp;&nbsp;</span>
          ) : (
            <span>=&nbsp;</span>
          )}
          {this.renderNumber(radix)}
        </div>
      );
    });

    return <div className="Converter">{allNumbers}</div>;
  }
}

export default Converter;
