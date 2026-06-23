const nodemailer = require('nodemailer');

// ─── Transporter Setup ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const verifyMailer = () => {
  return new Promise((resolve) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP connection failed to verify:');
        console.error('   Host: smtp.gmail.com');
        console.error('   Port: 587');
        console.error('   User:', process.env.EMAIL_USER);
        console.error('   Error Message:', error.message);
        console.error('   Full Error:', error);
        resolve(false);
      } else {
        console.log('✅ SMTP connection successfully verified (smtp.gmail.com:587). Server is ready to send emails.');
        resolve(true);
      }
    });
  });
};

// ─── HTML Layout Helper ───────────────────────────────────────────────────────
const baseHtml = (bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CareSync Notification</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:28px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">
                Care<span style="color:#bfdbfe;">Sync</span>
              </h1>
              <p style="margin:4px 0 0;color:#bfdbfe;font-size:12px;font-weight:500;">Hospital Appointment Management</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">For support: <a href="mailto:support@caresync.com" style="color:#2563eb;">support@caresync.com</a></p>
              <p style="margin:6px 0 0;font-size:11px;color:#94a3b8;">© 2024 CareSync — All rights reserved</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const detailRow = (label, value) => `
  <tr>
    <td style="padding:10px 12px;font-size:13px;font-weight:700;color:#475569;background:#f8fafc;border-bottom:1px solid #e2e8f0;width:40%;">${label}</td>
    <td style="padding:10px 12px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;">${value}</td>
  </tr>
`;

// ─── 1. Appointment Confirmation (to Patient) ─────────────────────────────────
const sendAppointmentConfirmation = async (
  patientEmail, patientName, doctorName, department, date, slot, fee
) => {
  const html = baseHtml(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;width:52px;height:52px;background:#f0fdf4;border-radius:50%;line-height:52px;font-size:24px;border:2px solid #bbf7d0;">✅</div>
      <h2 style="margin:16px 0 6px;font-size:20px;font-weight:800;color:#0f172a;">Appointment Confirmed!</h2>
      <p style="margin:0;font-size:14px;color:#64748b;">Hello <strong>${patientName}</strong>, your appointment has been successfully scheduled.</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      ${detailRow('Doctor', doctorName)}
      ${detailRow('Specialty', department)}
      ${detailRow('Date', date)}
      ${detailRow('Time Slot', slot)}
      ${detailRow('Consultation Fee', `₹${fee}`)}
    </table>

    <div style="margin-top:24px;padding:16px;background:#eff6ff;border-radius:12px;border:1px solid #bfdbfe;">
      <p style="margin:0;font-size:12px;color:#1e40af;font-weight:600;">
        📌 If you need to cancel or reschedule, please log in to CareSync at least 24 hours before your appointment.
      </p>
    </div>
  `);

  const info = await transporter.sendMail({
    from: `"CareSync" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: '✅ Appointment Confirmed — CareSync',
    html,
  });
  console.log(`✉️ Patient confirmation email sent successfully to ${patientEmail}. MessageId: ${info.messageId}`);
};

// ─── 2. Appointment Cancellation (to Patient) ─────────────────────────────────
const sendAppointmentCancellation = async (
  patientEmail, patientName, doctorName, date, slot
) => {
  const html = baseHtml(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;width:52px;height:52px;background:#fff1f2;border-radius:50%;line-height:52px;font-size:24px;border:2px solid #fecdd3;">❌</div>
      <h2 style="margin:16px 0 6px;font-size:20px;font-weight:800;color:#0f172a;">Appointment Cancelled</h2>
      <p style="margin:0;font-size:14px;color:#64748b;">Hello <strong>${patientName}</strong>, your appointment has been cancelled.</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      ${detailRow('Doctor', doctorName)}
      ${detailRow('Date', date)}
      ${detailRow('Time Slot', slot)}
      ${detailRow('Status', '<span style="color:#f43f5e;font-weight:700;">Cancelled</span>')}
    </table>

    <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
      <p style="margin:0;font-size:12px;color:#065f46;font-weight:600;">
        💡 You can book a new appointment anytime by logging into CareSync.
      </p>
    </div>
  `);

  const info = await transporter.sendMail({
    from: `"CareSync" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: '❌ Appointment Cancelled — CareSync',
    html,
  });
  console.log(`✉️ Appointment cancellation email sent successfully to ${patientEmail}. MessageId: ${info.messageId}`);
};

// ─── 3. New Appointment Notification (to Doctor) ──────────────────────────────
const sendDoctorNotification = async (
  doctorEmail, doctorName, patientName, date, slot
) => {
  const html = baseHtml(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;width:52px;height:52px;background:#eff6ff;border-radius:50%;line-height:52px;font-size:24px;border:2px solid #bfdbfe;">📅</div>
      <h2 style="margin:16px 0 6px;font-size:20px;font-weight:800;color:#0f172a;">New Appointment Scheduled</h2>
      <p style="margin:0;font-size:14px;color:#64748b;">Hello <strong>${doctorName}</strong>, a new patient has booked a consultation with you.</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      ${detailRow('Patient', patientName)}
      ${detailRow('Date', date)}
      ${detailRow('Time Slot', slot)}
    </table>

    <div style="margin-top:24px;padding:16px;background:#eff6ff;border-radius:12px;border:1px solid #bfdbfe;">
      <p style="margin:0;font-size:12px;color:#1e40af;font-weight:600;">
        🩺 Please log in to CareSync to view full patient details and manage your schedule.
      </p>
    </div>
  `);

  const info = await transporter.sendMail({
    from: `"CareSync" <${process.env.EMAIL_USER}>`,
    to: doctorEmail,
    subject: '📅 New Appointment Scheduled — CareSync',
    html,
  });
  console.log(`✉️ Doctor notification email sent successfully to ${doctorEmail}. MessageId: ${info.messageId}`);
};

module.exports = {
  sendAppointmentConfirmation,
  sendAppointmentCancellation,
  sendDoctorNotification,
  verifyMailer,
};
