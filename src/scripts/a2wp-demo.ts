import type { Flow } from '../data/a2wp';

const STEP_MS = 2600;
const START_MS = 500;
const FLOW_REST_MS = 2500;

export function mountA2wpDemo(root: HTMLElement) {
  const flows: Flow[] = JSON.parse(root.querySelector('[data-flows]')!.textContent ?? '[]');
  const parts = [...root.querySelectorAll<HTMLElement>('[data-part]')];
  const msgs = new Map(
    [...root.querySelectorAll<HTMLElement>('[data-edge]')].map((el) => [el.dataset.edge!, el.querySelector<HTMLElement>('[data-msg]')!]),
  );
  const slot = root.querySelector<HTMLElement>('[data-slot]')!;
  const count = root.querySelector<HTMLElement>('[data-count]')!;
  const text = root.querySelector<HTMLElement>('[data-text]')!;
  const sub = root.querySelector<HTMLElement>('[data-sub]')!;
  const progress = root.querySelector<HTMLElement>('[data-progress]')!;
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-pick]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let flowIndex = 0;

  function show(i: number) {
    const flow = flows[flowIndex];
    const step = flow.steps[i];
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pick === flow.id)));

    const active = new Set<string>(step.active);
    parts.forEach((el) => el.classList.toggle('is-active', active.has(el.dataset.part!)));

    msgs.forEach((el, edge) => {
      const on = step.msg?.edge === edge;
      if (on) {
        // Restart from the side the message comes from.
        el.classList.remove('is-on');
        el.dataset.dir = String(step.msg!.dir);
        el.textContent = step.msg!.label;
        void el.offsetWidth;
      }
      el.classList.toggle('is-on', on);
    });

    slot.classList.toggle('is-on', flow.startsFilled || flow.steps.some((s, n) => s.fill && n <= i));
    count.textContent = `Step ${i + 1} of ${flow.steps.length}`;
    text.textContent = step.text;
    sub.textContent = step.sub ?? '';
    progress.replaceChildren(
      ...flow.steps.map((_, n) => {
        const li = document.createElement('li');
        if (n <= i) li.className = 'is-on';
        return li;
      }),
    );
  }

  // Playback ------------------------------------------------------------------
  let run = 0;
  let paused = true;
  let started = false;

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  async function wait(ms: number, id: number) {
    await sleep(ms);
    while (paused && id === run) await sleep(200);
    return id === run;
  }

  async function play(fi: number) {
    const id = ++run;
    started = true;
    flowIndex = fi;
    const steps = flows[fi].steps;
    show(0);
    if (!(await wait(START_MS + STEP_MS, id))) return;
    for (let i = 1; i < steps.length; i++) {
      show(i);
      if (!(await wait(STEP_MS, id))) return;
    }
    if (await wait(FLOW_REST_MS, id)) play((fi + 1) % flows.length);
  }

  function showStill(fi: number) {
    run++;
    flowIndex = fi;
    show(flows[fi].steps.length - 1);
  }

  // Controls appear only when JavaScript runs.
  root.querySelector<HTMLElement>('[data-tabs]')!.hidden = false;
  root.querySelector<HTMLElement>('[data-replay]')!.hidden = false;
  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      const fi = flows.findIndex((f) => f.id === b.dataset.pick);
      if (reduceMotion.matches) return showStill(fi);
      paused = false;
      play(fi);
    }),
  );
  root.querySelector('[data-replay]')!.addEventListener('click', () => {
    if (reduceMotion.matches) return showStill(flowIndex);
    paused = false;
    play(flowIndex);
  });

  if (reduceMotion.matches) return showStill(0);

  let visible = false;
  const update = () => {
    paused = !visible || document.hidden;
    if (!paused && !started) play(0);
  };
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      update();
    },
    { threshold: 0.3 },
  ).observe(root);
  document.addEventListener('visibilitychange', update);
}
