import { useState, useEffect } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square border border-black text-lg font-bold h-9 w-9 p-0 text-center bg-white hover:border-4 active:bg-slate-500" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  // if (winner) {
  //   status = 'Winner: ' + winner;
  // } else {
  //   status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  // }
  if (winner) {
    status = 'Winner: ' + winner + ' (computer)';
  }
  else {
    status = 'No winner yet';
  }
  return (
    <><div className='text-bold text-lg text-center mt-3'>Status</div>
      <div className="status mb-2 underline underline-offset-4 text-center">{status}</div>
      <div className="grid grid-cols-3 gap-1 m-5">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xIsNext, setXIsNext] = useState(true); // Initialize with true for user's first move

  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext); // Toggle turns after a move
  }

  function findBestMove(squares) {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        let score = minimax(squares, 0, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }

  function minimax(squares, depth, isMaximizing) {
    const winner = calculateWinner(squares);
    if (winner === 'X') {
      return -10 + depth;
    }
    if (winner === 'O') {
      return 10 - depth;
    }
    if (squares.indexOf(null) === -1) {
      return 0;
    }

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          maxScore = Math.max(maxScore, minimax(squares, depth + 1, false));
          squares[i] = null;
        }
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          minScore = Math.min(minScore, minimax(squares, depth + 1, true));
          squares[i] = null;
        }
      }
      return minScore;
    }
  }

  function handleComputerMove() {
    if (!xIsNext) {
      const bestMove = findBestMove(currentSquares.slice());
      const nextSquares = currentSquares.slice();
      nextSquares[bestMove] = 'O';
      handlePlay(nextSquares);
    }
  }

  useEffect(() => {
    if (!xIsNext) {
      handleComputerMove();
    }
  }, [xIsNext, currentSquares]);

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button className="border border-black rounded-sm m-1 px-2 hover:bg-white" onClick={() => setCurrentMove(move)}>{description}</button>
      </li>
    );
  });

  return (
    // <div className='flex flex-row border border-green-500 h-screen w-screen justify-center'>
    <div className="game flex flex-col border-4 border-black h-screen w-screen justify-center items-center gap-6 bg-slate-200 md:flex-row flex-col-reverse">
      <div className="game-board border rounded-md border-black w-40 ">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info border rounded-md border-black h-100 pt-1 px-2">
        <p className='font-bold text-center'>History</p>
        <ol>{moves}</ol>
      </div>
    </div>
    // </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
