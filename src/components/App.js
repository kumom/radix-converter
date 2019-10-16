import React from "react";
import Converter from "./Converter";
import "../stylesheets/App.css";

function App() {
  return (
    <div className="App">
      <link
        href="https://fonts.googleapis.com/css?family=Montserrat&display=swap"
        rel="stylesheet"
      ></link>
      {/* <header className="header">Radix Calculator</header> */}
      <Converter />
    </div>
  );
}

export default App;
