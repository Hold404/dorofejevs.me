import { test, expect, type Locator } from "@playwright/test";

async function freezeAnimations(figure: Locator) {
  await figure.evaluate(async (element) => {
    const animations = element.getAnimations({ subtree: true });
    animations.forEach((animation) => animation.pause());
    await Promise.all(animations.map((animation) => animation.ready));
  });
}

async function seek(figure: Locator, time: number) {
  await figure.evaluate((element, currentTime) => {
    element.getAnimations({ subtree: true }).forEach((animation) => {
      animation.currentTime = currentTime;
    });
  }, time);
}

test("robot scene has no visible labels and loops without controls", async ({
  page,
}) => {
  await page.goto("/");
  const note = page.locator(".robot-note");
  await expect(note.getByRole("img", { name: "A robot arm" })).toBeVisible();
  await expect(note.locator(".diagram-label, figcaption")).toHaveCount(0);
  await expect(note.getByRole("link")).toHaveCount(0);
  await expect(note).not.toContainText(
    /Robotics Startup|Conceptual illustration|Three cameras|one trajectory|Rust edge client|Go backend/,
  );
  await expect(note.getByRole("button")).toHaveCount(0);
  await expect(note).toHaveAttribute("data-motion-visible", "true");
  const shoulder = note.locator(".robot-shoulder");
  const transform = () =>
    shoulder.evaluate((element) => getComputedStyle(element).transform);
  const initial = await transform();
  await expect.poll(transform).not.toBe(initial);
  const timing = await note.evaluate((element) =>
    element.getAnimations({ subtree: true }).map((animation) => ({
      state: animation.playState,
      looping: animation.effect?.getTiming().iterations === Infinity,
    })),
  );
  expect(timing.length).toBeGreaterThan(0);
  for (const part of timing) {
    expect(part.state).toBe("running");
    expect(part.looping).toBe(true);
  }
});

test("manipulator grips the box, lifts it, replaces it, and repeats continuously", async ({
  page,
}) => {
  await page.goto("/");
  const note = page.locator(".robot-note");
  await expect(note).toHaveAttribute("data-motion-visible", "true");
  await freezeAnimations(note);
  const positions = () =>
    note.evaluate((element) => {
      const box = element.querySelector<SVGGElement>(".robot-box")!;
      const tool = element.querySelector<SVGGElement>(".robot-tool")!;
      const leftJaw = element.querySelector<SVGPathElement>(".robot-jaw-left")!;
      const rightJaw =
        element.querySelector<SVGPathElement>(".robot-jaw-right")!;
      const center = new DOMPoint(0, 0).matrixTransform(box.getCTM()!);
      const grip = new DOMPoint(0, 44).matrixTransform(tool.getCTM()!);
      const left = new DOMPoint(0, 30).matrixTransform(leftJaw.getCTM()!);
      const right = new DOMPoint(0, 30).matrixTransform(rightJaw.getCTM()!);
      return {
        x: center.x,
        y: center.y,
        gripError: Math.hypot(center.x - grip.x, center.y - grip.y),
        opening: right.x - left.x,
      };
    });
  await seek(note, 0);
  const rest = await positions();
  await seek(note, 2240); // Reached the box; jaws still open.
  const reached = await positions();
  expect(reached.x).toBeCloseTo(rest.x, 2);
  expect(reached.y).toBeCloseTo(rest.y, 2);
  await seek(note, 2880); // Grasp is complete before lifting.
  const grasped = await positions();
  expect(grasped.opening).toBeLessThan(reached.opening - 15);
  for (let time = 2880; time <= 6400; time += 40) {
    await seek(note, time);
    expect(
      (await positions()).gripError,
      `box attachment at ${time}ms`,
    ).toBeLessThan(0.5);
  }
  await seek(note, 4640);
  const lifted = await positions();
  expect(lifted.y).toBeLessThan(rest.y - 70);
  await seek(note, 6400);
  const replaced = await positions();
  expect(replaced.x).toBeCloseTo(rest.x, 2);
  expect(replaced.y).toBeCloseTo(rest.y, 2);
  await seek(note, 7040);
  expect((await positions()).opening).toBeGreaterThan(grasped.opening + 15);
  await seek(note, 8000);
  const next = await positions();
  expect(next.x).toBeCloseTo(rest.x, 2);
  expect(next.y).toBeCloseTo(rest.y, 2);
  expect(next.opening).toBeCloseTo(rest.opening, 2);
  await seek(note, 12640);
  const secondLift = await positions();
  expect(secondLift.x).toBeCloseTo(lifted.x, 2);
  expect(secondLift.y).toBeCloseTo(lifted.y, 2);
  expect(secondLift.gripError).toBeLessThan(0.5);
});

test("robotics illustration stays still with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const note = page.locator(".robot-note");
  await note.scrollIntoViewIfNeeded();
  await expect(note.getByRole("button")).toHaveCount(0);
  for (const part of await note.locator(".robot-motion").all())
    await expect(part).toHaveCSS("animation-name", "none");
  expect(
    await note.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
});

test("name and biography are vertically centered beside the manipulator", async ({
  page,
}) => {
  for (const width of [768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.goto("/");
    await expect(page.locator(".hero-copy h1")).toHaveText("Jegors Dorofejevs");
    await page.evaluate(() => document.fonts.ready);
    const copy = (await page.locator(".hero-copy").boundingBox())!;
    const robot = (await page.locator(".robot-note").boundingBox())!;
    expect(
      Math.abs(copy.y + copy.height / 2 - robot.y - robot.height / 2),
    ).toBeLessThanOrEqual(2);
    expect(copy.x + copy.width).toBeLessThan(robot.x);
  }
});

test("personal introduction explains the current robotics work and education", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-description")).toContainText("CTO at");
  await expect(page.locator(".hero-description")).toContainText(
    "release signing and backend reliability",
  );
  await expect(page.locator(".hero-description")).toContainText(
    "we’re building",
  );
  await expect(page.locator(".hero-description")).toContainText(
    "Applied Mathematics",
  );
  await expect(
    page
      .locator(".hero-description")
      .getByRole("link", { name: "Robotics Startup" }),
  ).toHaveAttribute("href", "/work/robotics-startup");
});

test("volleyball keeps moving across repeat cycles without controls", async ({
  page,
}) => {
  await page.goto("/projects/volleyball-tracking");
  const figure = page.locator(".tracking-figure");
  await figure.scrollIntoViewIfNeeded();
  await expect(figure).toHaveAttribute("data-motion-visible", "true");
  await expect(figure.locator(".diagram-label")).toHaveText(
    "Three cameras → one trajectory",
  );
  await expect(figure.getByRole("button")).toHaveCount(0);
  const ball = figure.locator(".tracking-ball");
  const transform = () =>
    ball.evaluate((element) => getComputedStyle(element).transform);
  const initial = await transform();
  await expect.poll(transform).not.toBe(initial);
  await expect(ball).toHaveCSS("animation-iteration-count", "infinite");
  await expect(ball).toHaveCSS("animation-direction", "alternate");
  await freezeAnimations(figure);
  await seek(figure, 1600);
  const first = await transform();
  await seek(figure, 11200);
  expect(await transform()).toBe(first);
  await seek(figure, 12000);
  expect(await transform()).not.toBe(first);
  await expect(figure.locator(".tracking-fade")).toHaveCSS("opacity", "1");
});

test("camera rays stay on the ball between keyframes and across both loop boundaries", async ({
  page,
}) => {
  await page.goto("/projects/volleyball-tracking");
  const figure = page.locator(".tracking-figure");
  await figure.scrollIntoViewIfNeeded();
  await expect(figure).toHaveAttribute("data-motion-visible", "true");
  await freezeAnimations(figure);
  const errors = await figure.evaluate((element) => {
    const animations = element.getAnimations({ subtree: true });
    const ball = element.querySelector<SVGGElement>(".tracking-ball")!;
    const shadow = element.querySelector<SVGGElement>(".tracking-shadow")!;
    const rays = [...element.querySelectorAll<SVGPathElement>(".tracking-ray")];
    const worst = rays.map(() => ({ distance: 0, time: 0 }));
    let shadowX = 0;
    let minimumHeight = Infinity;
    let maximumRayStep = 0;
    let previous: DOMPoint[] = [];
    for (let time = 0; time <= 9604; time += 4) {
      animations.forEach((animation) => {
        animation.currentTime = time;
      });
      const point = new DOMPoint(0, 0).matrixTransform(ball.getCTM()!);
      const ground = new DOMPoint(0, 0).matrixTransform(shadow.getCTM()!);
      shadowX = Math.max(shadowX, Math.abs(point.x - ground.x));
      minimumHeight = Math.min(minimumHeight, ground.y - point.y);
      const endpoints = rays.map((ray) =>
        new DOMPoint(1, 0).matrixTransform(ray.getCTM()!),
      );
      endpoints.forEach((end, index) => {
        const distance = Math.hypot(end.x - point.x, end.y - point.y);
        const measured = worst[index];
        if (measured && distance > measured.distance)
          worst[index] = { distance, time };
        if (previous[index])
          maximumRayStep = Math.max(
            maximumRayStep,
            Math.hypot(end.x - previous[index].x, end.y - previous[index].y),
          );
      });
      previous = endpoints;
    }
    return { worst, shadowX, minimumHeight, maximumRayStep };
  });
  errors.worst.forEach((ray, index) => {
    expect(ray.distance, `camera ${index + 1} at ${ray.time}ms`).toBeLessThan(
      0.5,
    );
  });
  expect(errors.maximumRayStep).toBeLessThan(1);
  expect(errors.shadowX).toBeLessThan(0.1);
  expect(errors.minimumHeight).toBeGreaterThanOrEqual(-0.1);
});

test("offscreen scenes stop and replay when they return into view", async ({
  page,
}) => {
  await page.goto("/");
  const robot = page.locator(".robot-note");
  const volleyball = page.locator(".tracking-figure");
  await expect(volleyball).toHaveAttribute("data-motion-visible", "false");
  await expect(volleyball.locator(".tracking-ball")).toHaveCSS(
    "animation-name",
    "none",
  );
  await volleyball.scrollIntoViewIfNeeded();
  await expect(volleyball.locator(".tracking-ball")).toHaveCSS(
    "animation-name",
    "tracking-ball",
  );
  await expect(robot).toHaveAttribute("data-motion-visible", "false");
  await expect(robot.locator(".robot-shoulder")).toHaveCSS(
    "animation-name",
    "none",
  );
  await robot.scrollIntoViewIfNeeded();
  await expect(robot.locator(".robot-shoulder")).toHaveCSS(
    "animation-name",
    "robot-shoulder",
  );
  await expect(volleyball.locator(".tracking-ball")).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("reduced motion keeps a visible static diagram and responds to preference changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects");
  const figure = page.locator(".tracking-figure");
  await figure.scrollIntoViewIfNeeded();
  await expect(figure.getByRole("button")).toHaveCount(0);
  const ball = figure.locator(".tracking-ball");
  await expect(ball).toHaveCSS("animation-name", "none");
  await expect(figure.locator(".tracking-fade")).toHaveCSS("opacity", "1");
  const transform = await ball.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await page.waitForTimeout(250);
  expect(
    await ball.evaluate((element) => getComputedStyle(element).transform),
  ).toBe(transform);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(ball).toHaveCSS("animation-name", "tracking-ball");
});
