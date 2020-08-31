import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";

import "./Game.css";

import vide from "../Ressources/Vide.png";
import red from "../Ressources/Red.png";
import green from "../Ressources/Green.png";

function Game() {
  const dispatch = useDispatch();

  const game = useSelector((state) => state.game);
  const socket = useSelector((state) => state.socket);
  const winner = useSelector((state) => state.game.winner);
  const room = useSelector((state) => state.room);
  const pseudo = useSelector((state) => state.pseudo);

  let setGame = (args) => {
    dispatch({ type: "changeGame", game: args.game, score: args.score });
  };

  useEffect(() => {
    socket.off("played");
    socket.off("rejouer");

    socket.on("played", (args) => setGame(args));
    socket.on("rejouer", (args) => setGame(args));
    // eslint-disable-next-line
  }, []);

  const clicked = (i, j) => {
    if (!game.winner) {
      socket.emit("play", { room: room, pseudo: pseudo, i: i, j: j });
    }
  };

  const PrintCase = (c, i, j) => {
    return (
      <img
        key={i * 7 + j}
        onClick={() => clicked(i, j)}
        style={{ height: `45px`, width: `45px` }}
        src={image(c)}
        alt="case"
      />
    );
  };

  const image = (c) => {
    if (c === 0) {
      return vide;
    } else if (c === 1) {
      return red;
    } else if (c === 2) {
      return green;
    }
  };

  const Rejouer = () => {
    socket.emit("rejouer", { room: room });
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          {game.grid.map((line, i) => {
            return (
              <div key={i} className="col s12 rowFlex">
                {line.map((c, j) => {
                  return PrintCase(c, i, j);
                })}
              </div>
            );
          })}
        </div>
      </div>
      {winner ? (
        <p className="light center">
          <button
            onClick={Rejouer}
            className="waves-effect waves-light btn-large"
          >
            RePLAY
          </button>
        </p>
      ) : (
        ""
      )}
    </div>
  );
}

export default connect()(Game);
