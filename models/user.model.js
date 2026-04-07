const db = require("../config/db");

let _twofaColumnsPromise;
async function hasTwofaColumns() {
  if (!_twofaColumnsPromise) {
    _twofaColumnsPromise = (async () => {
      const [rows] = await db.query(
        "SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME IN ('twofa_enabled','twofa_secret')"
      );
      return Number(rows && rows[0] && rows[0].c) === 2;
    })();
  }
  return _twofaColumnsPromise;
}

let _approvalColumnPromise;
async function hasApprovalColumn() {
  if (!_approvalColumnPromise) {
    _approvalColumnPromise = (async () => {
      const [rows] = await db.query(
        "SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'approved'"
      );
      return Number(rows && rows[0] && rows[0].c) === 1;
    })();
  }
  return _approvalColumnPromise;
}

async function userSelectFields() {
  const has2fa = await hasTwofaColumns();
  const hasApproval = await hasApprovalColumn();

  const base = "id, username, password, email";
  const twofa = has2fa
    ? "twofa_enabled, twofa_secret"
    : "0 AS twofa_enabled, NULL AS twofa_secret";

  // Backward compatible jika kolom approved belum dimigrasi: default dianggap sudah approved.
  const approved = hasApproval ? "approved" : "1 AS approved";

  return `${base}, ${twofa}, ${approved}`;
}

const User = {
  create: async (data) => {
    const cols = ["username", "password", "email"];
    const vals = [data.username, data.password, data.email];

    if (await hasApprovalColumn()) {
      cols.push("approved");
      // default 0 (menunggu approval)
      vals.push(data.approved != null ? Number(data.approved) : 0);
    }

    const placeholders = cols.map(() => "?").join(", ");
    const [result] = await db.query(
      `INSERT INTO \`user\` (${cols.join(", ")}) VALUES (${placeholders})`,
      vals
    );
    return result;
  },

  findAll: async () => {
    // Backward compatible jika kolom 2FA belum dimigrasi.
    const has2fa = await hasTwofaColumns();
    const hasApproval = await hasApprovalColumn();

    const fields = [
      "id",
      "username",
      "email",
      has2fa ? "twofa_enabled" : "0 AS twofa_enabled",
      hasApproval ? "approved" : "1 AS approved"
    ].join(", ");

    const [rows] = await db.query(
      `SELECT ${fields} FROM \`user\` ORDER BY id ASC`
    );
    return rows;
  },

  findByUsername: async (username) => {
    const fields = await userSelectFields();
    const [rows] = await db.query(
      `SELECT ${fields} FROM \`user\` WHERE username = ? LIMIT 1`,
      [username]
    );
    return rows[0];
  },

  findById: async (id) => {
    const fields = await userSelectFields();
    const [rows] = await db.query(
      `SELECT ${fields} FROM \`user\` WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0];
  },

  update: async (id, data) => {
    // Update only provided fields. Password must already be hashed.
    const sets = [];
    const params = [];

    if (data.username !== undefined) {
      sets.push("username = ?");
      params.push(data.username);
    }
    if (data.email !== undefined) {
      sets.push("email = ?");
      params.push(data.email);
    }
    if (data.password !== undefined) {
      sets.push("password = ?");
      params.push(data.password);
    }

    if (!sets.length) {
      return { affectedRows: 0, changedRows: 0 };
    }

    params.push(id);
    const [result] = await db.query(
      `UPDATE \`user\` SET ${sets.join(", ")} WHERE id = ?`,
      params
    );
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query("DELETE FROM `user` WHERE id = ?", [id]);
    return result;
  },

  existsByUsername: async (username, exceptId = null) => {
    if (exceptId != null) {
      const [rows] = await db.query(
        "SELECT 1 AS ok FROM `user` WHERE username = ? AND id <> ? LIMIT 1",
        [username, exceptId]
      );
      return !!rows.length;
    }

    const [rows] = await db.query(
      "SELECT 1 AS ok FROM `user` WHERE username = ? LIMIT 1",
      [username]
    );
    return !!rows.length;
  },

  setTwofaSecret: async (id, secretBase32) => {
    if (!(await hasTwofaColumns())) {
      throw new Error("Kolom 2FA belum ada di tabel `user` (twofa_enabled, twofa_secret)");
    }
    const [result] = await db.query(
      "UPDATE `user` SET twofa_secret = ? WHERE id = ?",
      [secretBase32, id]
    );
    return result;
  },

  enableTwofa: async (id) => {
    if (!(await hasTwofaColumns())) {
      throw new Error("Kolom 2FA belum ada di tabel `user` (twofa_enabled, twofa_secret)");
    }
    const [result] = await db.query(
      "UPDATE `user` SET twofa_enabled = 1 WHERE id = ?",
      [id]
    );
    return result;
  },

  disableTwofa: async (id) => {
    if (!(await hasTwofaColumns())) {
      throw new Error("Kolom 2FA belum ada di tabel `user` (twofa_enabled, twofa_secret)");
    }
    const [result] = await db.query(
      "UPDATE `user` SET twofa_enabled = 0, twofa_secret = NULL WHERE id = ?",
      [id]
    );
    return result;
  },

  setApproved: async (id, approved) => {
    if (!(await hasApprovalColumn())) {
      throw new Error("Kolom approval belum ada di tabel `user` (approved)");
    }
    const v = Number(approved) ? 1 : 0;
    const [result] = await db.query(
      "UPDATE `user` SET approved = ? WHERE id = ?",
      [v, id]
    );
    return result;
  }
};

module.exports = User;
