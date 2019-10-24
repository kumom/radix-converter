import React from "react";
import "../stylesheets/Setting.css";
import expandedIcon from "../assets/expand.svg";
import githubLogo from "../assets/github.png";
import { saveCaret } from "../utils/caretPositioning";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.panelRef = React.createRef();
    this.githubLogoRef = React.createRef();
    this.expandIconRef = React.createRef();
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
        <div id="radix-buttons">{buttons.slice(2)}</div>
      </div>
    );
  }

  renderPrecisionSetter() {
    let precision = this.props.precision;
    return (
      <div id="precision-setter">
        Show
        <input
          type="tel"
          value={precision}
          style={{ width: `${precision}`.length + 0.5 + "ch" }}
          onChange={event => {
            this.props.changedPrecision(event.target, event.target.value);
          }}
          onClick={event => saveCaret(event.target)}
          onKeyDown={event => saveCaret(event.target)}
        ></input>
        {precision <= 1 ? "digit" : "digits"} after the radix point
      </div>
    );
  }

  render() {
    const ref = this.panelRef;
    return (
      <div className="Setting">
        <ExpansionPanel
          ref={ref}
          onChange={(_, expanded) => {
            if (expanded) {
              ref.current.style.backgroundColor = "rgba(10,10,10,0.8)";
              ref.current.style.color = "rgba(250,250,250,0.8)";
              this.githubLogoRef.current.style.filter = "invert(80%)";
              this.expandIconRef.current.style.filter = "invert(80%)";
            } else {
              ref.current.style.backgroundColor = "rgba(250,250,250,0.8)";
              ref.current.style.color = "rgba(10,10,10,0.8)";
              this.githubLogoRef.current.style.filter = "none";
              this.expandIconRef.current.style.filter = "none";
            }
          }}
        >
          <ExpansionPanelSummary
            aria-controls="header"
            id="header"
            expandIcon={
              <img
                ref={this.expandIconRef}
                id="expand-icon"
                src={expandedIcon}
                alt="expand"
              />
            }
          >
            <div id="title">
              Radix C
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/kumom/radix-converter"
              >
                <img
                  ref={this.githubLogoRef}
                  key="github"
                  src={githubLogo}
                  alt="github-logo"
                  id="github-logo"
                ></img>
              </a>
              nverter
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {this.renderPrecisionSetter()}
            {this.renderRadixes()}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default Setting;
