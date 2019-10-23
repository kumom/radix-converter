import React from "react";
import "../stylesheets/Setting.css";
import expandedIcon from "../assets/expand.svg";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.menuIcon = React.createRef();
  }
  renderRadixes() {
    const inactiveColor = "rgba(34,34,34,0.7)";
    let buttons = [
      ...Array(37)
        .fill(null)
        .keys()
    ].map((_, radix) => {
      let activeColor = `hsla(${radix * 10}, 70%, 40%, 0.6)`;
      return (
        <button
          key={radix}
          style={{
            backgroundColor: this.props.radixes.includes(radix)
              ? activeColor
              : inactiveColor
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
        > <div id="radix-buttons">{buttons.slice(2)}</div>
      </div>
    );
  }

  renderPrecisionSetter() {
    let precision = this.props.precision;
    return (
      <div>
        <span>
          > Show
          <input
            type="number"
            value={precision}
            style={{ width: `${precision}`.length + 0.5 + "ch" }}
          ></input>
          {precision <= 1 ? "digit" : "digits"} after the radix point
        </span>
      </div>
    );
  }

  render() {
    return (
      <div className="Setting">
        <ExpansionPanel>
          <ExpansionPanelSummary
            aria-controls="header"
            id="header"
            style={{ height: "3vh" }}
            expandIcon={<img style={{ height: "2vh" }} src={expandedIcon} />}
          >
            Radix C
            <a
              key="github"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/kumom/radix-converter"
              id="github-logo"
            ></a>
            nverter
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {this.renderRadixes()}
            {this.renderPrecisionSetter()}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default Setting;
