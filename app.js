/* ============================================================
   RevQuest — moteur de révision
   Méthodes d'apprentissage implémentées :
   - Rappel actif (active recall) : on répond AVANT de voir la solution
   - Feedback immédiat : explication après chaque réponse
   - Répétition espacée (Leitner) : les cartes ratées reviennent vite
   - Interleaving : la révision quotidienne mélange les mondes
   - Gamification : XP, niveaux, série (streak), progression par monde
   ============================================================ */

const STORE_KEY = "revquest_v1";
const XP_PER_LEVEL = 100;
const XP_CORRECT = 10;
const XP_EFFORT = 3; // récompense même quand on rate (on a appris)

// Intervalles Leitner en jours par "boîte" (adaptés à un cram d'1 semaine)
const BOX_DAYS = { 1: 0, 2: 1, 3: 2, 4: 4, 5: 7 };
const MASTERY_BOX = 4; // boîte >= 4 = notion "maîtrisée"
const DAILY_MAX = 15;

const DAY = 86400000;
const todayKey = () => new Date().toISOString().slice(0, 10);

/* ---------------- State ---------------- */
function defaultState() {
  return { xp: 0, streak: 0, lastDay: null, cards: {} /* id -> {box, due, seen} */, lessons: {} /* worldId -> true */, roadmap: {} /* stepId -> true */ };
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    return s && typeof s === "object" ? Object.assign(defaultState(), s) : defaultState();
  } catch { return defaultState(); }
}
function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  if (typeof RevAuth !== "undefined") RevAuth.queueSave(state);
}
let state = load();
let syncStatus = ""; // "", "saved", "error", "offline"

function cardState(id) {
  if (!state.cards[id]) state.cards[id] = { box: 1, due: 0, seen: false };
  return state.cards[id];
}

/* ---------------- Leitner / scoring ---------------- */
function grade(id, success) {
  const cs = cardState(id);
  cs.seen = true;
  if (success) cs.box = Math.min(5, cs.box + 1);
  else cs.box = 1;
  cs.due = Date.now() + BOX_DAYS[cs.box] * DAY;
  state.xp += success ? XP_CORRECT : XP_EFFORT;
  touchStreak();
  save();
}
function touchStreak() {
  const t = todayKey();
  if (state.lastDay === t) return;
  const y = new Date(Date.now() - DAY).toISOString().slice(0, 10);
  state.streak = state.lastDay === y ? state.streak + 1 : 1;
  state.lastDay = t;
}

/* ---------------- Selectors ---------------- */
const levelOf = () => Math.floor(state.xp / XP_PER_LEVEL) + 1;
const xpInLevel = () => state.xp % XP_PER_LEVEL;

function worldCards(wid) { return CARDS.filter(c => c.world === wid); }
function isDue(id) { const cs = state.cards[id]; return !cs || !cs.seen || cs.due <= Date.now(); }
function masteryOf(wid) {
  const list = worldCards(wid);
  const mastered = list.filter(c => (state.cards[c.id]?.box || 0) >= MASTERY_BOX).length;
  return { mastered, total: list.length, pct: Math.round((mastered / list.length) * 100) };
}
function dueCards() {
  // cartes à revoir aujourd'hui (déjà vues et échues) + nouvelles, mélangées (interleaving)
  const seenDue = CARDS.filter(c => state.cards[c.id]?.seen && state.cards[c.id].due <= Date.now());
  const fresh = CARDS.filter(c => !state.cards[c.id]?.seen);
  return shuffle(seenDue).concat(shuffle(fresh)).slice(0, DAILY_MAX);
}
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------------- Auth UI ---------------- */
function renderAuthBar() {
  const el = document.getElementById("authBar");
  if (!el) return;
  const logged = typeof RevAuth !== "undefined" && RevAuth.isLoggedIn();
  const user = logged ? RevAuth.getUser() : null;
  const offline = typeof RevAuth !== "undefined" && !RevAuth.serverAvailable();
  const syncHint = syncStatus === "saved" ? " · ☁️ sauvegardé"
    : syncStatus === "error" ? " · ⚠️ sync échouée"
    : logged ? " · ☁️ connecté" : "";

  if (logged) {
    el.innerHTML = `
      <span class="auth-user" title="${escapeHtml(user.email)}">👤 ${escapeHtml(user.displayName)}${syncHint}</span>
      <button class="wbtn auth-btn" id="logoutBtn">Déconnexion</button>`;
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      if (typeof RevAuth !== "undefined") await RevAuth.flushSave();
      RevAuth.logout();
      syncStatus = "";
      renderAuthBar();
    });
    return;
  }

  el.innerHTML = offline
    ? `<span class="auth-offline" title="Lance le serveur pour synchroniser entre appareils">📴 Mode local</span>
       <button class="wbtn auth-btn" id="loginBtn">Compte</button>`
    : `<button class="wbtn auth-btn" id="loginBtn">Connexion</button>
       <button class="wbtn auth-btn auth-btn-primary" id="registerBtn">Créer un compte</button>`;
  const lb = document.getElementById("loginBtn");
  if (lb) lb.addEventListener("click", () => renderAuthForm("login"));
  const rb = document.getElementById("registerBtn");
  if (rb) rb.addEventListener("click", () => renderAuthForm("register"));
}

function renderAuthForm(mode) {
  renderTopbar();
  const isRegister = mode === "register";
  view().innerHTML = `
    <div class="card auth-card">
      <span class="tag">${isRegister ? "✨ Créer un compte" : "🔐 Connexion"}</span>
      <p class="qtext">${isRegister
        ? "Sauvegarde ta progression (XP, parcours, certificat) sur ton compte — accessible depuis n'importe quel navigateur."
        : "Retrouve ta progression sur tous tes appareils."}</p>
      ${!RevAuth.serverAvailable()
        ? `<div class="auth-warn">⚠️ Ouvre le site via <strong>http://localhost:4599</strong> (serveur Node) pour activer les comptes. En double-clic sur index.html, seul le stockage local fonctionne.</div>`
        : ""}
      <form class="auth-form" id="authForm">
        ${isRegister ? `<label class="auth-label">Pseudo<input class="auth-input" name="displayName" autocomplete="nickname" required maxlength="40" placeholder="Ton prénom ou pseudo" /></label>` : ""}
        <label class="auth-label">E-mail<input class="auth-input" type="email" name="email" autocomplete="email" required placeholder="toi@exemple.fr" /></label>
        <label class="auth-label">Mot de passe<input class="auth-input" type="password" name="password" autocomplete="${isRegister ? "new-password" : "current-password"}" required minlength="6" placeholder="6 caractères minimum" /></label>
        <div class="auth-error" id="authError"></div>
        <div class="card-actions">
          <button type="button" class="btn btn-ghost" id="authCancel">Annuler</button>
          <button type="submit" class="btn btn-primary">${isRegister ? "Créer mon compte →" : "Se connecter →"}</button>
        </div>
      </form>
      <p class="auth-switch">${isRegister
        ? `Déjà un compte ? <button class="linklike" id="switchLogin">Se connecter</button>`
        : `Pas encore de compte ? <button class="linklike" id="switchRegister">Créer un compte</button>`}</p>
    </div>`;
  document.getElementById("authCancel").addEventListener("click", renderHome);
  const swL = document.getElementById("switchLogin");
  if (swL) swL.addEventListener("click", () => renderAuthForm("login"));
  const swR = document.getElementById("switchRegister");
  if (swR) swR.addEventListener("click", () => renderAuthForm("register"));
  document.getElementById("authForm").addEventListener("submit", async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const err = document.getElementById("authError");
    err.textContent = "";
    try {
      if (isRegister) {
        await RevAuth.register(fd.get("email"), fd.get("password"), fd.get("displayName"));
      } else {
        await RevAuth.login(fd.get("email"), fd.get("password"));
      }
      state = await RevAuth.loadMergedProgress(state);
      save();
      syncStatus = "saved";
      renderAuthBar();
      renderHome();
    } catch (ex) {
      err.textContent = ex.message || "Erreur de connexion.";
    }
  });
}

/* ---------------- Topbar render ---------------- */
function renderTopbar() {
  document.getElementById("streak").textContent = state.streak;
  document.getElementById("level").textContent = levelOf();
  const pct = (xpInLevel() / XP_PER_LEVEL) * 100;
  document.getElementById("xpfill").style.width = pct + "%";
  document.getElementById("xptext").textContent = `${xpInLevel()} / ${XP_PER_LEVEL} XP`;
  renderAuthBar();
}

/* ---------------- Views ---------------- */
const view = () => document.getElementById("view");

function renderHome() {
  renderTopbar();
  const due = dueCards().length;
  const overall = (() => {
    const m = CARDS.filter(c => (state.cards[c.id]?.box || 0) >= MASTERY_BOX).length;
    return { m, t: CARDS.length, pct: Math.round((m / CARDS.length) * 100) };
  })();

  const worldsHtml = WORLDS.map(w => {
    const { mastered, total, pct } = masteryOf(w.id);
    const done = pct === 100;
    const read = !!state.lessons[w.id];
    const hasLesson = !!LESSONS[w.id];
    return `
      <div class="world" style="--accent:${w.couleur}">
        ${done ? '<span class="badge-done">✅</span>' : ""}
        <div class="wtop"><span class="wemoji">${w.emoji}</span><h3>${w.nom}</h3></div>
        <div class="wsub">${w.sous}</div>
        <div class="wbar"><div class="wfill" style="width:${pct}%;background:${w.couleur}"></div></div>
        <div class="wmeta"><span>${mastered}/${total} maîtrisées</span><span>${pct}%</span></div>
        <div class="wactions">
          ${hasLesson ? `<button class="wbtn wbtn-learn" data-lesson="${w.id}">📖 Cours ${read ? "✓" : ""}</button>` : ""}
          ${LESSONS[w.id] ? `<button class="wbtn wbtn-fiche" data-fiche="${w.id}">📑 Fiche</button>` : ""}
          <button class="wbtn wbtn-test" data-test="${w.id}">🎯 Test</button>
        </div>
      </div>`;
  }).join("");

  view().innerHTML = `
    <div class="hero">
      <h1>Prêt à réviser ? ⚔️</h1>
      <p>Objectif : la Code Review (épreuve déterminante). Maîtrise globale : <strong>${overall.pct}%</strong> (${overall.m}/${overall.t}).</p>
    </div>

    <div class="roadmap-cta">
      <div class="rc-left">
        <h2>🚀 Parcours guidé « débutant → prêt pour les tests »</h2>
        <p>Tout est repris de zéro, dans le bon ordre, avec exemples et exercices guidés. ${roadmapProgressText()}</p>
      </div>
      <button class="btn btn-primary btn-lg" id="roadmapBtn">${state.roadmap && Object.keys(state.roadmap).length ? "Continuer →" : "Commencer ici →"}</button>
    </div>

    <div class="method">
      <strong>🧭 Comment réviser efficacement (méthode guidée)</strong>
      <ol>
        <li><strong>Lis le Cours</strong> d'un monde (📖) — découpé en petites notions avec exemples concrets.</li>
        <li><strong>Teste-toi</strong> juste après (rappel actif) : le cours enchaîne automatiquement sur un mini-quiz.</li>
        <li><strong>Reviens chaque jour</strong> faire la « Révision du jour » 🎯 : les notions ratées reviennent plus vite (répétition espacée), tous les mondes mélangés (interleaving).</li>
      </ol>
    </div>

    <div class="daily">
      <div class="dleft">
        <h2>🎯 Révision du jour</h2>
        <p>${due > 0
          ? `<span class="due-count">${due}</span> carte(s) à travailler — mélange de tous les mondes (méthode d'interleaving).`
          : `Tout est à jour pour aujourd'hui ! Reviens demain ou attaque un monde ci-dessous.`}</p>
      </div>
      <button class="btn btn-primary btn-lg" data-start="daily" ${due === 0 ? "disabled style='opacity:.5;cursor:default'" : ""}>Commencer</button>
    </div>

    <div class="section-title">Parcours par monde — Apprendre puis se tester</div>
    <div class="worlds">${worldsHtml}</div>

    <div class="section-title">Ressources & certification</div>
    <div class="cta-row" style="justify-content:flex-start">
      <button class="btn btn-ghost" id="glossaireBtn">📖 Glossaire (vocabulaire de base)</button>
      <button class="btn btn-ghost" id="cahierBtn">📓 Mon cahier</button>
      <button class="btn btn-primary" id="examBtn">🏆 Examen final de certification</button>
    </div>
    ${state.cert ? `<p class="cert-note">✅ Certifié le ${escapeHtml(state.cert.date)} avec ${state.cert.score}%.</p>` : ""}
  `;

  view().querySelectorAll("[data-lesson]").forEach(el =>
    el.addEventListener("click", () => renderLesson(el.dataset.lesson, -1)));
  view().querySelectorAll("[data-fiche]").forEach(el =>
    el.addEventListener("click", () => renderFiche(el.dataset.fiche)));
  view().querySelectorAll("[data-test]").forEach(el =>
    el.addEventListener("click", () => startSession(shuffle(worldCards(el.dataset.test)), WORLDS.find(w => w.id === el.dataset.test).nom)));
  const sb = view().querySelector("[data-start='daily']");
  if (sb && due > 0) sb.addEventListener("click", () => startSession(dueCards(), "Révision du jour"));
  document.getElementById("glossaireBtn").addEventListener("click", renderGlossaire);
  document.getElementById("cahierBtn").addEventListener("click", renderCahier);
  document.getElementById("examBtn").addEventListener("click", renderExamIntro);
  document.getElementById("roadmapBtn").addEventListener("click", renderRoadmap);
}

/* ---------------- ROADMAP (parcours guidé par maîtrise) ---------------- */
function flatSteps() {
  const out = [];
  ROADMAP.forEach((ch, ci) => ch.steps.forEach(s => out.push({ ...s, chapitre: ch.chapitre, chEmoji: ch.emoji, ci })));
  return out;
}
const stepDone = id => !!state.roadmap[id];
function stepUnlocked(i) {
  const all = flatSteps();
  return i === 0 || all.slice(0, i).every(s => stepDone(s.id));
}
function roadmapProgressText() {
  const all = flatSteps();
  const done = all.filter(s => stepDone(s.id)).length;
  if (done === 0) return "Idéal si tu pars de zéro.";
  if (done === all.length) return "🎉 Parcours terminé — tu es prêt pour l'examen final !";
  return `Progression : <strong>${done}/${all.length}</strong> étapes.`;
}

function renderRoadmap() {
  renderTopbar();
  const all = flatSteps();
  const done = all.filter(s => stepDone(s.id)).length;
  const firstOpen = all.findIndex((s, i) => stepUnlocked(i) && !stepDone(s.id));

  const chaptersHtml = ROADMAP.map(ch => {
    const items = ch.steps.map(s => {
      const idx = all.findIndex(x => x.id === s.id);
      const d = stepDone(s.id), unlocked = stepUnlocked(idx);
      const cls = d ? "done" : unlocked ? "open" : "locked";
      const icon = d ? "✅" : unlocked ? "▶️" : "🔒";
      return `<button class="rstep ${cls}" ${unlocked ? `data-step="${s.id}"` : "disabled"}>
          <span class="rstep-icon">${icon}</span>
          <span class="rstep-titre">${escapeHtml(s.titre)}</span>
          ${s.exo ? '<span class="rstep-tag">exo</span>' : ""}
        </button>`;
    }).join("");
    return `<div class="rchapter">
        <h3 class="rchapter-h">${ch.emoji} Chapitre ${escapeHtml(ch.chapitre)}</h3>
        <div class="rsteps">${items}</div>
      </div>`;
  }).join("");

  const finished = done === all.length;
  view().innerHTML = `
    <div class="quiz-head no-print">
      <button class="quiz-exit" id="exitR">✕ Accueil</button>
      <div class="qprogress"><div class="qfill" style="width:${(done / all.length) * 100}%"></div></div>
      <div class="qcount">${done}/${all.length}</div>
    </div>
    <div class="hero" style="margin-bottom:18px">
      <h1>🚀 Parcours guidé</h1>
      <p>Suis les étapes dans l'ordre. Chaque étape se débloque quand tu réussis son checkpoint. À la fin, tu sais répondre à tous les tests.</p>
    </div>
    ${finished
      ? `<div class="daily"><div class="dleft"><h2>🎉 Parcours terminé !</h2><p>Tu as vu et validé chaque notion. Passe l'examen de certification.</p></div>
         <button class="btn btn-primary btn-lg" id="toExam">🏆 Examen final →</button></div>`
      : firstOpen >= 0
        ? `<div class="daily"><div class="dleft"><h2>Reprendre à l'étape ${firstOpen + 1}</h2><p>${escapeHtml(all[firstOpen].titre)}</p></div>
           <button class="btn btn-primary btn-lg" id="resume">Continuer →</button></div>` : ""}
    ${chaptersHtml}`;

  document.getElementById("exitR").addEventListener("click", renderHome);
  const ex = document.getElementById("toExam"); if (ex) ex.addEventListener("click", renderExamIntro);
  const rs = document.getElementById("resume"); if (rs) rs.addEventListener("click", () => renderStep(all[firstOpen].id));
  view().querySelectorAll("[data-step]").forEach(el =>
    el.addEventListener("click", () => renderStep(el.dataset.step)));
}

function stepContentHtml(s) {
  let out = "";
  if (s.html) out += s.html;
  if (s.lessons) s.lessons.forEach(([w, i]) => { out += LESSONS[w].sections[i].html; });
  else if (s.lesson) { const [w, i] = s.lesson; out += LESSONS[w].sections[i].html; }
  if (s.glos) out += s.glos.map(t => {
    const g = GLOSSAIRE.find(x => x.t === t); if (!g) return "";
    return `<div class="glos-entry"><strong>${escapeHtml(g.t)}</strong> — ${escapeHtml(g.d)}<span class="fiche-ex">🔍 Exemple : ${escapeHtml(g.ex)}</span>${g.code ? `<pre class="glos-code"><code>${escapeHtml(g.code)}</code></pre>` : ""}</div>`;
  }).join("");
  return out;
}

function exoZone(exo) {
  return exo.zone ?? exo.mauvais ?? exo.code ?? "";
}

function exoSolutionText(exo) {
  if (exo.starter && exo.solutionZone) {
    const sep = exo.starter.endsWith("\n") ? "" : "\n";
    return exo.starter + sep + exo.solutionZone;
  }
  return exo.solution ?? "";
}

function registerExoEditorModes() {
  if (typeof CodeMirror === "undefined" || CodeMirror.modes.typescript) return;
  CodeMirror.defineMode("typescript", config =>
    CodeMirror.getMode(config, { name: "javascript", typescript: true })
  );
  CodeMirror.defineMIME("text/typescript", "typescript");
}

function exoEditorMode(text, exo) {
  if (exo?.runnable === false || /^#/m.test(String(text || "").trim())) return "shell";
  return "typescript";
}

function mountExoEditor(textarea, minRows, onRun, exo) {
  registerExoEditorModes();
  if (typeof CodeMirror === "undefined") return null;
  const cm = CodeMirror.fromTextArea(textarea, {
    mode: exoEditorMode(textarea.value, exo),
    theme: "revquest",
    lineNumbers: true,
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false,
    lineWrapping: false,
    autoCloseBrackets: true,
    matchBrackets: true,
    styleActiveLine: true,
    viewportMargin: Infinity,
    extraKeys: {
      Tab: cm => {
        if (cm.somethingSelected()) cm.indentSelection("add");
        else cm.replaceSelection("  ", "end");
      },
      "Shift-Tab": cm => cm.indentSelection("subtract"),
      "Ctrl-Enter": () => { if (onRun) onRun(); },
      "Cmd-Enter": () => { if (onRun) onRun(); },
    },
  });
  cm.setSize("100%", Math.max(168, minRows * 22));
  requestAnimationFrame(() => cm.refresh());
  return cm;
}

function preprocessExoCode(code) {
  return String(code || "")
    .split("\n")
    .filter(line => !/^\s*interface\s+[\w.]+\s*\{/.test(line))
    .map(line => line.replace(/\s+implements\s+[\w.\s,]+(?=\s*\{|\s*$)/g, ""))
    .map(line => line.replace(/\b(public|private|protected)\s+/g, ""))
    .join("\n");
}

const TS_COMPILER_OPTIONS = {
  target: typeof ts !== "undefined" ? ts.ScriptTarget.ES2020 : undefined,
  module: typeof ts !== "undefined" ? ts.ModuleKind.None : undefined,
  strict: false,
  removeComments: false,
};

function compileTypeScript(source) {
  if (typeof ts === "undefined") {
    return { ok: true, js: preprocessExoCode(source), fallback: true };
  }
  const result = ts.transpileModule(source, {
    compilerOptions: TS_COMPILER_OPTIONS,
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
  if (errors.length) {
    const error = errors.map(d => {
      let loc = "";
      if (d.file && d.start != null) {
        const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
        loc = ` (ligne ${line + 1}, col ${character + 1})`;
      }
      return ts.flattenDiagnosticMessageText(d.messageText, "\n") + loc;
    }).join("\n");
    return { ok: false, error, phase: "typescript" };
  }
  return { ok: true, js: result.outputText };
}

function buildRunnableExoCode(exo, userPart) {
  const parts = [];
  if (exo.starter) parts.push(exo.starter);
  parts.push(userPart);
  if (exo.runTest) parts.push(exo.runTest);
  return parts.filter(Boolean).join("\n\n");
}

function compileAndRunExoCode(tsSource) {
  const compiled = compileTypeScript(tsSource);
  if (!compiled.ok) return { ok: false, error: compiled.error, phase: "typescript", logs: [] };
  const result = executeJsCode(compiled.js);
  if (!result.ok) return { ...result, phase: "runtime" };
  return result;
}

function formatRunValue(v) {
  if (v === undefined) return "undefined";
  if (typeof v === "object") {
    try { return JSON.stringify(v); } catch { return String(v); }
  }
  return String(v);
}

function executeJsCode(jsCode) {
  const logs = [];
  const fakeConsole = {
    log: (...args) => logs.push(args.map(formatRunValue).join(" ")),
    warn: (...args) => logs.push("⚠ " + args.map(formatRunValue).join(" ")),
    error: (...args) => logs.push("✖ " + args.map(formatRunValue).join(" ")),
  };
  try {
    const fn = new Function("console", jsCode);
    fn(fakeConsole);
    return { ok: true, logs };
  } catch (e) {
    return { ok: false, error: e.message, logs };
  }
}

function exoSolutionUserPart(exo) {
  return exo.solutionZone ?? exo.solution ?? "";
}

function isExoRunnable(exo, userCode) {
  if (exo.runnable === false) return false;
  const text = String(userCode || exoZone(exo)).trim();
  return exoEditorMode(text, exo) !== "shell";
}

function runExoCode(exo, userCode) {
  if (!isExoRunnable(exo, userCode)) {
    return { ok: null, message: "Cet exercice est une réponse texte (oral), pas du code exécutable." };
  }
  const code = buildRunnableExoCode(exo, userCode);
  const result = compileAndRunExoCode(code);
  if (!result.ok) return result;

  const expected = compileAndRunExoCode(buildRunnableExoCode(exo, exoSolutionUserPart(exo)));
  const match = expected.ok && JSON.stringify(result.logs) === JSON.stringify(expected.logs);
  return { ...result, match, expectedLogs: expected.logs };
}

function renderExoOutput(result) {
  if (result.ok === null) {
    return `<div class="exo-output exo-output-info"><div class="exo-output-label">ℹ️ Info</div><p>${escapeHtml(result.message)}</p></div>`;
  }
  if (!result.ok) {
    const label = result.phase === "typescript"
      ? "❌ Erreur TypeScript — corrige la syntaxe ou les types"
      : "❌ Erreur à l'exécution — le TS compile, mais le code plante au runtime";
    return `<div class="exo-output exo-output-err">
      <div class="exo-output-label">${label}</div>
      <pre class="exo-output-pre">${escapeHtml(result.error)}</pre>
      ${result.logs.length ? `<pre class="exo-output-pre">${escapeHtml(result.logs.join("\n"))}</pre>` : ""}
    </div>`;
  }
  const logsText = result.logs.length ? result.logs.join("\n") : "(aucune sortie — ajoute des console.log() pour voir un résultat)";
  const verdict = result.match === true
    ? `<p class="exo-output-verdict ok">✅ Même résultat que la solution attendue — bravo !</p>`
    : result.match === false
      ? `<p class="exo-output-verdict warn">⚠️ Le code s'exécute, mais le résultat diffère de la solution. Compare avec « Voir la bonne version ».</p>`
      : `<p class="exo-output-verdict ok">✅ Code exécuté sans erreur de syntaxe.</p>`;
  return `<div class="exo-output exo-output-ok">
    <div class="exo-output-label">▶ Résultat de l'exécution</div>
    <pre class="exo-output-pre">${escapeHtml(logsText)}</pre>
    ${verdict}
  </div>`;
}

function renderExoHtml(exo) {
  const zone = exoZone(exo);
  const hasStarter = !!(exo.starter && exo.starter.trim());
  const hasMauvais = !!(exo.mauvais && exo.mauvais.trim());
  const guideHtml = (exo.guide || []).map((g, i) =>
    `<li><strong>Étape ${i + 1}.</strong> ${escapeHtml(g)}</li>`
  ).join("");

  return `
    <div class="exo">
      <div class="exo-label">💻 Exercice guidé — TypeScript</div>
      <p class="exo-enonce">${escapeHtml(exo.enonce)}</p>
      ${exo.probleme ? `
        <div class="exo-probleme-wrap">
          <div class="exo-part-label exo-part-bad">❌ Pourquoi c'est une mauvaise approche</div>
          <p class="exo-probleme">${escapeHtml(exo.probleme)}</p>
        </div>` : ""}
      ${hasMauvais ? `
        <div class="exo-bad-wrap">
          <div class="exo-part-label exo-part-bad">❌ Mauvaise façon de faire</div>
          <pre class="exo-bad"><code>${escapeHtml(exo.mauvais)}</code></pre>
        </div>` : ""}
      ${hasStarter ? `
        <div class="exo-starter-wrap">
          <div class="exo-part-label">📄 Contexte (déjà correct — ne modifie pas)</div>
          <pre class="exo-starter"><code>${escapeHtml(exo.starter)}</code></pre>
        </div>` : ""}
      <div class="exo-mission">
        <span class="exo-mission-label">✅ Corrige</span>
        <p>${escapeHtml(exo.mission || exo.enonce)}</p>
      </div>
      <div class="exo-part-label exo-part-edit">✏️ Écris ta correction ci-dessous (part du code incorrect et modifie-le)</div>
      <div class="exo-editor-wrap">
        <textarea class="exo-editor" id="exo-editor" spellcheck="false" autocapitalize="off" autocomplete="off">${escapeHtml(zone)}</textarea>
      </div>
      <p class="exo-tip">▶ Exécuter compile ton TypeScript puis lance le code · Ctrl+Entrée · Compare avec la solution.</p>
      <div class="exo-controls">
        ${isExoRunnable(exo, zone) ? `<button class="wbtn exo-run-btn" id="exo-run">▶ Exécuter</button>` : ""}
        ${guideHtml ? `<button class="wbtn" id="exo-guide">🧭 Étapes pas à pas</button>` : ""}
        <button class="wbtn" id="exo-reset">↺ Repartir du code incorrect</button>
        ${exo.indices.map((_, i) => `<button class="wbtn exo-hint-btn" data-h="${i}">💡 Indice ${i + 1}</button>`).join("")}
        <button class="wbtn exo-sol-btn">✅ Voir la bonne version</button>
      </div>
      <div id="exo-reveal">${guideHtml ? `<div class="exo-guide hidden" id="exo-guide-box"><div class="exo-guide-label">🧭 Étapes pas à pas</div><ol>${guideHtml}</ol></div>` : ""}<div id="exo-output"></div></div>
    </div>`;
}

function renderStep(stepId) {
  renderTopbar();
  const all = flatSteps();
  const idx = all.findIndex(s => s.id === stepId);
  const s = all[idx];

  const exoHtml = s.exo ? renderExoHtml(s.exo) : "";

  view().innerHTML = `
    <div class="quiz-head no-print">
      <button class="quiz-exit" id="exitS">✕ Parcours</button>
      <div class="qprogress"><div class="qfill" style="width:${(idx / all.length) * 100}%"></div></div>
      <div class="qcount">Étape ${idx + 1}/${all.length}</div>
    </div>
    <div class="card lesson">
      <span class="tag">${s.chEmoji} Chapitre ${escapeHtml(s.chapitre)}</span>
      <h2 class="lesson-h">${escapeHtml(s.titre)}</h2>
      ${s.pourquoi ? `<div class="step-why">🎯 ${escapeHtml(s.pourquoi)}</div>` : ""}
      <div class="lesson-body">${stepContentHtml(s)}</div>
      ${s.exemple ? `<div class="ex-line">🔍 Exemple concret : ${escapeHtml(s.exemple)}</div>` : ""}
      ${codeMemoHtml(stepContentHtml(s) + (s.exo ? "\n" + exoZone(s.exo) + "\n" + exoSolutionText(s.exo) : ""))}
      ${exoHtml}
      <div class="note-box">
        <span class="note-label">📓 À noter dans ton cahier</span>
        ${escapeHtml(s.note)}
      </div>
      <div class="card-actions">
        ${idx > 0 ? `<button class="btn btn-ghost" id="prevS">← Précédent</button>` : ""}
        <button class="btn btn-primary" id="cpBtn">${s.checkpoint.length ? "Checkpoint : se tester →" : "J'ai compris, valider →"}</button>
      </div>
    </div>`;

  document.getElementById("exitS").addEventListener("click", renderRoadmap);
  const prev = document.getElementById("prevS");
  if (prev) prev.addEventListener("click", () => renderStep(all[idx - 1].id));

  // exercice guidé : éditeur modifiable + indices + solution
  if (s.exo) {
    const reveal = document.getElementById("exo-reveal");
    const outputEl = document.getElementById("exo-output");
    const editorEl = document.getElementById("exo-editor");
    const minRows = Math.max(4, exoZone(s.exo).split("\n").length + 1);

    function getExoUserCode() {
      return exoCm ? exoCm.getValue() : editorEl.value;
    }

    function showExoRunResult() {
      const result = runExoCode(s.exo, getExoUserCode());
      outputEl.innerHTML = renderExoOutput(result);
      outputEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    const exoCm = mountExoEditor(editorEl, minRows, showExoRunResult, s.exo);

    const runBtn = document.getElementById("exo-run");
    if (runBtn) runBtn.addEventListener("click", showExoRunResult);

    document.getElementById("exo-reset").addEventListener("click", () => {
      const initial = exoZone(s.exo);
      if (exoCm) {
        exoCm.setValue(initial);
        exoCm.setOption("mode", exoEditorMode(initial, s.exo));
        exoCm.focus();
      } else {
        editorEl.value = initial;
        editorEl.focus();
      }
      outputEl.innerHTML = "";
    });
    const guideBtn = document.getElementById("exo-guide");
    if (guideBtn) guideBtn.addEventListener("click", () => {
      const box = document.getElementById("exo-guide-box");
      if (box) { box.classList.toggle("hidden"); box.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
    });
    view().querySelectorAll(".exo-hint-btn").forEach(b => b.addEventListener("click", () => {
      if (document.getElementById("hint-" + b.dataset.h)) return;
      reveal.insertAdjacentHTML("beforeend", `<div class="exo-hint" id="hint-${b.dataset.h}">💡 ${escapeHtml(s.exo.indices[b.dataset.h])}</div>`);
    }));
    view().querySelector(".exo-sol-btn").addEventListener("click", () => {
      if (document.getElementById("exo-solution")) return;
      const sol = exoSolutionText(s.exo);
      const solNote = s.exo.solutionZone
        ? "✅ Bonne version — compare avec ta correction au-dessus"
        : "✅ Bonne version — compare avec ta correction au-dessus";
      reveal.insertAdjacentHTML("beforeend", `<div class="exo-sol" id="exo-solution"><div class="exo-sol-label">${solNote}</div><pre><code>${escapeHtml(sol)}</code></pre></div>`);
      document.getElementById("exo-solution").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  document.getElementById("cpBtn").addEventListener("click", () => {
    if (!s.checkpoint.length) { completeStep(stepId); return; }
    const cards = s.checkpoint.map(id => CARDS.find(c => c.id === id)).filter(Boolean);
    session = { cards, index: 0, correct: 0, label: "Checkpoint — " + s.titre, roadmap: { stepId } };
    renderQuestion();
  });
}

function finishCheckpoint() {
  const { correct, cards, roadmap } = session;
  const stepId = roadmap.stepId;
  const passed = correct === cards.length;
  const all = flatSteps();
  const idx = all.findIndex(s => s.id === stepId);
  const s = all[idx];
  session = null;
  if (passed) { completeStepResult(stepId, idx, all, s); return; }
  // échec : on encourage à revoir
  view().innerHTML = `
    <div class="card results">
      <div class="big">📚</div>
      <div class="score">${correct}/${cards.length} au checkpoint</div>
      <div class="sub">Presque ! Revois l'étape et retente — l'étape suivante se débloquera une fois le checkpoint réussi.</div>
      <div class="cta-row" style="justify-content:center">
        <button class="btn btn-ghost" id="back">Revoir l'étape</button>
        <button class="btn btn-primary" id="retry">Refaire le checkpoint</button>
      </div>
    </div>`;
  document.getElementById("back").addEventListener("click", () => renderStep(stepId));
  document.getElementById("retry").addEventListener("click", () => {
    const cards2 = s.checkpoint.map(id => CARDS.find(c => c.id === id)).filter(Boolean);
    session = { cards: cards2, index: 0, correct: 0, label: "Checkpoint — " + s.titre, roadmap: { stepId } };
    renderQuestion();
  });
}

function completeStep(stepId) {
  const all = flatSteps();
  const idx = all.findIndex(s => s.id === stepId);
  completeStepResult(stepId, idx, all, all[idx]);
}

function completeStepResult(stepId, idx, all, s) {
  state.roadmap[stepId] = true; save();
  const isLast = idx === all.length - 1;
  const next = all[idx + 1];
  view().innerHTML = `
    <div class="card results">
      <div class="big">✅</div>
      <div class="score">Étape validée : ${escapeHtml(s.titre)}</div>
      <div class="sub">${isLast
        ? "🎉 Dernière étape ! Tu as parcouru toutes les notions."
        : "Étape suivante débloquée. On enchaîne ?"}</div>
      <div class="cta-row" style="justify-content:center">
        <button class="btn btn-ghost" id="map">Voir le parcours</button>
        ${isLast
          ? `<button class="btn btn-primary" id="exam">🏆 Examen final →</button>`
          : `<button class="btn btn-primary" id="next">Étape suivante →</button>`}
      </div>
    </div>`;
  document.getElementById("map").addEventListener("click", renderRoadmap);
  const nx = document.getElementById("next"); if (nx) nx.addEventListener("click", () => renderStep(next.id));
  const ex = document.getElementById("exam"); if (ex) ex.addEventListener("click", renderExamIntro);
}

/* ---------------- Mon cahier (notes à recopier) ---------------- */
function renderCahier() {
  renderTopbar();
  const all = flatSteps();
  const chapters = ROADMAP.map(ch => {
    const notes = ch.steps.map(s => `<li class="${stepDone(s.id) ? "noted-done" : ""}"><strong>${escapeHtml(s.titre)} :</strong> ${escapeHtml(s.note)}</li>`).join("");
    return `<h3 class="fiche-th">${ch.emoji} ${escapeHtml(ch.chapitre)}</h3><ul class="cahier-list">${notes}</ul>`;
  }).join("");
  view().innerHTML = `
    <div class="quiz-head no-print">
      <button class="quiz-exit" id="exitC">✕ Retour</button>
      <div style="flex:1"></div>
      <button class="wbtn" id="printC" style="max-width:120px">🖨️ Imprimer</button>
    </div>
    <div class="card fiche">
      <div class="fiche-head">
        <span class="fiche-emoji">📓</span>
        <div><h2 class="fiche-title">Mon cahier</h2>
        <p class="fiche-intro">Toutes les phrases à recopier à la main pour ne rien oublier (recopier aide à mémoriser). Coche-les sur papier au fur et à mesure.</p></div>
      </div>
      ${chapters}
    </div>`;
  document.getElementById("exitC").addEventListener("click", renderHome);
  document.getElementById("printC").addEventListener("click", () => window.print());
}

/* ---------------- Glossaire ---------------- */
let glossaireMasked = false;
function renderGlossaire() {
  renderTopbar();
  const rows = GLOSSAIRE.map(g => `<tr>
      <td class="cell-term">${escapeHtml(g.t)}</td>
      <td><span class="maskable">${escapeHtml(g.d)}<span class="fiche-ex">🔍 Exemple : ${escapeHtml(g.ex)}</span></span>
        ${g.code ? `<pre class="glos-code"><code>${escapeHtml(g.code)}</code></pre>` : ""}</td>
    </tr>`).join("");
  view().innerHTML = `
    <div class="quiz-head no-print">
      <button class="quiz-exit" id="exitG">✕ Retour</button>
      <div style="flex:1"></div>
      <button class="wbtn" id="maskG" style="max-width:200px">${glossaireMasked ? "👁️ Tout révéler" : "🙈 Mode révision (masquer)"}</button>
      <button class="wbtn" id="printG" style="max-width:120px">🖨️ Imprimer</button>
    </div>
    <div class="card fiche ${glossaireMasked ? "masked" : ""}">
      <div class="fiche-head">
        <span class="fiche-emoji">📖</span>
        <div><h2 class="fiche-title">Glossaire</h2>
        <p class="fiche-intro">Le vocabulaire de base de la programmation, expliqué simplement avec un exemple. À lire en premier si les termes te paraissent obscurs.</p></div>
      </div>
      <div class="fiche-table-wrap"><table class="fiche-table"><tbody>${rows}</tbody></table></div>
    </div>`;
  document.getElementById("exitG").addEventListener("click", renderHome);
  document.getElementById("printG").addEventListener("click", () => window.print());
  document.getElementById("maskG").addEventListener("click", () => { glossaireMasked = !glossaireMasked; renderGlossaire(); });
  if (glossaireMasked) view().querySelectorAll(".maskable").forEach(el =>
    el.addEventListener("click", () => el.classList.add("revealed")));
}

/* ---------------- Examen final de certification ----------------
   Rigueur : uniquement des questions à correction objective (QCM / Vrai-Faux),
   couvrant TOUS les mondes, sans feedback avant la fin.
   Réussite (certification) : ≥ 85% global ET ≥ 70% dans chaque monde. */
const EXAM_PASS = 85;
const EXAM_PASS_WORLD = 70;
function examPool() { return CARDS.filter(c => c.type === "qcm" || c.type === "tf"); }

function renderExamIntro() {
  renderTopbar();
  const pool = examPool();
  const byWorld = WORLDS.filter(w => pool.some(c => c.world === w.id))
    .map(w => `${w.emoji} ${w.nom}`).join(" · ");
  view().innerHTML = `
    <div class="card">
      <span class="tag">🏆 Examen final</span>
      <p class="qtext">Examen de certification</p>
      <div class="lesson-body">
        <p>Cet examen prouve ta maîtrise réelle. Règles :</p>
        <ul>
          <li><strong>${pool.length} questions</strong> à correction objective (QCM et Vrai/Faux), tirées de tous les mondes : ${byWorld}.</li>
          <li><strong>Aucune correction affichée avant la fin</strong> : comme un vrai examen.</li>
          <li>Tu es <strong>certifié</strong> si tu obtiens <strong>≥ ${EXAM_PASS}%</strong> au global <em>et</em> <strong>≥ ${EXAM_PASS_WORLD}%</strong> dans chaque monde.</li>
          <li>À la fin : ta note, le détail par monde, et la correction de chaque erreur.</li>
        </ul>
      </div>
      <div class="card-actions">
        <button class="btn btn-ghost" id="cancel">Plus tard</button>
        <button class="btn btn-primary" id="start">Démarrer l'examen →</button>
      </div>
    </div>`;
  document.getElementById("cancel").addEventListener("click", renderHome);
  document.getElementById("start").addEventListener("click", () => {
    session = { cards: shuffle(examPool()), index: 0, correct: 0, label: "Examen final", exam: true, answers: [] };
    renderQuestion();
  });
}

function renderExamResults() {
  renderTopbar();
  const ans = session.answers;
  const total = ans.length;
  const correct = ans.filter(a => a.ok).length;
  const pct = Math.round((correct / total) * 100);

  // détail par monde
  const perWorld = WORLDS.map(w => {
    const wa = ans.filter(a => a.world === w.id);
    if (!wa.length) return null;
    const c = wa.filter(a => a.ok).length;
    return { w, c, t: wa.length, pct: Math.round((c / wa.length) * 100) };
  }).filter(Boolean);

  const allWorldsOk = perWorld.every(p => p.pct >= EXAM_PASS_WORLD);
  const passed = pct >= EXAM_PASS && allWorldsOk;
  if (passed && (!state.cert || state.cert.score < pct)) {
    state.cert = { date: todayKey(), score: pct }; save();
  }

  const worldRows = perWorld.map(p => `<tr>
      <td class="cell-term">${p.w.emoji} ${p.w.nom}</td>
      <td>${p.c}/${p.t}</td>
      <td style="color:${p.pct >= EXAM_PASS_WORLD ? "var(--good)" : "var(--bad)"};font-weight:700">${p.pct}%${p.pct < EXAM_PASS_WORLD ? " ⚠️" : " ✓"}</td>
    </tr>`).join("");

  const wrong = ans.filter(a => !a.ok);
  const review = wrong.length ? wrong.map(a => {
    const c = a.card;
    const good = c.type === "tf" ? (c.answer ? "Vrai" : "Faux") : c.options[c.answer];
    return `<div class="review-item">
        <div class="review-q">❌ ${escapeHtml(c.q)}</div>
        <div class="review-a"><strong>Bonne réponse :</strong> ${escapeHtml(good)}</div>
        <div class="review-e">${escapeHtml(c.explication)}</div>
      </div>`;
  }).join("") : `<p style="color:var(--good)">Sans-faute, rien à revoir. 🎉</p>`;

  view().innerHTML = `
    <div class="card results">
      <div class="big">${passed ? "🏆" : "📚"}</div>
      <div class="score">${correct} / ${total} — ${pct}%</div>
      <div class="sub">${passed
        ? "CERTIFIÉ ! Tu démontres une maîtrise solide de toutes les notions."
        : `Pas encore certifié. Il faut ≥ ${EXAM_PASS}% global et ≥ ${EXAM_PASS_WORLD}% par monde.`}</div>
      ${passed ? `<div class="cert-badge">✅ Certificat de maîtrise — ${todayKey()}</div>` : ""}
    </div>

    <h3 class="fiche-th" style="margin-top:24px">Détail par monde</h3>
    <div class="card" style="padding:8px 18px">
      <table class="fiche-table"><tbody>${worldRows}</tbody></table>
    </div>

    <h3 class="fiche-th" style="margin-top:24px">Correction de tes erreurs (${wrong.length})</h3>
    <div class="card">${review}</div>

    <div class="cta-row" style="justify-content:center;margin-top:24px">
      <button class="btn btn-ghost" id="home">Accueil</button>
      <button class="btn btn-primary" id="retry">Repasser l'examen</button>
    </div>`;
  const old = session; session = null;
  document.getElementById("home").addEventListener("click", renderHome);
  document.getElementById("retry").addEventListener("click", renderExamIntro);
}

/* ---------------- Cours (lessons) — apprentissage guidé ---------------- */
let lesson = null; // { wid, sec }

function renderLesson(wid, sec = 0) {
  renderTopbar();
  const L = LESSONS[wid];
  const w = WORLDS.find(x => x.id === wid);
  lesson = { wid, sec };

  // Écran d'intro (avant la 1re section)
  if (sec < 0) {
    view().innerHTML = `
      <div class="card">
        <span class="tag">${w.emoji} ${w.nom} · Cours</span>
        <p class="qtext">${escapeHtml(L.intro)}</p>
        <div class="card-actions"><button class="btn btn-primary" id="go">Commencer le cours →</button></div>
      </div>`;
    document.getElementById("go").addEventListener("click", () => renderLesson(wid, 0));
    document.querySelector(".card").insertAdjacentHTML("afterbegin",
      `<button class="quiz-exit" style="margin-bottom:14px" id="exitL">✕ Retour</button>`);
    document.getElementById("exitL").addEventListener("click", () => { lesson = null; renderHome(); });
    return;
  }

  const total = L.sections.length;
  const s = L.sections[sec];
  const pct = (sec / total) * 100;
  const last = sec === total - 1;

  view().innerHTML = `
    <div class="quiz-head">
      <button class="quiz-exit" id="exitL">✕ Retour</button>
      <div class="qprogress"><div class="qfill" style="width:${pct}%;background:${w.couleur}"></div></div>
      <div class="qcount">Notion ${sec + 1} / ${total}</div>
    </div>
    <div class="card lesson">
      <span class="tag">${w.emoji} ${w.nom} · Cours</span>
      <h2 class="lesson-h">${escapeHtml(s.h)}</h2>
      <div class="lesson-body">${s.html}</div>
      ${codeMemoHtml(s.html)}
      <div class="lesson-key"><span class="key-label">🔑 Point clé</span> ${escapeHtml(s.cle)}</div>
      <div class="card-actions">
        ${sec > 0 ? `<button class="btn btn-ghost" id="prev">← Précédent</button>` : ""}
        <button class="btn btn-primary" id="nextS">${last ? "Passer au test →" : "Notion suivante →"}</button>
      </div>
    </div>`;

  document.getElementById("exitL").addEventListener("click", () => { lesson = null; renderHome(); });
  const prev = document.getElementById("prev");
  if (prev) prev.addEventListener("click", () => renderLesson(wid, sec - 1));
  document.getElementById("nextS").addEventListener("click", () => {
    if (last) finishLesson(wid);
    else renderLesson(wid, sec + 1);
  });
}

function finishLesson(wid) {
  state.lessons[wid] = true; save();
  const w = WORLDS.find(x => x.id === wid);
  lesson = null;
  // Rappel actif immédiat : enchaîne sur le quiz du monde (la science = tester juste après avoir lu)
  view().innerHTML = `
    <div class="card results">
      <div class="big">📖→🎯</div>
      <div class="score">Cours « ${w.nom} » terminé !</div>
      <div class="sub">Méthode prouvée : se tester juste après avoir lu ancre la mémoire bien mieux que relire.</div>
      <div class="card-actions" style="justify-content:center">
        <button class="btn btn-ghost" id="home">Plus tard</button>
        <button class="btn btn-primary" id="test">Me tester maintenant →</button>
      </div>
    </div>`;
  document.getElementById("home").addEventListener("click", renderHome);
  document.getElementById("test").addEventListener("click", () => startSession(shuffle(worldCards(wid)), w.nom));
}

/* ---------------- Fiche de révision ---------------- */
let ficheMasked = false;

function renderFiche(wid) {
  renderTopbar();
  const L = LESSONS[wid];
  const F = FICHES[wid] || { tables: [] };
  const w = WORLDS.find(x => x.id === wid);

  const essentiel = L.sections.map(s =>
    `<li><strong>${escapeHtml(s.h)}</strong> — ${escapeHtml(s.cle)}</li>`).join("");

  const tables = F.tables.map(t => {
    const rows = t.lignes.map(r => `<tr>
        <td class="cell-term">${escapeHtml(r.t)}</td>
        <td><span class="maskable">${escapeHtml(r.d)}<span class="fiche-ex">🔍 Exemple : ${escapeHtml(r.ex)}</span></span></td>
      </tr>`).join("");
    return `<div class="fiche-table-wrap">
        <h3 class="fiche-th">${escapeHtml(t.titre)}</h3>
        <table class="fiche-table"><tbody>${rows}</tbody></table>
      </div>`;
  }).join("");

  view().innerHTML = `
    <div class="quiz-head no-print">
      <button class="quiz-exit" id="exitF">✕ Retour</button>
      <div style="flex:1"></div>
      <button class="wbtn" id="maskBtn" style="max-width:200px">${ficheMasked ? "👁️ Tout révéler" : "🙈 Mode révision (masquer)"}</button>
      <button class="wbtn" id="printBtn" style="max-width:120px">🖨️ Imprimer</button>
    </div>
    <div class="card fiche ${ficheMasked ? "masked" : ""}" id="ficheCard" style="--accent:${w.couleur}">
      <div class="fiche-head">
        <span class="fiche-emoji">${w.emoji}</span>
        <div><h2 class="fiche-title">Fiche — ${escapeHtml(w.nom)}</h2>
        <p class="fiche-intro">${escapeHtml(L.intro)}</p></div>
      </div>

      <h3 class="fiche-th">🔑 L'essentiel</h3>
      <ul class="fiche-essentiel">${essentiel}</ul>

      ${tables}

      <p class="fiche-hint no-print">${ficheMasked
        ? "Mode révision actif : clique sur une case floutée pour la révéler (rappel actif)."
        : "Astuce : active le « Mode révision » pour masquer la colonne de droite et t'auto-interroger."}</p>
    </div>`;

  document.getElementById("exitF").addEventListener("click", renderHome);
  document.getElementById("printBtn").addEventListener("click", () => window.print());
  document.getElementById("maskBtn").addEventListener("click", () => { ficheMasked = !ficheMasked; renderFiche(wid); });

  // clic pour révéler une case masquée individuellement
  if (ficheMasked) view().querySelectorAll(".maskable").forEach(el =>
    el.addEventListener("click", () => el.classList.add("revealed")));
}

/* ---------------- Session / Quiz ---------------- */
let session = null; // { cards, index, correct, label }

function startSession(cards, label) {
  if (!cards.length) { renderHome(); return; }
  session = { cards, index: 0, correct: 0, label };
  renderQuestion();
}

function renderQuestion() {
  renderTopbar();
  const { cards, index, label } = session;
  const c = cards[index];
  const pct = (index / cards.length) * 100;
  const world = WORLDS.find(w => w.id === c.world);

  view().innerHTML = `
    <div class="quiz-head">
      <button class="quiz-exit" id="exitQuiz">✕ Quitter</button>
      <div class="qprogress"><div class="qfill" style="width:${pct}%"></div></div>
      <div class="qcount">${index + 1} / ${cards.length}</div>
    </div>
    <div class="card" id="card">
      <span class="tag">${world.emoji} ${world.nom} · ${typeLabel(c.type)}</span>
      ${c.lettre ? `<span class="tag letter" style="border-color:${world.couleur};color:${world.couleur}">Lettre ${escapeHtml(c.lettre)}</span>` : ""}
      <p class="qtext">${escapeHtml(c.q)}</p>
      <div id="body"></div>
    </div>
  `;
  document.getElementById("exitQuiz").addEventListener("click", () => { session = null; renderHome(); });

  if (c.type === "qcm") renderQcm(c);
  else if (c.type === "tf") renderTf(c);
  else renderFlash(c);
}

function renderQcm(c) {
  const body = document.getElementById("body");
  body.innerHTML = `<div class="options">${
    c.options.map((o, i) => `<button class="opt" data-i="${i}">${escapeHtml(o)}</button>`).join("")
  }</div><div id="fb"></div>`;
  body.querySelectorAll(".opt").forEach(btn =>
    btn.addEventListener("click", () => answerChoice(c, parseInt(btn.dataset.i), c.answer, body)));
}

function renderTf(c) {
  const body = document.getElementById("body");
  body.innerHTML = `<div class="options">
      <button class="opt" data-v="true">✔️ Vrai</button>
      <button class="opt" data-v="false">❌ Faux</button>
    </div><div id="fb"></div>`;
  body.querySelectorAll(".opt").forEach(btn =>
    btn.addEventListener("click", () => answerChoice(c, btn.dataset.v === "true", c.answer, body, true)));
}

function answerChoice(c, picked, correctVal, body, isTf) {
  const success = picked === correctVal;
  grade(c.id, success);
  if (success) session.correct++;

  // Mode examen : on enregistre, aucune correction affichée, on enchaîne directement.
  if (session.exam) {
    session.answers.push({ card: c, world: c.world, ok: success });
    next();
    return;
  }

  body.querySelectorAll(".opt").forEach((btn, i) => {
    btn.classList.add("locked");
    const val = isTf ? (btn.dataset.v === "true") : i;
    if (val === correctVal) { btn.classList.add("correct"); btn.querySelector(".mark") || btn.insertAdjacentHTML("beforeend", ' <span class="mark">✓</span>'); }
    if (val === picked && !success) { btn.classList.add("wrong"); btn.insertAdjacentHTML("beforeend", ' <span class="mark">✗</span>'); }
  });
  showFeedback(body, success, c);
}

function renderFlash(c) {
  const body = document.getElementById("body");
  body.innerHTML = `
    <p style="color:var(--text-dim);font-size:14px;margin:-6px 0 16px">
      Formule la réponse à voix haute (rappel actif), puis révèle.</p>
    <div class="card-actions"><button class="btn btn-primary" id="reveal">Révéler la réponse</button></div>`;
  document.getElementById("reveal").addEventListener("click", () => {
    body.innerHTML = `
      <div class="flash-answer"><h4>Réponse</h4><p>${escapeHtml(c.back)}</p></div>
      <div class="explain"><strong>💡 À retenir pour l'oral</strong>${escapeHtml(c.explication)}
        ${c.exemple ? `<div class="ex-line">🔍 Exemple concret : ${escapeHtml(c.exemple)}</div>` : ""}</div>
      <p style="margin:18px 0 8px;font-weight:700">Tu savais ?</p>
      <div class="self-row">
        <button class="btn" style="background:var(--good)" id="knew">✔️ Je savais</button>
        <button class="btn" style="background:var(--warn)" id="redo">🔁 À revoir</button>
      </div>`;
    document.getElementById("knew").addEventListener("click", () => { grade(c.id, true); session.correct++; next(); });
    document.getElementById("redo").addEventListener("click", () => { grade(c.id, false); next(); });
  });
}

function showFeedback(body, success, c) {
  const fb = document.getElementById("fb");
  fb.innerHTML = `
    <div class="explain ${success ? "good" : "bad"}">
      <strong>${success ? "✅ Correct ! (+" + XP_CORRECT + " XP)" : "❌ Pas tout à fait"}</strong>
      ${escapeHtml(c.explication)}
      ${c.exemple ? `<div class="ex-line">🔍 Exemple concret : ${escapeHtml(c.exemple)}</div>` : ""}
    </div>
    <div class="card-actions"><button class="btn btn-primary" id="next">Suivant →</button></div>`;
  document.getElementById("next").addEventListener("click", next);
}

function next() {
  session.index++;
  if (session.index >= session.cards.length) {
    if (session.roadmap) finishCheckpoint();
    else if (session.exam) renderExamResults();
    else renderResults();
  } else renderQuestion();
}

function renderResults() {
  renderTopbar();
  const { correct, cards, label } = session;
  const total = cards.length;
  const pct = Math.round((correct / total) * 100);
  const emoji = pct >= 90 ? "🏆" : pct >= 70 ? "🎉" : pct >= 50 ? "💪" : "📚";
  const msg = pct >= 90 ? "Maîtrise excellente !" : pct >= 70 ? "Solide, continue !" : pct >= 50 ? "Tu progresses." : "Rejoue : la répétition paie.";
  const earned = correct * XP_CORRECT;
  session = null;

  view().innerHTML = `
    <div class="card results">
      <div class="big">${emoji}</div>
      <div class="score">${correct} / ${total} — ${label}</div>
      <div class="sub">${msg}</div>
      <div class="earned">+${earned} XP gagnés</div>
      <div class="card-actions" style="justify-content:center">
        <button class="btn btn-ghost" id="home">Accueil</button>
        <button class="btn btn-primary" id="again">Réviser encore</button>
      </div>
    </div>`;
  document.getElementById("home").addEventListener("click", renderHome);
  document.getElementById("again").addEventListener("click", () => startSession(dueCards().length ? dueCards() : shuffle(CARDS).slice(0, DAILY_MAX), "Révision du jour"));
}

/* ---------------- Utils ---------------- */
function typeLabel(t) { return t === "qcm" ? "QCM" : t === "tf" ? "Vrai / Faux" : "Flashcard"; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])); }

// Mémo automatique : repère les mots de code présents et les explique (pour débutants)
function codeMemoHtml(text) {
  if (!text || typeof CODE_TERMS === "undefined") return "";
  const low = text.toLowerCase();
  const found = CODE_TERMS.filter(t => {
    if (t.token === "//") return text.includes("//") || /#\s/.test(text);
    if (t.token === ".()") return /[\w\]\)]\s*\.\s*\w+\s*\(/.test(text);
    if (t.token === "__init__") return text.includes("__init__");
    return new RegExp("\\b" + t.token + "\\b").test(low);
  });
  if (!found.length) return "";
  const items = found.map(t => `<li><code>${escapeHtml(t.label)}</code> — ${escapeHtml(t.def)}</li>`).join("");
  return `<details class="code-memo">
      <summary>🔤 Les mots de code expliqués <span class="cm-hint">(clique si un terme t'échappe)</span></summary>
      <ul>${items}</ul>
    </details>`;
}

/* ---------------- Navigation globale ---------------- */
document.querySelector(".brand").addEventListener("click", () => { session = null; renderHome(); });
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Réinitialiser toute ta progression (XP, niveaux, mémorisation) ?")) {
    state = defaultState(); save(); session = null; renderHome();
  }
});

/* ---------------- Boot ---------------- */
async function boot() {
  if (typeof RevAuth !== "undefined") {
    RevAuth.onAuthChange = () => renderAuthBar();
    RevAuth.onSyncNotice = status => { syncStatus = status; renderAuthBar(); };
    await RevAuth.init();
    if (RevAuth.isLoggedIn()) {
      state = await RevAuth.loadMergedProgress(state);
      save();
    }
  }
  renderHome();
}
boot();
