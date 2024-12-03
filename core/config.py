from utils.schema_utils import AbstractSettings

class DBSettings(AbstractSettings):
    """
    This class holds the configuration settings for 
    the database connection, including the database name, 
    user, password, host, and port. It is used for connecting 
    to the database in the application.
    """
    DATABASE_NAME: str
    DATABASE_PORT: int
    DATABASE_HOST: str
    DATABASE_PASSWORD: str
    DATABASE_USER: str

class StripeSettings(AbstractSettings):
    """
    This class stores the settings for integrating Stripe payments, 
    including the public and private keys, account ID, webhook secret, 
    and price ID. These settings are used to interact with Stripe's payment services.
    """
    PUBLIC_KEY: str
    PRIVATE_KEY: str
    ACCOUNT_ID: str
    WEBHOOK_CODE: str

class AuthSettings(AbstractSettings):
    """
    This class contains the configuration for user authentication, 
    including the secret key used for generating JWT tokens, the 
    expiration time of the tokens, and the algorithm used to sign the tokens.
    """
    access_secret_key: str
    access_time_exp: int
    Algorithm: str

db_settings = DBSettings()
stripe_settings = StripeSettings()
auth_settings = AuthSettings()