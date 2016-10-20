import urllib2, json, time, sys, os
from uuid import getnode as get_mac


url = "http://192.168.1.48:8080/data/add"
frec = sys.argv[1] #Primer argumento despues del path a ejecutar
valor = 75
data = {
	"fichero": os.path.basename(__file__),
	"mac": get_mac(),
	"valor": valor}

while 1:
	req = urllib2.Request(url)
	req.add_header('Content-Type', 'application/json')
	response = urllib2.urlopen(req, json.dumps(data))
	time.sleep(float(frec))
