'use strict';

const Player = (id,name,symbol,color,imgSrc)=>{

    const getId= ()=> id;                //WRONG because I can still edit it from outside the scoop
    const getName = () => name;
    const getSymbol = () =>symbol;
    const getColor = () =>color;
    const getImgSrc = () =>imgSrc;

    
    return {getId , getName, getSymbol,getColor,getImgSrc}
};


const play = (function(){

    let players = [];
    const player1 = Player(1,'player1','x','red',"images/x-mark-1.svg");
    const player2 = Player(2,'player2','o','blue',"images/circle-2.svg");
    players = [player1, player2]

    let playersTurn = players[0];

    function changePlayerTurn(){

        const oldPlayerIndex = players.indexOf(playersTurn)
        if (oldPlayerIndex < (players.length-1)) playersTurn = players[oldPlayerIndex + 1] ;
        else playersTurn = players[0]

    }

    //-------------
    function gameResult(gameBoard , isGmaeBoardFull){

        if (checkRowColDia(gameBoard)){
            // boardTable.removeEventListener('click', updatGameBoardArray);
            console.log('win: ',playersTurn.getName()); 
            return true;
        }else if(isGmaeBoardFull){
            console.log('draw'); 
            return true;
        }



        
        function checkRowColDia(gameBoard){
                

            for (let r = 0; r < gameBoard.length; r++) {
                for (let c = 1; c < gameBoard.length; c++) {
                    // console.log('[',0 ,',',c-1 , '] =',gameBoard[0][c-1],'\n'  ,'[',0 ,',',c , '] =',gameBoard[0][c]);
        
                    if(gameBoard[r][c-1] === 0  || !(gameBoard[r][c] === gameBoard[r][c-1]) )break ;
                    else if (c === gameBoard.length-1 ) {
                        return playersTurn;
                    }
        
                }
            }
            for (let c = 0; c < gameBoard.length; c++) {
                for (let r = 1; r < gameBoard.length; r++) {
                    // console.log('[',0 ,',',c-1 , '] =',gameBoard[0][c-1],'\n'  ,'[',0 ,',',c , '] =',gameBoard[0][c]);
        
                    if(gameBoard[r-1][c] === 0  || !(gameBoard[r][c] === gameBoard[r-1][c]) )break ;
                    else if (r === gameBoard.length-1 ) {
                        return playersTurn;
                    }
        
                }
            }

            for (let rc = 1; rc < gameBoard.length; rc++) {
                if(gameBoard[rc-1][rc-1] === 0  || !(gameBoard[rc][rc] === gameBoard[rc-1][rc-1]) )break ;
                else if (rc === gameBoard.length-1 ) {
                    return playersTurn;
                }
                
            }
            for (let c = 1; c < gameBoard.length; c++) {
                if(gameBoard[gameBoard.length-c][c-1] === 0  || !(gameBoard[gameBoard.length-1-c][c] === gameBoard[gameBoard.length-c][c-1]) )break ;
                else if (c === gameBoard.length-1 ) {
                    return playersTurn;

                }
                
            }

        }
        
    }



    const getPlayersTurn= ()=>{ return playersTurn};



    return {
        getPlayersTurn,
        changePlayerTurn,
        gameResult
    }

})();


//=====================================================================================================
const gameBoard = (function (){
    'use strict';

    let gameBoard = [];
    const status = {     
        isGmaeBoardFull : false,
        numberOfSpaceTaken :0,
        resit: function(){
            this.isGmaeBoardFull = false;
            this.numberOfSpaceTaken = 0;
        }
    }
    let boardDim = 3;
    document.documentElement.style.setProperty('--dim', boardDim)

    //initilize
    initiateGirdToZero();


    // catch dom
    const boardTable = document.querySelector(".table");
    const restButton = document.querySelector(".button");
    const slider = document.getElementById("myRange");
    slider.value=boardDim;

    //bind event
    boardTable.addEventListener('click', updatGameBoardArray);
    restButton.addEventListener('click', resetGameBoard); 
    slider.addEventListener('input', getSlider); 


    //render
    doForAllGridElements(addDivForEachGridElement);
    function updateGameBoardUI(clickedDiv){
        // clickedDiv.textContent = play.getPlayersTurn().getSymbol();
        // clickedDiv.style.backgroundColor = play.getPlayersTurn().getColor();
        addImage(clickedDiv);
        addToNumberOfSpaceTaken();
        if(play.gameResult(gameBoard , status.isGmaeBoardFull)) {
            boardTable.removeEventListener('click', updatGameBoardArray);
        };
        play.changePlayerTurn();
    }
    function resetGameBoard(){
    
        gameBoard =[]
        document.documentElement.style.setProperty('--dim', boardDim)
        initiateGirdToZero();
        boardTable.replaceChildren();
        doForAllGridElements(addDivForEachGridElement);
        boardTable.removeEventListener('click', updatGameBoardArray);
        boardTable.addEventListener('click', updatGameBoardArray);
        status.resit();
        
    }

    //--------------
    function updatGameBoardArray(e){
        const clickedDiv = e.target;
        if (clickedDiv.parentElement === boardTable){

            const clickedDivID = clickedDiv.getAttribute("id");
            const [r,c] = getRCFromID(clickedDivID);
            if (gameBoard[r][c] === 0)  {
                gameBoard[r][c] = play.getPlayersTurn().getId();
                updateGameBoardUI(clickedDiv);

            }


        } 
    }

    function initiateGirdToZero(){

        for(let r=0; r < boardDim; r++){
            gameBoard[r] = [];
            for(let c= 0; c < boardDim; c++){
                gameBoard[r][c] = 0;
            }
        }
    }

    function doForAllGridElements(fn){

        for(let r=0; r < boardDim; r++){
            for(let c= 0; c < boardDim; c++){
                fn(r,c);
            }
        }


    }

    function addDivForEachGridElement(r,c){

        const div=document.createElement('div');
        div.setAttribute("id", `r${r}-c${c}`);
        boardTable.appendChild(div);

    }

    function getRCFromID(id){

    const r = Number(id.substring(id.indexOf("r")+1, id.indexOf("-"))) ;
    const c = Number(id.substring(id.indexOf("c")+1, id.lenght) );
    return [r,c]

    }

    function addToNumberOfSpaceTaken(){
        
        if (status.numberOfSpaceTaken < (boardDim*boardDim) ) {  //first if statment not nedded
            status.numberOfSpaceTaken ++;
            if (status.numberOfSpaceTaken == (boardDim*boardDim) )status.isGmaeBoardFull = true;
        }

    }

    // function gameResult(){

    //     if (checkRowColDia()){
    //         boardTable.removeEventListener('click', updatGameBoardArray);
    //         console.log('win: ',play.getPlayersTurn().getName()); 
    //     }else if(status.isGmaeBoardFull){
    //         console.log('draw'); 
    //     }
    // }

    // function checkRowColDia(){
            

    //     for (let r = 0; r < gameBoard.length; r++) {
    //         for (let c = 1; c < gameBoard.length; c++) {
    //             // console.log('[',0 ,',',c-1 , '] =',gameBoard[0][c-1],'\n'  ,'[',0 ,',',c , '] =',gameBoard[0][c]);
    
    //             if(gameBoard[r][c-1] === 0  || !(gameBoard[r][c] === gameBoard[r][c-1]) )break ;
    //             else if (c === gameBoard.length-1 ) {
    //                 return play.getPlayersTurn();
    //             }
      
    //         }
    //     }
    //     for (let c = 0; c < gameBoard.length; c++) {
    //         for (let r = 1; r < gameBoard.length; r++) {
    //             // console.log('[',0 ,',',c-1 , '] =',gameBoard[0][c-1],'\n'  ,'[',0 ,',',c , '] =',gameBoard[0][c]);
    
    //             if(gameBoard[r-1][c] === 0  || !(gameBoard[r][c] === gameBoard[r-1][c]) )break ;
    //             else if (r === gameBoard.length-1 ) {
    //                 return play.getPlayersTurn();
    //             }
      
    //         }
    //     }

    //     for (let rc = 1; rc < gameBoard.length; rc++) {
    //         if(gameBoard[rc-1][rc-1] === 0  || !(gameBoard[rc][rc] === gameBoard[rc-1][rc-1]) )break ;
    //         else if (rc === gameBoard.length-1 ) {
    //             return play.getPlayersTurn();
    //         }
            
    //     }
    //     for (let c = 1; c < gameBoard.length; c++) {
    //         if(gameBoard[gameBoard.length-c][c-1] === 0  || !(gameBoard[gameBoard.length-1-c][c] === gameBoard[gameBoard.length-c][c-1]) )break ;
    //         else if (c === gameBoard.length-1 ) {
    //             return play.getPlayersTurn();

    //         }
            
    //     }

    // }

    
    function getSlider() {
        console.log( this.value);
        boardDim= this.value;
        resetGameBoard();

    } 

    function addImage(clickedDiv){
        const img = document.createElement("img");
        img.setAttribute("src", play.getPlayersTurn().getImgSrc());
        clickedDiv.appendChild(img);

    }


    const getGmaeBoard = ()=>console.table(gameBoard);
    const getStatus = () => console.table(status);
    
    return{
        getGmaeBoard,
        getStatus
    }


})();



// let div = document.querySelector("div");
// div.textContent


