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
let shipHastighedX = tileSize; //hvor meget det rykker sig

//alien
let alienArray = [];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColums = 3;
let alienCount = 0; //aliens der skal besejres
let alienHastighedX = 1; //hvor meget de rykker sig.

//bullets
let bulletArray = [];
let bulletHastighedY = -10; //hastighed på bullets, skal være i minus for at kunne komme op mod de0 som boarded starter med (0, 0 er i øverste venstre hjørne)

let score = 0;
let gameOver = false;
let gameOn = false;
let aniFrameId;

document.querySelector("#startBtn").addEventListener("click", startGame);

window.onload = function () {
    board = document.querySelector("#board");
    board.width = boardWidth;
    board.height = boardHeight;
    context =board.getContext("2d"); //Til at tegne på brættet

    //tegn rumskib på brættet
    //context.fillStyle="green";
    //context.fillRect(ship.x, ship.y, ship.width, ship.height);

    //load rumskib/alien imgs
    shipImg = new Image();
    shipImg.src = "assets/space_invaders/ship.png"
    shipImg.onload = function () {
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

alienImg = new Image();
alienImg.src = "assets/space_invaders/alien.png"
alienHastighedX = 1;
createAliens ();

   // requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

function startGame (e){
    e.preventDefault();
    if (gameOn) {
        cancelAnimationFrame(aniFrameId);
    }
    
     // nulstil variabler
    ship.x = shipX;
    ship.y = shipY;
    alienColums = 3;
    alienRows = 2;
    alienArray = [];
    bulletArray = [];
    score = 0;
    gameOver = false;
    createAliens();

    // start game loop (igen)
    aniFrameId = requestAnimationFrame(update);
}

function update (){

if (gameOver) {
    gameOn = false;

    context.fillStyle="red";
    context.font="40px que";
    context.fillText("GAME OVER", board.width/2 - tileSize*3, board.height/2 - tileSize)
    return;
}

context.clearRect (0, 0, board.width, board.height);

//re-tegning af rumskibet i det rigtige spot
context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height); 

//aliens
for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray [i];
    if (alien.alive) {
        alien.x += alienHastighedX;


        //hvis alien rør kandten af boarded
        if (alien.x + alien.width >= board.width || alien.x <= 0){
            alienHastighedX *= -1;
            alien.x += alienHastighedX*2; //sådan så aliensne er in sync

            //flyt aliens ned en række
            for (let j = 0; j < alienArray.length; j++){
                alienArray[j].y += alienHeight;
            }
        }
        context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

        if (alien.y >= ship.y) {
            gameOver = true;
        }
    }
}

//bullets
for (let i = 0; i < bulletArray.length; i++) {
    let bullet = bulletArray[i];
    bullet.y += bulletHastighedY;
    context.fillStyle="white";
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);


    //bullet sammenstød med aliens
    for (let j = 0; j < alienArray.length; j++) {
        let alien = alienArray[j];
        if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
            bullet.used = true;
            alien.alive = false;
            alienCount--;
            score += 100;
        }
    }
}

//fjern bullets
while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
    bulletArray.shift(); //fjerner bullet når de kommer udover borded, da 0 er den øverste linje på boarded
}


//next lvl
if (alienCount == 0){
    //forøg antallet af aliens i colums og rækker med 1.
    alienColums = Math.min(alienColums + 1, colums/2 -2); //vi dividere det med halvdelen eftersom de fylder to i breden, og minusser to så vi er sikker på de har ldit plads at bevæge sig på.
    alienRows = Math.min(alienRows +1, rows-4); //så de ikke kan fylde helt nede ved skibet. så max 12 rækker.
    alienHastighedX += 0.5; //gør at de bevæger sig hurtigere
    alienArray = [];
    bulletArray = [];
    createAliens(); 
}

//score
context.fillStyle="white";
context.font="16px que";
context.fillText(score, 5, 20);

aniFrameId = requestAnimationFrame(update);
}

function moveShip(e) {
    if (gameOver) {
       return; 
    }
    if (e.code == "ArrowLeft" && ship.x - shipHastighedX >= 0) //Så skibet ikke kan "falde ud af boksen" til venstre 
    {
        ship.x -= shipHastighedX; //flyt til venstre et 'tile'
    }
    else if (e.code == "ArrowRight" && ship.x + shipHastighedX +  ship.width <= board.width) //width her er vigtigt, sådan så skibet ikke falder "halvt" ud til højre da det jo fylder to tiles
        {
        ship.x += shipHastighedX; //flyt til højre et 'tile'
    }
}
//c er for at gå igennem colums og r er for at gå igennem rækker, når man siger r++ eller c++ så lægger man én til.
function createAliens() {
for (let c = 0; c < alienColums; c++) {
    for (let r = 0; r < alienRows; r++) {
        let alien = {
            img : alienImg,
            x : alienX + c*alienWidth, //så de ikke overlapper med hinanden
            y : alienY + r*alienHeight,
            width : alienWidth,
            height : alienHeight,
            alive: true
        }
        alienArray.push(alien);
    }
}
alienCount = alienArray.length;
}

function shoot(e){
    if (gameOver){
        return;
    }

    if (e.code == "Space"){
        //shoot
        let bullet = {
            x : ship.x + shipWidth*15/32, //så den passer emd at den kommer ud af "kanonen"
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false //så når den ramme en alien at det forsvinder
        }
        bulletArray.push(bullet);
    }
}

function detectCollision (a, b) {
    return a.x < b.x + b.width && //a's top venstre hjørne rammer ikke b's top højre hjørne
           a.x + a.width > b.x && //a's top højre hjørne passerer b's top venstre hjørne
           a.y < b.y + b.height && //a's top venstre hjørne rør ikke b's bund venstre hjørne
           a.y + a.height > b.y; //a's bund venstre hjørne passere b's top venstre hjørne
}