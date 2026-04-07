const crypto = require("crypto");
const User = require("../models/user.model");
const { sendMail } = require("../utils/email");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function toSafeUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    email: row.email ?? null,
    twofa_enabled: row.twofa_enabled ?? 0,
    approved: row.approved ?? 1
  };
}

exports.create = async (req, res) => {
  try {
    const { username, password, email = null } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username dan password wajib diisi"
      });
    }

    const existing = await User.findByUsername(username);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "username sudah terdaftar"
      });
    }

    const passwordHash = hashPassword(password);
    const result = await User.create({
      username,
      password: passwordHash,
      email,
      approved: 0
    });

    // Notify admin (user id=1) when a new account is created.
    // This is best-effort and won't fail the request if email is not configured.
    try {
      const admin = await User.findById(1);
      if (admin && admin.email) {
        await sendMail({
          to: admin.email,
          subject: "[Quisioner Pelatihan] Akun Baru Dibuat",
          text: `Akun baru dibuat:\n\nusername: ${username}\nemail: ${email || "-"}\n\nSilakan approve di menu Data User.`,
        });
      }
    } catch (e) {
      // ignore
    }

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        username,
        email
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.approve = async (req, res) => {
  try {
    // Only admin user id=1 can approve.
    if (!req.user || String(req.user.sub) !== "1") {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({
        success: false,
        message: "id tidak valid"
      });
    }

    const approved = req.body && req.body.approved !== undefined ? req.body.approved : 1;
    const result = await User.setApproved(id, approved);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "user tidak ditemukan"
      });
    }

    const row = await User.findById(id);
    return res.status(200).json({
      success: true,
      data: toSafeUser(row)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.resetTwofa = async (req, res) => {
  try {
    // adminOnly middleware sudah handle, tapi keep safe guard.
    if (!req.user || String(req.user.sub) !== "1") {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({
        success: false,
        message: "id tidak valid"
      });
    }

    const result = await User.disableTwofa(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "user tidak ditemukan"
      });
    }

    const row = await User.findById(id);
    return res.status(200).json({
      success: true,
      message: "2FA berhasil direset",
      data: toSafeUser(row)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const rows = await User.findAll();
    return res.status(200).json({
      success: true,
      data: rows.map(toSafeUser)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.findById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({
        success: false,
        message: "id tidak valid"
      });
    }

    const row = await User.findById(id);
    if (!row) {
      return res.status(404).json({
        success: false,
        message: "user tidak ditemukan"
      });
    }

    return res.status(200).json({
      success: true,
      data: toSafeUser(row)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({
        success: false,
        message: "id tidak valid"
      });
    }

    const { username, password, email } = req.body || {};
    if (username === undefined && password === undefined && email === undefined) {
      return res.status(400).json({
        success: false,
        message: "tidak ada field yang diupdate"
      });
    }

    if (username !== undefined) {
      if (!username) {
        return res.status(400).json({
          success: false,
          message: "username tidak boleh kosong"
        });
      }
      const exists = await User.existsByUsername(username, id);
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "username sudah terdaftar"
        });
      }
    }

    const data = {
      username: username !== undefined ? username : undefined,
      email: email !== undefined ? email : undefined
    };

    if (password !== undefined) {
      if (!password) {
        return res.status(400).json({
          success: false,
          message: "password tidak boleh kosong"
        });
      }
      data.password = hashPassword(password);
    }

    const result = await User.update(id, data);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "user tidak ditemukan"
      });
    }

    const row = await User.findById(id);
    return res.status(200).json({
      success: true,
      data: toSafeUser(row)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({
        success: false,
        message: "id tidak valid"
      });
    }

    const result = await User.remove(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "user tidak ditemukan"
      });
    }

    return res.status(200).json({
      success: true,
      message: "user berhasil dihapus"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
