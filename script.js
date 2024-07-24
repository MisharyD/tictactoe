
function GameBoard()
{

    function Cell()
    {
        let value;
        const setValue = (val) => {
            value = val};

        const getValue = () => value
        
        return { setValue, getValue }
    }

    //init board
    let board = [];
    for(let i =0; i<3; i++)
        {
            board[i] = []
            for(let j =0; j<3; j++)
                {
                    board[i][j] = Cell()
                }
        }

    const getBoard = () => board;

    return { getBoard }
}



function Game(name1, name2)
{
    let board = GameBoard().getBoard();
    
    let activePlayer = name1
        
    let players ={
        [name1]:{token: 1},
        [name2]:{token: 2}
    }
    const getActivePlayer = () => activePlayer

    const switchPlayerTurns = function () {
        activePlayer = activePlayer === name1 ? name2 : name1;   
    }

    const playRound = function (cellIndex) 
    {
        const [row, col] = cellIndex;
        board[row][col].setValue(players[activePlayer].token)
    }

    //returns true if game ended otherwise returns false
    const terminated = function()
    {
        for(let i =0; i< 3; i++)
            {
                for(let j =0; j< 3; j++)
                    {
                        if(board[i][j].getValue() == undefined)
                            return false
                    }
            }
        
        return true;
    }
    
    //this function should only be used after checkGameState. if someone won, return the name. otherwise, return false
    const winner = function() 
    {
        //horizental wins
        for(let i =0; i<3; i++)
            if( (board[i][0].getValue() == board[i][1].getValue() && board[i][1].getValue()  == board[i][2].getValue()) && board[i][0].getValue() != undefined)
                return players[name1].token == board[i][0].getValue() ? name1 : name2
            
        //vertical wins
        for(let i =0; i<3; i++)
            if( (board[0][i].getValue() == board[1][i].getValue() && board[1][i].getValue() == board[2][i].getValue()) 
                && board[0][i].getValue() != undefined)
                return players[name1].token == board[0][i].getValue() ? name1 : name2

        //diagonal wins
        if( ((board[0][0].getValue() == board[1][1].getValue() && board[1][1].getValue()  == board[2][2].getValue())  
            || (board[0][2].getValue() == board[1][1].getValue() && board[1][1].getValue() == board[2][0].getValue())) 
            && board[1][1].getValue() != undefined )
            return players[name1].token == board[1][1].getValue() ? name1 : name2
        
        return false
        
    }

    //returns the empty cells
    const getLegalMoves = function ()
    {
        moves = []
        for(let i =0; i< 3; i++)
            {
                for(let j =0; j< 3; j++)
                    {
                        if(board[i][j].getValue() == undefined)
                            moves.push([i,j])
                    }
            }
        return moves;
    }

    const getBoard = () => board

    const getPlayerToken = (name) => players[name].token

    return { winner, switchPlayerTurns, getActivePlayer, terminated, playRound, getLegalMoves, getBoard, getPlayerToken }

}

//this module handles interaction with the DOM
function play()
{
    //get dom elements
    let game;
    let startButton = document.querySelector(".start")
    let resetButton = document.querySelector(".reset")
    let form = document.querySelector(".form")
    let domBoard = document.querySelector(".board")
    let playerTurnContainer = document.querySelector(".turn")
    let playingContainer = document.querySelector(".playingContainer")
    
    const enableStartButton = (e) =>
    {
        let inputElements = form.querySelectorAll("input[type ='text']")
        let disabled = false; 
        inputElements.forEach(elm => 
            {
                if(elm.value == "")
                    disabled = true;
            }) 
        
        startButton.disabled = disabled
    }

    //init the game,display playingcontainer and add eventlisters to cell divs. then calls the update function
    const init = (e) => 
        {
            //init game
            let name1 = form.elements["name1"].value
            let name2 = form.elements["name2"].value

            if(name1 == "" || name2 == "")
                return

            domBoard.textContent = ""
            game = Game(name1, name2)

            //display playing container and add generate cell divs
            form.style.display = "none"
            playingContainer.style.display = "grid"
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let cell = document.createElement("div");
                    cell.classList.add("cell", "cell-hover")
                    cell.addEventListener("click", clickHandler)
                    cell.id = i + "-" + j;
                    domBoard.appendChild(cell);
                }
            }
            
            update()
        }

    //used when game ends to remove click listeners for cells
    const removeListeners = () => 
        {
            let domCells = Array.from(domBoard.querySelectorAll(".cell"))
            domCells.forEach(cell => {
                cell.removeEventListener("click", clickHandler)
                cell.classList.remove("cell-hover")
            })
        }


    //update dom board, player turn, checks if game ends, if so, displays the reset button.
    const update =() => {
        let gameBoard = game.getBoard();

        //update domcells with new input
        for(let i =0; i<3; i++)
            {
                for(let j =0; j<3; j++)
                    {
                        if(gameBoard[i][j].getValue() != undefined)
                            {
                                domBoard.querySelector(`[id='${i}-${j}']`).textContent = gameBoard[i][j].getValue() == 1 ? "x" : "o"
                            }
                    }
            }
        
        //check if game ends
        let winner = game.winner()
        if(winner)
            {
                playerTurnContainer.textContent = winner +" Won!"
                removeListeners()
            }
        else if(!game.winner() && game.terminated())
            {
                playerTurnContainer.textContent = "Draw!" 
                removeListeners()
            }
        else
        {
            //update player turn
            playerTurnContainer.textContent = game.getActivePlayer() + " turn:"
        }
        
    } 

    //checks if click is valid, if it is valid it plays a round then calls update. removes pointer from cell divs
    const clickHandler = function(e) 
    {
        cell = e.target;
        //check if move is valid
        move = cell.getAttribute("id").split("-").map(num => parseInt(num, 10));
        cell.classList.remove("cell-hover")//remove pointer cursor from cell
        let validMoves = game.getLegalMoves()
        let exists = validMoves.some(subArray => subArray.every((value, index) => value === move[index]))
        if(!exists)
            return;

        //play move and update turns
        game.playRound(move);
        game.switchPlayerTurns()

        update() 
    }

    //add event listners to start button,reset button, and input elements
    startButton.addEventListener("click", init)
    resetButton.addEventListener("click", init)
    let inputElements = Array.from(form.querySelectorAll("input[type ='text']"))
    inputElements.forEach(elm => elm.addEventListener("keyup",enableStartButton));

}

play();


