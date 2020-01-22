let canv, ctx;

var start = false;
//Position- och spel fysik variabler
var x, y,
  velocity = 0,
  speed = 5,
  friction = 0.98,
  isDead = false;
score = 0;

var gameAnimationFrame;

var playerImg = new Image();
var inactive = new Image();
var active = new Image();

var pic1 = "Pics/inactive.png";
var pic2 = "Pics/active.png"
var isActive = false;

var pause;
var tempGame;

function init() {
  canv = document.getElementById("game");
  ctx = canv.getContext("2d");

  inactive.onload = drawImg;
  inactive.src = pic1;
  active.src = pic2;
  ctx.imageSmoothingEnabled = true;

  playerImg = inactive;

  drawText(canv.width / 2, 150, "30px arial", "white", "center", "0");

  drawText(canv.width / 2, canv.height - 100, "30px arial", "white", "center", "Press space to start");

  pause = setInterval(startGame, 100);

  // För att måla ut första stillbilden efter den har laddats in
  function drawImg() {
    x = canv.width / 2 - 35;
    y = canv.height / 2;
    ctx.drawImage(inactive, x, y, 70, 60);
  }
}

var playerPos = {
  y: 0,
  width: 70,
  height: 60
};

var imgInt;

//Kollar om man har tryckt space och om man inte är död så sätts velocity till -12 men om man är död så startar det om

function jump(event) {
  if (event.keyCode == "32") {
    if (velocity > -speed && !isDead) {
      velocity = -12;
      playerImg = active;
      imgInt = setInterval(animate, 5)
    }
  }
  else if (isDead) {
    reset();
    init();
  }
  isActive = true;
}
document.addEventListener('keydown', jump, false);

function game() {
  //Slutar animera när gameAnimationFrame är false
  if (gameAnimationFrame) {
    window.requestAnimationFrame(game);
  }
  //Ökar velocity om den är mindre än speed
  if (velocity < speed) {
    velocity += 1;
  }

  //multiplerar velocity med friction varje frame för att spelaren ska falla snabbare och snabbare
  velocity *= friction;
  y += velocity;
  playerPos.y = y;

  //Rensar skärmen och sedan flyttar hinderna och kollar om man har åkt in i något av hinderna
  clearScreen();
  moveObstacles();
  collisionDetection();

  drawText(canv.width / 2, 150, "30px arial", "white", "center", score);

  //Kollar om man nuddar marken isådanafall så dör man annars målar man ut tomten på nytt med nya y-positionen
  if (y > canv.height - 50) {
    velocity = 0;
    ctx.drawImage(active, x, canv.height - 50, 70, 60);
    isDead = true;
    deathScreen();
    gameAnimationFrame = false;
  }
  else {
    ctx.drawImage(playerImg, x, y, 70, 60);
    isActive = false;
  }

  increaseScore();
}

//Kollar på elementet som ligger längst fram för att kolla om man är förbi så ökar poäng och sen tar bort elementet
function increaseScore() {
  if (scoreArray.length > 0) {
    if (x > scoreArray[0].x + scoreArray[0].width && !isDead) {
      score++;
      scoreArray.shift();
    }
  }
}

var obsactleInterval;

//Väntar med att starta förän man trycker space
function startGame() {
  document.addEventListener('keydown', function (event) {
    if (event.keyCode == "32") {
      start = true;
    }
  }, false);

  if (start) {
    clearInterval(pause);
    tempGame = window.requestAnimationFrame(game);
    gameAnimationFrame = true;
    obstacleInterval = setInterval(createObstacles, 1500);
  }
}

function deathScreen() {
  highScore();
}

//Rensar allting så att det funkar som det ska när man startar om
function reset() {
  start = false;
  isDead = false;
  score = 0;
  clearInterval(obstacleInterval);
  clearScreen();
  scoreArray = [];
  obstacles = [];
}

//För att hålla armarna nere när man hoppar
var i = 0;
function animate() {
  i++;
  if (i == 25) {
    i = 0;
    playerImg = inactive;
    clearInterval(imgInt);
  }
}

var width = 175;
var height = 138;
function highScore() {
  //Hämtar highscore från localstorage
  var highScoreList = JSON.parse(localStorage.getItem("highscore"));

  if (highScoreList == null) {
    highScoreList = [];
  }


  //Rutan bakom poängen
  drawRect(canv.width / 2 - width / 2, canv.height / 2.26 - height / 2, width, height, "black", true);

  //För att sätta ett jämt avstånd mellan dom olika poängen
  var temp = canv.height / 2 - height / 2 - 10;

  for (let j = 0; j < highScoreList.length && j < 5; j++) {
    //Målar ut namn och poäng och använder j för position
    drawText(canv.width / 2 - width / 2 + 3, temp, "20px arial", "white", "start", j + 1 + ". " + `${highScoreList[j].key}: ${highScoreList[j].value}`);
    //Avståndet mellan positionerna
    temp += 25;
  }

  //Målar ut knapparna för att lägga till poäng och starta om
  drawRect(canv.width / 2 - width / 2, (canv.height / 2.26 + height / 2) + 5, width / 2.07, 25, "black", true);
  drawText((canv.width / 2 - width / 2) + (width / 2.07) / 2, (canv.height / 2.26 + height / 2) + 25, "bold 17px arial", "white", "center", "Restart");
  drawRect(canv.width / 2 + width / 2, (canv.height / 2.26 + height / 2) + 5, -width / 2.07, 25, "black", true);
  drawText((canv.width / 2 + width / 2) + (-width / 2.07) / 2, (canv.height / 2.26 + height / 2) + 25, "bold 16px arial", "white", "center", "Add Score");
}

//Gör samma sak som på addScore fast restarar
function restart(event) {
  if (isDead) {
    var pos = getMousePos(canv, event);
    if (pos.mouseX > canv.width / 2 - 175 / 2 && pos.mouseY > (canv.height / 2.26 + height / 2) && pos.mouseY < (canv.height / 2.26 + height / 2) + 25 && pos.mouseX < (canv.width / 2 - 175 / 2) + (175 / 2.07)) {
      reset();
      init();
    }
  }
}
document.addEventListener("click", restart);

//När man klickar på musen så går den in i funktionen och kollar om mus-positionen är inom Add Score knappen
function addScore(evt) {
  if (isDead) {
    var pos = getMousePos(canv, evt)
    if (pos.mouseX > (canv.width / 2 + 175 / 2) - (175 / 2.07) && pos.mouseY > (canv.height / 2.26 + height / 2) && pos.mouseY < (canv.height / 2.26 + height / 2) + 25 && pos.mouseX < canv.width / 2 + 175 / 2) {
      //Sparar undan score för att använda det i Index.html
      sessionStorage.setItem('tempScore', score);
      changePage();
    }
  }
}
document.addEventListener("click", addScore);

//Gör draw funktionerna så att det blir enklare
function drawRect(x, y, width, height, color, fill) {
  ctx.beginPath();
  ctx.rect(x, y, width, height)
  ctx.fillStyle = color;
  fill == true ? ctx.fill() : ctx.stroke();
  ctx.closePath();
}

function drawText(x, y, font, color, alignment, text) {
  ctx.beginPath();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = alignment;
  ctx.fillText(text, x, y);
  ctx.closePath();
}

function clearScreen() {
  ctx.clearRect(0, 0, canv.width, canv.height);
}

//Får musens position på canvasen på ett responsivt sätt
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

  return {
    mouseX: (evt.clientX - rect.left) * scaleX,
    mouseY: (evt.clientY - rect.top) * scaleY
  };
}
