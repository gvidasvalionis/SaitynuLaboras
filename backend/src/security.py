import bcrypt

from sqlalchemy.orm import Session
from src.db_models import RefreshToken

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def revoke_all_refresh_tokens(db: Session, user_id: int):
    count = db.query(RefreshToken).filter(RefreshToken.user_id == user_id, RefreshToken.revoked == False).update({RefreshToken.revoked: True}, synchronize_session=False)
    db.commit()
    return count