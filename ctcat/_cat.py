import os
from datetime import datetime
from cantools.web import respond, succeed, fail, local, cgi_get, send_file, email_reportees
from cantools.util import read, log
from model import settings, buildTrust

def response():
	action = cgi_get("action", choices=["doc", "build", "settings", "trust", "contact"])
	if action == "doc":
		ts = cgi_get("ts") / 1000
		sts = datetime.now().timestamp()
		tsd = ts - sts
		log("/_cat doc ts check: %s v %s : diff %s"%(ts, sts, tsd))
		if abs(tsd) > 2000:
			fail()
		send_file(read(os.path.join("documents",
			cgi_get("template", default="trust", choices=["trust"]), # more eventually...
			cgi_get("name", shield=True)), binary=True), detect=True)
	elif action == "build":
		iz = cgi_get("injections")
		shield = local("shield")
		if shield(iz["name"], local("ip"), fspath=True, count=False):
			log('/_cat build - shield bounced "%s" for "%s"'%(ip, shield.ip(ip)["message"]))
			fail()
		succeed(buildTrust(iz, cgi_get("member", required=False),
			cgi_get("key", required=False),
			cgi_get("template", default="trust", choices=["trust"])).data())
	elif action == "contact":
		email_reportees("CAT Message", "From: %s %s (%s)\n\n%s\n\n%s"%(cgi_get("firstName"),
			cgi_get("lastName"), cgi_get("email"), cgi_get("subject"), cgi_get("message")))
	else:
		s = settings()
		if action == "settings":
			succeed(s.data())
		setattr(s, action, cgi_get(action))
		s.put()

respond(response)