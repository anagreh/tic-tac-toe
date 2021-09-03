
const play = (function(){

    const player = [];
    const player1 = Player(1,'player1','x');
    const player2 = Player(2,'player2','o');
    player = [player1, player2]

    let playerTurn = player[0];
    const getPlayerTurn= ()=>{ return playerTurn};



    return {
        getPlayerTurn
    }

})();


const Player = (id,name,symbol)=>{

    const getId= ()=> id;
    const getName = () => name;
    const getSymbol = () =>symbol;

    
    
    return {getId , getName, getSymbol}
};




const gameBoard = (function (){
    'use strict';

    const gameBoard = [];
    const boardDim = 5;

    //initilize
    initiateGirdToZero();


    // catch dom
    const boardTable = document.querySelector(".table");


    //bind event
    boardTable.addEventListener('click', updatGameBoardArray);


    //render
    doForAllGridElements(addDivForEachGridElement);
    function updateGameBoardUI(clickedDiv){
        clickedDiv.style.backgroundColor = 'blue';
    }

    //--------------
    function updatGameBoardArray(e){
        const clickedDiv = e.target;
        if (clickedDiv.parentElement === boardTable){

            const clickedDivID = clickedDiv.getAttribute("id");
            const [r,c] = getRCFromID(clickedDivID);
            if (gameBoard[r][c] === 0)  {
                gameBoard[r][c] = 'a';
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

    function getGmaeBoard(){
        console.table(gameBoard);

    }

    function getRCFromID(id){

    const r = Number(id.substring(id.indexOf("r")+1, id.indexOf("-"))) ;
    const c = Number(id.substring(id.indexOf("c")+1, id.lenght) );
    return [r,c]

    }


    return{getGmaeBoard}


})();






