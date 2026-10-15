// The SVG links retain their authored shape. Solve their rotations on the server
// so the gripper stays upright and the carried box follows the same tool path.
const base = { x: 146, y: 246 };
const upper = { x: -42, y: -107 };
const lower = { x: 134, y: -68 };
const wrist = { x: 61, y: 61 };
const upperLength = Math.hypot(upper.x, upper.y);
const lowerLength = Math.hypot(lower.x, lower.y);
const upperAngle = Math.atan2(upper.y, upper.x);
const lowerAngle = Math.atan2(lower.y, lower.x);
const radians = Math.PI / 180;

export const boxRestPosition = { x: 328, y: 274 } as const;
const gripOffset = 44;

type ToolPose = { x: number; y: number; wrist: number; opening: number };
const rest: ToolPose = { x: 300, y: 145, wrist: -10, opening: 18 };
const pickup: ToolPose = { x: 328, y: 230, wrist: 12, opening: 18 };
const grasp: ToolPose = { ...pickup, opening: 0 };
const lift: ToolPose = { x: 302, y: 151, wrist: -8, opening: 0 };

const poses: readonly { percent: number; tool: ToolPose }[] = [
  { percent: 0, tool: rest },
  { percent: 8, tool: rest },
  { percent: 28, tool: pickup },
  { percent: 36, tool: grasp },
  { percent: 53, tool: lift },
  { percent: 63, tool: lift },
  { percent: 80, tool: grasp },
  { percent: 88, tool: pickup },
  { percent: 100, tool: rest },
];

function toolPose(percent: number): ToolPose {
  const next = poses.findIndex((pose) => pose.percent >= percent);
  if (next <= 0) return rest;
  const start = poses[next - 1];
  const end = poses[next];
  if (!start || !end) return rest;
  const progress = (percent - start.percent) / (end.percent - start.percent);
  const eased = progress * progress * (3 - 2 * progress);
  const lerp = (from: number, to: number) => from + (to - from) * eased;
  return {
    x: lerp(start.tool.x, end.tool.x),
    y: lerp(start.tool.y, end.tool.y),
    wrist: lerp(start.tool.wrist, end.tool.wrist),
    opening: lerp(start.tool.opening, end.tool.opening),
  };
}

export function robotPose(percent: number) {
  const tool = toolPose(percent);
  const worldWrist = tool.wrist * radians;
  const dx =
    tool.x -
    base.x -
    (wrist.x * Math.cos(worldWrist) - wrist.y * Math.sin(worldWrist));
  const dy =
    tool.y -
    base.y -
    (wrist.x * Math.sin(worldWrist) + wrist.y * Math.cos(worldWrist));
  const cosine =
    (dx * dx + dy * dy - upperLength ** 2 - lowerLength ** 2) /
    (2 * upperLength * lowerLength);
  const bend = Math.acos(Math.max(-1, Math.min(1, cosine)));
  const shoulderAngle =
    Math.atan2(dy, dx) -
    Math.atan2(
      lowerLength * Math.sin(bend),
      upperLength + lowerLength * Math.cos(bend),
    );
  const shoulder = (shoulderAngle - upperAngle) / radians;
  const elbow = (shoulderAngle + bend - lowerAngle) / radians - shoulder;
  const carrying = percent >= 36 && percent <= 80;
  return {
    shoulder,
    elbow,
    wrist: tool.wrist - shoulder - elbow,
    tool: -tool.wrist,
    leftJaw: tool.opening,
    rightJaw: -tool.opening,
    boxX: carrying ? tool.x : boxRestPosition.x,
    boxY: carrying ? tool.y + gripOffset : boxRestPosition.y,
  };
}

export const restingRobotPose = robotPose(0);

// Sample every 2%, retaining each exact phase boundary. Three decimal places
// keep sub-pixel attachment precision without sending redundant CSS to visitors.
const percentages = [
  ...new Set([
    ...Array.from({ length: 51 }, (_, index) => index * 2),
    ...poses.map(({ percent }) => percent),
  ]),
].sort((a, b) => a - b);
const frames = percentages.map((percent) => ({
  percent,
  pose: robotPose(percent),
}));
function keyframes(
  name: string,
  transform: (pose: ReturnType<typeof robotPose>) => string,
) {
  return `@keyframes ${name}{${frames.map(({ percent, pose }) => `${percent}%{transform:${transform(pose)}}`).join("")}}`;
}

export const robotKeyframes = [
  keyframes(
    "robot-shoulder",
    (pose) => `rotate(${pose.shoulder.toFixed(3)}deg)`,
  ),
  keyframes("robot-elbow", (pose) => `rotate(${pose.elbow.toFixed(3)}deg)`),
  keyframes("robot-wrist", (pose) => `rotate(${pose.wrist.toFixed(3)}deg)`),
  keyframes("robot-tool", (pose) => `rotate(${pose.tool.toFixed(3)}deg)`),
  keyframes(
    "robot-jaw-left",
    (pose) => `rotate(${pose.leftJaw.toFixed(3)}deg)`,
  ),
  keyframes(
    "robot-jaw-right",
    (pose) => `rotate(${pose.rightJaw.toFixed(3)}deg)`,
  ),
  keyframes(
    "robot-box",
    (pose) => `translate(${pose.boxX.toFixed(3)}px,${pose.boxY.toFixed(3)}px)`,
  ),
].join("");
