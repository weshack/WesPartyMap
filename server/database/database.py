import sqlite3
import re
from datetime import datetime
import time
import logging
import json
import math


#user = {'name':'John', 'homeLat':'46', 'homeLong':'46'}

def connect_database():
	return sqlite3.connect('database/database.db')
#conn = connect_database()

def add_user(conn, user):
	# User is a dictionary {'name':'', 'homeLat':'', 'homeLong':''}
	c = conn.cursor()
	c.execute("insert into userlist (Name, HomeLat, HomeLong) VALUES ({0},{1},{2})".format(json.dumps(user['name']), json.dumps(user['homeLat']), json.dumps(user['homeLong'])))
	conn.commit()
	return c.lastrowid

def delete_user(conn, userID):
	c = conn.cursor()
	c.execute("delete from userlist where UID = {0}".format(userID))
	conn.commit()

def check_in(conn, userID, Lat, Long, Time):
	c = conn.cursor()
	c.execute("insert into checkins (Latitude, Longitude, Time) VALUES ({0},{1},{2})".format(json.dumps(Lat), json.dumps(Long), Time))
	conn.commit()
	return ''

def get_home(conn, userID):
	c = conn.cursor()
	user = c.execute("select * from userlist where UID={0}".format(userID)).next()
	return [user[2], user[3]] #lat, long of home

def get_all_checkins(conn):
	c = conn.cursor()
	result = c.execute("select * from checkins")
	checkins = []
	for res in result:
		check = {'latitude': res[1],'longitude': res[2],'time': res[3]}
		checkins.append(check)
	return checkins
def get_comments(conn):
	c = conn.cursor()
	result = c.execute("select * from comments order by uid desc limit 10")
	comments = []
	for res in result:
		com = res[1]
		comments.append(com)
	return comments

def add_comment(conn, comment):
	c = conn.cursor()
	c.execute("insert into comments (comment) VALUES ({0})".format(json.dumps(comment)))
	return ''

def purge_check_ins(conn, time, timeago): #Need to test this
	c = conn.cursor()
	c.execute("delete from checkins where Time < {0}".format(timeago))
	#c.commit()
	return ''
