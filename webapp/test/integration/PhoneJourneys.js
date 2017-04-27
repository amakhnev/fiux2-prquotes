jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"edu/opensap/fiux2/am/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"edu/opensap/fiux2/am/test/integration/pages/App",
	"edu/opensap/fiux2/am/test/integration/pages/Browser",
	"edu/opensap/fiux2/am/test/integration/pages/Master",
	"edu/opensap/fiux2/am/test/integration/pages/Detail",
	"edu/opensap/fiux2/am/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "edu.opensap.fiux2.am.view."
	});

	sap.ui.require([
		"edu/opensap/fiux2/am/test/integration/NavigationJourneyPhone",
		"edu/opensap/fiux2/am/test/integration/NotFoundJourneyPhone",
		"edu/opensap/fiux2/am/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});

