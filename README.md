# minesweeper-ai
NodeJs AI for classic minesweeper game
#####server.js
This script generates a random grid with mines and intiates a solver to sweep the mines

#####solver.js
This contains  the AI which is capable of finding the mines in the grid

### Running
```sh
$ node server.js 
```
###Results
```sh
Init Grid....
Plant Mines....
Set Warnings....
All Set....

 0  1  B  1  1  1  1  0  0  0 
 1  2  1  1  1  B  1  0  0  0 
 B  2  0  0  1  1  1  0  0  0 
 B  3  0  0  0  0  0  1  2  2 
 B  2  0  0  0  0  0  1  B  B 
 1  1  0  0  0  0  1  2  3  2 
 0  0  0  0  0  0  1  B  1  0 
 0  0  0  0  0  0  1  1  1  0 
 0  0  0  1  1  2  1  1  0  0 
 0  0  0  1  B  2  B  1  0  0 

Setting up Sweeper...
Finished Sweeping...

 0  1     1  1  1  1  0  0  0 
 1  2  1  1  1     1  0  0  0 
    2  0  0  1  1  1  0  0  0 
    3  0  0  0  0  0  1  2  2 
    2  0  0  0  0  0  1       
 1  1  0  0  0  0  1  2  3  2 
 0  0  0  0  0  0  1     1  0 
 0  0  0  0  0  0  1  1  1  0 
 0  0  0  1  1  2  1  1  0  0 
 0  0  0  1     2     1  0  0 

Game Stats...
MINES(10)       15,2,20,30,40,48,49,67,94,96
DISCOVERED(10)  15,2,20,30,40,48,49,67,94,96

```
