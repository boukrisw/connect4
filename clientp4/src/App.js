import React from "react";
import { connect, useSelector } from "react-redux";

import "./App.css";

import Room from "./Components/Room";
import Home from "./Components/Home";

function App() {
  const canPlay = useSelector((state) => state.canPlay);

  return <div className="App">{canPlay ? <Room /> : <Home />}</div>;
}
export default connect()(App);
