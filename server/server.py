from flask import *
from database import *
from datetime import datetime, timedelta
from time import mktime
import simplejson
app = Flask(__name__)

@app.before_request
def before_request():
	database.db = connect_database()

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/checkin/<user>/<latitude>/<longitude>')
def checkIn(user, latitude, longitude):
	#purgeCheckIns()
	if metersBetween([latitude, longitude], get_home(conn, user)) >= 100:
		now = datetime.utcnow()
		time = mktime(now.timetuple())
		print(str(user) + str(latitude) + str(longitude) + str(time))
		check_in(database.db, user, latitude, longitude, time)
		return ''
	else:
		return simplejson.dumps('at home')
def purgeCheckIns():
	now = datetime.utcnow()
	ago = now - timedelta(hours=2)
	time = mktime(now.timetuple())
	timeago = mktime(ago.timetuple())
	purge_check_ins(database.db, time, timeago)

def metersBetween(coord1, coord2):
	lat1 = coord1[0]
	long1 = coord1[1]
	lat2 = coord2[0]
	long2 = coord2[1]
	degrees_to_radians = math.pi/180.0
	phi1 = (90.0 - lat1)*degrees_to_radians
	phi2 = (90.0 - lat2)*degrees_to_radians
	theta1 = long1*degrees_to_radians
	theta2 = long2*degrees_to_radians
	cos = (math.sin(phi1)*math.sin(phi2)*math.cos(theta1 - theta2) + math.cos(phi1)*math.cos(phi2))
	arc = math.acos( cos )
	return (arc*6378100)

@app.route('/user/add/<name>/<homeLat>/<homeLong>')
def addUser(name, homeLat, homeLong):
	user = {'name':name,'homeLat':homeLat,'homeLong':homeLong}
	return simplejson.dumps({'uid': str(add_user(database.db, user))})
	

@app.route('/user/delete/<userID>')
def deleteUser(userID):
	delete_user(database.db, userID)

@app.route('/checkins')
def getCheckIns():
	return simplejson.dumps(get_all_checkins(database.db))


if __name__ == "__main__":
    app.secret_key = 'gbn98423jieu394jrfk9je92hk'
    app.debug = True
    app.run(host='0.0.0.0')