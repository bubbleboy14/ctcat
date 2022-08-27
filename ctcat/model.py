from cantools import db
from ctuser.model import *
from ctedit.model import PageEdit, Style

class Member(CTUser):
	cc = db.JSON() # carecoin {person,membership}

class Trust(db.TimeStampedBase):
	member = db.ForeignKey(kind=Member)
	name = db.String()
	injections = db.JSON()
	iterations = db.String(repeated=True) # timestamps

def buildTrust(injections, member=None, key=None, template="trust"):
	from ctcat.util import build
	tdata = build(template, injections)
	trust = key and db.get(key) or Trust() # assume trust template for now
	trust.name = tdata["name"]
	trust.injections = injections
	trust.iterations = [tdata["ts"]] + trust.iterations
	if member:
		trust.member = member
	trust.put()
	return trust

class Settings(db.TimeStampedBase):
	trust = db.Text()

def settings():
	s = Settings.query().get()
	if not s:
		s = Settings()
		s.put()
	return s