var x_length = 10;
var y_length = 10;
var total = x_length*y_length;
var mines_count = 10;
var mineString = "B";
var emptyString = " ";
var stepString = "X";
var mines = [];

var grid = [];

console.log("Init Grid....");
plantMines();
console.log("Plant Mines....");
plantWarnings();
console.log("Set Warnings....");
console.log("All Set....\n");
printGrid();

function plantMines(){
    var i = 0;
    while(i < mines_count){
        var mine = Math.floor(Math.random() * (x_length*y_length)) ;
        grid[mine] = mineString;
        mines.push(mine);
        i ++;
    }

}

function printGrid(){
    for(var y = 0 ; y < y_length ; y++){
        var row = "";
        for(var x = 0; x < x_length; x++ ){
            var point = grid[y*10 + x];
            if(point == mineString){
                row = row + " "+mineString+" ";
            }
            else if(point == undefined){
                row = row + "   ";
            }
            else{
                row = row + " "+point+" ";
            }

        }
        console.log(row);
    }
}

function plantWarnings(){
    for(var i = 0 ; i < total; i++){
        if(grid[i] == mineString){
            continue;
        }
        var neighbours = getNeighbours(i);
        var mines = 0;
        for(var n = 0; n < 8; n ++){
            var neighbour = neighbours[n];
            if(neighbour == null){
                continue;
            }
            if(grid[neighbour] == mineString){
                mines++;
            }
        }

        grid[i] = mines;
    }
}

function getNeighbours(point){
    point = parseInt(point);
    var neighbours = [];
    neighbours[0] = point-x_length-1;
    neighbours[1] = point-x_length;
    neighbours[2] = point-x_length+1;
    neighbours[3] = point+1;
    neighbours[4] = point+x_length+1;
    neighbours[5] = point+x_length;
    neighbours[6] = point+x_length-1;
    neighbours[7] = point-1;

    for(i in neighbours){
        if(neighbours[i] < 0 || neighbours[i] >= x_length*y_length){
            neighbours[i] = null;
        }
    }
    if(point%x_length == 0){
        neighbours[0] = null;
        neighbours[7] = null;
        neighbours[6] = null;
    }
    if((point+1)%x_length == 0){
        neighbours[2] = null;
        neighbours[3] = null;
        neighbours[4] = null;
    }
   return neighbours;
}

var worker = require("child_process");
var solver = worker.fork("./solver");

console.log("\nSetting up Sweeper...");

solver.send({
    game:{
        x:x_length,
        y:y_length,
        mineCount:mines_count
    }
});

var clearedGrid = [];

solver.on("message", function(msg){

    if(msg.step){
        var s = checkStep(msg.step);
        if(s==0){
            sendStepAck();
        }
    }
    else if(msg.mine){
        clearedGrid[msg.mine] = mineString;
    }
    else if(msg.finish){
        finishStat(msg.finish);
    }
});


function checkStep(point){
    //console.log("POINT "+point);
    var gridPoint = grid[point];
    if(gridPoint == mineString){
        console.log("\nOops..! Steped on a mine");
        process.exit(0);
        return -1;
    }
    showWarnings(point);
    return 0;

}
var visited = [];

function showWarnings(point){

    if(checkVisited(point)){
        return;
    }
    visited.push(point);
    clearedGrid[point] = grid[point];
    var neighbours = getNeighbours(point);
    for(var n= 0 ; n < 8; n ++){
        var npoint = neighbours[n];
        if(npoint != null && grid[npoint] != mineString){
            clearedGrid[npoint] = grid[npoint];
            if(grid[npoint] == 0){
                showWarnings(npoint);
            }
        }
    }
}

function checkVisited(point){
    if(visited.indexOf(point) > 0){
        return true;
    }
     return false;
}

function sendStepAck(){
    solver.send({
        stepAck:clearedGrid
    })
}

function finishStat(myMines){

    var fmines = mines.filter(function(elem, pos) {
        return mines.indexOf(elem) == pos;
    })


    var discover = myMines.filter(function(elem, pos) {
        return myMines.indexOf(elem) == pos;
    })

    console.log("\nGame Stats...");
    console.log("MINES("+fmines.length+")       "+fmines.sort().toString());
    console.log("DISCOVERED("+discover.length+")  "+discover.sort().toString());

    process.exit(0);

}
