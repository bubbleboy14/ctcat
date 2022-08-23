CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("cat.util");
CT.require("cat.start");

CT.onload(function() {
	CT.initCore();
	cat.start.load();
});