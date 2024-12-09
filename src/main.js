const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Параметри гри
let gameOver = false;
let displayMessage = "";
let showMessage = false;
let timer = 60;
let level = 1;
let bossHP = 4;
let bossBullets = [];
let ammo = 10;

function drawBackground(ctx, canvas) {
  const stars = [];
  const planets = [];

  // Ініціалізуємо зірки
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      brightness: Math.random() * 255,
    });
  }

  // Ініціалізуємо планети
  for (let i = 0; i < 5; i++) {
    planets.push({
      x: Math.random() * canvas.width,
      y: (Math.random() * canvas.height) / 2,
      radius: Math.random() * 20 + 10,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    });
  }

  function renderStars() {
    stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
      ctx.fill();
    });
  }

  function renderPlanets() {
    planets.forEach((planet) => {
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = planet.color;
      ctx.fill();
    });
  }

  function renderBackground() {
    // Очищення для створення "мерехтіння"
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Малюємо зірки
    renderStars();

    // Малюємо планети
    renderPlanets();
  }

  return renderBackground;
}

// Параметри зорельота
const spaceship = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 50,
  width: 50,
  height: 20,
  color: "white",
  speed: 5,
};

// Астероїди (для 1-го рівня)
let asteroids = [];
function createAsteroids() {
  for (let i = 0; i < 7; i++) {
    asteroids.push({
      x: Math.random() * (canvas.width - 50),
      y: Math.random() * (canvas.height / 2),
      width: 50,
      height: 50,
      color: "gray",
    });
  }
}

// Параметри Боса (для 2-го рівня)
const boss = {
  x: canvas.width / 2 - 50,
  y: 50,
  width: 100,
  height: 50,
  color: "red",
  speed: 2,
  direction: 1,
};

// Кулі гравця
let bullets = [];

// Події клавіатури
let keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (!gameOver && e.key === " " && ammo > 0) {
    bullets.push({
      x: spaceship.x + spaceship.width / 2 - 7.5,
      y: spaceship.y,
      width: 15,
      height: 30,
      speed: 7,
      color: "red",
    });
    ammo--;
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Функція перевірки зіткнень куль з астероїдами
function checkAsteroidCollisions() {
  bullets.forEach((bullet, bIndex) => {
    asteroids.forEach((asteroid, aIndex) => {
      if (
        bullet.x < asteroid.x + asteroid.width &&
        bullet.x + bullet.width > asteroid.x &&
        bullet.y < asteroid.y + asteroid.height &&
        bullet.y + bullet.height > asteroid.y
      ) {
        bullets.splice(bIndex, 1);
        asteroids.splice(aIndex, 1);
      }
    });
  });
}

// Перехід на другий рівень
function startSecondLevel() {
  level = 2;
  showMessage = true;
  displayMessage = "BOSS";
  setTimeout(() => {
    showMessage = false;
    ammo = 10;
    timer = 60;
  }, 2000);
}

// Функція стрільби Боса
function bossShoot() {
  if (!gameOver && level === 2) {
    bossBullets.push({
      x: boss.x + boss.width / 2 - 7.5,
      y: boss.y + boss.height,
      width: 15,
      height: 30,
      speed: 5,
      color: "yellow",
    });
  }
}
setInterval(bossShoot, 2000);

// Логіка руху Боса
function moveBoss() {
  if (level === 2) {
    boss.x += boss.speed * boss.direction;
    if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
      boss.direction *= -1;
    }
  }
}

// Оновлення логіки гри
function update() {
  if (gameOver || showMessage) return;

  // Рух зорельота
  if (keys["ArrowLeft"] && spaceship.x > 0) {
    spaceship.x -= spaceship.speed;
  }
  if (keys["ArrowRight"] && spaceship.x + spaceship.width < canvas.width) {
    spaceship.x += spaceship.speed;
  }

  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y + bullet.height < 0) bullets.splice(index, 1);
  });

  if (level === 1) {
    checkAsteroidCollisions();
    if (asteroids.length === 0) startSecondLevel();
  }

  if (level === 2) {
    moveBoss();

    // Зіткнення куль гравця з Босом
    bullets.forEach((bullet, bIndex) => {
      if (
        bullet.x < boss.x + boss.width &&
        bullet.x + bullet.width > boss.x &&
        bullet.y < boss.y + boss.height &&
        bullet.y + bullet.height > boss.y
      ) {
        bullets.splice(bIndex, 1);
        bossHP--;
        if (bossHP <= 0) {
          gameOver = true;
          displayMessage = "YOU WIN";
        }
      }
    });

    // Зіткнення куль Боса із зорельотом
    bossBullets.forEach((bullet, bIndex) => {
      if (
        bullet.x < spaceship.x + spaceship.width &&
        bullet.x + bullet.width > spaceship.x &&
        bullet.y < spaceship.y + spaceship.height &&
        bullet.y + bullet.height > spaceship.y
      ) {
        gameOver = true;
        displayMessage = "YOU LOSE";
      }
    });

    // Зіткнення куль гравця та Боса
    bullets = bullets.filter((bullet) => {
      return !bossBullets.some((bBullet, index) => {
        const collided =
          bullet.x < bBullet.x + bBullet.width &&
          bullet.x + bullet.width > bBullet.x &&
          bullet.y < bBullet.y + bBullet.height &&
          bullet.y + bullet.height > bBullet.y;
        if (collided) bossBullets.splice(index, 1);
        return collided;
      });
    });

    bossBullets = bossBullets.filter((bullet) => bullet.y <= canvas.height);
  }
}

// Малювання
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (showMessage) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText(displayMessage, canvas.width / 2 - 100, canvas.height / 2);
    return;
  }

  ctx.fillStyle = spaceship.color;
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

  bullets.forEach((bullet) => {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  if (level === 1) {
    asteroids.forEach((asteroid) => {
      ctx.fillStyle = asteroid.color;
      ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
    });
  }

  if (level === 2) {
    ctx.fillStyle = boss.color;
    ctx.fillRect(boss.x, boss.y, boss.width, boss.height);

    ctx.fillStyle = "green";
    ctx.fillRect(boss.x, boss.y - 10, (bossHP / 4) * boss.width, 5);

    bossBullets.forEach((bullet) => {
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
  }

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Ammo: ${ammo}`, 10, 30);
  ctx.fillText(`Time: ${timer}`, 10, 60);

  if (gameOver) {
    ctx.fillStyle = displayMessage === "YOU WIN" ? "green" : "red";
    ctx.font = "40px Arial";
    ctx.fillText(displayMessage, canvas.width / 2 - 100, canvas.height / 2);
  }
}

const renderBackground = drawBackground(ctx, canvas); // Ініціалізуємо задній фон

// Ігровий цикл
function gameLoop() {
  renderBackground(); // Малюємо задній фон
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

function startGame() {
  createAsteroids();
  gameLoop();
}

startGame();
