# -*- coding:utf8 -*-

import MySQLdb
from default_config import *

def add(cost_name,cost_time,cost_money,remarks):
    insert_sql = "INSERT INTO cost_relationship (cost_name,cost_time,cost_money,remarks) VALUES ('%s','%s','%s','%s')" % (cost_name,cost_time,cost_money,remarks)
    conn = MySQLdb.connect(Config.get('DB_HOST'), Config.get('DB_USER'),Config.get('DB_PASSWORD'),
                           Config.get('DB_NAME'), charset=Config.get('DB_CHARSET'))
    cur = conn.cursor()
    cur.execute(insert_sql)
    conn.commit()
    conn.close()

add('aaa',1464152458,3333,'sjdjkhfkjsdhfkj')