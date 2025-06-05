let player;
let items = [];
let obstacles = [];
let gameState = "playing";
let score = 0;
let level = 1;
let creditsY = -50;
let creditSpeed = 2;

function setup() {
  createCanvas(800, 600);
  player = new Player();
  generateLevel(level);
}

function draw() {
  background(200);

  if (gameState === "playing") {
    player.update();
    player.display();

    for (let i = items.length - 1; i >= 0; i--) {
      items[i].display();
      if (player.collectItem(items[i])) {
        items.splice(i, 1);
        score++;
      }
    }

    for (let obs of obstacles) {
      obs.display();
      if (player.collidesWith(obs)) {
        gameState = "gameOver";
      }
    }

    displayScore();

    if (items.length === 0) {
      nextLevel();
    }
  } else if (gameState === "gameOver") {
    displayGameOver();

    if (creditsY < height) {
      creditsY += creditSpeed;
    } else {
      creditsY = -50;
    }

    displayCredits();
  }
}

function displayScore() {
  fill(0);
  textSize(24);
  text("Score: " + score, 20, 30);
  text("Fase: " + level, width - 150, 30);
}

function displayCredits() {
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);

  text("Créditos: ", width / 6, creditsY);
  text("Jogo criado com P5.js", width / 6, creditsY + 20);
  text("Ideia do ChatGPT", width / 6, creditsY + 40);
  text("Canais do YouTube", width / 6, creditsY + 60);
}

function displayGameOver() {
  background(0);
  textAlign(CENTER, CENTER);

  fill(255, 0, 0);
  textSize(48);
  text("Game Over", width / 2, height / 2 - 50);

  fill(0, 0, 255);
  textSize(24);
  text("Press 'R' to Restart", width / 2, height / 2 + 50);

  if (keyIsPressed && key === 'r') {
    resetGame();
  }
}

function nextLevel() {
  level++;
  score = 0;
  generateLevel(level);
}

function generateLevel(level) {
  items = [];
  obstacles = [];

  for (let i = 0; i < level * 3; i++) {
    let w = 50;
    let h = random(60, 150);
    let x = random(50, width - w - 50);
    let y = random(50, height - h - 50);
    obstacles.push(new Obstacle(x, y, w, h));
  }

  for (let i = 0; i < level * 5; i++) {
    let valid = false;
    let attempts = 0;
    while (!valid && attempts < 100) {
      let x = random(50, width - 50);
      let y = random(50, height - 50);
      let tooClose = false;

      for (let obs of obstacles) {
        let d = dist(x, y, obs.x + obs.w / 2, obs.y + obs.h / 2);
        if (d < 80) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        items.push(new Item(x, y));
        valid = true;
      }
      attempts++;
    }
  }
}

function resetGame() {
  level = 1;
  score = 0;
  gameState = "playing";
  generateLevel(level);
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.size = 30;
    this.speed = 5;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    if (keyIsDown(UP_ARROW)) this.y -= this.speed;
    if (keyIsDown(DOWN_ARROW)) this.y += this.speed;
  }

  display() {
    push();
    translate(this.x, this.y);
    noStroke();

    // Cabeça
    fill(255, 204, 153); // cor de pele
    ellipse(0, -20, 20, 20);

    // Corpo
    fill(255, 0, 0); // vermelho
    rectMode(CENTER);
    rect(0, 0, 15, 25, 5);

    // Braços
    stroke(0);
    strokeWeight(2);
    line(-10, -5, -18, 10); // braço esquerdo
    line(10, -5, 18, 10);   // braço direito

    // Pernas
    line(-5, 13, -5, 25);  // perna esquerda
    line(5, 13, 5, 25);    // perna direita

    // Olhos
    noStroke();
    fill(0);
    ellipse(-4, -22, 3, 3);
    ellipse(4, -22, 3, 3);

    pop();
  }

  collectItem(item) {
    let d = dist(this.x, this.y, item.x, item.y);
    return d < this.size / 2 + item.size / 2;
  }

  collidesWith(obstacle) {
    return (
      this.x + this.size / 2 > obstacle.x &&
      this.x - this.size / 2 < obstacle.x + obstacle.w &&
      this.y + this.size / 2 > obstacle.y &&
      this.y - this.size / 2 < obstacle.y + obstacle.h
    );
  }
}

class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
  }

  display() {
    noStroke();
    fill(144, 238, 144); // verde-pêra

    // Corpo da pêra
    ellipse(this.x, this.y + 4, this.size * 0.9, this.size * 1.2);

    // Cabinho
    stroke(101, 67, 33); // marrom
    strokeWeight(2);
    line(this.x, this.y - 8, this.x, this.y - 2);
  }
}

class Obstacle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    fill(60);
    stroke(40);
    rect(this.x, this.y, this.w, this.h);

    let cols = 3;
    let rows = floor(this.h / 20);
    let windowW = 8;
    let windowH = 10;
    fill(255, 255, 100);
    noStroke();

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let wx = this.x + 8 + i * (this.w - 16) / (cols - 1) - windowW / 2;
        let wy = this.y + 10 + j * 20;
        rect(wx, wy, windowW, windowH);
      }
    }
  }
}

