var x_length = 0;
var y_length = 0;

var grid = [];
var debugCount = 30;
var count = 0;
var mines = [];
process.on("message", function (game) {

    if (game.game) {
        startGame(game.game.x, game.game.y);
    } else if (game.stepAck) {
        if (count < debugCount) {
            var move = findNextStep(game.stepAck);
            //console.log("----------------------------");
            stepPoint(move);
            count++;
        }
        else{
            printGrid(game.stepAck);
        }

    }
});

function startGame(x, y) {
    x_length = x;
    y_length = y;
    firstMove();
}

function firstMove() {
    var point = Math.floor(Math.random() * (x_length * y_length));
    stepPoint(99);
}

function stepPoint(point) {
    process.send({
        step: point
    })
}

function markMine(point) {
    process.send({
        mine: point
    })
}

function sendFinishGame(mines) {
    process.send({
        finish: mines
    })
}

function printGrid(grid) {
    for (var y = 0; y < y_length; y++) {
        var row = "";
        for (var x = 0; x < x_length; x++) {
            var point = grid[y * 10 + x];
            if (point == undefined) {
                row = row + "   ";
            }
            else {
                row = row + " " + point + " ";
            }

        }
        console.log(row);
    }
}

function findNextStep(grid) {

   // printGrid(grid);
    //console.log("----------------------------");

    var steps = {};
    var testGrid = [];

    for (var i = 0; i < x_length * y_length; i++) {
        if (!grid[i]) {
            continue;
        }

        var val = grid[i];
        var neighbours = getNeighbours(i);

        for (var n = 0; n < 8; n++) {
            var npoint = neighbours[n];
            if (npoint && !grid[npoint]) {
                if (grid[npoint] != 0) {
                    add(steps, npoint, 1);
                    testGrid[npoint] = steps[npoint];
                }
            }

        }
    }

    var nextSteps = getPossibleStep(steps);
  //  printGrid(testGrid);

    for (s = 0; s < nextSteps.length; s++) {

        var neighs = getNeighbours(nextSteps[s]);

        var valids = [];
        for (var n = 0; n < 8; n++) {
            var np = neighs[n];
            if (grid[np] == 1) {
                valids.push(np);
            }
        }
    //    console.log("B " + nextSteps[s]);
        //mines.push(nextSteps[s]);
       // console.log(valids);
      //  mines.push(nextSteps[s]);
        if (valids.length == 0) {
            continue;
        }
        for (v in valids) {

            var vneighs = getNeighbours(valids[v]);
           // console.log(vneighs);
            for (var vn = 0; vn < 8; vn++) {

                var nnn = vneighs[vn];

                if (grid[nnn] == null) {

                    if(nnn == null){
                      //  console.log("C1 "+nnn);
                        continue;
                    }
                    else if (nnn == nextSteps[s]) {
                      //  console.log("C2 "+nnn);
                        continue;
                    }
                    else {
                        //console.log("VAL "+ grid[nnn]);
                     //   console.log(" FI " + nnn);
                       // markMine(nextSteps[s]);

                        return nnn;
                    }
                }
            }

        }

    }

    console.log("Finished Sweeping...\n");
    printGrid(grid);
    for(var fg = 0; fg < x_length*y_length;fg++){
        if(grid[fg] == null){
            mines.push(fg);
        }
    }
    sendFinishGame(mines);

}

function add(obj, val, count) {
    if (obj[val]) {
        var i = obj[val];
        obj[val] = i + count;
    }
    else {
        obj[val] = count;
    }
}

function getPossibleStep(steps) {

    var temp = [];
    var finesteps = [];
    for (s in steps) {
        temp.push(steps[s]);
    }
    temp.sort();
    temp.reverse();

    temp.forEach(function (i) {
        for (s in steps) {
            if (i == steps[s]) {
                finesteps.push(s);
                steps[s] = null;
            }
        }
    })

    return finesteps;
}


function getNeighbours(point) {

    point = parseInt(point);
    var neighbours = [];
    neighbours[0] = point - x_length - 1;
    neighbours[1] = point - x_length;
    neighbours[2] = point - x_length + 1;
    neighbours[3] = point + 1;
    neighbours[4] = point + x_length + 1;
    neighbours[5] = point + x_length;
    neighbours[6] = point + x_length - 1;
    neighbours[7] = point - 1;

    for (i in neighbours) {
        if (neighbours[i] < 0 || neighbours[i] >= (x_length * y_length)) {
            neighbours[i] = null;
        }
    }
    if (point % x_length == 0) {
        neighbours[0] = null;
        neighbours[7] = null;
        neighbours[6] = null;
    }
    if ((point + 1) % x_length == 0) {
        neighbours[2] = null;
        neighbours[3] = null;
        neighbours[4] = null;
    }

    return neighbours;
}


