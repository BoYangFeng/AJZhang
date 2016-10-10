# -*- coding:utf8 -*-

import MySQLdb,time
from config import *


class ConnectDB:
    def __init__(self):
        try:
            self.conn = MySQLdb.connect(host = AjizhangDB.host,user = AjizhangDB.user,passwd = AjizhangDB.passwd,
                                        db = AjizhangDB.db,charset = AjizhangDB.charset)
            self.cur = self.conn.cursor()
        except MySQLdb.Error as e:
            print "Mysql Error %d: %s" % (e.args[0], e.args[1])

    def colseDB(self):
        self.cur.close()
        self.conn.close()


class TallySql(ConnectDB):
    def getExacct(self):
        try:
            sql = "SELECT * FROM cost_configuration"
            self.cur.execute(sql)
            exacct = self.cur.fetchall()
            return exacct
        except MySQLdb.Error as e:
            print "Mysql Error %d: %s" % (e.args[0],e.args[1])

    def getBill(self):
        try:
            sql = "SELECT * FROM cost_relationship"
            self.cur.execute(sql)
            bill = self.cur.fetchall()
            return bill
        except MySQLdb.Error as e:
            print "Mysql Error %d: %s" % (e.args[0],e.args[1])


def getTime():
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
    return timelist



# a = TallySql()
# print a.getExacct()