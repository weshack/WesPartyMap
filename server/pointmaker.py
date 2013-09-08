
from random import uniform
import urllib

urllib.urlopen('http://google.com')
def randomPoints():
	u=0
	while u<=30:
		x = uniform(41.55757,41.55259)
		y = uniform(-72.66508,-72.64993)
		print(x, y)
		urllib.urlopen('http://0.0.0.0:5000/checkin/10/'+str(x)+'/'+str(y))
		urllib.urlopen('http://0.0.0.0:5000/checkin/10/'+str(x-0.0001)+'/'+str(y-0.0001))
		urllib.urlopen('http://0.0.0.0:5000/checkin/10/'+str(x+0.0001)+'/'+str(y+0.0001))
		urllib.urlopen('http://0.0.0.0:5000/checkin/10/'+str(x-0.0003)+'/'+str(y-0.0002))
		urllib.urlopen('http://0.0.0.0:5000/checkin/10/'+str(x+0.0002)+'/'+str(y+0.0003))
		u += 1
randomPoints()