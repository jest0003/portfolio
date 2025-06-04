//board
let tileSize = 32;
let rows = 16;
let colums = 16;

let board;
let boardWidth = tileSize * colums;
let boardHeight = tileSize * rows;
let context;

//rumskib
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * colums/2 - tileSize; //vil have rumskibet i midten, derfor er vi divideret colums med 2, MEN da rumskibet også fylder to tiles har vi sagt minus en så det står præcis i midten
let shipY = tileSize * rows - tileSize*2; //Y er op ned - gange 2 for at være løftet fra bunden

let ship = {
   x : shipX,
   y : shipY,
   width : shipWidth,
   height : shipHeight 
}

let shipImg;
let shipMoveX = tileSize; //hvor meget det rykker sig

window.onload = function () {
    board = document.querySelector("#board");
    board.width = boardWidth;
    board.height = boardHeight;
    context =board.getContext("2d"); //Til at tegne på brættet

    //tegn rumskib på brættet
    //context.fillStyle="green";
    //context.fillRect(ship.x, ship.y, ship.width, ship.height);

    //load rumskib img
    shipImg = new Image();
    shipImg.src = "assets/space_invaders/ship.png"
    shipImg.onload = function () {
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }
    requestAnimationFrame(update);
}
function update (){
requestAnimationFrame(update);
context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height); //retegning af rumskibet i det rigtige spot
}

function moveShip(e) {
    
}