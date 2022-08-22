cat.settings = {
	_: {
		c: function(cb, action, data) {
			var params = {
				action: action || "settings"
			};
			if (data)
				params[action] = data;
			CT.net.post({
				path: "/_cat",
				params: params,
				cb: cb
			});
		}
	},
	load: function(setts) {
		var _ = cat.settings._, trustField = CT.dom.smartField({
			wyz: true,
			isTA: true,
			value: setts.trust,
			classname: "w1 mt5 h4-5"
		});
		CT.dom.setMain(CT.dom.div([
			CT.dom.div("Trust Document Editor", "bigger bold centered"),
			trustField,
			CT.dom.button("update", function() {
				var tval = trustField.fieldValue();
				if (tval == setts.trust)
					return alert("no change");
				_.c(function() {
					setts.trust = tval;
					alert("you did it");
				}, "trust", tval);
			})
		], "relative h1"));
	},
	init: function() {
		cat.settings._.c(cat.settings.load);
	}
};