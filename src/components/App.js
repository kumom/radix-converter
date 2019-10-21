import React from "react";
import Converter from "./Converter";
import Header from "./Header";
import Setting from "./Setting";
import "../stylesheets/App.css";

function App() {
  return (
    <div className="App">
      <link
        href="https://fonts.googleapis.com/css?family=Montserrat&display=swap"
        rel="stylesheet"
      ></link>
      <link
        href="https://fonts.googleapis.com/css?family=Architects+Daughter&display=swap"
        rel="stylesheet"
      ></link>
      <Setting></Setting>
      <Header></Header>
      <Converter />
    </div>
  );
}

export default App;
