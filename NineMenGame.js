var mainBoard="xxxxxxxxxxxxxxxxxxxxxxx";
var gameAlive = true;
var moveCount = 0;
var depth =3;
var orgdepth = depth+1;
var selected = 100;
var closeMillVar = false;
var staticEstimateCounter=0;
var GameMode;
var commment ='welcome';
function playerSelection(position){
    if(moveCount==1||moveCount==0){
        document.getElementById("GameMode").innerHTML="<span>New Game</span>";
    }
    document.getElementById("commentR").innerHTML="";
    if(1<moveCount && moveCount< 16){
        document.getElementById("GameMode").innerHTML="<span>Opening</span>";
    }else{
        document.getElementById("GameMode").innerHTML="<span>MidGame</span>";
    }
    // console.log(typeof(parseInt(position))+" "+parseInt(position));
    if(moveCount<18){
        if(mainBoard.charAt(parseInt(position))=='x'){
            var temp = mainBoard.split('');
            temp[parseInt(position)]= 'W';
            // console.log(temp);
            mainBoard = temp.join('');
            // console.log(mainBoard); 
            document.getElementById(position).innerHTML="<span class='dot1'></span>";
            moveCount++;
            // console.log(parseInt(position),mainBoard.split(''));
            if(closeMill(parseInt(position),mainBoard.split(''))){
                closeMillVar = true;
                alert("Mill formed!! select an opponent coin not in Mill to remove");
            }else{
                gameLife(mainBoard);
                gameController(mainBoard);
            }
        }
        else if(closeMillVar!=true){
            alert("the position is already take, select an empty spot to place a coin");
        }
    }
    else{
        if(selected == 100 && mainBoard.charAt(parseInt(position))=='x'){
            alert("select a coin to move");
        }
        else if(selected==100 && mainBoard.charAt(parseInt(position))=='W'){
            selected = parseInt(position);
            document.getElementById(selected).innerHTML="";
            document.getElementById(selected).innerHTML="<span class = 'selection'></span>";
            // document.getElementsByClassName("selection").css({'background-color': '#000'});
            // console.log(selected);
        }
        else if(selected!=100 && mainBoard.charAt(parseInt(position))!='x'){
            alert("select an empty space to move");
        }
        else if(selected!=100 && mainBoard.charAt(parseInt(position))=='x'){
            var n = neighbors(selected);
            var neighborCheck = false;
            var i;
            var j,white=0;
for(j=0; j<mainBoard.length; j++){
    if(mainBoard.charAt(j)=='W'){
        white++;
    }
}
if(white>=3){
    for(i=0; i<n.length; i++){
        if(n[i]==parseInt(position)){
            neighborCheck = true;
        }
    }
}else{
    neighborCheck = true;
}
            if(neighborCheck){
                document.getElementById(position).innerHTML="<span class='dot1'></span>";
                document.getElementById(selected).innerHTML="";
                var temp = mainBoard.split('');
                temp[selected] = 'x';
                temp[parseInt(position)] = 'W';
                mainBoard = temp.join('');
                document.getElementById(selected).innerHTML="";
                selected = 100;
                if(closeMill(parseInt(position),mainBoard.split(''))){
                    closeMillVar = true;
                    alert("Mill formed!! select an opponent coin not in Mill to remove");
                }else{
                    gameLife(mainBoard);
                    console.log("check "+mainBoard);
                    gameController(mainBoard);
                }
                neighborCheck = false;
            }else{
                alert("Select a neighbor position to move the coin");
            }
        }

    }
    if(closeMillVar==true && mainBoard.charAt(parseInt(position))=='B'){
        if(!closeMill(parseInt(position),mainBoard.split(''))){
            document.getElementById(parseInt(position)).innerHTML="";
            var temp = mainBoard.split('');
            temp[parseInt(position)] = 'x';
            mainBoard = temp.join('');
            closeMillVar = false;
            gameLife(mainBoard);
            gameController(mainBoard);
        }else{
            alert("Select an opponent coin that is not in the Mill");
        }
    }
    console.log(moveCount);
}


// function sleep(milliseconds) {
//     var start = new Date().getTime();
//     for (var i = 0; i < 1e7; i++) {
//          if ((new Date().getTime() - start) > milliseconds){
//          break;
//         }
//     }
// }

function playerGenerateRemove(board){


}

function gameController(inputBoard){
    // console.log("input board "+inputBoard);
    var board=inputBoard;
    // console.log(board+typeof(board));
    
    var estimate;
    console.log("Computer turn");
    var board = swapPieces(board);
    console.log(board);
    estimate = maxMin(depth+1,board,-2147483648,2147483647);
    var previousBoard = mainBoard;
    // console.log("skdfhk"+estimate);
    console.log("mainboard before"+mainBoard);
    console.log("estimate "+estimate[0]+"   "+estimate[1]);
    mainBoard = swapPieces(estimate[0]);
    // console.log("mainboard after "+mainBoard);
    // console.log("computer move board"+mainBoard);
    console.log(previousBoard+"    "+mainBoard);
    generateDisplay(mainBoard,previousBoard);
    moveCount+=1;
    gameLife(board);
    console.log("computer move"+moveCount); 
}

function generateDisplay(board,previousBoard){
    var i;
    for(i=0; i<board.length; i++){
        if(board.charAt(i)=='x' && previousBoard.charAt(i)=='W'){
            document.getElementById(i).innerHTML="";
            document.getElementById("commentR").innerHTML=`<span>Removed your coin at position ${i}</span>`
        }else if(board.charAt(i)=='x' && previousBoard.charAt(i)=='B'){
            // document.getElementById(i).innerHTML="<span class='selection'></span>";
            // sleep(2000);
            // document.getElementById(i).classList.remove("selection");
            document.getElementById(i).innerHTML="";
            // document.getElementById("comment").innerHTML=`Removed your coin at position ${i}`
        }else if(board.charAt(i)=='B' && previousBoard.charAt(i)=='x'){
            document.getElementById(i).innerHTML="<span class='dot2'></span>";
            document.getElementById("comment").innerHTML=`<span>Placed a coin at position ${i}</span>`
        }else if(board.charAt(i)=='W' && previousBoard.charAt(i)=='x'){
            document.getElementById(i).innerHTML="<span class='dot1'></span>";
        }
    }
}

function gameLife(board){
    console.log(board+" board life ");
    var i,whites=0,blacks=0;
    for(i=0; i<board.length; i++){
        if(board.charAt(i)=='W'){
            whites++;
        }else if(board.charAt(i)=='B'){
            blacks++;
        }
    }
    console.log("whites "+whites+" blacks "+blacks);
    if(moveCount>=18){
        if(whites<=2){
            gameAlive = false;
            alert("Computer Wins");
            mainBoard="xxxxxxxxxxxxxxxxxxxxxxx";
            moveCount = 0;
            document.location.reload();

        }else if(blacks<=2){
            gameAlive = false;
            alert("Player Wins");
            mainBoard="xxxxxxxxxxxxxxxxxxxxxxx";
            moveCount = 0;
             document.location.reload();
             gameController(mainBoard);
        }
    }
}

function generateAdd(inputBoard){
    // console.log("generate add");
var l =[]; 
    var i;
    for(i=0; i<inputBoard.length; i++){
    if(inputBoard.charAt(i)=='x'){
            var b = inputBoard.split('');
            b[i] ='W';
            // console.log("closemill check 1");
            if(closeMill(i,b)){
                generateRemove(b,l);
            }else{
                l.push(b.join(''));
            }
        }
    }
    return l;
}

function maxMin(depth,board,alpha,beta){
    // console.log("max min");
    if(depth == 1){
        console.log("before maxmin entry movecoount"+ moveCount);
        if(moveCount<18){
            return [board,staticEstimator(board)];
        }else{
            return [board,staticEstimatorGame(board)];
        }
    }else{
        var v = -2147483648;
        var b="";
        if(moveCount<18){
            var list = generateAdd(board);
        }else{
            list = decideHopOrMove(board);
        }
        var i;
        for(i=0; i<list.length; i++){
            // console.log("list maxmin"+ list);
            if(depth>0) {
                var pair = minMax(depth-1, list[i],alpha,beta);
                if (v < pair[1]) {
                    v = pair[1];
                    b = pair[0];
                }
                if(v >= beta){
                    return [b, v];
                }else{
                alpha = Math.max(v,alpha);
                }
            }

        }
        if(depth==orgdepth) {
            return [b, v];
        }else{
            return [board, v];
        }
    }
};

function minMax(depth,board,alpha,beta){
    // console.log("min maax");
    // console.log("alpha :"+alpha);
    if(depth == 1){
        if(moveCount<18){
            return [board,staticEstimator(board)];
        }else{
            return [board,staticEstimatorGame(board)];
        }
        
    }else {
        v = 2147483647;
        b="";
        if(moveCount<18){
            var list = generateAdd(board);
        }else{
            list = decideHopOrMove(board);
        }
        // console.log(board);
        // console.log(list);
        var i;
        for( i=0; i<list.length; i++){
            // console.log("list minmax"+ list);
            if(depth>0) {
                pair = maxMin(depth-1,list[i],alpha,beta);
                if (v > pair[1]) {
                    v = pair[1];
                    b = pair= [0];
                }
                if (v <= alpha) {
                    return [b, v];
                } else {
                    beta = Math.min(v, beta);
                }
            }
        }
        if(depth==orgdepth){
            return [b,v];
        }else {
            return [board, v];
        }
    }
}

function closeMill(j,b){
    C = b[j];
    // console.log(C);
    // console.log(b+"    "+j);
    if(C == 'x'){
        alert("error");
    }
    switch (j){
        case 0:
            if((b[1]== C && b[2]== C)||(b[3]== C && b[6]== C)||(b[8]== C && b[20]== C)){
                return true;
            }else{
                return false;
            }
        case 1:
            if((b[0]== C && b[2]== C)){
                return true;
            }else{
                return false;
            }
        case 2:
            if((b[0]== C && b[1]== C)||(b[13]== C && b[22]== C)||(b[5]== C && b[7]== C)){
                return true;
            }else{
                return false;
            }
        case 3:
            if((b[9]== C && b[17]== C)||(b[4]== C && b[5]== C)||(b[0]== C && b[6]== C)){
                return true;
            }else{
                return false;
            }
        case 4:
            if((b[3]== C && b[5]== C)){
                return true;
            }else{
                return false;
            }
        case 5:
            if((b[3]== C && b[4]== C)||(b[12]== C && b[19]== C)||(b[2]== C && b[7]== C)){
                return true;
            }else{
                return false;
            }
        case 6:
            if((b[0]== C && b[3]== C)||(b[10]== C && b[14]== C)){
                return true;
            }else {
                return false;
            }
        case 7:
            if((b[2]== C && b[5]== C)||(b[11]== C && b[16]== C)){
                return true;
            }else {
                return false;
            }
        case 8:
            if((b[0]== C && b[20]== C)||(b[9]== C && b[10]== C)){
                return true;
            }else {
                return false;
            }
        case 9:
            if((b[8]== C && b[10]== C)||(b[3]== C && b[17]== C)){
                return true;
            }else {
                return false;
            }
        case 10:
            if((b[8]== C && b[9]== C)||(b[6]== C && b[14]== C)){
                return true;
            }else {
                return false;
            }
        case 11:
            if((b[12]== C && b[13]== C)||(b[7]== C && b[16]== C)){
                return true;
            }else {
                return false;
            }
        case 12:
            if((b[11]== C && b[13]== C)||(b[5]== C && b[19]== C)){
                return true;
            }else{
                return false;
            }
        case 13:
            if((b[11]== C && b[12]== C)||(b[2]== C && b[22]== C)){
                return true;
            }else {
                return false;
            }
        case 14:
            if((b[17]== C && b[20]== C)||(b[15]== C && b[16]== C)||(b[6]== C && b[10]== C)){
                return true;
            }else {
                return false;
            }
        case 15:
            if((b[18]== C && b[21]== C)||(b[14]== C && b[16]== C)){
                return true;
            }else{
                return false;
            }
        case 16:
            if((b[14]== C && b[15]== C)||(b[7]== C && b[11]== C)||(b[19]== C && b[22]== C)){
                return true;
            }else{
                return false;
            }
        case 17:
            if((b[14]== C && b[20]== C)||(b[3]== C && b[9]== C)||(b[18]== C && b[19]== C)){
                return true;
            }else{
                return false;
            }
        case 18:
            if((b[15]== C && b[21]== C)||(b[17]== C && b[19]== C)){
                return true;
            }else{
                return false;
            }
        case 19:
            if((b[16]== C && b[22]== C)||(b[17]== C && b[18]== C)||(b[5]== C && b[12]== C)){
                return true;
            }else{
                return false;
            }
        case 20:
            if((b[0]== C && b[8]== C)||(b[14]== C && b[17]== C)||(b[21]== C && b[22]== C)){
                return true;
            }else {
                return false;
            }
        case 21:
            if((b[20]== C && b[22]== C)||(b[15]== C && b[18]== C)){
                return true;
            }else {
                return false;
            }
        case 22:
            if((b[16]== C && b[19]== C)||(b[2]== C && b[13]== C)||(b[20]== C && b[21]== C)){
                return true;
            }else {
                return false;
            }
    }
    return false;
}

function generateRemove(b,l){
    // console.log("generate remove"+ b);
    var check=false;
    for(j=0; j<b.length; j++){
        if(b[j]=='B'){
            // console.log("closemill check 2");
            if(!closeMill(j,b)){
                check = true;
                var temp =b.slice();
                temp[j]='x';
                l.push(temp.join(''));
            }
        }
    }
    if(!check){
        var temp = b;
        l.push(temp.toString());
    }
}

function staticEstimator(board){
    var whitePieces=0,blackPieces=0,whitePieceWeight=0;
        for(i=0; i<board.length; i++) {
            if (board.charAt(i) == 'W') {
                whitePieces++;
                var temp = neighbors(i);
                switch (temp.length){
                    case 4:
                        whitePieceWeight+=0.75;
                        break;
                     case 3:
                        whitePieceWeight+=0.50;
                        break;
                }
            } else if (board.charAt(i) == 'B') {
                blackPieces++;
            }
        }
        return ((whitePieces-blackPieces)+Math.round(whitePieceWeight));
}

function swapPieces(b){
    // console.log("swap");
    var board = b.split('');
    // console.log(board+" "+b);
    for(i=0; i<b.length; i++){
        if(b.charAt(i) =='W'){
            board[i]='B';
        }else if(b.charAt(i)=='B'){
            board[i]='W';
        }
    }
    return board.join('');
}

function GenerateHopping(b) {
    var l = [];
    var board = b.slice();
    var i;
    for (i = 0; i < board.length; i++) {
        if (board[i] == 'W') {
            var j;
            for (j = 0; j < board.length; j++) {
                if (board[j] == 'x') {
                    var temp = board.split('');
                    temp[i] = 'x';
                    temp[j] = 'W';
                    // console.log("closemill check 3");
                    if (closeMill(j, temp)) {
                        generateRemove(temp, l);
                    } else {
                        l.push(temp.join(''));
                    }
                }
            }
        }
    }
    return l;

}

function GenerateMove(board) {
    var l = [];
    var i;
    for (i = 0; i < board.length; i++) {
        if (board[i] == 'W') {
            n = neighbors(i);
            var j;
            for (j=0; j<n.length; j++) {
                if (board[n[j]] == 'x') {
                    var temp = board.split('');
                    temp[i] = 'x';
                    temp[n[j]] = 'W';
                    // console.log("closemill check 4");
                    if (closeMill(n[j], temp)) {
                        generateRemove(temp, l);
                    } else {
                        l.push(temp.join(''));
                    }
                }
            }
        }
    }
    return l;
}

function decideHopOrMove(board) {
    var noOfWhite = 0;
    var i;
    for (i = 0; i < board.length; i++) {
        if (board[i] == 'W') {
            noOfWhite++;
        }
    }
    if (noOfWhite == 3) {
        return GenerateHopping(board);
    } else {
        return GenerateMove(board);
    }
}

function staticEstimatorGame(board) {
    var whitePieces = 0, blackPieces = 0;
    var i;
    for (i = 0; i < board.length; i++) {
        if (board[i] == 'W') {
            whitePieces++;
        } else if (board[i] == 'B') {
            blackPieces++;
        }
    }
    var blackBoard = swapPieces(board);
    var list = decideHopOrMove(blackBoard);
    var blackMilltoBe = blackMilltobe(board);
    staticEstimateCounter++;
    if (blackPieces <= 2) {
        return 10000;
    } else if (whitePieces <= 2) {
        return -10000;
    } else if (list.length == 0) {
        return 10000;
    } else {
        return (1000 * (whitePieces - blackPieces) - list.length-(10*blackMilltoBe));
    }
}

function neighbors(location) {
    switch (location) {
        case 0:
            return [1, 3, 8];
        case 1:
            return [0, 2, 4];
        case 2:
            return [1, 5, 13];
        case 3:
            return [0, 4, 6, 9];
        case 4:
            return [1, 3, 5];
        case 5:
            return [2, 4, 7, 12];
        case 6:
            return [3, 7, 10];
        case 7:
            return [5, 6, 11];
        case 8:
            return [0, 9, 20];
        case 9:
            return [3, 8, 10, 17];
        case 10:
            return [6, 9, 14];
        case 11:
            return [7, 12, 16];
        case 12:
            return [5, 11, 13, 19];
        case 13:
            return [2, 12, 22];
        case 14:
            return [10, 15, 17];
        case 15:
            return [14, 16, 18];
        case 16:
            return [11, 15, 19];
        case 17:
            return [9, 14, 18, 20];
        case 18:
            return [15, 17, 19, 21];
        case 19:
            return [12, 16, 18, 22];
        case 20:
            return [8, 17, 21];
        case 21:
            return [18, 20, 22];
        case 22:
            return [13, 19, 21];
        default: return [];
    }
}

function blackMilltobe(board){
var blackMilltoBe=0;
var i;
for(i=0; i<board.length; i++){
    if(board.charAt(i)=='x'){
        var temp = board.split('');
        temp[i]='B';
        // console.log("closemill check 5");
        if(closeMill(i,temp)){
            blackMilltoBe++;
        }
    }
}
return blackMilltoBe;
}
