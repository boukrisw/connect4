import io from "socket.io-client";

const initState = {
  game: { player1: "", player2: "", currentPlayer: 1, winner: null, grid: [] },
  messageError: "",
  score: [0, 0],
  chatActive: false,
  canPlay: false,
  room: "",
  pseudo: "",
  messages: [],
  socket: io("https://connect4chatroomserver.herokuapp.com/"),
  newMessage: false,
};

const myReducer = (state = initState, action) => {
  if (action.type === "changeGame") {
    return {
      ...state,
      game: action.game,
      score: action.score,
    };
  } else if (action.type === "create") {
    return {
      ...state,
      game: action.game,
      score: action.score,
      canPlay: true,
      room: action.room,
      pseudo: action.pseudo,
    };
  } else if (action.type === "error") {
    return {
      ...state,
      messageError: action.message,
    };
  } else if (action.type === "intialize") {
    return {
      ...state,
      game: {
        player1: "",
        player2: "",
        currentPlayer: 1,
        winner: null,
        grid: [],
      },
      messageError: "",
      score: [0, 0],
      chatActive: false,
      canPlay: false,
      room: "",
      pseudo: "",
      messages: [],
      newMessage: false,
    };
  } else if (action.type === "ActiveChat") {
    return {
      ...state,
      chatActive: action.value,
    };
  } else if (action.type === "addMessage") {
    let n = false;
    if (
      action.messages.length >= 1 &&
      state.pseudo !== action.messages[0].pseudo &&
      !state.chatActive
    ) {
      n = true;
    }
    return {
      ...state,
      messages: action.messages,
      newMessage: n,
    };
  } else if (action.type === "NonewMessage") {
    return {
      ...state,
      newMessage: false,
    };
  }
  return state;
};
export default myReducer;
