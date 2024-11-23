const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const heroImg = new Image();
heroImg.src = "./hero.svg";

let isMouseDown = false;
let canMove = false;
let canMoveBackward = false;

class Hero {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 42;
    this.height = 45;
    this.speed = 3;
  }

  draw() {
    ctx.drawImage(heroImg, this.x, this.y);
  }

  move() {
    if (canMove) {
      this.x += this.speed;
    } else if (canMoveBackward && this.x > 10) {
      this.x -= this.speed;
    }
  }
}

class Stick {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.rotationSpeed = 0.05;
  }

  grow() {
    this.height -= 2;
  }

  rotate() {
    if (this.angle < Math.PI / 2) {
      this.angle += this.rotationSpeed;
    } else {
      this.angle = Math.PI / 2;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.restore();
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 3;
  }

  draw() {
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  move() {
    this.x -= this.speed;
  }
}

canvas.addEventListener("mousedown", (e) => {
  isMouseDown = true;
});
canvas.addEventListener("mouseup", (e) => {
  isMouseDown = false;
});

const player = new Hero(10, 350);
const stick = new Stick(
  player.x + player.width,
  player.y + player.height,
  5,
  0
);

const p1 = new Platform(
  player.x,
  player.y + player.height,
  60,
  canvas.height - 350
);
const p2 = new Platform(200, 350 + player.height, 60, canvas.height - 350);

const platforms = [p1, p2];

function createPlatforms() {
  const lastPlatform = platforms[platforms.length - 1];
  const newX = lastPlatform.x + lastPlatform.width + Math.random() * 100 + 50;
  const newWidth = Math.random() * 50 + 40;
  platforms.push(
    new Platform(newX, 350 + player.height, newWidth, canvas.height - 350)
  );
}

function resetStick(stick, player) {
  stick.x = 10 + player.width;
  stick.y = player.y + player.height;
  stick.width = 5;
  stick.height = 0;
  stick.angle = 0;
  if(player.x === 10){
    canMoveBackward = false;
  }
}

function movePlatforms() {
  if (canMoveBackward) {
    platforms.forEach((platform) => platform.move());
  }
}

function gameLoop() {
    console.log("player.x: "+player.x)
    console.log("stick.x: "+stick.x)
    console.log("stick.height: "+stick.height)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  player.move();
  stick.draw();
  movePlatforms();
  if (isMouseDown) {
    stick.grow();
  }

  if (!isMouseDown && stick.height < 0) {
    stick.rotate();
    if (stick.angle === Math.PI / 2) {
      canMove = true;
    }
  }
  platforms.forEach((platform) => platform.draw());
  const lastPlatform = platforms[platforms.length - 1];
  if (player.x + canvas.width / 2 > lastPlatform.x) {
    createPlatforms();
  }
  if (platforms[0].x + platforms[0].width < 0) {
    platforms.shift();
  }

  if (player.x >= stick.height * -1 + stick.x - 15) {
    canMove = false;
    canMoveBackward = true;
    resetStick(stick, player);
    
  } 
   if(player.x === 10 ){
    canMoveBackward = false;
   }
   
  requestAnimationFrame(gameLoop);
}
 
heroImg.onload = () => {
  gameLoop();
};
