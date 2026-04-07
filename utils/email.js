function tryRequire(name) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(name);
  } catch (e) {
    return null;
  }
}

async function sendMail({ to, subject, text, html }) {
  const nodemailer = tryRequire("nodemailer");
  if (!nodemailer) {
    // graceful fallback: do not break user creation
    console.warn("[email] nodemailer belum terinstall. Skip kirim email.");
    return { ok: false, skipped: true, reason: "nodemailer_missing" };
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !from) {
    console.warn("[email] SMTP env belum lengkap. Skip kirim email.");
    return { ok: false, skipped: true, reason: "smtp_env_missing" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE || "0") === "1",
    auth: user && pass ? { user, pass } : undefined
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject: subject || "",
    text: text || undefined,
    html: html || undefined
  });

  return { ok: true, info };
}

module.exports = { sendMail };
