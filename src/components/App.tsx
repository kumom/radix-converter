import React from "react";
import Converter from "./Converter";
import Header from "./Header";
import "../stylesheets/App.css";

class App extends React.Component<{}, { [key: string]: any }> {
  constructor(props: any) {
    super(props);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.updateDecimalPlaces = this.updateDecimalPlaces.bind(this);

    this.state = {
      currentValue: 0,
      currentRadix: 10,
      decimalPlaces: 10,
      mask: Array(37).fill(null).map((v, i) => [2, 8, 10, 16].includes(i))
    };
  }

  changeValue(value: string, radix: number) {
    this.setState({ currentValue: value, currentRadix: radix });
  }

  updateDecimalPlaces(newValue: number) {
    console.log(newValue);
    this.setState({ decimalPlaces: newValue }, () => {
      console.log(this.state.decimalPlaces)
    });
  };

  toggleVisibility(radix: number) {
    let mask = this.state.mask.slice(0);
    mask[radix] = !mask[radix];
    this.setState({ mask });
  }

  componentDidMount() {
    // Force initial resize of <textarea> element
    setTimeout(() => { this.setState({ currentValue: 1024, currentRadix: 10 }) }, 500);
  }

  render() {
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
        <Header
          currentValue={this.state.currentValue}
          currentRadix={this.state.currentRadix}
          decimalPlaces={this.state.decimalPlaces}
          mask={this.state.mask}
          toggleVisibility={this.toggleVisibility}
          updateDecimalPlaces={this.updateDecimalPlaces}
        />
        <Converter
          currentValue={this.state.currentValue}
          currentRadix={this.state.currentRadix}
          decimalPlaces={this.state.decimalPlaces}
          mask={this.state.mask}
          changeValue={this.changeValue}
        />
      </div>
    );
  }
}

export default App;
