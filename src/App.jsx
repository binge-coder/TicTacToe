import { useState, useEffect } from 'react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { VscDebugRestart } from "react-icons/vsc";
import { IconContext } from "react-icons";

function Square({ value, onSquareClick, winningSquareBool }) {
  return (
    <button className={`square border border-black text-lg font-bold h-12 w-12 p-0 text-center hover:border-4 active:bg-slate-500  dark:border-white shadow-lg ${winningSquareBool?'bg-green-500':'bg-[#b8c1ec] dark:bg-slate-800'}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, handleRestart }) {
  const [gameStatus, setGameStatus] = useState('No winner yet');
  const [winningSquares, setWinningSquares] = useState([]);
  function handleClick(i) {
    if (calculateWinner(squares).winner || squares[i]) {
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

  const result = calculateWinner(squares);
  const {winner, winningCombination} = result;
  // let gameStatus;
  useEffect(() => {
    if (winner) {
      setGameStatus('Winner: ' + winner + ' (computer)');
      setWinningSquares(winningCombination);
    } else {
      setGameStatus('No winner yet');
    }
  }, [squares]);
  let sqRange = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <>
      <div className='font-bold text-center mt-2'>Play Here</div>
      <div className="grid grid-cols-3 gap-1 mx-5 my-2">
        {sqRange.map((index) => (
          <Square 
          key={index} 
          value={squares[index]} 
          onSquareClick={() => handleClick(index)}
          winningSquareBool={winningSquares.includes(index)}
          />
        ))}
      </div>
      <div className="mb-2 underline underline-offset-4 text-center">{gameStatus}</div>
      <button onClick={handleRestart} className='flex flex-row justify-center border-2 border-slate-500 hover:bg-slate-400 w-full gap-1 p-1'>Restart
        <IconContext.Provider value={{ size: 23 }}>
          <VscDebugRestart></VscDebugRestart>
        </IconContext.Provider>
      </button>
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
    let bestMove = null;
    let squaresCopy = [...squares];
    for (let i = 0; i < squaresCopy.length; i++) {
      if (squaresCopy[i] === null) {
        squaresCopy[i] = 'O';
        let score = minimax(squaresCopy, 0, -Infinity, Infinity, false);
        squaresCopy[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }


  function minimax(squares, depth, alpha, beta, isMaximizing) {
    const winner = calculateWinner(squares);
    if (winner.winner === 'X') {
      return -10 + depth;
    } else if (winner.winner === 'O') {
      return 10 - depth;
    } else if (winner.winner === null && winner.winningCombination.length === 0) {
      return 0; // Return score for draw
    }
    // if (squares.indexOf(null) === -1) {
    //   return 0;
    // }
    const squaresCopy = squares.slice();
    if (isMaximizing) {
      let maxScore = -Infinity;

      for (let i = 0; i < squares.length; i++) {
        if (squaresCopy[i] === null) {
          squaresCopy[i] = 'O';
          const score = minimax(squaresCopy, depth + 1, alpha, beta, false);
          squaresCopy[i] = null;
          maxScore = Math.max(maxScore, score);
          alpha = Math.max(alpha, score);
          if (beta <= alpha) {
            break;
          }
        }
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squaresCopy[i] === null) {
          squaresCopy[i] = 'X';
          const score = minimax(squaresCopy, depth + 1, alpha, beta, true);
          squaresCopy[i] = null;
          minScore = Math.min(minScore, score);
          beta = Math.min(beta, score);
          if (beta <= alpha) {
            break;
          }
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
        <button className="border border-black bg-[#b8c1ec] text-[#232946]  dark:hover:bg-slate-400 rounded-sm m-1 px-2 hover:bg-slate-400 shadow-lg dark:bg-transparent dark:text-white dark:border-slate-400 " onClick={() => setCurrentMove(move)}>{description}</button>
      </li>
    );
  });

  const [darkmode, setDarkmode] = useState(true);
  function toggleDarkMode() {
    setDarkmode(prevDarkMode => !prevDarkMode)
  }

  const restartGame = () => {
    setCurrentMove(0);

  };

  return (
    // <div className='flex flex-col h-screen border-2 border-green-500'>
    <div className={`flex flex-col min-h-screen ${darkmode ? 'dark' : ''} bg-slate-400`}>

      <Navbar darkmode={darkmode} toggleDarkMode={toggleDarkMode} />
      <div className="bg-slate-300 flex flex-1 flex-col justify-evenly items-center gap-6 md:flex-row dark:bg-slate-800">
        <div className="border-2 rounded-md w-50 mt-6 shadow-2xl border-black dark:border-slate-600">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} handleRestart={restartGame} />
        </div>
        <div className=" border-2 rounded-md shadow-2xl border-black dark:border-slate-600 h-100 pt-1 px-2 m-3">
          {/* game-history */}
          <p className='font-bold text-center'>History</p>
          <ol>{moves}</ol>
        </div>
      </div>
      <Footer></Footer>
    </div>

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
      return {winner: squares[a], winningCombination: [a, b, c]};
    }
  }
  return {winner: null, winningCombination: []};
}
