const express = require("express");
const socketio = require("socket.io");
const http = require("http");

//Imports
const Game = require("./Model/Game");

const PORT = process.env.PORT || 5000;

//App setup
const app = express();
const server = http.createServer(app);
const io = socketio(server);

var Parties = [];

io.on("connection", (socket) => {
  /** Socket { Create a party } */
  socket.on("creat", (args) => {
    let p = Parties.filter((p) => p.room === args.room);

    if (p.length > 0) {
      let party = p[0];
      if (party.players.length === 1) {
        if (party.game.player1 !== args.pseudo) {
          party.game.player2 = args.pseudo;
          party.sockets.push(socket.id);
          party.players.push(args.pseudo);

          io.to(party.sockets[0]).emit("created", {
            game: party.game,
            succes: true,
            score: [0, 0],
            room: party.room,
            pseudo: party.game.player1,
          });
          io.to(party.sockets[1]).emit("created", {
            game: party.game,
            succes: true,
            score: [0, 0],
            room: party.room,
            pseudo: args.pseudo,
          });
        } else {
          io.to(socket.id).emit("created", {
            game: null,
            succes: false,
            message: "change your pseudo name",
          });
        }
      } else {
        io.to(socket.id).emit("created", {
          game: null,
          succes: false,
          message: "this room exist and contains 2 players",
        });
      }
    } else {
      let game = new Game(args.pseudo, "waiting for player!", 1);
      Parties.push({
        game: game,
        room: args.room,
        sockets: [socket.id],
        players: [args.pseudo],
        score: [0, 0],
        start: 1,
        messages: [],
      });
      io.to(socket.id).emit("created", {
        game: game,
        succes: true,
        score: [0, 0],
        room: args.room,
        pseudo: args.pseudo,
      });
    }
  });

  socket.on("rejouer", (args) => {
    let p = Parties.filter((p) => p.room === args.room);
    if (p.length > 0) {
      if (p[0].start === 1) {
        p[0].start = 2;
      } else {
        p[0].start = 1;
      }
      p[0].game = new Game(p[0].players[0], p[0].players[1], p[0].start);
      p[0].sockets.map((s) =>
        io.to(s).emit("rejouer", { game: p[0].game, score: p[0].score })
      );
    }
  });

  /** Socket { Make a play } */
  socket.on("play", (args) => {
    //console.log('Lets play ',args)
    let p = Parties.filter((p) => p.room === args.room);
    if (p.length > 0) {
      let game = p[0].game;

      if (
        p[0].players.length === 2 &&
        p[0].players[game.currentPlayer - 1] === args.pseudo &&
        game.canPlay(args.j)
      ) {
        game.play(args.j);
        let fin = game.fin();
        if (fin) {
          game.changePlayer();
          p[0].score[game.currentPlayer - 1] =
            p[0].score[game.currentPlayer - 1] + 1;
        }
        p[0].sockets.map((s) =>
          io.to(s).emit("played", { game: game, score: p[0].score })
        );
      }
    }
  });

  /** Socket { Remove a Party } */
  socket.on("removePartie", (args) => {
    //console.log('Party removed')
    let p = Parties.filter((p) => p.room === args.room);
    if (p[0] && p[0].sockets.length === 2) {
      p[0].sockets = p[0].sockets.filter((s) => s !== socket.id);
      io.to(p[0].sockets[0]).emit("messageError", {
        message: args.pseudo + " Left ROOM " + args.room,
      });
    }
    Parties = Parties.filter((p) => p.room !== args.room);
  });

  socket.on("SendMessage", (args) => {
    let p = Parties.filter((p) => p.room === args.room);
    if (p.length >= 1 && p[0].sockets.length === 2) {
      p[0].messages.push({ pseudo: args.pseudo, message: args.message });
      let toSend = p[0].messages.slice().reverse();
      p[0].sockets.map((s) =>
        io.to(s).emit("RecieveMessage", { messages: toSend })
      );
    }
  });

  /** Socket disconnect*/
  socket.on("disconnect", () => {
    let p = Parties.filter((p) => p.sockets.includes(socket.id));
    p.map((p) => {
      p.sockets.map((s) =>
        io
          .to(s)
          .emit("messageError", { message: "opponent Left ROOM " + p.room })
      );
      Parties = Parties.filter((pp) => pp.room !== p.room);
    });
  });
});

server.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`));

module.exports = app;
