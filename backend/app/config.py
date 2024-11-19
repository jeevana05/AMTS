import os


class Config:
    # Set up the main database URI with mysql+mysqlconnector to ensure compatibility
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 
        'mysql+mysqlconnector://root:Jeevana%4005@localhost/amts_db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False


# class TestConfig(Config):
#     # Use environment variable for test database URI, with a default fallback
#     SQLALCHEMY_DATABASE_URI = os.getenv(
#         'TEST_DATABASE_URL', 
#         'mysql+mysqlconnector://username:password@localhost/amts_test_db'
#     )
#     TESTING = True
