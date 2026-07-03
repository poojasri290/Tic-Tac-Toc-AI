const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let board = ["","","","","","","","",""];

let playerScore = 0;
let aiScore = 0;

const human = "X";
const ai = "O";

let gameOver = false;

cells.forEach(cell=>{
    cell.addEventListener("click",playerMove);
});

function playSound(){
    document.getElementById("clickSound").play();
}

function playerMove(){

    let index = this.dataset.index;

    if(board[index]!=="" || gameOver) return;

    playSound();

    board[index] = human;
    this.textContent = human;

    if(checkWinner(board,human)){
        playerScore++;
        document.getElementById("playerScore").textContent = playerScore;
        statusText.innerHTML="🎉 You Win!";
        gameOver=true;
        return;
    }

    if(isDraw()){
        statusText.innerHTML="🤝 Draw!";
        gameOver=true;
        return;
    }

    statusText.innerHTML="🤖 AI Thinking...";

    setTimeout(()=>{
        aiMove();
    },1000);
}

function aiMove(){

    let bestMove=minimax(board,ai).index;

    board[bestMove]=ai;
    cells[bestMove].textContent=ai;

    playSound();

    if(checkWinner(board,ai)){
        aiScore++;
        document.getElementById("aiScore").textContent=aiScore;
        statusText.innerHTML="😢 AI Wins!";
        gameOver=true;
        return;
    }

    if(isDraw()){
        statusText.innerHTML="🤝 Draw!";
        gameOver=true;
        return;
    }

    statusText.innerHTML="Your Turn (X)";
}

function minimax(newBoard,player){

    let spots = newBoard
    .map((v,i)=>v===""?i:null)
    .filter(v=>v!==null);

    if(checkWinner(newBoard,human))
        return {score:-10};

    if(checkWinner(newBoard,ai))
        return {score:10};

    if(spots.length===0)
        return {score:0};

    let moves=[];

    for(let i=0;i<spots.length;i++){

        let move={};
        move.index=spots[i];

        newBoard[spots[i]]=player;

        if(player===ai){
            move.score=minimax(newBoard,human).score;
        }else{
            move.score=minimax(newBoard,ai).score;
        }

        newBoard[spots[i]]="";
        moves.push(move);
    }

    let bestMove;

    if(player===ai){

        let bestScore=-9999;

        for(let i=0;i<moves.length;i++){
            if(moves[i].score>bestScore){
                bestScore=moves[i].score;
                bestMove=i;
            }
        }

    }else{

        let bestScore=9999;

        for(let i=0;i<moves.length;i++){
            if(moves[i].score<bestScore){
                bestScore=moves[i].score;
                bestMove=i;
            }
        }
    }

    return moves[bestMove];
}

function checkWinner(board,player){

    const winPatterns=[
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    return winPatterns.some(pattern=>{
        return pattern.every(index=>{
            return board[index]===player;
        });
    });
}

function isDraw(){
    return board.every(cell=>cell!=="");
}

function restartGame(){

    board=["","","","","","","","",""];
    gameOver=false;

    cells.forEach(cell=>{
        cell.textContent="";
    });

    statusText.innerHTML="Your Turn (X)";
}