let player;
let items = [];
let obstacles = [];
let gameState = "playing"; // ou "gameOver"
let score = 0;
let level = 1; // Fase do jogo
let creditsY = -50; // Posição inicial do texto dos créditos
let creditSpeed = 2; // Velocidade do movimento dos créditos

function setup() {
  createCanvas(800, 600);
  player = new Player();
  
  // Adiciona itens e obstáculos na fase inicial
  generateLevel(level);
}

function draw() {
  background(200);
  
  if (gameState === "playing") {
    player.update();
    player.display();
    
    // Desenha itens
    for (let i = items.length - 1; i >= 0; i--) {
      items[i].display();
      if (player.collectItem(items[i])) {
        items.splice(i, 1);
        score++;
      }
    }
    
    // Desenha obstáculos
    for (let obs of obstacles) {
      obs.display();
      if (player.collidesWith(obs)) {
        gameState = "gameOver"; // Mudando para "gameOver" quando colide com um obstáculo
      }
    }
    
    displayScore();
    
    // Verifica se o jogador coletou todos os itens para avançar de fase
    if (items.length === 0) {
      nextLevel();
    }
  } else if (gameState === "gameOver") {
    displayGameOver();
    
    // Movendo os créditos para baixo
    if (creditsY < height) {
      creditsY += creditSpeed;
    } else {
      creditsY = -50; // Reinicia a posição dos créditos quando eles saem da tela
    }
  
    // Exibindo créditos em movimento
    displayCredits();
  }
}

function displayScore() {
  fill(0);
  textSize(24);
  text("Score: " + score, 20, 30);
  text("Fase: " + level, width - 150, 30); // Exibe a fase atual
}

function displayCredits() {
  fill(255); // Créditos em branco
  textSize(16);
  textAlign(CENTER, CENTER);
  
  // Mensagens de créditos em movimento
  text("Créditos: ", width / 2, creditsY);
  text("Jogo criado com P5.js", width / 2, creditsY + 20);
  text("Ideia do ChatGPT", width / 2, creditsY + 40);
  text("Canais do YouTube recomendados:", width / 2, creditsY + 60);
  text("1. Canal A", width / 2, creditsY + 80);
  text("2. Canal B", width / 2, creditsY + 100);
  text("3. Canal C", width / 2, creditsY + 120);
}

function displayGameOver() {
  background(0);
  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2 - 50);
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
  // Limpa os itens e obstáculos antigos
  items = [];
  obstacles = [];
  
  // Gera itens baseados no nível
  for (let i = 0; i < level * 5; i++) { // Aumenta o número de itens por nível
    items.push(new Item(random(50, width-50), random(50, height-50)));
  }
  
  // Gera obstáculos baseados no nível
  for (let i = 0; i < level * 3; i++) { // Aumenta o número de obstáculos por nível
    obstacles.push(new Obstacle(random(50, width-50), random(50, height-50)));
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
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }
  }
  
  display() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
  
  collectItem(item) {
    let d = dist(this.x, this.y, item.x, item.y);
    return d < this.size / 2 + item.size / 2;
  }
  
  collidesWith(obstacle) {
    let d = dist(this.x, this.y, obstacle.x, obstacle.y);
    return d < this.size / 2 + obstacle.size / 2;
  }
}

class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
  }
  
  display() {
    fill(0, 255, 0);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}

class Obstacle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40;
  }
  
  display() {
    fill(0);
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }
}
