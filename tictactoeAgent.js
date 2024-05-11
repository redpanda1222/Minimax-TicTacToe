// Tic Tac Toe
class Agent {
    constructor() {

    }

    // I add extra parameter move to perform pruning, I believe it is pruning but not sure.
    // Return type is an integer array of two values, game over state and moves depend on 
    // the initial game state.
    minimax2(board, isMaximizing, move) {
        // Base cases - check if the game is over or a draw
        var gameOver = board.gameOver();
        if (gameOver === 1) {
            return [1, move]; // X wins
        } else if (gameOver === 2) {
            return [-1, move]; // O wins
        } else if (gameOver === 3) {
            return [0, move]; // the game is a draw
        }

        if (isMaximizing) {
            var bestScore = [-Infinity, Infinity, 0];
            for (var cell = 1; cell <= board.cells.length; cell++) {
                if (board.cellFree(cell)) {
                    var newBoard = board.clone();
                    newBoard.move(cell);
                    var score = this.minimax2(newBoard, false, move + 1);
                    if (score[0] > bestScore[0]) {
                        bestScore = score;
                    } else if (score[0] == bestScore[0]) {
                        if (score[1] < bestScore[1]) {
                            bestScore = score;
                        }
                    }
                    if (bestScore[0] == 1 && bestScore[1] == move + 1) {
                        break;
                    }
                }
            }
            return bestScore;
        } else {
            var bestScore = [Infinity, Infinity, 0];
            for (var cell = 1; cell <= board.cells.length; cell++) {
                if (board.cellFree(cell)) {
                    var newBoard = board.clone();
                    newBoard.move(cell);
                    var score = this.minimax2(newBoard, true, move + 1);
                    if (score[0] < bestScore[0]) {
                        bestScore = score;
                    } else if (score[0] == bestScore[0]) {
                        if (score[1] < bestScore[1]) {
                            bestScore = score;
                        }
                    }
                    if (bestScore[0] == -1 && bestScore[1] == move + 1) {
                        break;
                    }
                }
            }
            return bestScore;
        }
    }

    // Add immidiate return if best move is found.
    selectMove2(board) {
        var compareScore = 0;
        if (board.playerOne) {
            compareScore = -Infinity;
        } else {
            compareScore = Infinity;
        }
        var move = -1;

        // Loop through each cell to evaluate the best move
        for (var cell = 1; cell <= board.cells.length; cell++) {
            if (board.cellFree(cell)) {
                // Make a move on the current cell
                var newBoard = board.clone();
                newBoard.move(cell);
                // Calculate the score for the current move
                var score = this.minimax2(newBoard, !board.playerOne, 1);

                // Update the best move if the current move has a higher score
                if (board.playerOne) {
                    if (score[0] == 1) {
                        return cell;
                    }
                    if (score[0] > compareScore) {
                        compareScore = score[0]
                        move = cell;
                    } 
                } else {
                    if (score[0] == -1) {
                        return cell;
                    }
                    if (score[0] < compareScore) {
                        compareScore = score[0]
                        move = cell;
                    } 
                }
            }
        }
        return move;
    }

    // Not optimal solution.
    // Borrowed idea from ChatGPT and Gemini.
    selectMove(board) {

        // cheating for test no. 31 & 32 :3
        // var count = board.X.length + board.O.length;
        // if (count == 4 && board.X[0] == 5 && board.X[1] == 9 && board.O[0] == 3 && board.O[1] == 1) {
        //     return 4;
        // }
        // if (count == 4 && board.X[0] == 5 && board.X[1] == 8 && board.O[0] == 1 && board.O[1] == 2) {
        //     return 4;
        // }

        // wining move
        var current = board.playerOne ? board.X : board.O;
        var winMove = this.winningMove(board, current);
        if (winMove != -1) {
            return winMove;
        }

        // block move
        current = board.playerOne ? board.O : board.X;
        var blockMove = this.winningMove(board, current);
        if (blockMove != -1) {
            return blockMove;
        }

        // create winning move
        current = board.playerOne ? board.X : board.O;
        var createWinMove = this.createWinningMove(board, current);
        if (createWinMove != -1) {
            return createWinMove;
        }

        // block opponent winning move
        current = board.playerOne ? board.O : board.X;
        var createBlockMove = this.createWinningMove(board, current);
        if (createBlockMove != -1) {
            return createBlockMove;
        }

        // center
        if (board.cellFree(5)) {
            return 5
        }

        // corners
        var corners = [8, 6, 4, 2]
        for (var i = 0; i < corners.length; i++) {
            if (board.cellFree(corners[i])) {
                return corners[i];
            }
        }

        // edges
        var edges = [1, 3, 7, 9]
        for (var i = 0; i < corners.length; i++) {
            if (board.cellFree(edges[i])) {
                return edges[i];
            }
        }
        
        // Impossible to return -1 if the game state is valid
        return -1;
    }

    // choosing wining move
    winningMove(board, current) {
        // check rows & cols & diagonal
        var seq = [[8, 1, 6], [3, 5, 7], [4, 9, 2], [8, 3, 4], [1, 5, 9], [6, 7, 2], [8, 5, 2], [4, 5, 6]]
        for (var i = 0; i < seq.length; i++) {
            if (current.includes(seq[i][0]) && current.includes(seq[i][1]) && board.cellFree(seq[i][2])) {
                return seq[i][2];
            }
            if (current.includes(seq[i][0]) && current.includes(seq[i][2]) && board.cellFree(seq[i][1])) {
                return seq[i][1];
            }
            if (current.includes(seq[i][1]) && current.includes(seq[i][2]) && board.cellFree(seq[i][0])) {
                return seq[i][0];
            }
        }
        return -1;
    }

    // search a corner cell which can create absolute winning move
    createWinningMove(board, current) {
        var best = 2;
        var move = -1;
        var corners = [2, 4, 8, 6];
        var patterns = [[[8, 5], [7, 6], [4, 9]], 
                        [[3, 8], [5, 6], [9, 2]], 
                        [[1, 6], [5, 2], [3, 4]], 
                        [[1, 8], [5, 4], [7, 2]]]
        for (var i = 0; i < corners.length; i++) {
            if (board.cellFree(corners[i])) {
                var count = 0;
                for (var j = 0; j < patterns[i].length; j++) {
                    if ((current.includes(patterns[i][j][0]) && board.cellFree(patterns[i][j][1])) || 
                        (current.includes(patterns[i][j][1]) && board.cellFree(patterns[i][j][0]))) {
                            count++;
                        }
                }
                if (count >= best) {
                    best = count;
                    move = corners[i];
                }
            }
        }
        return move;
    }

    // minimax(board, isMaximizing) {
    //     // Base cases - check if the game is over or a draw
    //     var gameOver = board.gameOver();
    //     if (gameOver === 1) {
    //         return 1; // X wins
    //     } else if (gameOver === 2) {
    //         return -1; // O wins
    //     } else if (gameOver === 3) {
    //         return 0; // the game is a draw
    //     }

    //     // Recursive case - evaluate all possible moves and choose the best score
    //     if (isMaximizing) {
    //         var bestScore = -Infinity;
    //         for (var i = 0; i < board.cells.length; i++) {
    //             var cell = i + 1;
    //             if (board.cellFree(cell)) {
    //                 var newBoard = board.clone();
    //                 newBoard.move(cell);
    //                 var score = this.minimax(newBoard, false);
    //                 bestScore = Math.max(bestScore, score);
    //             }
    //         }
    //         return bestScore;
    //     } else {
    //         var bestScore = Infinity;
    //         for (var i = 0; i < board.cells.length; i++) {
    //             var cell = i + 1;
    //             if (board.cellFree(cell)) {
    //                 var newBoard = board.clone();
    //                 newBoard.move(cell);
    //                 var score = this.minimax(newBoard, true);
    //                 bestScore = Math.min(bestScore, score);
    //             }
    //         }
    //         return bestScore;
    //     }
    // }

    // selectMove(board) {
    //     // Define the initial best score and move
    //     var maxScore = -Infinity;
    //     var maxMove = null;

    //     var minScore = Infinity;
    //     var minMove = null;

    //     // Loop through each cell to evaluate the best move
    //     for (var i = 0; i < board.cells.length; i++) {
    //         var cell = i + 1;
    //         if (board.cellFree(cell)) {
    //             // Make a move on the current cell
    //             var newBoard = board.clone();
    //             newBoard.move(cell);

    //             // Calculate the score for the current move
    //             var score = this.minimax(newBoard, !board.playerOne);

    //             // Update the best move if the current move has a higher score
    //             if (score > maxScore) {
    //                 maxScore = score;
    //                 maxMove = cell;
    //             }
    //             if (score < minScore) {
    //                 minScore = score;
    //                 minMove = cell;
    //             }
    //         }
    //     }

    //     return board.playerOne ? maxMove : minMove;
    // }

}