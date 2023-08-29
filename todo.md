```
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} /> 
        
```
isWinning={winningSquares.includes(1)}
isWinning={winningSquares.includes(2)}
isWinning={winningSquares.includes(3)}
isWinning={winningSquares.includes(4)}
isWinning={winningSquares.includes(5)}
isWinning={winningSquares.includes(6)}
isWinning={winningSquares.includes(7)}
isWinning={winningSquares.includes(8)}
isWinning={winningSquares.includes(9)}

<Square value={squares[0]} onSquareClick={() => handleClick(0)} isWinning={winningSquares.includes(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isWinning={winningSquares.includes(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isWinning={winningSquares.includes(2)}/>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isWinning={winningSquares.includes(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isWinning={winningSquares.includes(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isWinning={winningSquares.includes(5)}/>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isWinning={winningSquares.includes(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isWinning={winningSquares.includes(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isWinning={winningSquares.includes(8)}/>

