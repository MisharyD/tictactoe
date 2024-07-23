
//handles creation of the board and cells
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


//this module will handle the game flow and check for winners
function Game(name1, name2)
{
    board = GameBoard().getBoard();

    let players ={
        player1:{
            name:name1,
            token: 1
        },
        player2:{
            name:name2,
            token: 2
        }
    }

    let activePlayer = Math.random() < 0.5 ? 'player1' : 'player2';

    const getActivePlayer = () => activePlayer

    const switchPlayerTurns = function () {
        activePlayer = activePlayer == 'player1' ? 'player2' : 'player1';
    }

    const playRound = function (cellIndex) 
    {
        const [row, col] = cellIndex;
        board[row][col].setValue(players[activePlayer].token)
    }

    //returns true if game ended otherwise returns false
    const checkGameState = function()
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
    
    //this function should only be used after checkGameState. returns true if there is winner otherwise false (tie)
    const checkWinner = function() 
    {
        //horizental wins
        for(let i =0; i<3; i++)
            if( (board[i][0].getValue() == board[i][1].getValue() && board[i][1].getValue()  == board[i][2].getValue()) && board[i][0].getValue() != undefined)
                return true
            
        //vertical wins
        for(let i =0; i<3; i++)
            if( (board[0][i].getValue() == board[1][i].getValue() && board[1][i].getValue() == board[2][i].getValue()) 
                && board[0][i].getValue() != undefined)
                return true

        //diagonal wins
        if( ((board[0][0].getValue() == board[1][1].getValue() && board[1][1].getValue()  == board[2][2].getValue())  
            || (board[0][2].getValue() == board[1][1].getValue() && board[1][1].getValue() == board[2][0].getValue())) 
            && board[1][1].getValue() != undefined )
            return true
        
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


    return { checkWinner, switchPlayerTurns, getActivePlayer, checkGameState, playRound, getLegalMoves }

}

function play()
{
    let game = Game("1", "2")
    // let exists = moves.some(subArray => subArray.every((value, index) => value === move[index]))

}

play()


