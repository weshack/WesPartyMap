from Flask import *
from database import *
from datetime import datetime
from time import mktime
app = Flask(__name__)

@app.before_request
def before_request():
	database.db = connect_db()

@app.route('/checkin/<user>/<latitude>/<longitude>')
def checkIn(user, latitude, longitude):
	now = datetime.utcnow()
	time = mktime(now.timetuple())
	check_in(database.db, user, latitude, longitude, time)

@app.route('/user/add/<name>/<homeLat>/<homeLong>')
def addUser(name, homeLat, homeLong):
	user = {'name':name,'homeLat':homeLat,'homeLong':homeLong}
	add_user(database.db, user)

@app.route('/user/delete/<userID>')
def deleteUser(userID):
	delete_user(database.db, userID)
