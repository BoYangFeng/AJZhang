# -*- coding:utf-8 -*-

from flask import Flask, render_template
import default_config
from flask import request
import MySQLdb
import time

app = Flask(__name__, instance_relative_config=True)
app.config.from_object(default_config.Config)

def cost_configuration():
    conn = MySQLdb.connect(app.config.get('DB_HOST'), app.config.get('DB_USER'), app.config.get('DB_PASSWORD'),
                           app.config.get('DB_NAME'), charset=app.config.get('DB_CHARSET'))
    cur = conn.cursor()
    sql = "SELECT * FROM cost_configuration"
    cur.execute(sql)
    conn.commit()
    conn.close()
    rows = cur.fetchall()
    return rows

def cost_relationship():
    conn = MySQLdb.connect(app.config.get('DB_HOST'), app.config.get('DB_USER'), app.config.get('DB_PASSWORD'),
                           app.config.get('DB_NAME'), charset=app.config.get('DB_CHARSET'))
    cur = conn.cursor()
    sql = "SELECT * FROM cost_relationship"
    cur.execute(sql)
    conn.commit()
    conn.close()
    rows = cur.fetchall()
    return rows

def add_sql(cost_configuration_id,cost_name,cost_type,cost_time,cost_money,remarks):
    conn = MySQLdb.connect(app.config.get('DB_HOST'), app.config.get('DB_USER'), app.config.get('DB_PASSWORD'),
                           app.config.get('DB_NAME'), charset=app.config.get('DB_CHARSET'))
    cur = conn.cursor()
    insert_sql = "INSERT INTO cost_relationship (cost_configuration_id,cost_name,cost_type,cost_time,cost_money,remarks) VALUES " \
                 "('%s','%s','%s','%s','%s','%s')" % (cost_configuration_id,cost_name,cost_type,cost_time,cost_money,remarks)
    cur.execute(insert_sql)
    conn.commit()
    conn.close()

def get_time():
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

@app.route('/tally',methods=['GET','POST'])
def tally():
    # render_template('tally.html',data=cost_configuration(), params=get_time())
    # cost_configuration_id = request.form['']
    # cost_name = str(1223)
    # cost_type = int(23)
    # cost_time = str(1480525261)
    # cost_money = int(1233)
    # remarks = str(1241432)
    # add_sql(cost_configuration_id,cost_name,cost_type,cost_time,cost_money,remarks)
    return render_template('tally.html',data=cost_configuration(),params=get_time(),data1=cost_relationship())


if __name__ == '__main__':
    app.run()