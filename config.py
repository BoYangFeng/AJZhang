class ProductionConfig():
    DATABASE_URI = 'mysql+mysqldb://root:123456@127.0.0.1/ajzhang?charset=utf8'

class DevelopmentConfig():
    DEBUG = True

class TestingConfig():
    TESTING = True

