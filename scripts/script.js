'use strict';

//=================================================================================================
const PlayerFactories = (name,symbol)=>{
    let id = 0
    let imgSrc='';
    PlayerFactories.idList = PlayerFactories.idList || [];
    PlayerFactories.imgSrcList= [
        {symbol: 'x', url: 'images/x-mark-1.svg'},
        {symbol: 'o', url: 'images/circle-2.svg'},
        {symbol: 'z', url: 'images/LetterZ.svg'},
        {symbol: 'I', url: 'images/LetterI.svg'}
        
    ];
    PlayerFactories.imgSrcTaken = PlayerFactories.imgSrcTaken || [];


    //set id ------
    for(let i = 1; i <=PlayerFactories.idList.length + 1; i++){

        if(!(PlayerFactories.idList.some(id => id===i) )) {
            id= i ;
            PlayerFactories.idList.push(i);
            break;
        }

    }

    //set imgSrc-------
    for (let i = 0; i < PlayerFactories.imgSrcList.length; i++) {

        if(!(PlayerFactories.imgSrcTaken.indexOf(PlayerFactories.imgSrcList[i].symbol) !== -1)){
            PlayerFactories.imgSrcTaken.push(PlayerFactories.imgSrcList[i].symbol);
            imgSrc = PlayerFactories.imgSrcList[i].url;
            symbol = PlayerFactories.imgSrcList[i].symbol;
            break;
        }
        
    }


    return {
        get id(){return id}, 
        get name(){return name}, 
        get symbol(){return symbol}, 
        get imgSrc(){return imgSrc},
        
        set name(name){return name}, 
        set symbol(symbol){return symbol}, 
    }
};




//=================================================================================================
const players = (function (){

    let players = [];
    


    //initialize
    const player1 = PlayerFactories('player 1','x');
    const player2 = PlayerFactories('player 2','o');
    players = [player1, player2]
    let playersTurn = players[0];

    
    
    //catch DOM 
    const playersDom = document.getElementById('players');
    const addPlayerForm = playersDom.querySelector('#add-player')
    const playerName = addPlayerForm.querySelector('#player-name')
    const output = playersDom.querySelector('#output')
    

    //bind event
    addPlayerForm.addEventListener('submit', addPlayer);
    output.addEventListener('click', removePlayer)
    events.on('turnEnd', changePlayerTurn)
    
    //render
    render();
    function render(){
        output.replaceChildren();
        players.forEach(player => {

            const div= document.createElement('div');
            div.setAttribute('id', player.id)
            div.textContent = player.name +' : '+ player.symbol;
            output.appendChild(div);
            
            const delButtonNew = document.createElement('button');
            delButtonNew.classList.add('del-button')
            delButtonNew.textContent = "x"
            div.appendChild(delButtonNew);

        });


        
    }

    //reset
    function reset(){

    }

    
    //---------------------------------
    function addPlayer(e){
        e.preventDefault();

        const dim = gameBoard.boardDim;
        let maxPlayersNum= Math.floor((2*dim + 2)/4) <=4 ? Math.floor((2*dim + 2)/4) : 4;
        const newSymbol = '';

        if (players.length < maxPlayersNum){
            const newPlayer = PlayerFactories( playerName.value , newSymbol );
            players.push(newPlayer);
    
            render();
            playerName.value='';
            events.emit('playerAdded', players)

        }else console.log('the max player with dimension ' + dim+'*'+dim + ' is : ' + maxPlayersNum )

        
        
        
    }

    function removePlayer(e){
        if (players.length >2){
            if (e.target.classList.contains('del-button') ){
                const targetPlayerIndex = players.findIndex(player => player.id === Number( e.target.parentElement.id))
                players.splice(targetPlayerIndex,1);
                render();
                events.emit('playerRemoved' ,players)
            }
        }


    }

    function changePlayerTurn(){

        const oldPlayerIndex = players.indexOf(playersTurn)
        if (oldPlayerIndex < (players.length-1)) playersTurn = players[oldPlayerIndex + 1] ;
        else playersTurn = players[0]

    }


    const getPlayersTurn= ()=>{ return playersTurn};

    return  {
        getPlayersTurn,
        changePlayerTurn,
        get players(){return players}
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
                gameBoard[r][c] = players.getPlayersTurn().id;
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
                console.log('win: ',players.getPlayersTurn().name); 
                result = players.getPlayersTurn().name;
                events.emit('winGame' , players.getPlayersTurn())
                
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
                        return players.getPlayersTurn().name;
                    }
        
                }
            }
            for (let c = 0; c < gameBoard.length; c++) {
                for (let r = 1; r < gameBoard.length; r++) {
                    // console.log('[',0 ,',',c-1 , '] =',gameBoard[0][c-1],'\n'  ,'[',0 ,',',c , '] =',gameBoard[0][c]);
        
                    if(gameBoard[r-1][c] === 0  || !(gameBoard[r][c] === gameBoard[r-1][c]) )break ;
                    else if (r === gameBoard.length-1 ) {
                        return players.getPlayersTurn().name;
                    }
        
                }
            }

            for (let rc = 1; rc < gameBoard.length; rc++) {
                if(gameBoard[rc-1][rc-1] === 0  || !(gameBoard[rc][rc] === gameBoard[rc-1][rc-1]) )break ;
                else if (rc === gameBoard.length-1 ) {
                    return players.getPlayersTurn().name;
                }
                
            }
            for (let c = 1; c < gameBoard.length; c++) {
                if(gameBoard[gameBoard.length-c][c-1] === 0  || !(gameBoard[gameBoard.length-1-c][c] === gameBoard[gameBoard.length-c][c-1]) )break ;
                else if (c === gameBoard.length-1 ) {
                    return players.getPlayersTurn().name;

                }
                
            }

        }
        
    }

    function addImage(clickedDiv){
        const img = document.createElement("img");
        img.setAttribute("src", players.getPlayersTurn().imgSrc);
        clickedDiv.appendChild(img);

    }

    function whenGameEnd(result){
        boardTable.removeEventListener('click', updateGameBoardArray)

        const template = document.createElement('div')
        template.classList.add("result-container")
        template.textContent = (result ==='draw' ? 'DRAW' : "winner : " + result);
        boardTable.appendChild(template);

    }




    return{
        get boardDim(){return boardDim}
    }


})();


//slider===========================================================================================
(function(){

    // catch DOM
    const slider = document.getElementById("myRange");
    const minSliderValue  = document.querySelector("#slider-value");

    //initialize
    slider.value=3;

    //event
    slider.addEventListener('input', () => events.emit('sliderChanged' , slider) ); 


    //
    events.on('playerAdded',updateMinOnSlider)
    events.on('playerRemoved', updateMinOnSlider)

    function updateMinOnSlider(Players){
        slider.min= ((Players.length*4-2)/2)
        minSliderValue.textContent = slider.min;
    }
    


})();








