from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

# Only configure if credentials are provided
_mail_configured = bool(settings.MAIL_USERNAME and settings.MAIL_PASSWORD and settings.MAIL_FROM)

if _mail_configured:
    conf = ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
        MAIL_PORT=587,
        MAIL_SERVER="smtp.gmail.com",
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
    )
    fm = FastMail(conf)
else:
    fm = None


async def send_application_result_email(
    recipient_email: str,
    recipient_name: str,
    opportunity_title: str,
    accepted: bool,
):
    """Send acceptance or rejection email to applicant."""
    if not _mail_configured or fm is None:
        logger.warning("Email not configured — skipping email to %s", recipient_email)
        return

    if accepted:
        subject = f"🎉 Congratulations! Your Application for '{opportunity_title}'"
        body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
          <div style="background: #10b981; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 28px;">
            <h1 style="color: #fff; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          </div>

          <p style="font-size: 16px; color: #374151;">Dear <strong>{recipient_name}</strong>,</p>

          <p style="font-size: 15px; color: #374151; line-height: 1.7;">
            We are thrilled to inform you that your application for the opportunity
            <strong style="color: #10b981;">"{opportunity_title}"</strong> has been
            <strong>accepted</strong>! 🌟
          </p>

          <p style="font-size: 15px; color: #374151; line-height: 1.7;">
            Your hard work and dedication have paid off. The YELS team believes in your potential
            and we are excited to have you on board. This is a wonderful opportunity and we are
            confident you will make the most of it.
          </p>

          <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; margin: 24px 0;">
            <p style="margin: 0; color: #065f46; font-weight: 600;">
              ✅ Your application status: <span style="color: #10b981;">ACCEPTED</span>
            </p>
          </div>

          <p style="font-size: 15px; color: #374151; line-height: 1.7;">
            Please log in to your YELS dashboard to view further details. We look forward
            to seeing you thrive!
          </p>

          <p style="font-size: 15px; color: #374151; margin-top: 28px;">
            Warm regards,<br/>
            <strong>The YELS Team</strong><br/>
            <span style="color: #6b7280; font-size: 13px;">Youth Employment Linkage System — Dar es Salaam</span>
          </p>
        </div>
        """
    else:
        subject = f"Your Application for '{opportunity_title}' — Update"
        body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
          <div style="background: #6b7280; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 28px;">
            <h1 style="color: #fff; margin: 0; font-size: 26px;">Application Update</h1>
          </div>

          <p style="font-size: 16px; color: #374151;">Dear <strong>{recipient_name}</strong>,</p>

          <p style="font-size: 15px; color: #374151; line-height: 1.7;">
            Thank you sincerely for taking the time to apply for
            <strong>"{opportunity_title}"</strong> through the YELS platform.
            We truly appreciate your effort and interest.
          </p>

          <p style="font-size: 15px; color: #374151; line-height: 1.7;">
            After careful review, we regret to inform you that your application was
            <strong>not selected</strong> for this particular opportunity at this time.
            Please know this does not reflect your worth or potential — the competition
            was strong and this was a very difficult decision.
          </p>

          <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 6px; margin: 24px 0;">
            <p style="margin: 0; color: #991b1b; font-weight: 600;">
              📋 Your application status: <span style="color: #ef4444;">NOT SELECTED</span>
            </p>
          </div>

          <p style="font-size: 15px; color: #374151; line-height: 1.7;">
            We strongly encourage you <strong>not to give up</strong>. Keep building your
            skills, update your profile, and continue applying for new opportunities on YELS.
            Your next big break could be just around the corner! 💪
          </p>

          <p style="font-size: 15px; color: #374151; margin-top: 28px;">
            With encouragement and best wishes,<br/>
            <strong>The YELS Team</strong><br/>
            <span style="color: #6b7280; font-size: 13px;">Youth Employment Linkage System — Dar es Salaam</span>
          </p>
        </div>
        """

    message = MessageSchema(
        subject=subject,
        recipients=[recipient_email],
        body=body,
        subtype=MessageType.html,
    )

    try:
        await fm.send_message(message)
        logger.info("Email sent to %s", recipient_email)
    except Exception as e:
        logger.error("Failed to send email to %s: %s", recipient_email, str(e))
