import React from "react";
import { connect, useSelector } from "react-redux";

import "../App.css";

import Chat from "./Chat";
import Game from "./Game";
import Navbar from "./Navbar";

function Room() {
  const chatActive = useSelector((state) => state.chatActive);
  return (
    <div>
      <Navbar />
      {chatActive ? <Chat /> : <Game />}
    </div>
  );
}

export default connect()(Room);
