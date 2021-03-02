import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import "../stylesheets/Header.css";
import expandedIcon from "../assets/expand.svg";
import githubLogo from "../assets/github.png";

class Header extends React.Component<{ [key: string]: any }, { [key: string]: any }> {
  constructor(props: { decimalPlaces: number, mask: boolean[], currentValue: string, currentRadix: number }) {
    super(props);
    this.state = {
      expanded: false
    }
  }

  render() {
    let radixButtons: JSX.Element[] = [];
    Array(37).fill(null).forEach((v: any, i: number) => {
      if (i < 2) return;
      radixButtons.push(<RadixButton key={i} radix={i} show={this.props.mask[i]} toggleVisibility={this.props.toggleVisibility} />);
    });

    return (
      <div className="Header">
        <Accordion
          style={{
            backgroundColor: this.state.expanded ? "rgba(10,10,10,0.8)" : "rgba(250,250,250,0.8)",
            color: this.state.expanded ? "rgba(250,250,250,0.8)" : "rgba(10,10,10,0.8)"
          }}
          onChange={(_, expanded) => {
            this.setState({ expanded })
          }}
        >
          <AccordionSummary
            aria-controls="header"
            expandIcon={
              <img id="expand-icon" src={expandedIcon} alt="expand"
                style={{ filter: this.state.expanded ? "invert(80%)" : "none" }} />
            }
          >
            <Title expanded={this.state.expanded} />
          </AccordionSummary>
          <AccordionDetails>
            <DecimalPlacesSetter decimalPlaces={this.props.decimalPlaces} updateDecimalPlaces={this.props.updateDecimalPlaces} />
            <div id="set-radixes">
              <div id="radix-buttons">
                {radixButtons}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}

function RadixButton(props: { radix: number, show: boolean, toggleVisibility: (radix: number) => void }) {
  const inactiveColor = "rgba(34,34,34,0.7)";
  const activeColor = (radix: number) => `hsla(${radix * 10}, 70%, 40%, 0.6)`;

  return <button style={{ backgroundColor: props.show ? activeColor(props.radix) : inactiveColor }}
    onClick={() => { props.toggleVisibility(props.radix) }}>
    {props.radix}
  </button>
}

function Title(props: { expanded: boolean }) {
  return <div id="title">
    Radix C
          <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/kumom/radix-converter"
    >
      <img
        key="github"
        src={githubLogo}
        alt="github-logo"
        id="github-logo"
        style={{ filter: props.expanded ? "invert(80%)" : "none" }}
      ></img>
    </a>
          nverter
        </div>;
}

function DecimalPlacesSetter(props: { decimalPlaces: number, updateDecimalPlaces: (value: number) => void }) {
  return <div>
    Show
      <input
      type="number"
      defaultValue={props.decimalPlaces}
      style={{ width: `${props.decimalPlaces}`.length + 0.5 + "ch" }}
      onChange={event => {
        const value = Number(event.target.value);
        const isInt = !event.target.value.includes('.');
        const isPos = !(event.target.value[0] === '-');
        if (event.target.value && isPos && isInt && value >= 0)
          props.updateDecimalPlaces(value);
      }}
    ></input>
    {props.decimalPlaces <= 1 ? "digit" : "digits"} after the radix point
    </div>;
}

export default Header;