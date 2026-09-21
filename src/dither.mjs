// Animated, background-only adaptation of Canvas UI's vanilla Bayer dither.
// https://canvasui.dev/docs/components/retro-dither
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function drawDitherBackground(canvas) {
  const context = canvas?.getContext("2d");
  if (!context) return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let last = -Infinity;
  let pointerX = 0;
  let pointerY = 0;
  const resize = () => {
    canvas.width = Math.ceil(window.innerWidth / 3);
    canvas.height = Math.ceil(window.innerHeight / 3);
  };
  const draw = (now = 0) => {
    if (motion.matches || document.hidden) return;
    // 20fps is enough for this slow background; pixel geometry actually evolves.
    if (now - last >= 50) {
      last = now;
      const t = now / 6500;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#aaa99e";
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const wave = Math.sin(x / 65 + t + pointerX + 1.7 * Math.sin(y / 100 - t / 2))
            + Math.cos(y / 70 - t * .7 + pointerY + Math.sin(x / 90 + t / 3));
          const density = Math.max(0, (wave + .65) * .22);
          if (density > (BAYER[(y % 4) * 4 + x % 4] + .5) / 16) context.fillRect(x, y, 1, 1);
        }
      }
    }
    frame = requestAnimationFrame(draw);
  };
  const restart = () => {
    cancelAnimationFrame(frame);
    last = -Infinity;
    draw(performance.now());
  };
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX / window.innerWidth * .35;
    pointerY = event.clientY / window.innerHeight * .35;
  }, { passive: true });
  motion.addEventListener("change", restart);
  document.addEventListener("visibilitychange", restart);
  resize();
  draw();
}
