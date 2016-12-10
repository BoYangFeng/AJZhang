# -*- coding:utf8 -*-

import sqlalchemy,time
from sqlalchemy import create_engine,MetaData,Table
from sqlalchemy.sql import select
from config import ProductionConfig

# 链接数据库
# engine = create_engine('mysql+mysqldb://scott:tiger@localhost/foo')
engine = create_engine(ProductionConfig.DATABASE_URI,echo=False)
meta = MetaData()

# 反射表cost_configuration
# messages = Table('messages', meta, autoload=True, autoload_with=engine)
cost_configuration = Table('cost_configuration',meta,autoload=True,autoload_with=engine)
cost_relationship = Table('cost_relationship',meta,autoload=True,autoload_with=engine)
conn = engine.connect()

# 获取费用科目配置
exacct_sql = select([cost_configuration])
exacct = conn.execute(exacct_sql)

# 获取费用明细数据
bill_sql = select([cost_relationship])
bill = conn.execute(bill_sql)

# 获取日历
timelist = []
count = 5
while (count > -1):
    one_day = 86400
    datetime = int(time.time()) - one_day * count
    struct_time = time.gmtime(datetime)
    date = time.strftime("%Y-%m-%d",struct_time)
    year = time.strftime("%Y",struct_time)
    month = time.strftime("%m",struct_time)
    day = time.strftime("%d",struct_time)
    count -= 1
    timelist.append({'datetime':datetime,'date':date,'year':year,'month':month,'day':day})