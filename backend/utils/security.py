from passlib.context import CryptContext
from jose import jwt
from fastapi import HTTPException
from jose import JWTError
from datetime import datetime, timedelta


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


SECRET_KEY = "shophub-secret-key"

ALGORITHM = "HS256"



def hash_password(password):

    return pwd_context.hash(password)



def verify_password(
    password,
    hashed
):

    return pwd_context.verify(
        password,
        hashed
    )



def create_token(data):

    expire = datetime.utcnow() + timedelta(
        hours=24
    )

    data.update(
        {
            "exp": expire
        }
    )


    return jwt.encode(
        data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    
def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )