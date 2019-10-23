import React from "react";
import "../stylesheets/Setting.css";

class Setting extends React.Component {
  renderRadixes() {
    const inactiveColor = "rgba(34,34,34,0.7)";
    let buttons = [
      ...Array(37)
        .fill(null)
        .keys(),
    ].map((_, radix) => {
      let activeColor = `hsla(${radix * 10}, 70%, 40%, 0.5)`;
      return (
        <button
          key={radix}
          style={{
            backgroundColor: this.props.radixes.includes(radix)
              ? activeColor
              : inactiveColor,
          }}
          onClick={event =>
            this.props.toggleShownRadix(Number(event.target.textContent))
          }
        >
          {radix}
        </button>
      );
    });

    return (
      <div id="set-radixes">
        <div>Show radixes</div>
        <div id="radix-buttons">{buttons.slice(2)}</div>
      </div>
    );
  }

  renderSlider() {
    let precision = this.props.precision,
      color = `hsla(${precision * 3}, 70%, 40%, 0.8)`;
    return (
      <div id="slidecontainer">
        <span>
          Truncate to <span style={{ color: color }}>{precision}</span>{" "}
          {precision <= 1 ? "digit" : "digits"} after the radix point
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={precision}
          className="slider"
          style={{ background: color }}
          onChange={event => this.props.changedPrecision(event.target.value)}
        ></input>
      </div>
    );
  }

  render() {
    return (
      <div id="Setting">
        {this.renderRadixes()}
        {this.renderSlider()}
      </div>
    );
  }
}

export default Setting;
