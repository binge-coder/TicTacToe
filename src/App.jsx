import { useState, useEffect } from 'react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { VscDebugRestart } from "react-icons/vsc";
import { IconContext } from "react-icons";

function Square({ value, onSquareClick, winningSquareBool, index }) {
  const t = index === 1; // Top
  const l = index === 3; // Left
  const isCenter = index === 4; // Center
  const r = index === 5; // Right
  const b = index === 7; // Bottom

  const borderClass = `
  ${t ? 'border-l-4 border-r-4 ' : ''} 
  ${l ? 'border-t-4 border-b-4' : ''} 
  ${isCenter ? 'border-4' : ''} 
  ${r ? 'border-t-4 border-b-4' : ''} 
  ${b ? 'border-l-4 border-r-4' : ''}`;


  return (
    <button className={`h-24 text-3xl font-bold text-center hover:border-4 hover:border-black active:bg-slate-500 dark:border-white shadow-lg dark:shadow-none ${winningSquareBool?'bg-green-500':'bg-[#b8c1ec] dark:bg-slate-800'} ${borderClass}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}


function Board({ xIsNext, squares, onPlay, handleRestart }) {
  const [gameStatus, setGameStatus] = useState('');
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
  useEffect(() => {
    if (winner) {
      setGameStatus('Winner: computer');
      setWinningSquares(winningCombination);
    }
    else if(!squares.includes(null)) {
// all squares are filled and no winner so draw
      setGameStatus('Draw!');
    } 
    else {
      setGameStatus('');
      setWinningSquares([]);
    }
  }, [squares]);
  let sqRange = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <>
      <div className='font-bold text-xl text-center mt-2'>Play Here</div>
      <p className='mx-2 border-2 text-center border-black dark:border-white' >Your mark &rarr; <strong>X</strong>, Computer's mark &rarr; <strong>O</strong></p>
      {/* <div className="grid grid-cols-3 gap-1 mx-5 my-2"> */}
      <div className="grid grid-cols-3 m-6">

        {sqRange.map((index) => (
          <Square 
          key={index} 
          value={squares[index]} 
          onSquareClick={() => handleClick(index)}
          winningSquareBool={winningSquares.includes(index)}
          index={index}
          />
        ))}
      </div>
      <div className="mb-2 underline underline-offset-4 text-center ">{gameStatus}</div>
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
  const [xIsNext, setXIsNext] = useState(true);

  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function findBestMove(squares) {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        let score = minimax(squares, 0, -Infinity, Infinity, false);
        squares[i] = null;
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
    }
    if (squares.indexOf(null) === -1) {
      return 0;
    }
    if (isMaximizing) {
      let maxScore = -Infinity;

      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          const score = minimax(squares, depth + 1, alpha, beta, false);
          squares[i] = null;
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
        if (squares[i] === null) {
          squares[i] = 'X';
          const score = minimax(squares, depth + 1, alpha, beta, true);
          squares[i] = null;
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
      const currentSquaresCopy = [...currentSquares]
      const bestMove = findBestMove(currentSquaresCopy);
      currentSquaresCopy[bestMove] = 'O';
      handlePlay(currentSquaresCopy); // these are basically the squares that are the latest version
    }
  }

  useEffect(() => {
    if (!xIsNext) {
      handleComputerMove();
    }
  }, [xIsNext, currentSquares]);

  // const moves = history.map((squares, move) => {
  //   let description;
  //   if (move > 0) {
  //     description = 'Go to move #' + move;
  //   } else {
  //     description = 'Go to game start';
  //   }
    // return (
    //   <li key={move}>
    //     <button className="border border-black bg-[#b8c1ec] text-[#232946]  dark:hover:bg-slate-400 rounded-sm m-1 px-2 hover:bg-slate-400 shadow-lg dark:bg-transparent dark:text-white dark:border-slate-400 " onClick={() => setCurrentMove(move)}>{description}</button>
    //   </li>
    // );
  // });

  const [darkmode, setDarkmode] = useState(true);
  function toggleDarkMode() {
    setDarkmode(prevDarkMode => !prevDarkMode)
  }

  const restartGame = () => {
    setCurrentMove(0);
    // setHistory([Array(9).fill(null)]);
  };


  return (
    <div className={`flex flex-col min-h-screen ${darkmode ? 'dark' : ''} bg-slate-400`}>

      <Navbar darkmode={darkmode} toggleDarkMode={toggleDarkMode} />
      <div className="bg-slate-300 flex flex-1 flex-col justify-evenly items-center gap-6 md:flex-row dark:bg-slate-800">
        <div className="border-2 rounded-md w-96 mt-6 shadow-2xl border-black dark:border-slate-600">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} handleRestart={restartGame} />
        </div>
        {/* <div className=" border-2 rounded-md shadow-2xl border-black dark:border-slate-600 h-100 pt-1 px-2 m-3">
          <p className='font-bold text-center'>History</p>
          <ol>{moves}</ol>
        </div> */}
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
