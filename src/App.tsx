import React from "react";
import "./App.scss";
import Router from "./components/Router";
import Scroller from "./components/Scroller";

function App() {
  return (
    <Scroller>
      <Router />
    </Scroller>
  );
}

export default App;
