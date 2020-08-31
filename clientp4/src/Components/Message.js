import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { connect, useSelector } from "react-redux";

import "./Message.css";

function Message({ message }) {
  const pseudo = useSelector((state) => state.pseudo);
  const isUser = pseudo === message.pseudo;

  return (
    <div className={`message ${isUser && "message_user"}`}>
      <Card className={isUser ? "message_userCard" : "message_guestCard"}>
        <CardContent>
          <Typography variant="h6" component="h6">
            {!isUser ? message.pseudo + ": " : ""} {message.message}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default connect()(Message);
