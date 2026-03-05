import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ── Load from .env ────────────────────────────────────────────────────────────
SMTP_EMAIL    = os.getenv("SMTP_EMAIL")       # your Gmail address
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")    # Gmail App Password (not your login password)
FRONTEND_URL  = os.getenv("FRONTEND_URL", "https://fictional-invention-jj4jgwpj66qcqvpw-3000.app.github.dev")


def _send(to: str, subject: str, html: str):
    """Internal helper — sends an HTML email via Gmail SMTP."""
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print(f"[EMAIL SKIPPED] No SMTP credentials. Would send to {to}: {subject}")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"DoubtBridge <{SMTP_EMAIL}>"
    msg["To"]      = to
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to, msg.as_string())
        print(f"[EMAIL SENT] {subject} → {to}")
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send to {to}: {e}")


# ─────────────────────────────────────────────────────────────────────────────
# 1. EMAIL VERIFICATION
# ─────────────────────────────────────────────────────────────────────────────
def send_verification_email(email: str, token: str):
    verify_url = f"{FRONTEND_URL}/verify-email?token={token}"
    html = f"""
    <div style="font-family:'Segoe UI',sans-serif;max-width:520px;margin:auto;padding:32px;background:#f4f6ff;border-radius:16px">
      <div style="background:#4f46e5;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
        <span style="color:#fff;font-size:22px;font-weight:800">⚡ DoubtBridge</span>
      </div>
      <h2 style="color:#0f172a;margin-bottom:8px">Verify your email address</h2>
      <p style="color:#64748b;line-height:1.6">Thanks for signing up! Click the button below to verify your email and activate your account.</p>
      <div style="text-align:center;margin:32px 0">
        <a href="{verify_url}" style="background:#4f46e5;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px">
          ✅ Verify Email Address
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px">If you didn't create this account, you can safely ignore this email.</p>
      <p style="color:#94a3b8;font-size:12px;margin-top:16px">Or copy this link: <br/><a href="{verify_url}" style="color:#4f46e5">{verify_url}</a></p>
    </div>
    """
    _send(email, "Verify your DoubtBridge account", html)


# ─────────────────────────────────────────────────────────────────────────────
# 2. BOOKING REQUEST → sent to MENTOR
# ─────────────────────────────────────────────────────────────────────────────
def send_booking_request_email(
    mentor_email: str,
    mentor_name: str,
    student_email: str,
    topic: str,
    duration: int,
    preferred_time: str,
    booking_id: int,
):
    accept_url  = f"{FRONTEND_URL}/bookings?action=accept&id={booking_id}"
    decline_url = f"{FRONTEND_URL}/bookings?action=decline&id={booking_id}"
    html = f"""
    <div style="font-family:'Segoe UI',sans-serif;max-width:520px;margin:auto;padding:32px;background:#f4f6ff;border-radius:16px">
      <div style="background:#4f46e5;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
        <span style="color:#fff;font-size:22px;font-weight:800">⚡ DoubtBridge</span>
      </div>
      <h2 style="color:#0f172a">New Session Request 📬</h2>
      <p style="color:#64748b">Hi <b>{mentor_name}</b>, you have a new booking request!</p>
      <div style="background:#fff;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #e2e5ef">
        <p style="margin:0 0 8px"><b>Student:</b> {student_email}</p>
        <p style="margin:0 0 8px"><b>Topic:</b> {topic}</p>
        <p style="margin:0 0 8px"><b>Duration:</b> {duration} minutes</p>
        <p style="margin:0"><b>Preferred Time:</b> {preferred_time}</p>
      </div>
      <div style="display:flex;gap:12px;margin-top:24px">
        <a href="{accept_url}" style="background:#16a34a;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;margin-right:12px">
          ✅ Accept Session
        </a>
        <a href="{decline_url}" style="background:#dc2626;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700">
          ❌ Decline
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;margin-top:20px">You can also manage bookings from your dashboard.</p>
    </div>
    """
    _send(mentor_email, f"New session request from {student_email}", html)


# ─────────────────────────────────────────────────────────────────────────────
# 3. BOOKING ACCEPTED → sent to STUDENT
# ─────────────────────────────────────────────────────────────────────────────
def send_booking_accepted_email(
    student_email: str,
    mentor_name: str,
    topic: str,
    duration: int,
    preferred_time: str,
    booking_id: int,
):
    chat_url = f"{FRONTEND_URL}/chat/{booking_id}"
    html = f"""
    <div style="font-family:'Segoe UI',sans-serif;max-width:520px;margin:auto;padding:32px;background:#f4f6ff;border-radius:16px">
      <div style="background:#4f46e5;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
        <span style="color:#fff;font-size:22px;font-weight:800">⚡ DoubtBridge</span>
      </div>
      <h2 style="color:#0f172a">Session Accepted! 🎉</h2>
      <p style="color:#64748b">Great news! <b>{mentor_name}</b> has accepted your session request.</p>
      <div style="background:#fff;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #e2e5ef">
        <p style="margin:0 0 8px"><b>Mentor:</b> {mentor_name}</p>
        <p style="margin:0 0 8px"><b>Topic:</b> {topic}</p>
        <p style="margin:0 0 8px"><b>Duration:</b> {duration} minutes</p>
        <p style="margin:0"><b>Time:</b> {preferred_time}</p>
      </div>
      <div style="text-align:center;margin-top:24px">
        <a href="{chat_url}" style="background:#4f46e5;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px">
          💬 Open Chat Room
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;margin-top:20px">Use the chat room to coordinate and discuss before and during your session.</p>
    </div>
    """
    _send(student_email, f"Your session with {mentor_name} is confirmed!", html)