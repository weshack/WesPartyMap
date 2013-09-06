import sqlite3
import re
from datetime import datetime
import time
import logging

def connect_database():
	return sqlite3.connect('database/database.db')

def add_user(conn, user):
	# User is a dictionary {'name':'', 'homeLat':'', 'homeLong':''}
	c = conn.cursor()
	c.execute("insert into userlist (Name, HomeLat, HomeLong) VALUES ('{0}','{1}','{2}')".format(user['name'], user['homeLat'], user['homeLong']))
	#return uid
	conn.commit()

def delete_user(conn, name):
	c = conn.cursor()
	c.execute("delete from userlist where Name = '{0}'".format(name))
	conn.commit()

def checkIn(conn, userID, Lat, Long):
	#if userID location > 100m from Lat Long
	c = conn.cursor()
	c.execute("insert into checkin (Latitude, Longitude) VALUES ('{0}','{1}')".format(Lat, Long))
	conn.commit()
	return "200 OK"

def getHome(conn, userID):
	c = conn.cursor()
