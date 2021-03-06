import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import "../stylesheets/Header.css";
import expandedIcon from "../assets/expand.svg";
import githubLogo from "../assets/github.png";
import { activeColor } from "../util";
import BigNumber from "bignumber.js";

export default function Header(props: {
  decimalPlaces: number,
  mask: boolean[],
  currentValue: string,
  currentRadix: number,
  toggleVisibility: (radix: number) => void,
  updateDecimalPlaces: (val: number) => void
}) {

  const [expanded, setExpanded] = useState(false);

  let radixButtons: JSX.Element[] = [];
  Array(37).fill(null).forEach((v: any, i: number) => {
    if (i < 2) return;
    radixButtons.push(<RadixButton key={i} radix={i} show={props.mask[i]} toggleVisibility={props.toggleVisibility} />);
  });

  return (
    <div className="Header">
      <Accordion
        style={{
          backgroundColor: expanded ? "rgba(10,10,10,0.8)" : "rgba(250,250,250,0.8)",
          color: expanded ? "rgba(250,250,250,0.8)" : "rgba(10,10,10,0.8)"
        }}
        onChange={(_, expanded) => {
          setExpanded(expanded);
        }}
      >
        <AccordionSummary
        >
          <Title expanded={expanded} />
          <img id="expand-icon" src={expandedIcon} alt="expand"
            style={{
              filter: expanded ? "invert(80%)" : "none",
              transform: expanded ? "rotate(180deg)" : "none"
            }} />
        </AccordionSummary>
        <AccordionDetails>
          <DecimalPlacesSetterMemo decimalPlaces={props.decimalPlaces} updateDecimalPlaces={props.updateDecimalPlaces} />
          <div id="radix-buttons">
            {radixButtons}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
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
  const [outOfRange, setOutOfRange] = useState(false);
  const [plurality, setPlurality] = useState(props.decimalPlaces > 1);

  return <div>
    <div id="decimal-places-prompt">Show
      <div
        id="decimal-places"
        spellCheck={false}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onKeyDown={event => {
          if (event.key === "-" || event.key === "."
            || (event.key !== "Backspace" &&
              event.key !== "ArrowRight" &&
              event.key !== "ArrowLeft" &&
              !/^\d$/.test(event.key)))
            event.preventDefault();
        }}
        onBlur={event => {
          if (!event.target.innerText) {
            event.target.innerText = "0";
            props.updateDecimalPlaces(0);
            setPlurality(false);
          }
        }}
        onPaste={event => { event.preventDefault() }}
        onInput={(event: React.ChangeEvent<HTMLDivElement>) => {
          if (/^\d+$/.test(event.target.innerText)) {
            let value = Number(event.target.innerText);
            value = value > 65000 ? 65000 : value;
            setOutOfRange(value > 65000);
            props.updateDecimalPlaces(value);
            setPlurality(value > 1);
          }
        }}
      >
        {props.decimalPlaces}
      </div> decimal {plurality ? "digits" : "digit"}
    </div>
    <div style={{
      marginTop: "5px",
      fontSize: "80%",
      color: "rgba(227, 36, 36, 0.8)",
      display: outOfRange ? "block" : "none"
    }}>(OUT OF RANGE: maximum is 65000)</div>
  </div>;
}

const DecimalPlacesSetterMemo = React.memo(DecimalPlacesSetter, () => true);