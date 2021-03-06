import React, { useState, useEffect, useRef } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import "../stylesheets/Header.css";
import expandedIcon from "../assets/expand.svg";
import githubLogo from "../assets/github.png";
import { activeColor, resize } from "../util";

export default class Header extends React.Component<{ [key: string]: any }, { [key: string]: any }> {
  constructor(props: {
    decimalPlaces: number,
    mask: boolean[],
    currentValue: string,
    currentRadix: number,
    toggleVisibility: (radix: number) => void,
    updateDecimalPlaces: (val: number) => void
  }) {
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
          >
            <Title expanded={this.state.expanded} />
            <img id="expand-icon" src={expandedIcon} alt="expand"
              style={{
                filter: this.state.expanded ? "invert(80%)" : "none",
                transform: this.state.expanded ? "rotate(180deg)" : "none"
              }} />
          </AccordionSummary>
          <AccordionDetails>
            <DecimalPlacesSetter decimalPlaces={this.props.decimalPlaces} updateDecimalPlaces={this.props.updateDecimalPlaces} />
            <div id="radix-buttons">
              {radixButtons}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}

function RadixButton(props: { radix: number, show: boolean, toggleVisibility: (radix: number) => void }) {
  const inactiveColor = "rgba(34,34,34,0.7)";

  return <button style={{ backgroundColor: props.show ? activeColor(props.radix) : inactiveColor }}
    onClick={() => { props.toggleVisibility(props.radix) }}>
    {props.radix}
  </button>
}

function Title(props: { expanded: boolean }) {
  return <div>
    <div id="title">
      Radix <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>C
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
          nverter</span>
    </div>
  </div>
    ;
}

function DecimalPlacesSetter(props: { decimalPlaces: number, updateDecimalPlaces: (value: number) => void }) {
  let prevDecimalPlaces: number = props.decimalPlaces;
  const decimalPlaceRef = useRef(null);
  const [outOfRange, setOutOfRange] = useState(false);
  let subscribeToResize = false;

  useEffect(() => {
    const node = decimalPlaceRef.current! as HTMLInputElement;
    resize(node);
    if (!subscribeToResize)
      window.addEventListener('resize', () => resize(node));
  })

  return <div>
    Show
      <input
      ref={decimalPlaceRef}
      type="number"
      defaultValue={props.decimalPlaces}
      min="0"
      max="65000"
      onKeyDown={event => {
        if (event.key === "-" || event.key === ".")
          event.preventDefault();
      }}
      onBlur={event => {
        if (!event.target.value) {
          event.target.value = "0";
          props.updateDecimalPlaces(0);
        }
      }}
      onPaste={event => {
        const data = event.clipboardData.getData("text/plain");
        if (!/^\d+$/.test(data)) {
          event.preventDefault();
          props.updateDecimalPlaces(prevDecimalPlaces);
        }
      }}
      onChange={event => {
        if (/^\d+$/.test(event.target.value)) {
          const value = Number(event.target.value);
          if (value <= 65000) {
            props.updateDecimalPlaces(value);
            prevDecimalPlaces = value;
            setOutOfRange(false);
          }
          else {
            props.updateDecimalPlaces(65000);
            setOutOfRange(true);
          }
        }
      }}
    ></input>decimal {props.decimalPlaces <= 1 ? "digit" : "digits"}
    <div style={{
      marginTop: "5px",
      fontSize: "80%",
      color: "rgba(227, 36, 36, 0.8)",
      display: outOfRange ? "block" : "none"
    }}>(OUT OF RANGE: maximum is 65000)</div>
  </div>;
}
