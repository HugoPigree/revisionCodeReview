/* RevQuest — authentification et sync cloud de la progression */
(function () {
  const TOKEN_KEY = "revquest_auth_token";
  const USER_KEY = "revquest_auth_user";
  const API_BASE = window.REVQUEST_API || "";

  let token = localStorage.getItem(TOKEN_KEY);
  let user = null;
  let saveTimer = null;
  let saveInFlight = false;
  let pendingSave = null;
  let onAuthChange = null;
  let onSyncNotice = null;

  try {
    user = JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    user = null;
  }

  function headers(json) {
    const h = json ? { "Content-Type": "application/json" } : {};
    if (token) h.Authorization = "Bearer " + token;
    return h;
  }

  async function api(path, opts = {}) {
    const res = await fetch(API_BASE + path, {
      ...opts,
      headers: { ...headers(!!opts.body), ...(opts.headers || {}) },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Erreur réseau.");
    return data;
  }

  function setSession(nextToken, nextUser) {
    token = nextToken;
    user = nextUser;
    if (token && user) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    if (onAuthChange) onAuthChange(user);
  }

  function isLoggedIn() {
    return !!(token && user);
  }

  function getUser() {
    return user;
  }

  function serverAvailable() {
    return location.protocol.startsWith("http");
  }

  async function init() {
    if (!serverAvailable() || !token) return false;
    try {
      const me = await api("/api/auth/me");
      user = { id: me.id, email: me.email, displayName: me.displayName, createdAt: me.createdAt };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return true;
    } catch {
      setSession(null, null);
      return false;
    }
  }

  async function register(email, password, displayName) {
    const data = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, displayName }),
    });
    setSession(data.token, data.user);
    return data.user;
  }

  async function login(email, password) {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setSession(data.token, data.user);
    return data.user;
  }

  function logout() {
    setSession(null, null);
  }

  async function fetchRemoteProgress() {
    if (!isLoggedIn()) return null;
    const data = await api("/api/progress");
    return data.state ? { state: data.state, updatedAt: data.updatedAt } : null;
  }

  async function pushProgress(state) {
    if (!isLoggedIn()) return;
    await api("/api/progress", {
      method: "PUT",
      body: JSON.stringify({ state }),
    });
  }

  function queueSave(state) {
    if (!isLoggedIn()) return;
    pendingSave = state;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSave, 600);
  }

  async function flushSave() {
    if (!pendingSave || saveInFlight || !isLoggedIn()) return;
    saveInFlight = true;
    const payload = pendingSave;
    pendingSave = null;
    try {
      await pushProgress(payload);
      if (onSyncNotice) onSyncNotice("saved");
    } catch {
      if (onSyncNotice) onSyncNotice("error");
    } finally {
      saveInFlight = false;
      if (pendingSave) flushSave();
    }
  }

  /** Fusionne la progression locale et distante (XP le plus élevé, unions des clés). */
  function mergeProgress(local, remote) {
    if (!remote) return local;
    if (!local) return remote;
    const merged = {
      xp: Math.max(local.xp || 0, remote.xp || 0),
      streak: Math.max(local.streak || 0, remote.streak || 0),
      lastDay: pickLatestDay(local.lastDay, remote.lastDay),
      cards: { ...(remote.cards || {}), ...(local.cards || {}) },
      lessons: { ...(remote.lessons || {}), ...(local.lessons || {}) },
      roadmap: { ...(remote.roadmap || {}), ...(local.roadmap || {}) },
    };
    if (local.cert || remote.cert) {
      const ls = local.cert?.score || 0;
      const rs = remote.cert?.score || 0;
      merged.cert = ls >= rs ? local.cert : remote.cert;
    }
    return merged;
  }

  function pickLatestDay(a, b) {
    if (!a) return b;
    if (!b) return a;
    return a >= b ? a : b;
  }

  async function loadMergedProgress(localState) {
    if (!isLoggedIn()) return localState;
    try {
      const remote = await fetchRemoteProgress();
      if (!remote?.state) {
        await pushProgress(localState);
        return localState;
      }
      const merged = mergeProgress(localState, remote.state);
      await pushProgress(merged);
      return merged;
    } catch {
      return localState;
    }
  }

  window.RevAuth = {
    init,
    register,
    login,
    logout,
    isLoggedIn,
    getUser,
    serverAvailable,
    loadMergedProgress,
    queueSave,
    flushSave,
    mergeProgress,
    set onAuthChange(fn) { onAuthChange = fn; },
    set onSyncNotice(fn) { onSyncNotice = fn; },
  };
})();
