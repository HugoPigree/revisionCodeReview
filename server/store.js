const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data.json");

function defaultData() {
  return { users: [], progress: {}, nextId: 1 };
}

function load() {
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

function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

let data = load();

function persist() {
  save(data);
}

function getUserByEmail(email) {
  return data.users.find(u => u.email === email) || null;
}

function getUserById(id) {
  return data.users.find(u => u.id === id) || null;
}

function insertUser(email, passwordHash, displayName, createdAt) {
  const user = {
    id: data.nextId++,
    email,
    password_hash: passwordHash,
    display_name: displayName,
    created_at: createdAt,
  };
  data.users.push(user);
  persist();
  return user;
}

function getProgress(userId) {
  const row = data.progress[String(userId)];
  return row || null;
}

function upsertProgress(userId, jsonData, updatedAt) {
  data.progress[String(userId)] = { data: jsonData, updated_at: updatedAt };
  persist();
}

module.exports = {
  getUserByEmail,
  getUserById,
  insertUser,
  getProgress,
  upsertProgress,
};
