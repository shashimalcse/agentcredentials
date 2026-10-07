/** Pause after each kind of entry, in ms. */
const PAUSE = { agent: 1500, user: 900, approval: 1300, approve: 1100, step: 1000, verified: 1600 };
const TYPE_MS = 22;
const LOOP_REST_MS = 6000;

type Kind = keyof typeof PAUSE;

function kindOf(el: HTMLElement): Kind {
  if (el.classList.contains('marker')) return 'approve';
  if (el.classList.contains('msg--user')) return 'user';
  if (el.classList.contains('approval')) return 'approval';
  if (el.classList.contains('step--verified')) return 'verified';
  if (el.classList.contains('step')) return 'step';
  return 'agent';
}

export function mountDemo(root: HTMLElement) {
  const log = root.querySelector<HTMLElement>('[data-log]')!;
  const entries = [...log.querySelectorAll<HTMLElement>(':scope > [data-i]')];
  const last = entries.length - 1;
  const typed = root.querySelector<HTMLElement>('[data-typed]')!;
  const placeholder = typed.textContent ?? '';
  const approvals = [...root.querySelectorAll<HTMLElement>('.approval')];
  const effects = [...root.querySelectorAll<HTMLElement>('.fx')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** Render the state after entry `i` has played. */
  function show(i: number) {
    entries.forEach((el, n) => el.classList.toggle('is-on', n <= i));
    approvals.forEach((a) => a.classList.toggle('is-approved', i >= Number(a.dataset.approvedAt)));
    effects.forEach((el) => {
      const on = el.dataset.on;
      el.classList.toggle('is-on', on === undefined || i >= Number(on));
      const active = el.dataset.active;
      if (active) {
        const ranges = active.split(',').map((r) => r.split('-').map(Number));
        el.classList.toggle('is-active', ranges.some(([from, to]) => i >= from && i <= to));
      }
    });
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

  async function typeOut(text: string, id: number) {
    typed.classList.add('is-typing');
    for (let n = 1; n <= text.length; n++) {
      typed.textContent = text.slice(0, n);
      if (!(await wait(TYPE_MS, id))) return false;
    }
    return wait(350, id);
  }

  function resetInput() {
    typed.classList.remove('is-typing');
    typed.textContent = placeholder;
  }

  async function play() {
    const id = ++run;
    started = true;
    resetInput();
    show(-1);
    log.scrollTop = 0;
    if (!(await wait(700, id))) return;

    for (let i = 0; i <= last; i++) {
      const el = entries[i];
      const kind = kindOf(el);

      if (kind === 'user' && !(await typeOut(el.dataset.text ?? '', id))) return;
      if (kind === 'approve') {
        const card = approvals.find((a) => Number(a.dataset.approvedAt) === i);
        card?.classList.add('is-pressing');
        if (!(await wait(220, id))) return;
        card?.classList.remove('is-pressing');
      }

      resetInput();
      show(i);
      el.classList.add('is-new');
      log.scrollTo({ top: log.scrollHeight });

      if (!(await wait(PAUSE[kind], id))) return;
    }

    if (await wait(LOOP_REST_MS, id)) play();
  }

  root.querySelector('[data-replay]')!.addEventListener('click', () => {
    paused = false;
    play();
  });

  // Start when first seen; pause while off screen or in a background tab.
  if (reduceMotion.matches) {
    show(last);
    return;
  }
  show(-1);
  let visible = false;
  const update = () => {
    paused = !visible || document.hidden;
    if (!paused && !started) play();
  };
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }, { threshold: 0.15 }).observe(root);
  document.addEventListener('visibilitychange', update);
}
