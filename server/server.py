from flask import *
from database import *
from datetime import datetime
from time import mktime

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")
    
@app.before_request
def before_request():
	database.db = connect_database()

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

if __name__ == "__main__":
    app.secret_key = 'gbn98423jieu394jrfk9je92hk'
    app.debug = True
    app.run(host='0.0.0.0')