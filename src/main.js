const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Параметри зорельота
const spaceship = {
  x: canvas.width / 2 - 25, // Початкове положення по X
  y: canvas.height - 60, // Положення внизу
  width: 50, // Ширина зорельота
  height: 30, // Висота зорельота
  color: "white", // Колір зорельота
  speed: 5, // Швидкість руху
};

// Масив для зберігання куль
const bullets = [];
const bulletSpeed = 7; // Швидкість руху кулі

// Змінні для відстеження натиснення клавіш
const keys = {};

// Обробники клавіш
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  // Стрільба при натисканні пробілу
  if (e.key === " " && bullets.length < 10) {
    bullets.push({
      x: spaceship.x + spaceship.width / 2 - 2, // Початкова позиція кулі
      y: spaceship.y, // Верхній край зорельота
      width: 4, // Ширина кулі
      height: 10, // Висота кулі
      color: "red", // Колір кулі
    });
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Функція оновлення положення
function update() {
  // Рух зорельота
  if (keys["ArrowLeft"] && spaceship.x > 0) {
    spaceship.x -= spaceship.speed;
  }
  if (keys["ArrowRight"] && spaceship.x + spaceship.width < canvas.width) {
    spaceship.x += spaceship.speed;
  }

  // Оновлення положення куль
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bulletSpeed; // Кулі рухаються вгору
    if (bullets[i].y + bullets[i].height < 0) {
      bullets.splice(i, 1); // Видаляємо кулі, які виходять за межі екрана
    }
  }
}

// Функція малювання
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищення екрану

  // Малювання зорельота
  ctx.fillStyle = spaceship.color;
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

  // Малювання куль
  bullets.forEach((bullet) => {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// Основний ігровий цикл
function gameLoop() {
  update(); // Оновлюємо положення
  draw(); // Малюємо
  requestAnimationFrame(gameLoop); // Повторюємо цикл
}

// Запуск гри
gameLoop();
