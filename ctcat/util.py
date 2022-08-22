import os
from datetime import datetime
from cantools.util import cmd, log, read, write
from model import db, settings, Trust

def pan(fp, ex=None, srcex="html", opath=None):
	opath = opath or "%s.%s"%(fp, ex)
	cmd('pandoc "%s.%s" -o "%s"'%(fp, srcex, opath))
	return opath

def stateNotary(state):
	return os.path.join("templates", "notary", "%s.html"%(state,))

def notarize(txt, state):
	print("notarize()", state)
	return "%s<br><br>%s"%(txt, read(stateNotary(state)))

def buildNotaries(srcdir):
	for f in os.listdir(srcdir):
		fn = f.split(".").pop(0)
		s = fn.split("-").pop(0)
		pan(os.path.join(srcdir, fn), srcex="docx", opath=stateNotary(s))

def branchVal(obj, path=[]):
	if type(obj) == dict:
		for k, v in obj.items():
			if v:
				path.append(k)
				vv = branchVal(v)
				if vv and type(vv) == bool:
					return k
				return vv # "Other"-keyed val may be string ... probs
	return obj

def treeVal(obj):
	path = []
	leaf = branchVal(obj, path)
	path.append(leaf)
	return ": ".join(path)

def build(tempname, injections):
	name = injections.get("name", "no name")
	ts = str(datetime.now()).split(".").pop(0)
	fpath = os.path.join("documents", tempname, "%s %s"%(name, ts))
	hpath = "%s.html"%(fpath,)
	txt = getattr(settings(), tempname)
	for k, v in injections.items():
		print(k, v)
		if type(v) == list:
			vlen = len(v)
			if vlen == 1:
				v = v[0]
			elif vlen:
				v = ", ".join(v[:-1]) + " and %s"%(v[-1],)
		elif type(v) == dict:
			v = treeVal(v)
		if type(v) == str:
			txt = txt.replace("[%s]"%(k,), "<b>%s</b>"%(v,))
		elif type(v) == bool:
			sflag = "[%s-start]"%(k,)
			eflag = "[%s-end]"%(k,)
			if sflag in txt:
				first, second = txt.split(sflag)
				second, third = second.split(eflag)
				if v:
					txt = first + second + third
				else:
					txt = first + third
		else:
			print("unimplemented - skipping:", k, v)
	write(notarize(txt, injections["state"]), hpath)
	pan(fpath, "pdf")
	pan(fpath, "docx")
#	ex = { "html": "/%s"%(hpath,) }
#	ex["pdf"] = "/%s"%(pan(fpath, "pdf"),)
#	ex["docx"] = "/%s"%(pan(fpath, "docx"),)
	return {
#		"exports": ex,
		"name": name,
		"ts": ts
	}


# db updaters

class TrustUpper(object):
	def __init__(self, testrun=True, dedupe=False):
		self.items = Trust.query().all()
		self.testrun = testrun
		self.iterations()
		dedupe and self.duplicates()
		log("goodbye")

	def ts(self, t):
		return t.exports["pdf"].rsplit(".", 1).pop(0)[-19:]

	def put(self, puts):
		log("saving %s items (testrun: %s)"%(len(puts), self.testrun), important=True)
		self.testrun or db.put_multi(puts)

	def iterations(self):
		log("checking %s Trust records for iterations[]"%(len(self.items),), important=True)
		putz = []
		for t in self.items:
			if not t.iterations:
				putz.append(t)
				ts = self.ts(t)
				t.iterations = [ts]
				log("missing iterations[]: %s (%s)"%(t.name, ts))
		log("fixing %s iterations[]-less Trust records"%(len(putz),), important=True)
		self.put(putz)

	def duplicates(self):
		log("checking %s Trust records for duplicates"%(len(self.items),), important=True)
		consolidated = {}
		dupes = []
		bases = 0
		for t in self.items:
			if t.member:
				memkey = t.member.urlsafe()
				if memkey not in consolidated:
					consolidated[memkey] = {}
				memtrusts = consolidated[memkey]
				if t.name not in memtrusts:
					bases += 1
					memtrusts[t.name] = t
				else:
					dupes.append(t)
					base = memtrusts[t.name]
					base.iterations = [self.ts(t)] + base.iterations
		log("identified %s bases and %s duplicates"%(bases, len(dupes)), important=True)
		for memkey, trusts in consolidated.items():
			mem = db.get(memkey)
			log("saving %s bases for %s"%(len(trusts), mem.fullName()))
			self.put(list(trusts.values()))
		log("deleting %s duplicates (testrun: %s)"%(len(dupes), self.testrun), important=True)
		self.testrun or db.delete_multi(dupes)