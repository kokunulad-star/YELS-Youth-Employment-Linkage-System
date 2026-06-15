from sqlalchemy.orm import Session
from app.models.notification import Notification, NotificationType


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    ntype: NotificationType,
    related_id: int = None,
):
    """Helper to insert a notification record."""
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=ntype,
        related_id=related_id,
    )
    db.add(notif)
    db.commit()
    return notif
