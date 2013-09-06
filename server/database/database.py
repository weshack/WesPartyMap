import sqlite3
import re
from datetime import datetime
import time
import logging
import json

def connect_database():
	return sqlite3.connect('database/database.db')

def add_user(conn, user):
	# User is a dictionary {'name':'', 'homeLat':'', 'homeLong':''}
	c = conn.cursor()
	c.execute("insert into userlist (Name, HomeLat, HomeLong) VALUES ({0},{1},{2})".format(json.dumps(user['name']), json.dumps(user['homeLat']), json.dumps(user['homeLong'])))
	#return uid
	conn.commit()

def delete_user(conn, userID):
	c = conn.cursor()
	c.execute("delete from userlist where UID = {0}".format(userID))
	conn.commit()

def check_in(conn, userID, Lat, Long, Time):
	#if userID location > 100m from Lat Long
	c = conn.cursor()
	c.execute("insert into checkin (Latitude, Longitude, Time) VALUES ({0},{1},{2})".format(json.dumps(Lat), json.dumps(Long), Time))
	conn.commit()
	return "200 OK"

def get_home(conn, userID):
	c = conn.cursor()
