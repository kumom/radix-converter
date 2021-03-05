import React from "react";
import Converter from "./Converter";
import Header from "./Header";
import "../stylesheets/App.css";

class App extends React.Component<{}, { [key: string]: any }> {
  constructor(props: any) {
    super(props);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.updateDecimalPlaces = this.updateDecimalPlaces.bind(this);

    this.state = {
      currentValue: 1024,
      currentRadix: 10,
      editingRadix: 0,
      decimalPlaces: 10,
      mask: Array(37).fill(null).map((v, i) => [2, 8, 10, 16].includes(i))
    };
  }

  updateValue(value: string, radix: number) {
    this.setState({ currentValue: value, currentRadix: radix });
  }

  updateDecimalPlaces(newValue: number) {
    this.setState({ decimalPlaces: newValue });
  };

  toggleVisibility(radix: number) {
    let mask = this.state.mask.slice(0);
    mask[radix] = !mask[radix];
    this.setState({ mask });
  }

  render() {
    return (
      <div className="App">
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
          updateValue={this.updateValue}
        />
      </div>
    );
  }
}

export default App;
