import React from "react";

import "../App.css";
import alert from "../Ressources/new.png";

import { connect, useDispatch, useSelector } from "react-redux";

function Navbar(params) {
  const room = useSelector((state) => state.room);
  const pseudo = useSelector((state) => state.pseudo);
  const player1 = useSelector((state) => state.game.player1);
  const player2 = useSelector((state) => state.game.player2);
  const current = useSelector((state) => state.game.currentPlayer);
  const score = useSelector((state) => state.score);
  const winner = useSelector((state) => state.game.winner);
  const socket = useSelector((state) => state.socket);
  const chatActive = useSelector((state) => state.chatActive);
  const newMessage = useSelector((state) => state.newMessage);

  const dispatch = useDispatch();

  const handleClickGrid = () => {
    dispatch({ type: "ActiveChat", value: false });
  };

  const handleClickChat = () => {
    dispatch({ type: "ActiveChat", value: true });
    if (newMessage) {
      dispatch({ type: "NonewMessage" });
    }
  };

  const handleClickLeave = () => {
    dispatch({ type: "intialize" });
    socket.emit("removePartie", { room: room, pseudo: pseudo });
  };

  return (
    <div>
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper teal lighten-2">
            room: {room}
            <ul className="right">
              <li>
                <button
                  onClick={handleClickGrid}
                  className="light center waves-effect waves-light btn"
                >
                  Grid
                </button>
                <button
                  onClick={handleClickChat}
                  className="light waves-effect waves-light btn"
                >
                  chat
                  {newMessage && (
                    <img
                      src={alert}
                      style={{ weigth: "15px", height: "15px" }}
                      alt=""
                    />
                  )}
                </button>
                <button
                  onClick={handleClickLeave}
                  className="light center waves-effect waves-light btn"
                >
                  Leave
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      {!chatActive ? (
        <div className="nav-content">
          <ul className="tabs tabs-transparent center">
            <li
              className={`${
                winner && player1 === winner
                  ? "tab yellow accent-2"
                  : current === 1
                  ? "tab red darken-1"
                  : "tab"
              }`}
              style={{ width: `50%` }}
            >
              {player1} {score[0]}
            </li>
            <li
              className={`${
                winner && player2 === winner
                  ? "tab yellow accent-2"
                  : current === 2
                  ? "tab green darken-1"
                  : "tab"
              }`}
              style={{ width: `50%` }}
            >
              {player2} {score[1]}
            </li>
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export default connect()(Navbar);
