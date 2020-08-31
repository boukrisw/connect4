class Game {
  //Create a Game
  constructor(namePlayer1, namePlayer2, current) {
    this.player1 = namePlayer1;
    this.player2 = namePlayer2;
    this.currentPlayer = current;
    this.winner = null;
    this.grid = [];
    [0, 0, 0, 0, 0, 0].map((elt) => this.grid.push([0, 0, 0, 0, 0, 0, 0]));
  }

  //Return the current Player
  getCurrentPlayer() {
    return this.currentPlayer;
  }

  //Return the grid
  getGrid() {
    return this.grid;
  }

  //Make a play
  play(column) {
    var i = 5;
    while (i >= 0 && this.grid[i][column] !== 0) {
      i = i - 1;
    }

    if (i >= 0) {
      this.grid[i][column] = this.currentPlayer;
      this.changePlayer();
    }
  }

  //Return true if the player can put value in column
  canPlay(column) {
    return this.grid[0][column] === 0;
  }

  //To Change player
  //We call it in methode play
  changePlayer() {
    this.currentPlayer = (this.currentPlayer % 2) + 1;
  }

  //to get the name of the player with value : id
  getPlayer(id) {
    id === 1 ? this.player1 : this.player2;
  }

  //return TRUE if there is a winner or it's a DRAW
  //Else false
  fin() {
    let res = false;

    /* Toutes les cases de tableau sont remplis*/
    let cnt = 0;
    while (cnt < 7 && this.grid[0][cnt] != 0) {
      cnt++;
    }
    if (cnt == 7) {
      res = true;
      this.winner = "draw";
    }

    this.grid.map((line, i) => {
      line.map((c, j) => {
        if (c !== 0) {
          let nb = 0;
          //Horizontal
          let a = i;
          let b = j;
          while (b >= 0 && this.grid[a][b] === c) {
            b = b - 1;
            nb = nb + 1;
          }
          b = j + 1;
          while (b < this.grid[0].length && this.grid[a][b] === c) {
            b = b + 1;
            nb = nb + 1;
          }
          if (nb === 4) {
            res = true;
            c === 1
              ? (this.winner = this.player1)
              : (this.winner = this.player2);
          }

          //Verticale
          nb = 0;
          a = i;
          b = j;
          while (a >= 0 && this.grid[a][b] === c) {
            a = a - 1;
            nb = nb + 1;
          }
          a = i + 1;
          while (a < this.grid.length && this.grid[a][b] === c) {
            a = a + 1;
            nb = nb + 1;
          }
          if (nb === 4) {
            res = true;
            c === 1
              ? (this.winner = this.player1)
              : (this.winner = this.player2);
          }

          //Diagonale \
          nb = 0;
          a = i;
          b = j;
          while (a >= 0 && b >= 0 && this.grid[a][b] === c) {
            a = a - 1;
            b = b - 1;
            nb = nb + 1;
          }
          a = i + 1;
          b = j + 1;
          while (
            a < this.grid.length &&
            b < this.grid[0].length &&
            this.grid[a][b] === c
          ) {
            a = a + 1;
            b = b + 1;
            nb = nb + 1;
          }
          if (nb === 4) {
            res = true;
            c === 1
              ? (this.winner = this.player1)
              : (this.winner = this.player2);
          }

          //Diagonale /
          nb = 0;
          a = i;
          b = j;
          while (a >= 0 && b < this.grid[0].length && this.grid[a][b] === c) {
            a = a - 1;
            b = b + 1;
            nb = nb + 1;
          }
          a = i + 1;
          b = j - 1;
          while (a < this.grid.length && b >= 0 && this.grid[a][b] === c) {
            a = a + 1;
            b = b - 1;
            nb = nb + 1;
          }
          if (nb === 4) {
            res = true;
            c === 1
              ? (this.winner = this.player1)
              : (this.winner = this.player2);
          }
        }
      });
    });
    return res;
  }

  //***************Affichage***************
  print() {
    console.log(this.player1, "(X)     vs     (O)", this.player2);
    this.grid.map((line) => console.log(this.getLine(line)));
    console.log("Current Player :", this.currentPlayer == 1 ? "X" : "O");
    if (this.winner != null) {
      console.log("winner:", this.winner);
    }
  }
  //print one line of the GRID
  getLine(line) {
    const reducer = (accumulator, currentValue) => {
      let v = ".";
      if (currentValue == 1) v = "X";
      else if (currentValue == 2) v = "O";
      return accumulator + v;
    };
    let res = line.reduce(reducer, "");
    return res;
  }
}

module.exports = Game;
