import os
from datetime import datetime
from cantools.util import log, read, write, sed
from condox.util import h2l, h2x, pan, panflag
try:
	from model import db, settings, Trust
except:
	log("running w/o model")
try:
	from cantools import config
	ccb = config.ctcat.build
	if type(ccb.debug) is not bool:
		ccb.update("debug", ccb.debug == "True")
	DEBUG = ccb.debug
except:
	log("running w/o config")

panflag("md", "pdf", "f", "markdown-fancy_lists")

def stateNotary(state):
	return os.path.join("templates", "notary", "%s.html"%(state,))

def notarize(txt, state):
	print("notarize()", state)
	return "%s\n\nNEWPAGE\n\n%s"%(txt, read(stateNotary(state)))

def fixNotary(hpath, dpath):
	import docx
	hlines = read(hpath, lines=True)
	doc = docx.Document(dpath)
	pars = doc.paragraphs

	# realign
	paz = [p.paragraph_format.alignment for p in pars if p.text or p.paragraph_format.alignment]
	for n in range(min(len(hlines), len(paz))):
		pa = paz[n]
		if pa:
			hlines[n] = hlines[n].replace("<p>", '<p align="%s">'%(pa == 1 and "center" or "right",))

	# inject AlternateContent
	if pars[2].text == "":
		print("fixNotary() injecting AlternateContent")
		b = doc.part.blob.decode()
		ac = b.split("<mc:AlternateContent>").pop().split("</mc:AlternateContent>").pop(0)
		hlines[0] = "%s<p>%s</p>\n"%(hlines[0], ac.split("<w:t>").pop().split("</w:t>").pop(0))

	write("".join(hlines), hpath)

def buildNotaries(srcdir):
	for f in os.listdir(srcdir):
		fn = f.split(".").pop(0)
		s = fn.split("-Notary").pop(0).replace("-", " ")
		srcp = os.path.join(srcdir, fn)
		op = stateNotary(s)
		pan(srcp, srcex="docx", opath=op)
		fixNotary(op, "%s.docx"%(srcp,))

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
			elif k == "witnesses" and vlen == 2:
				txt = txt.replace("[witnesses][0]",
					"<b>%s</b>"%(v[0],)).replace("[witnesses][1]", "<b>%s</b>"%(v[1],))
				continue
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

#	strategy = "basic"
#	strategy = "ultra"
	strategy = "combo"

	mpath = "%s.md"%(fpath,)
	if strategy == "combo":
		def h2(dest, text):
			write(text, mpath)
			DEBUG and write(text, "%s-%s.md"%(fpath, dest))
			pan(fpath, dest, "md")

		# html
		htxt = notarize(txt, injections["state"])
		DEBUG and write(htxt, "%s-orig.html"%(fpath,))
		write(htxt.replace("NEWPAGE", "<br><br><br><br>"), hpath)
		# pdf
		h2("pdf", h2l(htxt))
		# docx
		h2("docx", h2x(htxt))
	else:
		if strategy == "basic":
			write(notarize(txt, injections["state"]), hpath)
			pan(fpath, "md")
			sed(hpath, "NEWPAGE", "<br><br><br><br>")
			sed(mpath, "NEWPAGE", "\\newpage")
		elif strategy == "ultra":
			htxt = notarize(txt, injections["state"])
			write(htxt.replace("NEWPAGE", "<br><br><br><br>"), hpath)
			write(h2l(htxt), mpath)
		pan(fpath, "pdf", "md")
		sed(mpath, "\\newpage", DXPB)
		pan(fpath, "docx", "md")
	return {
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