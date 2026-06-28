const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data.json");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  const { createClient } = require("@supabase/supabase-js");
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function usesCloud() {
  return !!supabase;
}

function defaultData() {
  return { users: [], progress: {}, nextId: 1 };
}

function loadLocal() {
  try {
    if (!fs.existsSync(DATA_FILE)) return defaultData();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return {
      users: Array.isArray(data.users) ? data.users : [],
      progress: data.progress && typeof data.progress === "object" ? data.progress : {},
      nextId: Number.isInteger(data.nextId) ? data.nextId : 1,
    };
  } catch {
    return defaultData();
  }
}

function saveLocal(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

let localData = loadLocal();

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    password_hash: row.password_hash,
    display_name: row.display_name,
    created_at: row.created_at,
  };
}

async function getUserByEmail(email) {
  if (supabase) {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).maybeSingle();
    if (error) throw error;
    return mapUser(data);
  }
  return localData.users.find(u => u.email === email) || null;
}

async function getUserById(id) {
  if (supabase) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return mapUser(data);
  }
  return localData.users.find(u => u.id === id) || null;
}

async function insertUser(email, passwordHash, displayName, createdAt) {
  if (supabase) {
    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: passwordHash,
        display_name: displayName,
        created_at: createdAt,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapUser(data);
  }

  const user = {
    id: localData.nextId++,
    email,
    password_hash: passwordHash,
    display_name: displayName,
    created_at: createdAt,
  };
  localData.users.push(user);
  saveLocal(localData);
  return user;
}

async function getProgress(userId) {
  if (supabase) {
    const { data, error } = await supabase.from("progress").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return { data: data.data, updated_at: data.updated_at };
  }

  const row = localData.progress[String(userId)];
  return row || null;
}

async function upsertProgress(userId, jsonData, updatedAt) {
  if (supabase) {
    const { error } = await supabase.from("progress").upsert(
      { user_id: userId, data: jsonData, updated_at: updatedAt },
      { onConflict: "user_id" }
    );
    if (error) throw error;
    return;
  }

  localData.progress[String(userId)] = { data: jsonData, updated_at: updatedAt };
  saveLocal(localData);
}

module.exports = {
  usesCloud,
  getUserByEmail,
  getUserById,
  insertUser,
  getProgress,
  upsertProgress,
};
