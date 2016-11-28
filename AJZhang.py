# -*- coding:utf-8 -*-

from flask import Flask, render_template,redirect,url_for,jsonify,json
from db import *
from flask import request

app = Flask(__name__, instance_relative_config=True)



@app.route('/',methods=['GET','POST'])
def helloXW():
    return redirect(url_for('tally'))

@app.route('/tally',methods=['GET','POST'])
def tally():
    tallyData = TallySql()
    timeList = getTime()
    exacctList = tallyData.getExacct()
    billList = tallyData.getBill()
    data = request.form
    print data
    return render_template('tally.html',exacct=exacctList,timeList=timeList,bill=billList)


if __name__ == '__main__':
    app.run(port=8888,debug=True)