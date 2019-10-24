import React from "react";
import Converter from "./Converter";
import Setting from "./Setting";
import { saveCaret, restoreCaret } from "../utils/caretPositioning";
import { isValidNumber, convert2all } from "../utils/algo";
import "../stylesheets/App.css";

class App extends React.Component {
  constructor() {
    super();
    let precision = "10",
      currentValue = "1024",
      currentRadix = 10,
      initialShownRadixes = [2, 8, 10, 16];
    this.state = {
      currentValue: currentValue,
      currentRadix: currentRadix,
      // radixValues[i] stores the representation of value in radix i
      radixValues: convert2all(currentValue, currentRadix, 10),
      precision: precision,
      radixes: Array(37)
        .fill(null)
        .map((_, radix) => {
          if (initialShownRadixes.includes(radix)) return radix;
          else return null;
        })
    };
  }

  handleInput = (event, radix) => {
    let target = event.target,
      input = target.textContent;

    if (!isValidNumber(input, radix)) {
      target.textContent = this.state.radixValues[radix];
      restoreCaret(target);
    } else {
      saveCaret(target);
      // let App handle setState instead
      this.setState(
        {
          currentValue: input,
          currentRadix: radix,
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

  changedPrecision = (target, newValue) => {
    if (!/^\d*$/g.test(newValue)) {
      target.value = this.state.precision;
      restoreCaret(target);
    } else {
      saveCaret(target);
      this.setState(
        {
          precision: newValue
        },
        () => {
          restoreCaret(target);
          this.setState({
            radixValues: convert2all(
              this.state.currentValue,
              this.state.currentRadix,
              this.state.precision
            )
          });
        }
      );
    }
  };

  toggleShownRadixes = radix => {
    let radixes = this.state.radixes.slice(0);
    if (radixes[radix]) radixes[radix] = null;
    else radixes[radix] = radix;

    this.setState({ radixes: radixes });
  };

  render() {
    let shownRadixes = this.state.radixes.filter(radix => radix != null),
      precision = this.state.precision;
    return (
      <div className="App">
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css?family=Inconsolata&display=swap"
          rel="stylesheet"
        ></link>
        <Setting
          toggleShownRadix={this.toggleShownRadixes}
          changedPrecision={this.changedPrecision}
          precision={precision}
          radixes={shownRadixes}
        />
        <Converter
          radixValues={this.state.radixValues}
          precision={Number(precision)}
          radixes={shownRadixes}
          currentValue={this.state.currentValue}
          currentRadix={this.state.currentRadix}
          firstRadix={shownRadixes[0]}
          handleInput={this.handleInput}
        />
      </div>
    );
  }
}

export default App;
