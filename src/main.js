import kaboom from "kaboom";

// initialize context
kaboom();

// load assets
loadSprite("bird", "sprites/bird.png");
loadSprite("bg", "sprites/bg.png");
loadSprite("pipe", "sprites/pipe.png");

//load sounds
loadSound("jump", "sounds/jump.mp3");
loadSound("bruh", "sounds/bruh.mp3");
loadSound("pass", "sounds/pass.mp3");

// track the high score
let highScore = localStorage.getItem("highScore") || 0;

// Game scene
scene("game", () => {
  const PIPE_GAP = 140;
  let score = 0;
  setGravity(1600);

  add([sprite("bg", { width: width(), height: height() })]);

  const scoreText = add([text(score), pos(12, 12)]);

  const player = add([
    sprite("bird"),
    scale(1.2),
    pos(100, 50),
    area(),
    body(),
  ]);

  function createPipe() {
    const offset = rand(-50, 50);
    // bottom pipe
    add([
      sprite("pipe"),
      pos(width(), height() / 2 + offset + PIPE_GAP / 2),
      "pipe",
      scale(2),
      area(),
      { passed: false },
    ]);

    // top pipe
    add([
      sprite("pipe", { flipY: true }),
      pos(width(), height() / 2 + offset - PIPE_GAP / 2),
      "pipe",
      anchor("botleft"),
      scale(2),
      area(),
    ]);
  }

  loop(1.5, () => createPipe());

  onUpdate("pipe", (pipe) => {
    pipe.move(-300, 0);

    if (pipe.pos.x < player.pos.x && pipe.passed === false) {
      pipe.passed = true;
      score += 1;
      scoreText.text = score;
      play("pass");
    }
  });

  // player collides with pipe
  player.onCollide("pipe", () => {
    const ss = screenshot();
    go("gameover", score, ss);
  });

  // game over when player collides with ground
  player.onUpdate(() => {
    if (player.pos.y > height()) {
      const ss = screenshot();
      go("gameover", score, ss);
    }
  });

  onKeyPress("space", () => {
    player.jump(400);
    play("jump");
  });
  // for touch
  window.addEventListener("touchstart", () => {
    player.jump(400);
    play("jump");
  });
});

// Game over Scene
scene("gameover", (score, screenshot) => {
  if (score > highScore) highScore = score;
  play("bruh");

  loadSprite("gameOverScreen", screenshot);
  add([sprite("gameOverScreen", { width: width(), height: height() })]);

  add([
    text("gameover!\n" + "score:" + "\nhigh score: " + highScore, { size: 45 }),
  ]),
    pos(width() / 2, height() / 3);

  onKeyPress("space", () => {
    go("game");
  });
});

// start the game
go("game");
