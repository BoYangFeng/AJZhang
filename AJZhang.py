# -*- coding:utf-8 -*-

from flask import Flask, render_template,redirect,url_for,jsonify,json
import db
from flask import request

app = Flask(__name__, instance_relative_config=True)



@app.route('/',methods=['GET','POST'])
def helloXW():
    return redirect(url_for('tally'))

@app.route('/tally',methods=['GET','POST'])
def tally():
    return render_template('tally.html',exacct=exacct,timeList=timelist,bill=bill)


if __name__ == '__main__':
    app.run(port=8888,debug=True)