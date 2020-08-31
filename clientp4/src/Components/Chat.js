import React, { useState } from "react";
import {
  Card,
  FormControl,
  InputLabel,
  Input,
  IconButton,
} from "@material-ui/core";
import { connect, useSelector } from "react-redux";
import SendIcon from "@material-ui/icons/Send";

import "./Chat.css";

import Message from "./Message";

function Chat() {
  const socket = useSelector((state) => state.socket);
  const messages = useSelector((state) => state.messages);
  const pseudo = useSelector((state) => state.pseudo);
  const room = useSelector((state) => state.room);

  const [message, setMessage] = useState("");

  const SendMessage = (event) => {
    event.preventDefault();
    if (message !== "") {
      socket.emit("SendMessage", {
        room: room,
        pseudo: pseudo,
        message: message,
      });
      setMessage("");
    }
  };

  return (
    <div className="home center">
      <Card className="card">
        <form>
          <FormControl className="app_form">
            <InputLabel>Enter a message</InputLabel>
            <Input
              className="app__input"
              onChange={(event) => setMessage(event.target.value)}
              value={message}
              type="text"
            />
            <IconButton
              className="app__iconButton"
              disabled={!message}
              variant="contained"
              color="primary"
              type="submit"
              onClick={SendMessage}
            >
              <SendIcon />
            </IconButton>
          </FormControl>
        </form>
      </Card>
      <div className="card__chat">
        {messages.map((m, i) => (
          <Message key={i} message={m} />
        ))}
      </div>
    </div>
  );
}

export default connect()(Chat);
