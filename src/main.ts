import "./style.css";

const W = 128;
const H = 64;
const PIXEL_SIZE = 4;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let data: number[][][] = [createGrid(W, H), createGrid(W, H)];
let dataIndex = 0;

let frame = 0;
const F = 2;

let running = true;

const palette = new Array(64);
for (let i = 0; i < 32; i++) {
  palette[i] = `rgb(${i * 8}, 0, 0)`;
}
for (let i = 32; i < 64; i++) {
  palette[i] = `rgb(255, ${(i - 32) * 8}, 0)`;
}

function main() {
  canvas = document.querySelector("canvas") as HTMLCanvasElement;

  if (!canvas) {
    console.error("no canvas in dom");
    return;
  }

  canvas.width = W * PIXEL_SIZE;
  canvas.height = H * PIXEL_SIZE;

  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  window.requestAnimationFrame(function f() {
    if (running) {
      render();
    }

    window.requestAnimationFrame(f);
  });
}

window.addEventListener("keyup", function (e) {
  if (e.code === "Space") {
    // render();
    running = !running;
  }

  if (!running && e.code === "Enter") {
    render();
  }
});

function render() {
  if (!running || frame % F === 0) {
    update();
    draw();
    dataIndex = (dataIndex + 1) % 2;
  }

  frame++;
}

function update() {
  const d1 = data[dataIndex];
  const d2 = data[(dataIndex + 1) % 2];

  for (let x = 0; x < data[0][0].length; x += 2) {
    const val = Math.random() >= 0.5 ? 63 : 0;
    d1[H - 1][x] = val;
    d1[H - 1][x + 1] = val;
    d1[H - 2][x] = val;
    d1[H - 2][x + 1] = val;
  }

  for (let y = H - 2; y > 0; y--) {
    for (let x = 1; x < W - 1; x++) {
      let v = Math.floor(
        (d1[y][x] + d1[y][x - 1] + d1[y][x + 1] + d1[y + 1][x]) / 4
      );
      if (v > 1) {
        v -= 1;
      }
      d2[y - 1][x] = v > 0 ? v : 0;
    }
  }
}

function draw() {
  const d = data[(dataIndex + 0) % 2];

  for (let y = 0; y < d.length - 3; y++) {
    for (let x = 0; x < d[0].length; x++) {
      const val = d[y][x];
      ctx.fillStyle = palette[val];
      ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    }
  }

  // render palette
  // for (let x = 0; x < 64; x++) {
  //   ctx.fillStyle = palette[x];
  //   ctx.fillRect(
  //     x * PIXEL_SIZE,
  //     (H - 1) * PIXEL_SIZE,
  //     PIXEL_SIZE - 1,
  //     PIXEL_SIZE - 1
  //   );
  // }
}

function createGrid(w = 10, h = 10): number[][] {
  if (w < 10) {
    throw new Error("table width must be at least 10");
  }

  if (h < 2) {
    throw new Error("table height must be at least 2");
  }

  const grid = new Array(h);

  for (let y = 0; y < h; y++) {
    grid[y] = new Array(w);
    for (let x = 0; x < w; x++) {
      grid[y][x] = 0;
    }
  }

  return grid;
}

main();
