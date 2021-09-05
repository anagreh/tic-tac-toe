'use strict';

const PlayerFactories = (id,name,symbol,color,imgSrc)=>{

    const getId= ()=> id;                //WRONG because I can still edit it from outside the scoop
    const getName = () => name;
    const getSymbol = () =>symbol;
    const getColor = () =>color;
    const getImgSrc = () =>imgSrc;

    
    return {getId , getName, getSymbol,getColor,getImgSrc}
};


const Players = (function (){

    let players = [];
    


    //initialize
    const player1 = PlayerFactories(1,'player1','x','red',"images/x-mark-1.svg");
    const player2 = PlayerFactories(2,'player2','o','blue',"images/circle-2.svg");
    players = [player1, player2]
    
    
    
    //catch DOM 
    const playersDom = document.getElementById('players');
    const addPlayerForm = playersDom.querySelector('#add-player')
    const playerName = addPlayerForm.querySelector('#player-name')
    const playerSubmitButton = addPlayerForm.querySelector('#player-submit-button')
    const output = playersDom.querySelector('#output')
    


    //bind event
    addPlayerForm.addEventListener('submit',e => addPlayer(e));


    //render
    players.forEach(player => {
        const div= document.createElement('div');
        div.textContent = player.getName() +' : '+ player.getSymbol();
        output.appendChild(div);
    });

    //---------------------------------
    function addPlayer(e){

        e.preventDefault();

        

    }
        


})();


const play = (function(){

    let players = [];

    const player1 = PlayerFactories(1,'player1','x','red',"images/x-mark-1.svg");
    const player2 = PlayerFactories(2,'player2','o','blue',"images/circle-2.svg");
    players = [player1, player2]

    let playersTurn = players[0];
    
    //event----------------------------
    events.on('turnEnd', changePlayerTurn)
    



    //---------------------------------
    function changePlayerTurn(){

        const oldPlayerIndex = players.indexOf(playersTurn)
        if (oldPlayerIndex < (players.length-1)) playersTurn = players[oldPlayerIndex + 1] ;
        else playersTurn = players[0]

    }


    const getPlayersTurn= ()=>{ return playersTurn};



    return {
        getPlayersTurn,
        changePlayerTurn
    }

})();





//=================================================================================================
const gameBoard = (function (){
    'use strict';

    let gameBoard = [];
    let boardDim;

    const status = {     
        isGameBoardFull : false,
        numberOfSpaceTaken :0,
        resit: function(){
            this.isGameBoardFull = false;
            this.numberOfSpaceTaken = 0;
        }
    }
    

    //initialize------------------------
    boardDim = 3;
    initiateGridToZero();


    // catch dom-----------------------
    const boardTable = document.querySelector(".table");
    const restButton = document.querySelector(".button");


    //bind event------------------------
    boardTable.addEventListener('click', updateGameBoardArray);
    restButton.addEventListener('click', resetGameBoard); 
    events.on('sliderChanged', updateBoardDim)
    events.on('gameEnded', whenGameEnd )
    

    //render-----------------------------
    document.documentElement.style.setProperty('--dim', boardDim)
    doForAllGridElements(addDivForEachGridElement);
    function updateGameBoardUI(clickedDiv){

        addImage(clickedDiv);
        UpdateNumberOfSpaceTaken();
        resultCheck();
        events.emit('turnEnd')
    }

    //reset--------------------------------
    function resetGameBoard(){
    
        gameBoard =[]
        document.documentElement.style.setProperty('--dim', boardDim)
        initiateGridToZero();
        boardTable.replaceChildren();
        doForAllGridElements(addDivForEachGridElement);
        boardTable.removeEventListener('click', updateGameBoardArray);
        boardTable.addEventListener('click', updateGameBoardArray);
        status.resit();
        
    }



    //--------------------------------------
    function updateGameBoardArray(e){
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

    function initiateGridToZero(){

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
        const c = Number(id.substring(id.indexOf("c")+1) );
        return [r,c]

    }
    
    function UpdateNumberOfSpaceTaken(){
        
        if (status.numberOfSpaceTaken < (boardDim*boardDim) ) {  
            status.numberOfSpaceTaken ++;
            if (status.numberOfSpaceTaken == (boardDim*boardDim) )status.isGameBoardFull = true;
        }

    }

    function updateBoardDim(slider) {
        boardDim= slider.value;
        resetGameBoard();
    } 

    function resultCheck(){

        const isThereWinner = Boolean( checkRowColDia() );

        if (isThereWinner || status.isGameBoardFull) {
            let result;
            
            if (isThereWinner){
                console.log('win: ',play.getPlayersTurn().getName()); 
                result = play.getPlayersTurn().getName();
                events.emit('winGame' , play.getPlayersTurn())
                
            }else if(status.isGameBoardFull){
                console.log('draw');
                result = 'draw'
                events.emit('draw')
                
            }
            events.emit('gameEnded' , result)
        }


        
        function checkRowColDia(){
                

            for (let r = 0; r < gameBoard.length; r++) {
                for (let c = 1; c < gameBoard.length; c++) {
                    // console.log('[',0 ,',',c-1 , '] =',gameBoard[0][c-1],'\n'  ,'[',0 ,',',c , '] =',gameBoard[0][c]);
        
                    if(gameBoard[r][c-1] === 0  || !(gameBoard[r][c] === gameBoard[r][c-1]) )break ;
                    else if (c === gameBoard.length-1 ) {
                        return play.getPlayersTurn().getName();
                    }
        
                }
            }
            for (let c = 0; c < gameBoard.length; c++) {
                for (let r = 1; r < gameBoard.length; r++) {
                    // console.log('[',0 ,',',c-1 , '] =',gameBoard[0][c-1],'\n'  ,'[',0 ,',',c , '] =',gameBoard[0][c]);
        
                    if(gameBoard[r-1][c] === 0  || !(gameBoard[r][c] === gameBoard[r-1][c]) )break ;
                    else if (r === gameBoard.length-1 ) {
                        return play.getPlayersTurn().getName();
                    }
        
                }
            }

            for (let rc = 1; rc < gameBoard.length; rc++) {
                if(gameBoard[rc-1][rc-1] === 0  || !(gameBoard[rc][rc] === gameBoard[rc-1][rc-1]) )break ;
                else if (rc === gameBoard.length-1 ) {
                    return play.getPlayersTurn().getName();
                }
                
            }
            for (let c = 1; c < gameBoard.length; c++) {
                if(gameBoard[gameBoard.length-c][c-1] === 0  || !(gameBoard[gameBoard.length-1-c][c] === gameBoard[gameBoard.length-c][c-1]) )break ;
                else if (c === gameBoard.length-1 ) {
                    return play.getPlayersTurn().getName();

                }
                
            }

        }
        
    }

    function addImage(clickedDiv){
        const img = document.createElement("img");
        img.setAttribute("src", play.getPlayersTurn().getImgSrc());
        clickedDiv.appendChild(img);

    }

    function whenGameEnd(result){
        boardTable.removeEventListener('click', updateGameBoardArray)

        const template = document.createElement('div')
        template.classList.add("result-container")
        template.textContent = (result ==='draw' ? 'DRAW' : "winner : " + result);
        boardTable.appendChild(template);

    }


    // const getGameBoard = ()=>console.table(gameBoard);
    // const getStatus = () => console.table(status);


    // return{
    //     getGameBoard,
    //     getStatus
    // }


})();



//slider===========================================================================================
(function(){

    // catch DOM
    const slider = document.getElementById("myRange");

    //initialize
    slider.value=3;

    //event
    slider.addEventListener('input', () => events.emit('sliderChanged' , slider) ); 


})();








