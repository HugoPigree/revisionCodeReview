require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const store = require("./store");

const PORT = process.env.PORT || 4599;
const JWT_SECRET = process.env.JWT_SECRET || "revquest-dev-secret-change-in-production";
const JWT_EXPIRES = "30d";
const ROOT = path.join(__dirname, "..");

const app = express();
app.use(cors());
app.use(express.json({ limit: "512kb" }));

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, name: user.display_name }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Authentification requise." });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      display_name: payload.name,
    };
    next();
  } catch {
    return res.status(401).json({ error: "Session expirée ou invalide." });
  }
}

function serverError(res, err) {
  console.error(err);
  res.status(500).json({ error: "Erreur serveur." });
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const displayName = String(req.body.displayName || "").trim();

    if (!isValidEmail(email)) return res.status(400).json({ error: "Adresse e-mail invalide." });
    if (password.length < 6) return res.status(400).json({ error: "Mot de passe : 6 caractères minimum." });
    if (!displayName || displayName.length > 40) return res.status(400).json({ error: "Pseudo requis (40 caractères max)." });

    if (await store.getUserByEmail(email)) {
      return res.status(409).json({ error: "Un compte existe déjà avec cet e-mail." });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const createdAt = nowIso();
    const user = await store.insertUser(email, passwordHash, displayName, createdAt);
    const token = signToken(user);

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, displayName: user.display_name, createdAt: user.created_at },
    });
  } catch (err) {
    serverError(res, err);
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const row = await store.getUserByEmail(email);
    if (!row || !bcrypt.compareSync(password, row.password_hash)) {
      return res.status(401).json({ error: "E-mail ou mot de passe incorrect." });
    }
    const user = { id: row.id, email: row.email, display_name: row.display_name, created_at: row.created_at };
    res.json({
      token: signToken(user),
      user: { id: user.id, email: user.email, displayName: user.display_name, createdAt: user.created_at },
    });
  } catch (err) {
    serverError(res, err);
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const row = await store.getUserById(req.user.id);
    if (!row) return res.status(404).json({ error: "Compte introuvable." });
    res.json({ id: row.id, email: row.email, displayName: row.display_name, createdAt: row.created_at });
  } catch (err) {
    serverError(res, err);
  }
});

app.get("/api/progress", authMiddleware, async (req, res) => {
  try {
    const row = await store.getProgress(req.user.id);
    if (!row) return res.json({ state: null, updatedAt: null });
    try {
      res.json({ state: JSON.parse(row.data), updatedAt: row.updated_at });
    } catch {
      res.json({ state: null, updatedAt: row.updated_at });
    }
  } catch (err) {
    serverError(res, err);
  }
});

app.put("/api/progress", authMiddleware, async (req, res) => {
  try {
    const state = req.body.state;
    if (!state || typeof state !== "object") {
      return res.status(400).json({ error: "Progression invalide." });
    }
    const updatedAt = nowIso();
    await store.upsertProgress(req.user.id, JSON.stringify(state), updatedAt);
    res.json({ ok: true, updatedAt });
  } catch (err) {
    serverError(res, err);
  }
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "revquest-api",
    storage: store.usesCloud() ? "supabase" : "local",
  });
});

app.use(express.static(ROOT));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(ROOT, "index.html"));
});

app.listen(PORT, () => {
  console.log(`RevQuest → http://localhost:${PORT}`);
  if (store.usesCloud()) {
    console.log("Stockage cloud Supabase actif — comptes partagés entre tous les PC");
  } else {
    console.log("Stockage local (data.json) — configure Supabase pour synchroniser entre PC");
    console.log("Voir README : section « Comptes sur plusieurs PC »");
  }
});
