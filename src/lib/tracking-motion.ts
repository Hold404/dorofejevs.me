// One trajectory drives the ball, its court projection, and all three camera rays.
// Frames are generated on the server; the browser only interpolates CSS transforms.
export const cameras = [
  { x: 62, y: 96 },
  { x: 490, y: 94 },
  { x: 470, y: 285 },
] as const;

export function ballPosition(progress: number) {
  const x = 170 + 220 * progress;
  const groundY = 230 - 40 * progress;
  return { x, y: groundY - 480 * progress * (1 - progress), groundY };
}

export function rayTransform(
  camera: (typeof cameras)[number],
  progress: number,
) {
  const ball = ballPosition(progress);
  const dx = ball.x - camera.x;
  const dy = ball.y - camera.y;
  // Keep angles on the same branch as the start of the flight. CAM 02 crosses
  // atan2's +π/-π boundary; interpolating those raw values spins the ray around.
  const start = ballPosition(0);
  const reference = Math.atan2(start.y - camera.y, start.x - camera.x);
  let angle = Math.atan2(dy, dx);
  while (angle - reference > Math.PI) angle -= 2 * Math.PI;
  while (angle - reference < -Math.PI) angle += 2 * Math.PI;
  return `rotate(${angle}rad) scaleX(${Math.hypot(dx, dy)})`;
}

const frames = Array.from({ length: 41 }, (_, index) => ({
  percent: index * 2,
  progress: index / 40,
})).concat([
  { percent: 90, progress: 1 },
  { percent: 100, progress: 1 },
]);

function keyframes(name: string, transform: (progress: number) => string) {
  return `@keyframes ${name}{${frames
    .map(
      ({ percent, progress }) =>
        `${percent}%{transform:${transform(progress)}}`,
    )
    .join("")}}`;
}

export const trackingKeyframes = [
  keyframes("tracking-ball", (progress) => {
    const { x, y } = ballPosition(progress);
    return `translate(${x}px,${y}px)`;
  }),
  keyframes("tracking-shadow", (progress) => {
    const { x, groundY } = ballPosition(progress);
    return `translate(${x}px,${groundY}px)`;
  }),
  ...cameras.map((camera, index) =>
    keyframes(`tracking-ray-${index}`, (progress) =>
      rayTransform(camera, progress),
    ),
  ),
].join("");
