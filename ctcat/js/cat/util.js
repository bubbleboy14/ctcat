cat.util = {
	doityourself: function() {
		CT.modal.modal(CT.dom.div([
			CT.dom.iframe("/templates/abc.html", "w1 h600p"),
			CT.dom.link("Download docx Version", null,
				"/templates/ABC%20Church%20Trust%20v3.docx", "bigger bold")
		], "centered"));
	},
	downloader: function(t, ts, ext) {
		var fname = t.name + " " + ts + "." + ext;
		return CT.file.downloader({
			path: "/_cat",
			params: {
				action: "doc",
				ts: Date.now(),
				name: fname // TODO: iterations menu!!
			}
		}, fname, ext, "biggerest margined padded hoverglow", "download " + ext + " version");
	},
	downloaders: function(t, ts) {
		ts = ts || t.iterations[0];
		return CT.dom.div([
			"pdf", "docx", "html"
		].map((ext) => cat.util.downloader(t, ts, ext)));
	},
	versions: function(t) {
		CT.modal.choice({
			prompt: CT.dom.div([
				CT.dom.div(t.name, "biggerest bold"),
				t.iterations.length + " versions"
			], "centered"),
			data: t.iterations,
			cb: (ts) => CT.modal.modal(cat.util.downloaders(t, ts))
		});
	},
	trust: function(t) {
		return CT.dom.flex([
			CT.hover.auto(CT.dom.link(t.name, function() {
				CT.storage.set("trust2edit", t);
				location = "/cat/start.html";
			}, null, "biggest"), "click to edit"),
			CT.dom.div(t.created, "bigger smallpadded"),
			cat.util.downloaders(t),
			CT.dom.div([
				CT.dom.link(t.iterations.length + " versions", () => cat.util.versions(t)),
				CT.dom.link("delete trust record", function() {
					var u = user.core.get();
					confirm("really delete this trust? no takebacks!") && CT.net.post({
						path: "/_cat",
						params: {
							action: "deltrust",
							p: prompt("Please enter your password"),
							e: u.email,
							k: u.key,
							t: t.key
						},
						cb: function() {
							location = location; // meh
						}
					});
				}, null, "redi block pt10")
			], "basiclink")
		], "row jcbetween margined padded bordered round");
	},
	_trusts: function(tlist) {
//		return tlist.map(cat.util.trust) // <- old version (grid mode)
		return tlist.map(function(t) {
			var tick = CT.dom.div(null, "rightTick"),
				dnode = cat.util.trust(t);
			return [
				tick,
				CT.dom.link(t.name, function() {
					dnode._expanded = !dnode._expanded;
					tick.className = dnode._expanded ? "downTick" : "rightTick";
					dnode.classList[dnode._expanded ? "add" : "remove"]("expanded");
				}),
				dnode
			];
		});
	},
	trusts: function(tnode) {
		tnode = tnode || CT.dom.div(null, "trusts");
		CT.db.get("trust", function(tlist) {
			CT.dom.setContent(tnode, tlist.length
				? cat.util._trusts(tlist)
				: "no trusts yet - go make one!");
		}, null, null, null, {
			member: user.core.get("key")
		});
		return tnode;
	}
};