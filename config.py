class AjizhangDB(object):
    host = '127.0.0.1'
    user = 'root'
    passwd = '123456'
    db = 'ajzhang'
    charset = 'utf8'

class ProductionConfig(AjizhangDB):
    DATABASE_URI = 'mysql://user@localhost/foo'

class DevelopmentConfig(AjizhangDB):
    DEBUG = True

class TestingConfig(AjizhangDB):
    TESTING = True

