# -*- coding:utf8 -*-

import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column ,Integer,String
from sqlalchemy.sql import select

print sqlalchemy.__version__
engine = create_engine("mysql+mysqldb://root:123456@localhost:3306/ajzhang",echo=True)

Base = declarative_base()

class Cost_configuration(Base):
    __tablename__ = 'cost_configuration'
    cost_configuration_id = Column(Integer,primary_key=True)
    cost_name = Column(String)
    is_system = Column(Integer)
    operator_employee_id = Column(Integer)
    create_time = Column(Integer)
    update_time = Column(Integer)
    is_delete = Column(Integer)
    delete_time = Column(Integer)

conn = engine.connect()
print conn
# s = select(Cost_configuration)
# result = conn.execute(s)
# print result
# for i in result:
#     print i