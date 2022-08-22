CT.require("CT.all");
CT.require("CT.rte");
CT.require("core");
CT.require("user.core");
CT.require("cat.settings");

CT.onload(function() {
	CT.initCore();
	cat.settings.init();
});