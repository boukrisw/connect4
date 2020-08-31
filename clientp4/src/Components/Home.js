import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";

function Home() {
  const dispatch = useDispatch();

  const messageError = useSelector((state) => state.messageError);
  var socket = useSelector((state) => state.socket);

  const [pseudo, setPseudo] = useState("");
  const [room, setRoomName] = useState("");

  const setResponseCreated = (args) => {
    if (args.succes) {
      dispatch({
        type: "create",
        game: args.game,
        score: args.score,
        room: args.room,
        pseudo: args.pseudo,
      });
    } else {
      dispatch({ type: "error", message: args.message });
    }
  };

  let setResponseMessageError = (args) => {
    dispatch({ type: "intialize" });
    dispatch({ type: "error", message: args.message });
  };

  let setResponseRecieveMessage = (args) => {
    dispatch({ type: "addMessage", messages: args.messages });
  };

  useEffect(() => {
    socket.off("created");
    socket.off("messageError");
    socket.off("RecieveMessage");

    socket.on("created", (args) => setResponseCreated(args));
    socket.on("messageError", (args) => setResponseMessageError(args));
    socket.on("RecieveMessage", (args) => setResponseRecieveMessage(args));
    // eslint-disable-next-line
  }, []);

  const handleClick = (event) => {
    event.preventDefault();
    if (room !== "" && pseudo !== "") {
      if (room.length <= 6 && pseudo.length <= 15) {
        socket.emit("creat", { pseudo: pseudo, room: room });
      } else {
        dispatch({
          type: "error",
          message:
            "the name of the room must not exceed 6 letters and 15 for Pseudo",
        });
      }
    } else {
      dispatch({
        type: "error",
        message: "You have to complete Pseudo and Room",
      });
    }
  };

  const changePseudo = (event) => {
    event.preventDefault();
    if (messageError !== "") {
      dispatch({ type: "error", message: "" });
    }
    setPseudo(event.target.value);
  };

  const changeRoom = (event) => {
    event.preventDefault();
    if (messageError !== "") {
      dispatch({ type: "error", message: "" });
    }
    setRoomName(event.target.value);
  };

  return (
    <div className="home">
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
        crossOrigin="anonymous"
      />
      <div className="table__container">
        <div className="light-blue-text">
          Hey, welcom to Connect 4 Chat ROOM
        </div>
        <form>
          <div className="input-field col s6">
            <input
              onChange={(event) => {
                changePseudo(event);
              }}
              value={pseudo}
              type="text"
            />
            <label>Pseudo</label>
          </div>
          <div className="input-field col s6">
            <input
              onChange={(event) => {
                changeRoom(event);
              }}
              value={room}
              type="text"
            />
            <label>ROOM name</label>
          </div>
          <p className="light center">
            <button
              type="submit"
              onClick={handleClick}
              className="waves-effect waves-light btn-large"
            >
              PLAY and CHAT
            </button>
          </p>
          {messageError !== "" ? (
            <div className="alert alert-danger" role="alert">
              {messageError}
            </div>
          ) : (
            ""
          )}
        </form>
      </div>
    </div>
  );
}

export default connect()(Home);
